import type { ColorSpace } from '~/color/types';

const SPACES: ColorSpace[] = [
  'rgb',
  'hsl',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
];

export function SpacePicker({
  onSelect,
}: {
  onSelect: (space: ColorSpace) => void;
}) {
  return (
    <div>
      {SPACES.map((space) => (
        <button type="button" key={space} onClick={() => onSelect(space)}>
          {space}
        </button>
      ))}
    </div>
  );
}
