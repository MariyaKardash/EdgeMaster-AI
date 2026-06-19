import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import type { PartyEquippedItem, PartyPlayer } from '@/components/molecules/party-player-card';
import { useCampaign } from '@/contexts/campaign-context';
import {
  characterTemplateSchema,
  dbKeys,
  dbPrefixEnd,
  playerCharacterSchema,
  playerItemSchema,
  playerSchema,
  type Player,
  type PlayerCharacter,
  type PlayerItem,
} from '@/database';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { logDev } from '@/lib/logger';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import {
  consumeEquipHeroPlayerInput,
  EquipHeroScreen,
  setEquipHeroPlayerUpdate,
} from '@/screens/master/equip-hero';

const DEFAULT_PLAYER_CLASS = 'Adventurer';
const DEFAULT_STATS = { str: 10, dex: 10, int: 10 };
const DEFAULT_HP = { current: 10, max: 10 };

function deriveHpFromStats(stats: PartyPlayer['stats']) {
  const max = Math.max(stats.str + stats.dex + stats.int, 1);
  return { current: max, max };
}

function resolveRouteParam(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

const EquipHeroRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { playerId: playerIdParam } = useLocalSearchParams<{ playerId?: string | string[] }>();
  const resolvedPlayerId = resolveRouteParam(playerIdParam);
  const { activeSession, connectionState, worklet } = useCampaign();
  const [sessionPlayer] = useState(() => consumeEquipHeroPlayerInput());
  const [loadedPlayer, setLoadedPlayer] = useState<PartyPlayer | null>(null);
  const [loadedSessionId, setLoadedSessionId] = useState<string | undefined>();
  const loadGenerationRef = useRef(0);

  const hostedSessionId =
    activeSession && activeSession.campaignId === campaignId && activeSession.status === 'active'
      ? activeSession.id
      : undefined;

  const isSessionLive = Boolean(hostedSessionId && connectionState === 'connected');
  const player =
    sessionPlayer ?? (isSessionLive && loadedSessionId === hostedSessionId ? loadedPlayer : null);

  useEffect(() => {
    if (sessionPlayer) {
      return;
    }

    if (!resolvedPlayerId || !hostedSessionId || connectionState !== 'connected') {
      loadGenerationRef.current += 1;
      return;
    }

    let cancelled = false;

    const loadPlayer = async () => {
      const loadGeneration = loadGenerationRef.current + 1;
      loadGenerationRef.current = loadGeneration;

      try {
        // --- 1. List joined players for this session ---
        // Read the session player index.
        const playerIndexEntries = await worklet.list<string>(
          dbKeys.indexPlayersBySession(hostedSessionId),
          dbPrefixEnd(dbKeys.indexPlayersBySession(hostedSessionId)),
        );

        const sessionPlayers: Player[] = [];

        for (const entry of playerIndexEntries) {
          // Read each player record referenced by the index.
          const playerValue = await worklet.get<Player>(dbKeys.player(entry.value));
          const parsedPlayer = playerSchema.safeParse(playerValue);

          if (parsedPlayer.success) {
            sessionPlayers.push(parsedPlayer.data);
          }
        }

        // --- 2. Load all player characters for lookups ---
        // Read every player-character record in the campaign database.
        const characterEntries = await worklet.list<PlayerCharacter>(
          dbKeys.playerCharacter(''),
          dbPrefixEnd('@player-character/'),
        );
        const charactersByPlayerId = new Map<string, PlayerCharacter>();

        for (const entry of characterEntries) {
          const parsedCharacter = playerCharacterSchema.safeParse(entry.value);

          if (parsedCharacter.success) {
            charactersByPlayerId.set(parsedCharacter.data.playerId, parsedCharacter.data);
          }
        }

        // --- 3. Load all player items for lookups ---
        // Read every player-item record in the campaign database.
        const itemEntries = await worklet.list<PlayerItem>(
          dbKeys.playerItem(''),
          dbPrefixEnd('@player-item/'),
        );
        const itemsByCharacterId = new Map<string, PartyEquippedItem[]>();

        for (const entry of itemEntries) {
          const parsedItem = playerItemSchema.safeParse(entry.value);

          if (!parsedItem.success) {
            continue;
          }

          const item = parsedItem.data;
          const equippedItems = itemsByCharacterId.get(item.playerCharacterId) ?? [];
          equippedItems.push({ id: item.id, name: item.name, icon: 'inventory' });
          itemsByCharacterId.set(item.playerCharacterId, equippedItems);
        }

        // --- 4. Map session players and pick the requested one ---
        const nextPlayers: PartyPlayer[] = [];

        for (const sessionPlayerEntry of sessionPlayers) {
          const displayName = sessionPlayerEntry.displayName.trim();
          const fallbackName = displayName.replace(/^device-/i, '') || displayName;
          const character = charactersByPlayerId.get(sessionPlayerEntry.id);

          if (!character) {
            nextPlayers.push({
              id: sessionPlayerEntry.id,
              name: fallbackName,
              race: DEFAULT_PLAYER_CLASS,
              imageUri: '',
              hp: DEFAULT_HP,
              stats: DEFAULT_STATS,
              equippedItems: [],
            });
            continue;
          }

          const stats = character.stats;
          let name = fallbackName;
          let race = DEFAULT_PLAYER_CLASS;
          let imageUri = '';

          // Read the character template assigned to this player.
          const templateValue = await worklet.get(
            dbKeys.characterTemplate(character.characterTemplateId),
          );
          const parsedTemplate = characterTemplateSchema.safeParse(templateValue);

          if (parsedTemplate.success) {
            name = parsedTemplate.data.name;
            race = parsedTemplate.data.class;
            imageUri = parsedTemplate.data.imageUri ?? '';
          }

          nextPlayers.push({
            id: sessionPlayerEntry.id,
            name,
            race,
            imageUri,
            hp: deriveHpFromStats(stats),
            stats,
            equippedItems: itemsByCharacterId.get(character.id) ?? [],
          });
        }

        if (!cancelled && loadGeneration === loadGenerationRef.current) {
          setLoadedPlayer(
            nextPlayers.find((entry) => entry.id === resolvedPlayerId) ?? nextPlayers[0] ?? null,
          );
          setLoadedSessionId(hostedSessionId);
        }
      } catch (error) {
        logDev('[equip-hero.loadPlayer]', error);
      }
    };

    void loadPlayer();

    return () => {
      cancelled = true;
      loadGenerationRef.current += 1;
    };
  }, [connectionState, hostedSessionId, resolvedPlayerId, sessionPlayer, worklet]);

  if (!player) {
    return null;
  }

  return (
    <EquipHeroScreen
      player={player}
      onBack={(updatedPlayer) => {
        setEquipHeroPlayerUpdate(updatedPlayer);
        router.back();
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default EquipHeroRoute;
