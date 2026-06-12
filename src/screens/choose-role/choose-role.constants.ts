import type { RoleCardIcon } from '@/components/molecules/role-card';
import { colors } from '@/theme';
import type { UserRole } from './choose-role.types';

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: RoleCardIcon;
  overlayIcon?: RoleCardIcon;
  accentColor: string;
};

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'master',
    title: 'MASTER',
    description: 'Host the adventure, manage chapters & players',
    icon: 'build',
    accentColor: colors.gameMaster,
  },
  {
    id: 'player',
    title: 'PLAYER',
    description: 'Join a session and play your character',
    icon: 'shield',
    accentColor: colors.player,
  },
];

export const FOOTER_NOTE = 'No account needed — connect locally via session code';
