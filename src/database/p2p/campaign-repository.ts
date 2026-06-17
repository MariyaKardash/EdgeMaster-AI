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
import {
  createEntity,
  normalizeStoredCampaign,
  sessionIdFromCampaignId,
  touchEntity,
} from '../utils';
import type { P2pWorkletClient } from './types';
import { logHolepunch } from '@/lib/holepunch/logHolepunch';
import { campaignTopicHex } from '@/lib/holepunch/sessionTopicHex';
import { normalizeTopicHex } from '@/lib/holepunch/topicHex';

type CampaignSummary = {
  campaign: Campaign;
  chapterCount: number;
  activeSession: Session | null;
};

export class CampaignRepository {
  constructor(private readonly worklet: P2pWorkletClient) {}

  private log(method: string, data: unknown) {
    logHolepunch('campaign-repo', method, data);
  }

  private parse<T>(schema: { parse: (value: unknown) => T }, value: unknown) {
    return schema.parse(value);
  }

  private async indexSession(session: Session) {
    await this.worklet.put(dbKeys.indexSessionByCode(session.sessionCode), session.id);
    await this.worklet.put(dbKeys.indexSessionByTopicHex(session.topicHex), session.id);
  }

  private async readLocalCampaignIds() {
    const value = await this.worklet.get<string[]>(dbKeys.metaCampaignList());

    this.log('readLocalCampaignIds', { value });

    return value ?? [];
  }

  private async writeLocalCampaignIds(campaignIds: string[]) {
    await this.worklet.put(dbKeys.metaCampaignList(), campaignIds);
  }

