export const encodeCampaignToHex = (value: string): string => {
  const bytes = new TextEncoder().encode(value);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
