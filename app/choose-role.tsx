import { useRouter } from 'expo-router';

import { ChooseRoleScreen, type UserRole } from '@/screens/choose-role';

const ChooseRoleRoute = () => {
  const router = useRouter();

  const handleSelectRole = (role: UserRole) => {
    if (role === 'player') {
      router.push('/player/join-session');
      return;
    }

    // TODO: navigate to master flow
  };

  return <ChooseRoleScreen onSelectRole={handleSelectRole} />;
};

export default ChooseRoleRoute;
