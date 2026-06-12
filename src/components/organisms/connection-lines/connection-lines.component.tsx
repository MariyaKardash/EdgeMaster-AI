import { useWindowDimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { colors } from '@/theme';
import { styles } from './connection-lines.styles';

export const ConnectionLines = () => {
  const { width, height } = useWindowDimensions();

  return (
    <Svg width={width} height={height} style={styles.overlay} pointerEvents="none" opacity={0.2}>
      <Line
        x1={width * 0.25}
        y1={height * 0.25}
        x2={width * 0.5}
        y2={height * 0.75}
        stroke={colors.primary}
        strokeWidth={0.5}
        strokeDasharray="4,4"
      />
      <Line
        x1={width * 0.75}
        y1={height * 0.33}
        x2={width * 0.5}
        y2={height * 0.75}
        stroke={colors.primary}
        strokeWidth={0.5}
        strokeDasharray="4,4"
      />
      <Line
        x1={width * 0.75}
        y1={height * 0.33}
        x2={width * 0.9}
        y2={height * 0.5}
        stroke={colors.primary}
        strokeWidth={0.5}
        strokeDasharray="4,4"
      />
    </Svg>
  );
};
