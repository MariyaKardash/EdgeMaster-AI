import type { ConnectedPlayer } from '@/components/molecules/connected-player-avatar';

export const MOCK_SESSION_ID = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

export const BRAND_TITLE = 'EdgeMaster';

export const ACTIVE_CHAPTER_SECTION_TITLE = 'Active Chapter';

export const CONNECTED_PLAYERS_SECTION_TITLE = 'Connected Players';

export const START_SESSION_LABEL = 'Start Session';

export const STARTING_SESSION_LABEL = 'Starting...';

export const SESSION_ACTIVE_LABEL = 'Session Active';

export const getActivePlayersLabel = (count: number) => `${count} Active`;

export const ACTIVE_CHAPTER_TITLE = 'The Sunken Marshes';

export const ACTIVE_CHAPTER_DESCRIPTION =
  'The group ventures deep into the weeping bogs of Oakhaven. Toxic mists rise from the waters where an ancient relic is said to be buried beneath the roots of the Great Willow.';

export const ACTIVE_CHAPTER_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD4zIio6SSIO0rn6gVM-7QJwwQ34hCAhbWn3KFXlj_j-xeWkcEWdkjeT0gpErGAKRVrj7mw59i0Kwlcgd_Y9nxIrWVzYnH9xH1Ppa_VPXHdzLA4o9M0Zlnxo7xfAdSgja_tEU0sciyRQvhocTzSXWMZN0cm4mhpOBvw1oUUcev6oCfO_haxKX6hcxJ7pY1t0TLFn9Og2tk1ZK0iCjc1-MZL1RzRJI4zW6muPGZRPFUGs-Xj8lAy0mb4NGCRq6x5xCCNZBotPyEj9FI';

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
