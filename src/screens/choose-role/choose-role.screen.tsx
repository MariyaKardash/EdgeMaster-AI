import { useState } from 'react';
import { View } from 'react-native';

import { Button, HexGridOverlay, RoleCard, Text } from '@/components';
import { FOOTER_NOTE, ROLE_OPTIONS } from './choose-role.constants';
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
      <HexGridOverlay />

      <View style={styles.main}>
        <View style={styles.content}>
          <Text variant="chooseRoleTitle">Who are you tonight?</Text>

          <View style={styles.cards}>
            {ROLE_OPTIONS.map((role) => (
              <RoleCard
                key={role.id}
                title={role.title}
                description={role.description}
                icon={role.icon}
                overlayIcon={role.overlayIcon}
                accentColor={role.accentColor}
                selected={selectedRole === role.id}
                onPress={() => setSelectedRole(role.id)}
              />
            ))}
          </View>
        </View>
      </View>

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
