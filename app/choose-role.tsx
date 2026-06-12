import { ChooseRoleScreen, type UserRole } from '@/screens/choose-role';

const ChooseRoleRoute = () => {
  const handleSelectRole = (_role: UserRole) => {
    // TODO: navigate to master or player flow
  };

  return <ChooseRoleScreen onSelectRole={handleSelectRole} />;
};

export default ChooseRoleRoute;
