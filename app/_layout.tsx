import '@/theme/unistyles';

import { useEffect } from 'react';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDMSans,
} from '@expo-google-fonts/dm-sans';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairDisplay,
} from '@expo-google-fonts/playfair-display';
import { SpaceMono_400Regular, useFonts as useSpaceMono } from '@expo-google-fonts/space-mono';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { styles } from '@/app.styles';
import { registerAppDevMenuItems } from '@/dev/register-dev-menu';
import { colors } from '@/theme/colors';

const RootLayout = () => {
  useEffect(() => {
    registerAppDevMenuItems();
  }, []);
  const [playfairLoaded] = usePlayfairDisplay({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  const [dmSansLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium });
  const [spaceMonoLoaded] = useSpaceMono({ SpaceMono_400Regular });

  const fontsLoaded = playfairLoaded && dmSansLoaded && spaceMonoLoaded;

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}
          />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
