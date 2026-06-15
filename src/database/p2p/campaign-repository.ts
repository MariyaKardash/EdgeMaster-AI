import { dbKeys, dbPrefixEnd } from '../keys';
import {
  campaignSchema,
  chapterSchema,
  characterTemplateSchema,
  gameEventSchema,
  itemHistoryEntrySchema,
  itemTemplateSchema,
  playerCharacterSchema,
  playerItemSchema,
  playerSchema,
  sessionSchema,
  statsHistoryEntrySchema,
  type Campaign,
  type Chapter,
  type CharacterTemplate,
  type GameEvent,
  type ItemHistoryEntry,
  type ItemTemplate,
  type Player,
  type PlayerCharacter,
  type PlayerItem,
  type Session,
  type StatsHistoryEntry,
} from '../entities';
import { createEntity, generateSessionCode, touchEntity } from '../utils';
import type { P2pWorkletClient } from './types';
import { sessionTopicHex } from '@/lib/holepunch/sessionTopicHex';

type CampaignSummary = {
  campaign: Campaign;
  chapterCount: number;
  activeSession: Session | null;
};

export class CampaignRepository {
  constructor(private readonly worklet: P2pWorkletClient) {}

  private parse<T>(schema: { parse: (value: unknown) => T }, value: unknown) {
    return schema.parse(value);
  }

  private async readLocalCampaignIds() {
    const value = await this.worklet.get<string[]>(dbKeys.metaCampaignList());

    return value ?? [];
  }

  private async writeLocalCampaignIds(campaignIds: string[]) {
    await this.worklet.put(dbKeys.metaCampaignList(), campaignIds);
  }

  async listLocalCampaigns(preserveOpenCampaignId?: string | null): Promise<CampaignSummary[]> {
    const campaignIds = await this.readLocalCampaignIds();
    const summaries: CampaignSummary[] = [];

    for (const campaignId of campaignIds) {
      await this.worklet.openCampaign(campaignId);
      const campaign = await this.getCampaign(campaignId);

      if (!campaign) {
        if (preserveOpenCampaignId !== campaignId) {
          await this.worklet.closeCampaign();
        }
        continue;
      }

      const chapters = await this.listChapters(campaignId);
      const sessions = await this.listSessions(campaignId);
      const activeSession = sessions.find((session) => session.status === 'active') ?? null;

      summaries.push({
        campaign,
        chapterCount: chapters.length,
        activeSession,
      });

      if (preserveOpenCampaignId !== campaignId) {
        await this.worklet.closeCampaign();
      }
    }

    if (preserveOpenCampaignId && !campaignIds.includes(preserveOpenCampaignId)) {
      await this.worklet.openCampaign(preserveOpenCampaignId);
    }

    return summaries;
  }

  async createCampaign(name: string): Promise<{ campaign: Campaign; coreKey: string }> {
    const campaign = createEntity<Campaign>({
      name: name.trim(),
      activeChapterId: null,
    });

    const opened = await this.worklet.openCampaign(campaign.id);
    await this.worklet.put(dbKeys.campaign(campaign.id), campaign);

    const campaignIds = await this.readLocalCampaignIds();

    if (!campaignIds.includes(campaign.id)) {
      await this.writeLocalCampaignIds([campaign.id, ...campaignIds]);
    }

    return {
      campaign,
      coreKey: opened.coreKey,
    };
  }

  async openCampaign(campaignId: string, coreKey?: string) {
    return this.worklet.openCampaign(campaignId, coreKey);
  }

  async closeCampaign() {
    await this.worklet.closeCampaign();
  }

  async getCampaign(campaignId: string) {
    const value = await this.worklet.get<Campaign>(dbKeys.campaign(campaignId));

    return value ? this.parse(campaignSchema, value) : null;
  }

  async updateCampaign(campaign: Campaign) {
    const next = touchEntity(campaign);
    await this.worklet.put(dbKeys.campaign(next.id), next);
    return next;
  }

  async createChapter(input: {
    campaignId: string;
    title: string;
    description: string;
    order: number;
    generationSource?: Chapter['generationSource'];
  }) {
    const chapter = createEntity<Chapter>({
      campaignId: input.campaignId,
      title: input.title.trim(),
      description: input.description,
      order: input.order,
      status: 'draft',
      generationSource: input.generationSource,
    });

    await this.worklet.put(dbKeys.chapter(chapter.id), chapter);
    await this.worklet.put(
      `${dbKeys.indexChaptersByCampaign(input.campaignId)}${chapter.order}`,
      chapter.id,
    );

    return chapter;
  }

  async listChapters(campaignId: string) {
    const entries = await this.worklet.list<string>(
      dbKeys.indexChaptersByCampaign(campaignId),
      dbPrefixEnd(dbKeys.indexChaptersByCampaign(campaignId)),
    );
    const chapters: Chapter[] = [];

    for (const entry of entries) {
      const value = await this.worklet.get<Chapter>(dbKeys.chapter(entry.value));

      if (value) {
        chapters.push(this.parse(chapterSchema, value));
      }
    }

    return chapters.sort((left, right) => left.order - right.order);
  }

