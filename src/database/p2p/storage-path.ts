import { Directory, Paths } from 'expo-file-system';

const STORAGE_DIR_NAME = 'edgemaster-p2p';

export function getP2pStoragePath() {
  const directory = new Directory(Paths.document, STORAGE_DIR_NAME);
  directory.create({ idempotent: true, intermediates: true });

  return directory.uri.replace(/^file:\/\//, '');
}
