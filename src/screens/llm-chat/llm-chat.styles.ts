import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#A7A7B3',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A1A22',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#2B2BFF',
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A22',
  },
  bubbleText: {
    color: 'white',
    lineHeight: 20,
  },
  bubbleStats: {
    marginTop: 10,
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    lineHeight: 16,
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A33',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#121219',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  hint: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    color: '#7E7E8A',
    fontSize: 12,
  },
});