  async activateChapter(campaignId: string, chapterId: string) {
    const campaign = await this.getCampaign(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found.');
    }

    const chapters = await this.listChapters(campaignId);
    const updatedChapters = await Promise.all(
      chapters.map(async (chapter) => {
        const nextStatus: Chapter['status'] =
          chapter.id === chapterId
            ? 'active'
            : chapter.status === 'active'
              ? 'completed'
              : chapter.status;
        const next = touchEntity({ ...chapter, status: nextStatus });
        await this.worklet.put(dbKeys.chapter(next.id), next);
        return next;
      }),
    );

    const campaignNext = await this.updateCampaign({
      ...campaign,
      activeChapterId: chapterId,
    });

    return {
      campaign: campaignNext,
      chapters: updatedChapters,
    };
  }

  async createSession(campaignId: string, chapterId: string) {
    const existingSessions = await this.listSessions(campaignId);

    for (const existingSession of existingSessions) {
      if (existingSession.status === 'active') {
        await this.endSession(existingSession.id);
      }
    }

    const sessionCode = generateSessionCode();
    const session = createEntity<Session>({
      campaignId,
      chapterId,
      sessionCode,
      topicHex: sessionTopicHex(sessionCode),
      status: 'active',
    });

    await this.worklet.put(dbKeys.session(session.id), session);
    await this.worklet.put(dbKeys.indexSessionByCode(sessionCode), session.id);

    return session;
  }

  async getSessionByCode(sessionCode: string, options?: { wait?: boolean }) {
    const indexKey = dbKeys.indexSessionByCode(sessionCode);

    const sessionId = options?.wait
      ? await this.worklet.waitForDbKey(indexKey)
      : await this.worklet.get<string>(indexKey);

    if (!sessionId || typeof sessionId !== 'string') {
      return null;
    }

    const sessionKey = dbKeys.session(sessionId);
    const value = options?.wait
      ? await this.worklet.waitForDbKey(sessionKey)
      : await this.worklet.get<Session>(sessionKey);

    return value && typeof value === 'object' ? this.parse(sessionSchema, value) : null;
  }

