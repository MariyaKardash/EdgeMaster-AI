import {
  AudioModule,
  AudioQuality,
  IOSOutputFormat,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import type { RecordingOptions } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  downloadAsset,
  loadModel,
  transcribe,
  unloadModel,
  WHISPER_TINY_Q8_0,
  type ModelProgressUpdate,
} from '@qvac/sdk';

import type { DictationState } from '@/components/organisms/description-editor';

/**
 * 16 kHz mono LPCM WAV — required format for whispercpp transcription.
 * HIGH_QUALITY preset produces .m4a (AAC) which whispercpp cannot decode.
 */
const WHISPER_RECORDING_OPTIONS: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  ios: {
    extension: '.wav',
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.MAX,
    sampleRate: 16000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  android: {
    extension: '.wav',
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
    sampleRate: 16000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

export type UseTranscriptionOptions = {
  onError?: (message: string) => void;
};

export type UseTranscriptionResult = {
  dictationState: DictationState;
  /** Requests mic permission, sets audio mode, prepares and starts recording. */
  startRecording: () => Promise<void>;
  /** Stops recording, transcribes the audio via QVAC Whisper, returns text or null. */
  stopAndTranscribe: () => Promise<string | null>;
};

export function useTranscription({
  onError,
}: UseTranscriptionOptions = {}): UseTranscriptionResult {
  const [dictationState, setDictationState] = useState<DictationState>('idle');

  const audioRecorder = useAudioRecorder(WHISPER_RECORDING_OPTIONS);
  const whisperModelIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (whisperModelIdRef.current) {
        void unloadModel({ modelId: whisperModelIdRef.current, clearStorage: false }).catch(
          () => {},
        );
        whisperModelIdRef.current = null;
      }
    };
  }, []);

  const ensureWhisperLoaded = useCallback(async (): Promise<string> => {
    if (whisperModelIdRef.current) return whisperModelIdRef.current;

    await downloadAsset({
      assetSrc: WHISPER_TINY_Q8_0,
      onProgress: (_p: ModelProgressUpdate) => {},
    });

    const id = await loadModel({
      modelSrc: WHISPER_TINY_Q8_0,
      modelType: 'whispercpp-transcription',
    });

    whisperModelIdRef.current = id;
    return id;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        onError?.('Microphone permission denied');
        return;
      }

      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      if (mountedRef.current) setDictationState('recording');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[useTranscription] startRecording failed:', e);
      onError?.(`Could not start recording: ${message}`);
      if (mountedRef.current) setDictationState('idle');
    }
  }, [audioRecorder, onError]);

  const stopAndTranscribe = useCallback(async (): Promise<string | null> => {
    try {
      if (mountedRef.current) setDictationState('processing');

      await audioRecorder.stop();
      await setAudioModeAsync({ allowsRecording: false });

      const uri = audioRecorder.uri;
      if (!uri) throw new Error('No audio recorded');

      // QVAC transcribe() expects a raw file path, not a file:// URI
      const filePath = uri.replace(/^file:\/\//, '');

      const modelId = await ensureWhisperLoaded();
      const text = await transcribe({ modelId, audioChunk: filePath });

      if (mountedRef.current) setDictationState('idle');
      return text.trim() || null;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[useTranscription] stopAndTranscribe failed:', e);
      onError?.(`Transcription failed: ${message}`);
      if (mountedRef.current) setDictationState('idle');
      return null;
    }
  }, [audioRecorder, ensureWhisperLoaded, onError]);

  return { dictationState, startRecording, stopAndTranscribe };
}
