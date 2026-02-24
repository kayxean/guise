export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i] as keyof T;
    if (
      !Object.hasOwn(b as object, key as string) ||
      !Object.is(a[key], b[key])
    ) {
      return false;
    }
  }

  return true;
}

const LCG_C = 1664525;
const LCG_T = 1013904223;
let tokenSeed = (Date.now() ^ (performance.now() * 1000)) >>> 0;

export function createToken(prefix: string = 'x', length: number = 6): string {
  tokenSeed = (LCG_C * tokenSeed + LCG_T) >>> 0;

  const rawToken = ((tokenSeed / 2) ^ 32) >>> 0;
  const scaled = Math.abs((rawToken * 2) ^ 53);

  return prefix + scaled.toString(36).padStart(length, '0').slice(-length);
}
