import type { NarrativeParagraph } from './game-view.types';
import { MOCK_PARTY_PLAYERS } from '@/screens/master/party-status/party-status.constants';

export { MOCK_EVENT_LOG as MOCK_GAME_LOG } from '@/screens/master/live-control/live-control.constants';

export const MOCK_PARTY_PLAYER = MOCK_PARTY_PLAYERS[0];

export const APP_BAR_TITLE = 'EDGEMASTER';

export const CHAPTER_TITLE = 'The Sunken Marshes';

export const CHAPTER_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuALID_3-C0PIhAiVv77B_jEDs01P0vLL5xwR0aq165vOf6w_xSZyqyxSkrzoSNs0PdA1GgxSDDu2w-QN-_wHKMPVPH84tz5a-LwZ_HnoO_8pgaprp7Tt8KC85bAu3lazB6a8eoOgmrbjaPDqMAmjexzcmu7M3vCa7fmRZprSM2KZCRTJdrJoUBlQ7R3jwU3zRydnXBYhW5WzW34hO8ILnLEEnVoP1XrCVZw99ZRs0DwstXyVJd3hFVe3miB4cyAZQOdxbuK2Z6hn-s';

export const MOCK_NARRATIVE: NarrativeParagraph[] = [
  {
    text: 'The air hangs heavy with the scent of damp earth and decaying vegetation. Beneath your boots, the ground gives way with a wet squelch, each step threatening to pull you deeper into the emerald-black mire.',
  },
  {
    text: 'A thick mist clings to the twisted roots of the Iron-Oaks, their branches reaching out like skeletal fingers. Somewhere in the distance, a low, rhythmic croaking echoes—too deep to be any ordinary amphibian.',
  },
  {
    text: '"Beware the shimmering lights," your guide\'s last words ring in your ears. "In the Marshes, the most beautiful things are often the most lethal."',
    variant: 'quote',
  },
  {
    text: 'You notice a flickering blue light near the base of a hollowed stump. It pulses with a soft, hypnotic rhythm, casting long, distorted shadows across the surface of the swamp.',
  },
];

export const PLAYER_SHEET_HEADER_HEIGHT = 80;
export const PLAYER_SHEET_EXPANDED_HEIGHT = 480;
