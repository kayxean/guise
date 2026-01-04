export const shallowEqual = <T>(a: T, b: T): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  const keysA = Object.keys(a) as Array<keyof T>;
  const keysB = Object.keys(b) as Array<keyof T>;
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.hasOwn(b as object, key as string) || !Object.is(a[key], b[key])) {
      return false;
    }
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
