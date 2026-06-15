import { z } from 'zod';

// --- Base ---

export const entityIdSchema = z.uuid();

export const timestampSchema = z.iso.datetime();

export const baseEntitySchema = z.object({
  id: entityIdSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;

// --- User Role ---

export const userRoleSchema = z.enum(['master', 'player']);

export type UserRole = z.infer<typeof userRoleSchema>;

// --- Character Stats ---

export const characterStatsSchema = z.object({
  str: z.number().int().min(0),
  dex: z.number().int().min(0),
  int: z.number().int().min(0),
});

export type CharacterStats = z.infer<typeof characterStatsSchema>;

// --- Item Stats ---

export const itemStatsSchema = z.object({
  str: z.number().int().optional(),
  dex: z.number().int().optional(),
  int: z.number().int().optional(),
});

export type ItemStats = z.infer<typeof itemStatsSchema>;

// --- Campaign ---

export const campaignSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  activeChapterId: z.uuid().nullable(),
});

export type Campaign = z.infer<typeof campaignSchema>;

// --- Character Template ---

export const characterTemplateSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  name: z.string().min(1),
  class: z.string().min(1),
  description: z.string(),
  stats: characterStatsSchema,
  imageUri: z.url().optional(),
});

export type CharacterTemplate = z.infer<typeof characterTemplateSchema>;

// --- Item Template ---

export const itemTemplateSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  name: z.string().min(1),
  description: z.string(),
  stats: itemStatsSchema,
});

export type ItemTemplate = z.infer<typeof itemTemplateSchema>;

// --- Chapter ---

export const chapterStatusSchema = z.enum(['draft', 'active', 'completed']);

export const chapterGenerationSourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('manual') }),
  z.object({
    type: z.literal('prompt'),
    prompt: z.string().min(1),
  }),
  z.object({
    type: z.literal('voice'),
    transcript: z.string().min(1),
  }),
  z.object({
    type: z.literal('document'),
    documentName: z.string().min(1),
    contentRef: z.string().optional(),
  }),
]);

export const chapterSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  title: z.string().min(1),
  description: z.string(),
  order: z.number().int().min(0),
  status: chapterStatusSchema,
  summary: z.string().optional(),
  generationSource: chapterGenerationSourceSchema.optional(),
});

export type ChapterStatus = z.infer<typeof chapterStatusSchema>;
export type ChapterGenerationSource = z.infer<typeof chapterGenerationSourceSchema>;
export type Chapter = z.infer<typeof chapterSchema>;

// --- Session ---

export const sessionStatusSchema = z.enum(['active', 'ended']);

export const sessionSchema = baseEntitySchema.extend({
  campaignId: z.uuid(),
  chapterId: z.uuid(),
  sessionCode: z.string().min(1),
  topicHex: z.string().min(1),
  status: sessionStatusSchema,
});

export type SessionStatus = z.infer<typeof sessionStatusSchema>;
export type Session = z.infer<typeof sessionSchema>;

// --- Game Event ---

export const gameEventTypeSchema = z.enum(['event', 'info']);

export const gameEventSchema = baseEntitySchema.extend({
  chapterId: z.uuid(),
  type: gameEventTypeSchema,
  title: z.string().min(1),
  body: z.string(),
});

export type GameEventType = z.infer<typeof gameEventTypeSchema>;
export type GameEvent = z.infer<typeof gameEventSchema>;

// --- Player ---

export const playerSchema = baseEntitySchema.extend({
  sessionId: z.uuid(),
  displayName: z.string().min(1),
});

export type Player = z.infer<typeof playerSchema>;

// --- Player Character ---

export const playerCharacterSchema = baseEntitySchema.extend({
  playerId: z.uuid(),
  characterTemplateId: z.uuid(),
  stats: characterStatsSchema,
});

export type PlayerCharacter = z.infer<typeof playerCharacterSchema>;

// --- Player Item ---

export const playerItemSchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  itemTemplateId: z.uuid().optional(),
  name: z.string().min(1),
  stats: itemStatsSchema,
  quantity: z.number().int().min(1).default(1),
});

export type PlayerItem = z.infer<typeof playerItemSchema>;

// --- Stats History Entry ---

export const statsHistoryEntrySchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  stats: characterStatsSchema,
  source: z.string().optional(),
});

export type StatsHistoryEntry = z.infer<typeof statsHistoryEntrySchema>;

// --- Item History Entry ---

export const itemHistoryActionSchema = z.enum(['acquired', 'removed', 'modified']);

export const itemHistoryEntrySchema = baseEntitySchema.extend({
  playerCharacterId: z.uuid(),
  itemTemplateId: z.uuid().optional(),
  itemName: z.string().min(1),
  action: itemHistoryActionSchema,
  stats: itemStatsSchema.optional(),
});

export type ItemHistoryAction = z.infer<typeof itemHistoryActionSchema>;
export type ItemHistoryEntry = z.infer<typeof itemHistoryEntrySchema>;
