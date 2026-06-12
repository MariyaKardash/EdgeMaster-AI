import type { RoleCardIcon } from '@/components/molecules/role-card';
import { colors } from '@/theme';
import type { UserRole } from './choose-role.types';

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: RoleCardIcon;
  accentColor: string;
};

export const SUBTITLE =
  'Step into the realm as a storyteller or an adventurer — your table awaits.';

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'master',
    title: 'Master',
    description: 'Host the adventure, manage chapters & players',
    icon: 'auto-awesome',
    accentColor: colors.primary,
  },
  {
    id: 'player',
    title: 'Player',
    description: 'Join a session and play your character',
    icon: 'shield',
    accentColor: colors.primary,
  },
];

export const FOOTER_NOTE = 'No account needed — connect locally via session code';
