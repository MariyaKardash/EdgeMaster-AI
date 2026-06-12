import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';
import { styles } from './hex-grid-overlay.styles';

export const HexGridOverlay = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <Pattern id="hex" width={60} height={104} patternUnits="userSpaceOnUse">
            <Path
              d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32L30 0z"
              fill={colors.primary}
              fillOpacity={0.03}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#hex)" />
      </Svg>
    </View>
  );
};
