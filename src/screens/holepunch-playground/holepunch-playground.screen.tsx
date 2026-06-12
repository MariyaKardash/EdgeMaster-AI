import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/components';
import {
  createHolepunchController,
  defaultAlias,
  logHolepunch,
  logHolepunchEvent,
  type HolepunchController,
  type HolepunchEvent,
  type HolepunchRole,
  topicHexFromRoom,
} from '@/lib/holepunch';
import { styles } from './holepunch-playground.styles';
import type {
  HolepunchPlaygroundPhase,
  HolepunchPlaygroundScreenProps,
  TimelineEntry,
} from './holepunch-playground.types';

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metric}>
    <Text variant="bodyMd" style={{ fontWeight: '600' }}>
      {value}
    </Text>
    <Text variant="labelMd">{label}</Text>
  </View>
);

export const HolepunchPlaygroundScreen = ({
  initialRole = 'host',
  initialRoom = 'holepunch-demo',
}: HolepunchPlaygroundScreenProps) => {
  const controllerRef = useRef<HolepunchController | null>(null);
  const [role, setRole] = useState<HolepunchRole>(initialRole);
  const [alias, setAlias] = useState(defaultAlias);
  const [room, setRoom] = useState(initialRoom);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Idle');
  const [phase, setPhase] = useState<HolepunchPlaygroundPhase>('idle');
  const [peerIds, setPeerIds] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([
    {
      id: 'boot',
      tone: 'system',
      title: 'Ready',
      body: 'Use the same room code on two devices, then host on one and join on the other.',
    },
  ]);
  const topicHex = useMemo(() => topicHexFromRoom(room), [room]);

  const pushTimeline = useCallback((entry: Omit<TimelineEntry, 'id'>) => {
    setTimeline((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        ...entry,
      },
      ...current,
    ]);
  }, []);

  const handleEvent = useCallback(
    (event: HolepunchEvent) => {
      logHolepunchEvent('ui', event);

      switch (event.type) {
        case 'status':
          setStatus(event.message);
          pushTimeline({
            tone: 'system',
            title: 'Status',
            body: event.message,
          });
          break;
        case 'error':
          setPhase('idle');
          setStatus(event.message);
          pushTimeline({
            tone: 'error',
            title: 'Error',
            body: event.message,
          });
          break;
        case 'ready':
          setPhase('ready');
          setStatus(
            `${event.role === 'host' ? 'Hosting' : 'Joined'} ${event.topicHex.slice(0, 12)}...`,
          );
          pushTimeline({
            tone: 'system',
            title: event.role === 'host' ? 'Host online' : 'Joined room',
            body: `${event.alias} is active on ${event.topicHex.slice(0, 16)}...`,
          });
          break;
        case 'peer-open':
          setPeerIds((current) =>
            current.includes(event.peerId) ? current : [event.peerId, ...current],
          );
          pushTimeline({
            tone: 'system',
            title: 'Peer connected',
            body: `${event.peerId} connected. ${event.connectionCount} active peer${event.connectionCount === 1 ? '' : 's'}.`,
          });
          break;
        case 'peer-closed':
          setPeerIds((current) => current.filter((peerId) => peerId !== event.peerId));
          pushTimeline({
            tone: 'system',
            title: 'Peer disconnected',
            body: `${event.peerId} disconnected.`,
          });
          break;
        case 'metrics':
          setConnecting(event.connecting);
          break;
        case 'chat':
          pushTimeline({
            tone: event.inbound ? 'remote' : 'local',
            title: event.author,
            body: event.text,
          });
          break;
        case 'stopped':
          setPhase('idle');
          setStatus('Stopped');
          setPeerIds([]);
          setConnecting(0);
          break;
      }
    },
    [pushTimeline],
  );

  useEffect(() => {
    const controller = createHolepunchController(handleEvent);
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [handleEvent]);

  const startSession = useCallback(() => {
    const nextAlias = alias.trim() || defaultAlias();

    setAlias(nextAlias);
    setPhase('starting');
    setPeerIds([]);
    setConnecting(0);
    setStatus('Starting Bare worklet...');
    setTimeline([
      {
        id: 'session-start',
        tone: 'system',
        title: 'Session',
        body: `${role === 'host' ? 'Hosting' : 'Joining'} room "${room.trim() || 'holepunch-demo'}".`,
      },
    ]);

    controllerRef.current?.start({
      role,
      alias: nextAlias,
      topicHex,
    });
    logHolepunch('ui', 'start', { role, alias: nextAlias, topicHex });
  }, [alias, role, room, topicHex]);

  const stopSession = useCallback(() => {
    logHolepunch('ui', 'stop', {});
    controllerRef.current?.stop();
  }, []);

  const sendMessage = useCallback(() => {
    const text = draft.trim();

    if (!text) {
      return;
    }

    logHolepunch('ui', 'sendChat', { text });
    controllerRef.current?.sendChat(text);
    setDraft('');
  }, [draft]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text variant="chooseRoleTitle">Holepunch Playground</Text>
        <Text variant="bodyMd">
          Starts a Bare worklet, joins a Hyperswarm topic, and lets two devices exchange messages
          directly.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="bodyLg" style={{ fontWeight: '600' }}>
          Session
        </Text>
        <View style={styles.segmentedControl}>
          {(['host', 'join'] as HolepunchRole[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setRole(option)}
              style={[styles.segment, role === option && styles.segmentActive]}
            >
              <Text
                variant="bodyMd"
                style={role === option ? styles.segmentLabelActive : styles.segmentLabel}
              >
                {option === 'host' ? 'Host' : 'Join'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text variant="bodyMd" style={{ fontWeight: '600' }}>
          Alias
        </Text>
        <TextInput
          value={alias}
          onChangeText={setAlias}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <Text variant="bodyMd" style={{ fontWeight: '600' }}>
          Room code
        </Text>
        <TextInput
          value={room}
          onChangeText={setRoom}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <Text variant="bodyMd" style={{ fontWeight: '600' }}>
          Derived topic
        </Text>
        <Text variant="codeMd" style={styles.code}>
          {topicHex}
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={startSession}
            disabled={phase === 'starting'}
            style={[styles.actionButton, phase === 'starting' && styles.buttonDisabled]}
          >
            <Text variant="bodyMd" style={styles.actionButtonLabel}>
              {phase === 'starting' ? 'Starting...' : role === 'host' ? 'Start host' : 'Join room'}
            </Text>
          </Pressable>

          <Pressable onPress={stopSession} style={styles.secondaryButton}>
            <Text variant="bodyMd" style={styles.secondaryButtonLabel}>
              Stop
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="bodyLg" style={{ fontWeight: '600' }}>
          Runtime
        </Text>
        <View style={styles.metricsRow}>
          <Metric label="State" value={phase} />
          <Metric label="Peers" value={String(peerIds.length)} />
          <Metric label="Pending" value={String(connecting)} />
        </View>
        <Text variant="bodyMd">{status}</Text>
        {peerIds.length > 0 ? (
          <Text variant="codeMd" style={styles.code}>
            {peerIds.join(', ')}
          </Text>
        ) : (
          <Text variant="bodyMd">No peer connected yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="bodyLg" style={{ fontWeight: '600' }}>
          Chat
        </Text>
        <View style={styles.chatComposer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            editable={phase === 'ready'}
            placeholder="Send a test message"
            placeholderTextColor="#7a7a7a"
            style={[styles.input, styles.chatInput]}
          />
          <Pressable
            onPress={sendMessage}
            disabled={phase !== 'ready'}
            style={[
              styles.actionButton,
              styles.sendButton,
              phase !== 'ready' && styles.buttonDisabled,
            ]}
          >
            <Text variant="bodyMd" style={styles.actionButtonLabel}>
              Send
            </Text>
          </Pressable>
        </View>

        <View style={styles.timeline}>
          {timeline.map((entry) => (
            <View key={entry.id} style={styles.timelineItem}>
              <Text
                variant="bodyMd"
                style={[
                  { fontWeight: '600' },
                  entry.tone === 'error' && styles.errorText,
                  entry.tone === 'remote' && styles.remoteText,
                  entry.tone === 'local' && styles.localText,
                ]}
              >
                {entry.title}
              </Text>
              <Text variant="bodyMd">{entry.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