  async listLocalCampaigns(preserveOpenCampaignId?: string | null): Promise<CampaignSummary[]> {
    this.log('listLocalCampaigns', { preserveOpenCampaignId });
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

        if (preserveOpenCampaignId) {
          await this.worklet.openCampaign(preserveOpenCampaignId);
        }
      }
    }

    if (preserveOpenCampaignId) {
      await this.worklet.openCampaign(preserveOpenCampaignId);
    }

    this.log('listLocalCampaigns:result', {
      count: summaries.length,
      campaignIds: summaries.map((summary) => summary.campaign.id),
    });

    return summaries;
  }

  async createCampaign(
    name: string,
    description = '',
  ): Promise<{ campaign: Campaign; coreKey: string }> {
    this.log('createCampaign', { name, description });
    const campaign = createEntity<Campaign>({
      name: name.trim(),
      description,
      activeChapterId: null,
    });

    const opened = await this.worklet.openCampaign(campaign.id);
    await this.worklet.put(dbKeys.campaign(campaign.id), campaign);

    const campaignIds = await this.readLocalCampaignIds();

    if (!campaignIds.includes(campaign.id)) {
      await this.writeLocalCampaignIds([campaign.id, ...campaignIds]);
    }

    const result = {
      campaign,
      coreKey: opened.coreKey,
    };

    this.log('createCampaign:result', {
      campaignId: campaign.id,
      coreKey: opened.coreKey,
    });

    return result;
  }

  async openCampaign(campaignId: string, coreKey?: string) {
    this.log('openCampaign', { campaignId, hasCoreKey: Boolean(coreKey) });
    const opened = await this.worklet.openCampaign(campaignId, coreKey);
    this.log('openCampaign:result', { campaignId, coreKey: opened.coreKey });
    return opened;
  }

  async closeCampaign() {
    this.log('closeCampaign', {});
    await this.worklet.closeCampaign();
  }

  async getCampaign(campaignId: string) {
    this.log('getCampaign', { campaignId });
    const value = await this.worklet.get<Campaign>(dbKeys.campaign(campaignId));

    const campaign = value ? this.parse(campaignSchema, normalizeStoredCampaign(value)) : null;
    this.log('getCampaign:result', { campaignId, found: Boolean(campaign) });
    return campaign;
  }

  async updateCampaign(campaign: Campaign) {
    this.log('updateCampaign', { campaignId: campaign.id });
    const next = touchEntity(campaign);
    await this.worklet.put(dbKeys.campaign(next.id), next);
    this.log('updateCampaign:result', { campaignId: next.id });
    return next;
  }

  async createChapter(input: {
    campaignId: string;
    title: string;
    description: string;
    order: number;
    generationSource?: Chapter['generationSource'];
  }) {
    this.log('createChapter', {
      campaignId: input.campaignId,
      title: input.title,
      order: input.order,
    });
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

    this.log('createChapter:result', { chapterId: chapter.id, campaignId: input.campaignId });
    return chapter;
  }

  async listChapters(campaignId: string) {
    this.log('listChapters', { campaignId });
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

    chapters.sort((left, right) => left.order - right.order);
    this.log('listChapters:result', { campaignId, count: chapters.length });
    return chapters;
  }

  async getChapter(chapterId: string) {
    this.log('getChapter', { chapterId });
    const value = await this.worklet.get<Chapter>(dbKeys.chapter(chapterId));
    const chapter = value ? this.parse(chapterSchema, value) : null;
    this.log('getChapter:result', { chapterId, found: Boolean(chapter) });
    return chapter;
  }

  async deleteChapter(campaignId: string, chapterId: string) {
    this.log('deleteChapter', { campaignId, chapterId });
    const chapter = await this.getChapter(chapterId);

    if (!chapter) {
      throw new Error('Chapter not found.');
    }

    await this.worklet.del(dbKeys.chapter(chapterId));
    await this.worklet.del(`${dbKeys.indexChaptersByCampaign(campaignId)}${chapter.order}`);

    const campaign = await this.getCampaign(campaignId);

    if (campaign?.activeChapterId === chapterId) {
      await this.updateCampaign({ ...campaign, activeChapterId: null });
    }

    this.log('deleteChapter:result', { chapterId });
  }

  async activateChapter(campaignId: string, chapterId: string) {
    this.log('activateChapter', { campaignId, chapterId });
    const campaign = await this.getCampaign(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found.');
    }

    const chapters = await this.listChapters(campaignId);
    const activeChapter = chapters.find((c) => c.status === 'active');

    if (activeChapter && activeChapter.id !== chapterId) {
      throw new Error(
        `"${activeChapter.title}" is still active. Complete it before starting a new chapter.`,
      );
    }

    const target = chapters.find((c) => c.id === chapterId);

    if (!target) {
      throw new Error('Chapter not found.');
    }

    const next = touchEntity({ ...target, status: 'active' as const });
    await this.worklet.put(dbKeys.chapter(next.id), next);

    const campaignNext = await this.updateCampaign({
      ...campaign,
      activeChapterId: chapterId,
    });

    const result = {
      campaign: campaignNext,
      chapter: next,
    };

    this.log('activateChapter:result', {
      campaignId,
      chapterId,
      activeChapterId: campaignNext.activeChapterId,
    });

    return result;
  }

  async createSession(campaignId: string, chapterId: string) {
    this.log('createSession', { campaignId, chapterId });
    const existingSessions = await this.listSessions(campaignId);

    for (const existingSession of existingSessions) {
      if (existingSession.status === 'active') {
        await this.endSession(existingSession.id);
      }
    }

    const sessionCode = sessionIdFromCampaignId(campaignId);
    const session = createEntity<Session>({
      campaignId,
      chapterId,
      sessionCode,
      topicHex: campaignTopicHex(campaignId),
      status: 'active',
    });

    await this.worklet.put(dbKeys.session(session.id), session);
    await this.indexSession(session);

    this.log('createSession:result', {
      sessionId: session.id,
      sessionCode: session.sessionCode,
      topicHex: session.topicHex,
    });

    return session;
  }

  async getSessionByTopicHex(topicHex: string, options?: { wait?: boolean }) {
    const normalizedTopicHex = normalizeTopicHex(topicHex);
    this.log('getSessionByTopicHex', {
      topicHex: normalizedTopicHex,
      wait: options?.wait ?? false,
    });
    const indexKey = dbKeys.indexSessionByTopicHex(normalizedTopicHex);

    const sessionId = options?.wait
      ? await this.worklet.waitForDbKey(indexKey)
      : await this.worklet.get<string>(indexKey);

    if (!sessionId || typeof sessionId !== 'string') {
      this.log('getSessionByTopicHex:result', { topicHex: normalizedTopicHex, found: false });
      return null;
    }

    const sessionKey = dbKeys.session(sessionId);
    const value = options?.wait
      ? await this.worklet.waitForDbKey(sessionKey)
      : await this.worklet.get<Session>(sessionKey);

    const session = value && typeof value === 'object' ? this.parse(sessionSchema, value) : null;
    this.log('getSessionByTopicHex:result', {
      topicHex: normalizedTopicHex,
      found: Boolean(session),
      sessionId: session?.id,
    });
    return session;
  }

  async getSessionByCode(sessionCode: string, options?: { wait?: boolean }) {
    this.log('getSessionByCode', { sessionCode, wait: options?.wait ?? false });
    const indexKey = dbKeys.indexSessionByCode(sessionCode);

    const sessionId = options?.wait
      ? await this.worklet.waitForDbKey(indexKey)
      : await this.worklet.get<string>(indexKey);

    if (!sessionId || typeof sessionId !== 'string') {
      this.log('getSessionByCode:result', { sessionCode, found: false });
      return null;
    }

    const sessionKey = dbKeys.session(sessionId);
    const value = options?.wait
      ? await this.worklet.waitForDbKey(sessionKey)
      : await this.worklet.get<Session>(sessionKey);

    const session = value && typeof value === 'object' ? this.parse(sessionSchema, value) : null;
    this.log('getSessionByCode:result', {
      sessionCode,
      found: Boolean(session),
      sessionId: session?.id,
    });
    return session;
  }

  async listSessions(campaignId: string) {
    this.log('listSessions', { campaignId });
    const entries = await this.worklet.list<Session>(dbKeys.session(''), dbPrefixEnd('@session/'));

    const sessions = entries
      .map((entry) => this.parse(sessionSchema, entry.value))
      .filter((session) => session.campaignId === campaignId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

    this.log('listSessions:result', {
      campaignId,
      count: sessions.length,
      activeCount: sessions.filter((session) => session.status === 'active').length,
    });

    return sessions;
  }

  async endSession(sessionId: string) {
    this.log('endSession', { sessionId });
    const value = await this.worklet.get<Session>(dbKeys.session(sessionId));

    if (!value) {
      throw new Error('Session not found.');
    }

    const session = touchEntity({ ...this.parse(sessionSchema, value), status: 'ended' as const });
    await this.worklet.put(dbKeys.session(session.id), session);
    this.log('endSession:result', { sessionId: session.id, status: session.status });
    return session;
  }

  async summarizeChapter(chapterId: string, summary: string) {
    this.log('summarizeChapter', { chapterId, summaryLength: summary.length });
    const value = await this.worklet.get<Chapter>(dbKeys.chapter(chapterId));

    if (!value) {
      throw new Error('Chapter not found.');
    }

    const parsed = this.parse(chapterSchema, value);

    const chapter = touchEntity({
      ...parsed,
      summary,
      status: 'completed' as const,
    });

    await this.worklet.put(dbKeys.chapter(chapter.id), chapter);

    // Clear activeChapterId on the campaign so the chapter no longer
    // appears as active after completion (mirrors deleteChapter logic)
    const campaign = await this.getCampaign(parsed.campaignId);
    if (campaign?.activeChapterId === chapterId) {
      await this.updateCampaign({ ...campaign, activeChapterId: null });
    }

    this.log('summarizeChapter:result', { chapterId: chapter.id, status: chapter.status });
    return chapter;
  }

  async createCharacterTemplate(input: Omit<CharacterTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    this.log('createCharacterTemplate', {
      campaignId: input.campaignId,
      name: input.name,
    });
    const template = createEntity<CharacterTemplate>(input);
    await this.worklet.put(dbKeys.characterTemplate(template.id), template);
    await this.worklet.put(
      `${dbKeys.indexCharacterTemplatesByCampaign(input.campaignId)}${template.id}`,
      template.id,
    );
    this.log('createCharacterTemplate:result', { templateId: template.id });
    return template;
  }

  async listCharacterTemplates(campaignId: string) {
    this.log('listCharacterTemplates', { campaignId });
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

    this.log('listCharacterTemplates:result', { campaignId, count: templates.length });
    return templates;
  }

  async createItemTemplate(input: Omit<ItemTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    this.log('createItemTemplate', { campaignId: input.campaignId, name: input.name });
    const template = createEntity<ItemTemplate>(input);
    await this.worklet.put(dbKeys.itemTemplate(template.id), template);
    await this.worklet.put(
      `${dbKeys.indexItemTemplatesByCampaign(input.campaignId)}${template.id}`,
      template.id,
    );
    this.log('createItemTemplate:result', { templateId: template.id });
    return template;
  }

  async listItemTemplates(campaignId: string) {
    this.log('listItemTemplates', { campaignId });
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

    this.log('listItemTemplates:result', { campaignId, count: templates.length });
    return templates;
  }

  async registerPlayer(sessionId: string, displayName: string) {
    this.log('registerPlayer', { sessionId, displayName });
    const player = createEntity<Player>({
      sessionId,
      displayName: displayName.trim(),
    });

    await this.worklet.put(dbKeys.player(player.id), player);
    await this.worklet.put(`${dbKeys.indexPlayersBySession(sessionId)}${player.id}`, player.id);

    this.log('registerPlayer:result', { playerId: player.id, sessionId });
    return player;
  }

  async listPlayers(sessionId: string) {
    this.log('listPlayers', { sessionId });
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

    this.log('listPlayers:result', { sessionId, count: players.length });
    return players;
  }

  async assignCharacter(input: {
    playerId: string;
    characterTemplateId: string;
    stats: PlayerCharacter['stats'];
  }) {
    this.log('assignCharacter', {
      playerId: input.playerId,
      characterTemplateId: input.characterTemplateId,
    });
    const character = createEntity<PlayerCharacter>({
      playerId: input.playerId,
      characterTemplateId: input.characterTemplateId,
      stats: input.stats,
    });

    await this.worklet.put(dbKeys.playerCharacter(character.id), character);
    this.log('assignCharacter:result', { characterId: character.id, playerId: input.playerId });
    return character;
  }

  async getPlayerCharacter(playerId: string) {
    this.log('getPlayerCharacter', { playerId });
    const entries = await this.worklet.list<PlayerCharacter>(
      dbKeys.playerCharacter(''),
      dbPrefixEnd('@player-character/'),
    );

    const match = entries
      .map((entry) => this.parse(playerCharacterSchema, entry.value))
      .find((character) => character.playerId === playerId);

    const character = match ?? null;
    this.log('getPlayerCharacter:result', {
      playerId,
      found: Boolean(character),
      characterId: character?.id,
    });
    return character;
  }

  async grantItem(input: {
    playerCharacterId: string;
    itemTemplateId?: string;
    name: string;
    stats: PlayerItem['stats'];
    quantity?: number;
  }) {
    this.log('grantItem', {
      playerCharacterId: input.playerCharacterId,
      itemTemplateId: input.itemTemplateId,
      name: input.name,
      quantity: input.quantity ?? 1,
    });
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

    this.log('grantItem:result', { itemId: item.id, playerCharacterId: input.playerCharacterId });
    return item;
  }

  async listPlayerItems(playerCharacterId: string) {
    this.log('listPlayerItems', { playerCharacterId });
    const entries = await this.worklet.list<PlayerItem>(
      dbKeys.playerItem(''),
      dbPrefixEnd('@player-item/'),
    );

    const items = entries
      .map((entry) => this.parse(playerItemSchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId);

    this.log('listPlayerItems:result', { playerCharacterId, count: items.length });
    return items;
  }

  async recordStatsHistory(input: {
    playerCharacterId: string;
    stats: StatsHistoryEntry['stats'];
    source?: string;
  }) {
    this.log('recordStatsHistory', {
      playerCharacterId: input.playerCharacterId,
      source: input.source,
    });
    const entry = createEntity<StatsHistoryEntry>({
      playerCharacterId: input.playerCharacterId,
      stats: input.stats,
      source: input.source,
    });

    await this.worklet.put(dbKeys.statsHistory(entry.id), entry);
    this.log('recordStatsHistory:result', { entryId: entry.id });
    return entry;
  }

  async listStatsHistory(playerCharacterId: string) {
    this.log('listStatsHistory', { playerCharacterId });
    const entries = await this.worklet.list<StatsHistoryEntry>(
      dbKeys.statsHistory(''),
      dbPrefixEnd('@stats-history/'),
    );

    const history = entries
      .map((entry) => this.parse(statsHistoryEntrySchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

    this.log('listStatsHistory:result', { playerCharacterId, count: history.length });
    return history;
  }

  async recordItemHistory(input: Omit<ItemHistoryEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    this.log('recordItemHistory', {
      playerCharacterId: input.playerCharacterId,
      action: input.action,
      itemName: input.itemName,
    });
    const entry = createEntity<ItemHistoryEntry>(input);
    await this.worklet.put(dbKeys.itemHistory(entry.id), entry);
    this.log('recordItemHistory:result', { entryId: entry.id });
    return entry;
  }

  async listItemHistory(playerCharacterId: string) {
    this.log('listItemHistory', { playerCharacterId });
    const entries = await this.worklet.list<ItemHistoryEntry>(
      dbKeys.itemHistory(''),
      dbPrefixEnd('@item-history/'),
    );

    const history = entries
      .map((entry) => this.parse(itemHistoryEntrySchema, entry.value))
      .filter((item) => item.playerCharacterId === playerCharacterId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

    this.log('listItemHistory:result', { playerCharacterId, count: history.length });
    return history;
  }

  async createGameEvent(input: Omit<GameEvent, 'id' | 'createdAt' | 'updatedAt'>) {
    this.log('createGameEvent', {
      chapterId: input.chapterId,
      type: input.type,
    });
    const event = createEntity<GameEvent>(input);
    await this.worklet.put(dbKeys.gameEvent(event.id), event);
    await this.worklet.put(`${dbKeys.indexEventsByChapter(input.chapterId)}${event.id}`, event.id);
    this.log('createGameEvent:result', { eventId: event.id, chapterId: input.chapterId });
    return event;
  }

  async listGameEvents(chapterId: string) {
    this.log('listGameEvents', { chapterId });
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

    events.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
    this.log('listGameEvents:result', { chapterId, count: events.length });
    return events;
  }

  async getActiveChapter(campaignId: string) {
    this.log('getActiveChapter', { campaignId });
    const campaign = await this.getCampaign(campaignId);

    if (!campaign?.activeChapterId) {
      this.log('getActiveChapter:result', { campaignId, found: false });
      return null;
    }

    const value = await this.worklet.get<Chapter>(dbKeys.chapter(campaign.activeChapterId));

    const chapter = value ? this.parse(chapterSchema, value) : null;
    this.log('getActiveChapter:result', {
      campaignId,
      found: Boolean(chapter),
      chapterId: chapter?.id,
    });
    return chapter;
  }
}
