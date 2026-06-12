import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, RoleCard, Text } from '@/components';
import { FOOTER_NOTE, ROLE_OPTIONS, SUBTITLE } from './choose-role.constants';
import { styles } from './choose-role.styles';
import type { ChooseRoleScreenProps, UserRole } from './choose-role.types';

export const ChooseRoleScreen = ({ onSelectRole }: ChooseRoleScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole?.(selectedRole);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineLgMobile" style={styles.title}>
            Who are you tonight?
          </Text>
          <Text variant="bodyLg" style={styles.subtitle}>
            {SUBTITLE}
          </Text>
        </View>

        <View style={styles.cards}>
          {ROLE_OPTIONS.map((role) => (
            <RoleCard
              key={role.id}
              title={role.title}
              description={role.description}
              icon={role.icon}
              accentColor={role.accentColor}
              selected={selectedRole === role.id}
              onPress={() => setSelectedRole(role.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          icon="arrow-forward"
          fullWidth
          disabled={!selectedRole}
          onPress={handleContinue}
        />

        <Text variant="chooseRoleFooter">{FOOTER_NOTE}</Text>
      </View>
    </View>
  );
};
