export type TabBarItem<T extends string> = {
  key: T;
  label: string;
};

export type TabBarProps<T extends string> = {
  tabs: TabBarItem<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
};
