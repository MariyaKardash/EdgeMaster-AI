export type DictationState = 'idle' | 'recording' | 'processing';

export type DescriptionEditorProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Show the dictation bar below the text area. Default: false */
  showDictation?: boolean;
  dictationState: DictationState;
  onDictationPress: () => void;
  isFixing: boolean;
  onFix: () => void;
  /** Disables Fix button when the LLM model is not loaded yet */
  isModelReady: boolean;
};
