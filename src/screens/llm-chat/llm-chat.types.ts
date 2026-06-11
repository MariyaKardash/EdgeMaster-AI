export type Role = 'user' | 'assistant';

export type MessageStats = { ttftMs?: number; tps?: number };

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  stats?: MessageStats;
};
