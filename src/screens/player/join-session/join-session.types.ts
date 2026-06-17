export type JoinSessionConnectPayload = {
  topicHex: string;
};

export type JoinSessionScreenProps = {
  onConnect?: (payload: JoinSessionConnectPayload) => void;
  onBack?: () => void;
  isConnecting?: boolean;
  errorMessage?: string | null;
};
