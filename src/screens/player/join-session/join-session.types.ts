export type JoinSessionConnectPayload = {
  campaignName: string;
  sessionHex: string;
};

export type JoinSessionScreenProps = {
  onConnect?: (payload: JoinSessionConnectPayload) => void;
  onBack?: () => void;
};
