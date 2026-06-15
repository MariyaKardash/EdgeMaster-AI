import type { ChapterStatus } from '@/database/entities';

export type ChapterListItem = {
  id: string;
  title: string;
  description: string;
  status: ChapterStatus;
  dateLabel: string;
};

export const CHAPTERS_SCREEN_TITLE = 'Chapters';

export const NEW_CHAPTER_FAB_LABEL = 'New Chapter';

export const EMPTY_CHAPTERS_TITLE = 'No chapters yet';

export const EMPTY_CHAPTERS_DESCRIPTION =
  'Your grand epic begins with a single page. Create your first adventure to get started.';

export const MOCK_CHAPTERS: ChapterListItem[] = [
  {
    id: 'sunken-marshes',
    title: 'The Sunken Marshes',
    description: 'Venture deep into the miasma where the ancient guardian sleeps...',
    status: 'active',
    dateLabel: 'Today',
  },
  {
    id: 'whispering-woods',
    title: 'The Whispering Woods',
    description: "Quest concluded. The dryad's curse was lifted.",
    status: 'completed',
    dateLabel: 'Oct 24',
  },
  {
    id: 'iron-citadel',
    title: 'The Iron Citadel',
    description: 'Drafting the siege mechanics and NPC dialogue...',
    status: 'draft',
    dateLabel: 'Oct 20',
  },
];
