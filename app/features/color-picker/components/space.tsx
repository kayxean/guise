import type { ColorMode } from '@kayxean/chromatrix/types';

const ALL_SPACES: ColorMode[] = ['hex', 'rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch'];

export function SpacePicker({
  onSelect,
  allowedMode,
}: {
  onSelect: (space: ColorMode) => void;
  allowedMode?: ColorMode[];
}) {
  const activeMode = allowedMode ? ALL_SPACES.filter((s) => allowedMode.includes(s)) : ALL_SPACES;

  return (
    <div>
      {activeMode.map((space) => (
        <button type="button" key={space} onClick={() => onSelect(space)}>
          {space}
        </button>
      ))}
    </div>
  );
}