  async listSessions(campaignId: string) {
    const entries = await this.worklet.list<Session>(dbKeys.session(''), dbPrefixEnd('@session/'));

    return entries
      .map((entry) => this.parse(sessionSchema, entry.value))
      .filter((session) => session.campaignId === campaignId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async endSession(sessionId: string) {
    const value = await this.worklet.get<Session>(dbKeys.session(sessionId));

    if (!value) {
      throw new Error('Session not found.');
    }

    const session = touchEntity({ ...this.parse(sessionSchema, value), status: 'ended' as const });
    await this.worklet.put(dbKeys.session(session.id), session);
    return session;
  }

  async summarizeChapter(chapterId: string, summary: string) {
    const value = await this.worklet.get<Chapter>(dbKeys.chapter(chapterId));

    if (!value) {
      throw new Error('Chapter not found.');
    }

    const chapter = touchEntity({
      ...this.parse(chapterSchema, value),
      summary,
      status: 'completed' as const,
    });

    await this.worklet.put(dbKeys.chapter(chapter.id), chapter);
    return chapter;
  }

  async createCharacterTemplate(input: Omit<CharacterTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    const template = createEntity<CharacterTemplate>(input);
    await this.worklet.put(dbKeys.characterTemplate(template.id), template);
    await this.worklet.put(
      `${dbKeys.indexCharacterTemplatesByCampaign(input.campaignId)}${template.id}`,
      template.id,
    );
    return template;
  }

  async listCharacterTemplates(campaignId: string) {
    const entries = await this.worklet.list<string>(
      dbKeys.indexCharacterTemplatesByCampaign(campaignId),
      dbPrefixEnd(dbKeys.indexCharacterTemplatesByCampaign(campaignId)),
    );
    const templates: CharacterTemplate[] = [];

    for (const entry of entries) {
      const value = await this.worklet.get<CharacterTemplate>(
        dbKeys.characterTemplate(entry.value),
      );

      if (value) {
        templates.push(this.parse(characterTemplateSchema, value));
      }
    }

    return templates;
  }

  async createItemTemplate(input: Omit<ItemTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    const template = createEntity<ItemTemplate>(input);
    await this.worklet.put(dbKeys.itemTemplate(template.id), template);
    await this.worklet.put(
      `${dbKeys.indexItemTemplatesByCampaign(input.campaignId)}${template.id}`,
      template.id,
    );
    return template;
  }

  async listItemTemplates(campaignId: string) {
    const entries = await this.worklet.list<string>(
      dbKeys.indexItemTemplatesByCampaign(campaignId),
      dbPrefixEnd(dbKeys.indexItemTemplatesByCampaign(campaignId)),
    );
    const templates: ItemTemplate[] = [];

    for (const entry of entries) {
      const value = await this.worklet.get<ItemTemplate>(dbKeys.itemTemplate(entry.value));

      if (value) {
        templates.push(this.parse(itemTemplateSchema, value));
      }
    }

    return templates;
  }

  async registerPlayer(sessionId: string, displayName: string) {
    const player = createEntity<Player>({
      sessionId,
      displayName: displayName.trim(),
    });

    await this.worklet.put(dbKeys.player(player.id), player);
    await this.worklet.put(`${dbKeys.indexPlayersBySession(sessionId)}${player.id}`, player.id);

    return player;
  }

  async listPlayers(sessionId: string) {
    const entries = await this.worklet.list<string>(
      dbKeys.indexPlayersBySession(sessionId),
      dbPrefixEnd(dbKeys.indexPlayersBySession(sessionId)),
    );
    const players: Player[] = [];

    for (const entry of entries) {
      const value = await this.worklet.get<Player>(dbKeys.player(entry.value));

      if (value) {
        players.push(this.parse(playerSchema, value));
      }
    }

    return players;
  }

  async assignCharacter(input: {
    playerId: string;
    characterTemplateId: string;
    stats: PlayerCharacter['stats'];
  }) {
    const character = createEntity<PlayerCharacter>({
      playerId: input.playerId,
      characterTemplateId: input.characterTemplateId,
      stats: input.stats,
    });

    await this.worklet.put(dbKeys.playerCharacter(character.id), character);
    return character;
  }

  async getPlayerCharacter(playerId: string) {
    const entries = await this.worklet.list<PlayerCharacter>(
      dbKeys.playerCharacter(''),
      dbPrefixEnd('@player-character/'),
    );

    const match = entries
      .map((entry) => this.parse(playerCharacterSchema, entry.value))
      .find((character) => character.playerId === playerId);

    return match ?? null;
  }

  async grantItem(input: {
    playerCharacterId: string;
    itemTemplateId?: string;
    name: string;
    stats: PlayerItem['stats'];
    quantity?: number;
  }) {
    const item = createEntity<PlayerItem>({
      playerCharacterId: input.playerCharacterId,
      itemTemplateId: input.itemTemplateId,
      name: input.name,
      stats: input.stats,
      quantity: input.quantity ?? 1,
    });

    await this.worklet.put(dbKeys.playerItem(item.id), item);
    await this.recordItemHistory({
      playerCharacterId: input.playerCharacterId,
      itemTemplateId: input.itemTemplateId,
      itemName: input.name,
      action: 'acquired',
      stats: input.stats,
    });

    return item;
  }

  async listPlayerItems(playerCharacterId: string) {
    const entries = await this.worklet.list<PlayerItem>(
      dbKeys.playerItem(''),
      dbPrefixEnd('@player-item/'),
    );

    return entries
      .map((entry) => this.parse(playerItemSchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId);
  }

  async recordStatsHistory(input: {
    playerCharacterId: string;
    stats: StatsHistoryEntry['stats'];
    source?: string;
  }) {
    const entry = createEntity<StatsHistoryEntry>({
      playerCharacterId: input.playerCharacterId,
      stats: input.stats,
      source: input.source,
    });

    await this.worklet.put(dbKeys.statsHistory(entry.id), entry);
    return entry;
  }

  async listStatsHistory(playerCharacterId: string) {
    const entries = await this.worklet.list<StatsHistoryEntry>(
      dbKeys.statsHistory(''),
      dbPrefixEnd('@stats-history/'),
    );

    return entries
      .map((entry) => this.parse(statsHistoryEntrySchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async recordItemHistory(input: Omit<ItemHistoryEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const entry = createEntity<ItemHistoryEntry>(input);
    await this.worklet.put(dbKeys.itemHistory(entry.id), entry);
    return entry;
  }

  async listItemHistory(playerCharacterId: string) {
    const entries = await this.worklet.list<ItemHistoryEntry>(
      dbKeys.itemHistory(''),
      dbPrefixEnd('@item-history/'),
    );

    return entries
      .map((entry) => this.parse(itemHistoryEntrySchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async createGameEvent(input: Omit<GameEvent, 'id' | 'createdAt' | 'updatedAt'>) {
    const event = createEntity<GameEvent>(input);
    await this.worklet.put(dbKeys.gameEvent(event.id), event);
    await this.worklet.put(`${dbKeys.indexEventsByChapter(input.chapterId)}${event.id}`, event.id);
    return event;
  }

  async listGameEvents(chapterId: string) {
    const entries = await this.worklet.list<string>(
      dbKeys.indexEventsByChapter(chapterId),
      dbPrefixEnd(dbKeys.indexEventsByChapter(chapterId)),
    );
    const events: GameEvent[] = [];

    for (const entry of entries) {
      const value = await this.worklet.get<GameEvent>(dbKeys.gameEvent(entry.value));

      if (value) {
        events.push(this.parse(gameEventSchema, value));
      }
    }

    return events.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async getActiveChapter(campaignId: string) {
    const campaign = await this.getCampaign(campaignId);

    if (!campaign?.activeChapterId) {
      return null;
    }

    const value = await this.worklet.get<Chapter>(dbKeys.chapter(campaign.activeChapterId));

    return value ? this.parse(chapterSchema, value) : null;
  }
}
