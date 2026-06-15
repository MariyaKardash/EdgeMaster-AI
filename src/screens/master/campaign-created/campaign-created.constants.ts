export const TITLE = 'Success!';

export const SUBTITLE = 'Your campaign has been forged in the digital ether.';

export const OPEN_DASHBOARD_LABEL = 'Open Dashboard';

export const MOCK_CAMPAIGN_NAME = 'The Shattered Sigil';

export const MOCK_CHARACTER_COUNT = 4;

export const MOCK_ITEM_COUNT = 12;

export const MOCK_SESSION_ID = 'AX7K-9M2P';

const SESSION_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const randomSegment = (length: number): string =>
  Array.from(
    { length },
    () => SESSION_ID_CHARS[Math.floor(Math.random() * SESSION_ID_CHARS.length)],
  ).join('');

export const generateSessionId = (): string => `${randomSegment(4)}-${randomSegment(4)}`;
