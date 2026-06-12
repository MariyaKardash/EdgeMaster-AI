import type { CampaignCharacter } from './campaign-setup-step2.types';

export const HEADER_TITLE = 'Assemble Your Heroes';

export const SECTION_SUBTITLE = 'Select 3 to 5 companions who will face the coming storm.';

export const MIN_SELECTED_CHARACTERS = 3;
export const MAX_SELECTED_CHARACTERS = 5;

export const MOCK_CHARACTERS: CampaignCharacter[] = [
  {
    id: 'valerius',
    name: 'Valerius',
    class: 'Paladin',
    stats: { str: 16, dex: 10, int: 12 },
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBddrffRDdfFN1YECpxoA0IaGP1A4h-xOIOAxt8vKPA34s3ORbmzDkFwBotXwwgf4EDWM6Ddshr9IN0lZ6IS6xFqWYtElQ3cInFzrY31LARxTAULNRNPIs6XKm4r1Y_-RLVb9KsjanW59JsX0cM9qdbcKGaVacZgtBHWLFFqfO1N7JXmAM26FhA-4c9QhInh8h6MVCt7uMcqyUZAFSeKWsYblMXqdfXqpDbjZSASGwFCzAZanvVajpN_cC-VdGsnXqrsE1xLkhhZIs',
  },
  {
    id: 'elara',
    name: 'Elara',
    class: 'Wizard',
    stats: { str: 8, dex: 14, int: 18 },
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvxj8S604vOE7Cyx02Kcw4EfHLb3DAT6fj8k4p2Uk22xOIISgWoSIsdgtdgP8JYhkV3eGR6QdlMLNb1RoWf0dS7zn76s2Uomd_UZMSXx15faeGmGzLecsyOFGjdRYftrQ1ZKZB16by9Vm6gjue1ynTEUB69mRcy3we3L2hmjB8BuBPyZiBVXUTamBqDXS4I4CEl-WabfsgFiT5fmomclN-BP8lHX5kGWeGM6Cr4Z9iMrSIki80u2dp8FNrfVKuWXdd6wdlLl1SrwI',
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    class: 'Rogue',
    stats: { str: 12, dex: 17, int: 10 },
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8xZqtc_Zoawo0b4M-mhSsHigF4y5ERHNRGwTBuf7-5zzEsVbiwRqHnBacmVQL8gSQxgNmcpBdZENLWWrD8MZxeQKXyv6IVevGOcCsuryUJ982ycCG7HzDBk4edJ0EqwvtAPVo0LsJbarTLpc5E7McjNKxJy4Hv0NBRAJLr6xiXPVyBObVpQ_xsR4cr5KERDaen-AeqjDlc83SQ6x05kCY9W7y0A9M8D3s5jlEU6hEHKBnn4dz2UEdKBI3Ww51MognTOqjOuUDXgg',
  },
];

export const NEW_HERO_TITLE = 'New Hero Profile';

export const NEW_HERO_SUBTITLE =
  'Forge a new identity for your legend. Define their attributes and destiny.';

export const HEROIC_NAME_LABEL = 'Heroic Name';
export const HEROIC_NAME_PLACEHOLDER = 'e.g. Alaric of the North';

export const ARCHETYPE_LABEL = 'Archetype';
export const ARCHETYPE_PLACEHOLDER = 'Select';

export const ARCHETYPE_OPTIONS = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Paladin',
  'Ranger',
  'Rogue',
  'Warrior',
  'Wizard',
] as const;

export const ORIGIN_LABEL = 'Origin';
export const ORIGIN_PLACEHOLDER = 'Kingdom...';

export const STATS_LABEL = 'Stats';

export const GENERATE_STATS_LABEL = 'Generate Stats';

export const ADD_HERO_LABEL = 'Add Hero';

export const DEFAULT_CUSTOM_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAvxj8S604vOE7Cyx02Kcw4EfHLb3DAT6fj8k4p2Uk22xOIISgWoSIsdgtdgP8JYhkV3eGR6QdlMLNb1RoWf0dS7zn76s2Uomd_UZMSXx15faeGmGzLecsyOFGjdRYftrQ1ZKZB16by9Vm6gjue1ynTEUB69mRcy3we3L2hmjB8BuBPyZiBVXUTamBqDXS4I4CEl-WabfsgFiT5fmomclN-BP8lHX5kGWeGM6Cr4Z9iMrSIki80u2dp8FNrfVKuWXdd6wdlLl1SrwI';

export const STAT_PLACEHOLDERS = {
  str: '',
  dex: '',
  int: '',
} as const;
