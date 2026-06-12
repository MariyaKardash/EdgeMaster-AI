import { useRouter } from 'expo-router';

import { WelcomeScreen } from '@/screens/welcome';

const WelcomeRoute = () => {
  const router = useRouter();

  return <WelcomeScreen onGetStarted={() => router.push('/choose-role')} />;
};

export default WelcomeRoute;
