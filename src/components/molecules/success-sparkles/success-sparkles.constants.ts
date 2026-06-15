const SPARKLE_COLOR_OPTIONS = ['#ecc246', '#cebdff', '#ffb598'] as const;

export type SparkleConfig = {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
};

export const SPARKLE_CONFIGS: SparkleConfig[] = Array.from({ length: 15 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  top: Math.random() * 40 + 20,
  size: Math.random() * 4 + 2,
  color: SPARKLE_COLOR_OPTIONS[Math.floor(Math.random() * SPARKLE_COLOR_OPTIONS.length)],
  delay: index * 300,
  duration: Math.random() * 2000 + 2000,
}));
