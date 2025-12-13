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
