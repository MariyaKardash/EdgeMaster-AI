const prefix = (collection: string, id: string) => `@${collection}/${id}`;

export const dbKeys = {
  campaign: (id: string) => prefix('campaign', id),
  chapter: (id: string) => prefix('chapter', id),
  session: (id: string) => prefix('session', id),
  characterTemplate: (id: string) => prefix('character-template', id),
  itemTemplate: (id: string) => prefix('item-template', id),
  player: (id: string) => prefix('player', id),
  playerCharacter: (id: string) => prefix('player-character', id),
  playerItem: (id: string) => prefix('player-item', id),
  gameEvent: (id: string) => prefix('game-event', id),
  statsHistory: (id: string) => prefix('stats-history', id),
  itemHistory: (id: string) => prefix('item-history', id),
  metaCampaignList: () => '@meta/campaign-list',
  indexSessionByCode: (sessionCode: string) =>
    `@idx/session-code/${sessionCode.trim().toUpperCase()}`,
  indexChaptersByCampaign: (campaignId: string) => `@idx/chapters/${campaignId}/`,
  indexPlayersBySession: (sessionId: string) => `@idx/players/${sessionId}/`,
  indexEventsByChapter: (chapterId: string) => `@idx/events/${chapterId}/`,
  indexCharacterTemplatesByCampaign: (campaignId: string) =>
    `@idx/character-templates/${campaignId}/`,
  indexItemTemplatesByCampaign: (campaignId: string) => `@idx/item-templates/${campaignId}/`,
} as const;

export const dbPrefixEnd = (prefixKey: string) => `${prefixKey}\xff`;
