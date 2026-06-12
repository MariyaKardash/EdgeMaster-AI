import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';

import {
  Button,
  ConnectionLines,
  HexGridOverlay,
  Icon,
  P2PNode,
  RoleBadgeRow,
  SpinningRing,
  StatusChip,
  Text,
} from '@/components';
import { colors } from '@/theme';
import { MAP_IMAGE, MAP_SIZE } from './welcome.constants';
import { styles } from './welcome.styles';
import type { WelcomeScreenProps } from './welcome.types';

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const headerOpacity = useMemo(() => new Animated.Value(0), []);
  const headerTranslate = useMemo(() => new Animated.Value(-20), []);
  const mainOpacity = useMemo(() => new Animated.Value(0), []);
  const footerOpacity = useMemo(() => new Animated.Value(0), []);
  const footerTranslate = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslate, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.timing(mainOpacity, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(footerTranslate, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- entrance animation runs once on mount

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(201, 162, 39, 0.08)', 'transparent']}
        style={styles.ambientGlow}
        start={{ x: 0.96, y: 0.76 }}
        end={{ x: 0.3, y: 0.2 }}
      />
      <HexGridOverlay />

      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <View style={styles.titleRow}>
          <Icon name="auto-awesome" size={36} />
          <Text variant="welcomeTitle">EdgeMaster AI</Text>
        </View>
        <Text variant="welcomeTagline">Your table. Your rules. No cloud.</Text>
      </Animated.View>

      <Animated.View style={[styles.main, { opacity: mainOpacity }]}>
        <ConnectionLines />

        <View style={styles.mapWrapper}>
          <SpinningRing baseSize={MAP_SIZE} inset={32} duration={60000} />
          <SpinningRing baseSize={MAP_SIZE} inset={64} duration={120000} reverse />

          <View style={styles.cornerAccentTopLeft} />
          <View style={styles.cornerAccentBottomRight} />

          <View style={styles.mapBorder}>
            <View style={styles.mapClip}>
              <Image source={MAP_IMAGE} style={styles.mapImage} contentFit="cover" />
              <LinearGradient
                colors={['transparent', colors.background]}
                style={styles.mapGradient}
              />
            </View>
          </View>
        </View>

        <P2PNode size={8} delay={0} style={{ top: '25%', left: '25%' }} />
        <P2PNode size={6} delay={1500} style={{ top: '33%', right: '25%' }} />
        <P2PNode size={10} delay={800} style={{ bottom: '25%', left: '50%' }} />
        <P2PNode size={8} delay={2200} style={{ top: '50%', right: 40 }} />
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          { opacity: footerOpacity, transform: [{ translateY: footerTranslate }] },
        ]}
      >
        <Button title="Get Started" icon="arrow-forward" onPress={onGetStarted} fullWidth />

        <StatusChip>v1.0.4 - Local Session: Secure</StatusChip>

        <RoleBadgeRow
          roles={[
            { label: 'Game Master', color: colors.gameMaster },
            { label: 'Player', color: colors.player },
          ]}
        />
      </Animated.View>
    </View>
  );
};
