export type ConnectedPlayer = {
  id: string;
  name: string;
  class: string;
  imageUri: string;
  connected?: boolean;
};

export type ConnectedPlayerAvatarProps = {
  player: ConnectedPlayer;
  onPress?: () => void;
};
