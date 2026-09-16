type MaybeWrapped<T> = T | { data?: T } | null | undefined;

export function unwrapReadOnlyData<T>(value: MaybeWrapped<T>): T | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && "data" in value) {
    return value.data;
  }
  return value as T;
}
