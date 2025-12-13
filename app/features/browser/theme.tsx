import { useColorStore } from './color';

export function Theme() {
  const colors = useColorStore((state) => state);

  const styles = Object.entries(colors)
    .map(([key, value]) => `--${key}:${value};`)
    .join('');

  return <style>{`@layer browser{:root{${styles}}}`}</style>;
}
