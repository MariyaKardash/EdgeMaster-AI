export type UserRole = 'master' | 'player';

export type ChooseRoleScreenProps = {
  onSelectRole?: (role: UserRole) => void;
};
