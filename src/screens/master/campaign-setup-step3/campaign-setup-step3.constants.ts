import type { ArtifactItem } from '@/components/molecules/artifact-item-card';

export const HEADER_TITLE = 'Distribute Artifacts';

export const MIN_AVAILABLE_ITEMS = 1;

export const MOCK_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'dragonbone-blade',
    name: 'Dragonbone Blade',
    description: '+2 Fire Damage, Ignores Armor',
    icon: 'whatshot',
    rarity: 'epic',
  },
  {
    id: 'misty-draught',
    name: 'Misty Draught',
    description: 'Invisibility for 3 turns',
    icon: 'science',
    rarity: 'common',
  },
  {
    id: 'shadow-ring',
    name: 'Shadow Ring',
    description: '+5 Stealth in dim light',
    icon: 'toll',
    rarity: 'rare',
  },
];

export const DEFAULT_AVAILABLE_ITEM_IDS = MOCK_ARTIFACTS.map((artifact) => artifact.id);

export const NEW_ARTIFACT_TITLE = 'New Item Profile';

export const NEW_ARTIFACT_SUBTITLE =
  'Forge a new artifact for your campaign. Define its power and legend.';

export const ITEM_NAME_LABEL = 'Item Name';
export const ITEM_NAME_PLACEHOLDER = 'e.g. Vorpal Blade';

export const ITEM_DESCRIPTION_LABEL = 'Description';
export const ITEM_DESCRIPTION_PLACEHOLDER = 'Tell the tale of this artifact...';

export const STAT_MODIFIER_LABEL = 'Stat Modifier';
export const STAT_MODIFIER_PLACEHOLDER = 'Strength';

export const STAT_VALUE_LABEL = 'Value';
export const STAT_VALUE_PLACEHOLDER = '+1';

export const FORGE_ITEM_LABEL = 'Forge Item';

export const FINALIZE_LABEL = 'Finalize Campaign';
