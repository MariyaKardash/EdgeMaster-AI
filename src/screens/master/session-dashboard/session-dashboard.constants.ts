import type { ConnectedPlayer } from '@/components/molecules/connected-player-avatar';

export const MOCK_SESSION_ID = 'AX7K-9M2P';

export const BRAND_TITLE = 'EdgeMaster';

export const ACTIVE_CHAPTER_SECTION_TITLE = 'Active Chapter';

export const CONNECTED_PLAYERS_SECTION_TITLE = 'Connected Players';

export const getActivePlayersLabel = (count: number) => `${count} Active`;

export const NO_ACTIVE_CHAPTER_TITLE = 'The Story Awaits';
export const NO_ACTIVE_CHAPTER_DESCRIPTION =
  'No chapter is active yet. Head to the Chapters tab to begin your next adventure.';

export const MOCK_CONNECTED_PLAYERS: ConnectedPlayer[] = [
  {
    id: 'valerius',
    name: 'Valerius',
    class: 'Warrior',
    connected: true,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMvlsk89clXuMFQnD1LaxhStj2rP6UQj7M8AVHGxSZn0V0Kz7Wt6sXSrSfu_D36N-CkJdt4qY5SILVKvawz0ZAEtpFpXpXM1jXRsWZZqgptNTV2DYLrOSpK2B-AQcrbqoSri7FTEsIQ_nQ-nmQySCR80mTQO3UZh8rM-CU79w0jpppQkzAGrPHie-Ad9fMgkI_lMr7g54OpHJhOPcIC4lK-y5PIGL9KvkFIuh7-7YapLkG5XAVhLudiKYTqQSc7MttDXmQC_wBta8',
  },
  {
    id: 'elara',
    name: 'Elara',
    class: 'Mage',
    connected: true,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBx9IqYOYOaQOP1JggEjiyMUjeok-V4XqSeZBb4QZSZFQqfEeXl3QSbvSMv8YxOwXGsANOQUsKIDpqVHI24EXd7Q2IZaOIjmZqZVjO3n-axvvSPg4uodFH5Aqtv2V6rhAT4kxjlfEFRUetNzAeFDVl6cedgNjryFStylKuh3P-DYfpvpyzBiK_G-EbHzCt7TSlOwv05SqEbBxau1bpgwgDpjjSa0XY03Lg65722jZKSpLP6mdH6gwlbvGwJseduU_JRgtBMYgbLUbQ',
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    class: 'Rogue',
    connected: true,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2pr7owXOgIYIHz0tu2wqySzhf5qK5kNJileZkub5RsmttX7c6THI_S6aOGkQFSkgbCq6HkJdhvnCVwx-iIols7PX4GdsawJ6gSMc2ZNAShcHns8w9s8MJ97rriS6DDwnSbVuTnb-lXPi3eHTrgpMVwhAfqT0comgH37uOJxup6RbxRUOgH6gVXHLaYPc-rI2gvUsALAbNWYYQ2Sg4RwuOzXIe_MyaPrmQ-G6ffe3VqRKKAnFCuwNEtIPgBmz4ix_-H4Rt_tFjO9Q',
  },
];
