export type HpEditorProps = {
  current: number;
  max: number;
  onChange: (hp: { current: number; max: number }) => void;
  playerName: string;
  readOnly?: boolean;
};
