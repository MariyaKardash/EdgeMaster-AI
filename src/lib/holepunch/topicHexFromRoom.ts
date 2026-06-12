export function topicHexFromRoom(room: string) {
  const normalized = room.trim() || 'holepunch-playground';
  const bytes = new Uint8Array(32);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = normalized.charCodeAt(index % normalized.length) & 0xff;
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
