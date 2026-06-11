import { StyleSheet } from 'react-native-unistyles';

import { MAP_SIZE } from './welcome.constants';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.containerMargin,
    paddingTop: theme.spacing.xl + theme.spacing.lg + theme.spacing.sm,
    paddingBottom: theme.spacing.xl + theme.spacing.sm,
  },
  ambientGlow: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    alignItems: 'center',
    zIndex: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md - theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mapWrapper: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cornerAccentTopLeft: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 48,
    height: 48,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: `${theme.colors.primary}4D`,
    borderTopLeftRadius: 12,
  },
  cornerAccentBottomRight: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    width: 48,
    height: 48,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: `${theme.colors.primary}4D`,
    borderBottomRightRadius: 12,
  },
  mapBorder: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    padding: 8,
    backgroundColor: theme.colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  mapClip: {
    flex: 1,
    borderRadius: MAP_SIZE / 2,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapGradient: {
    ...StyleSheet.absoluteFill,
  },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    zIndex: 20,
    maxWidth: 384,
    alignSelf: 'center',
    width: '100%',
  },
}));
