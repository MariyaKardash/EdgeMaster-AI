import type { BaseEntity } from '../entities/base';

export function createEntityId() {
  return crypto.randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export function createEntity<T extends BaseEntity>(
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
): T {
  const timestamp = nowIso();

  return {
    id: createEntityId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...data,
  } as T;
}

export function touchEntity<T extends BaseEntity>(entity: T): T {
  return {
    ...entity,
    updatedAt: nowIso(),
  };
}
