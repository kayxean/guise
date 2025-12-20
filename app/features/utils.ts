export const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(b, key)) return false;
    if (!Object.is((a as Record<PropertyKey, unknown>)[key], (b as Record<PropertyKey, unknown>)[key])) return false;
  }
  return true;
};

export const createToken = (() => {
  let current = Date.now() >>> 0;

  const c = 1664525;
  const t = 1013904223;

  const generateNextToken = (): number => {
    current = (c * current + t) >>> 0;
    return (current / 2) ^ 32;
  };

  return (prefix: string = 'x', length: number = 6): string => {
    const rawToken = generateNextToken();
    const scaledInteger = Math.floor((rawToken * 2) ^ 53);

    let base36String = scaledInteger.toString(36);
    base36String = base36String.padStart(length, '0').slice(-length);

    return prefix + base36String;
  };
})();
