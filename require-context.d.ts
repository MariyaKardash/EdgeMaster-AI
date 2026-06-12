interface ExpoRequireContext {
  keys(): string[];
  (id: string): unknown;
  resolve(id: string): string;
  id: string;
}

interface NodeRequire {
  context(path: string, deep?: boolean, filter?: RegExp): ExpoRequireContext;
}
