import type { InventoryFilter, InventoryItem } from './equip-hero.types';

export const EQUIP_HERO_SCREEN_TITLE = 'Equip Hero';

export const INVENTORY_FILTERS: { id: InventoryFilter; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'armor', label: 'Armor' },
  { id: 'utility', label: 'Utility' },
];

export const INVENTORY_CATEGORY_LABELS: Record<InventoryFilter, string | null> = {
  all: null,
  weapons: 'Weapons',
  armor: 'Armor',
  utility: 'Utility',
};

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'sun-forged-blade',
    name: 'Sun-Forged Blade',
    description: '+1d8 Radiant Damage',
    icon: 'whatshot',
    category: 'weapons',
  },
  {
    id: 'iron-shortbow',
    name: 'Iron Shortbow',
    description: 'Range 80/320 ft.',
    icon: 'straighten',
    category: 'weapons',
  },
  {
    id: 'wardens-plate',
    name: "Warden's Plate",
    description: '+2 Armor Class',
    icon: 'shield',
    category: 'armor',
  },
  {
    id: 'greater-healing-potion',
    name: 'Greater Healing Potion',
    description: 'Heals 4d4 + 4 HP',
    icon: 'science',
    category: 'utility',
  },
  {
    id: 'amulet-of-vitality',
    name: 'Amulet of Vitality',
    description: 'Passive: +10 Max Health',
    icon: 'auto-fix-high',
    category: 'utility',
  },
];

export const PLAYER_ARMOR_CLASS: Record<string, number> = {
  'kaelen-vance': 16,
  'lyra-moonwhisper': 12,
};
