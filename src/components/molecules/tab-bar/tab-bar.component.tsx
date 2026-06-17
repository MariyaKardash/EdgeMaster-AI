import { Pressable, View } from 'react-native';

import { Text } from '@/components/atoms/text';

import { styles } from './tab-bar.styles';
import type { TabBarProps } from './tab-bar.types';

export function TabBar<T extends string>({ tabs, activeTab, onTabPress }: TabBarProps<T>) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
          onPress={() => onTabPress(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.key }}
        >
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
