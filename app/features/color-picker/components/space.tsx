import type { ColorMode, ColorSpace } from '@kayxean/chromatrix/types';
import * as stylex from '@stylexjs/stylex';

const ALL_SPACES: ColorMode[] = ['hex', 'rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch'];

export function SpacePicker({
  currentSpace,
  allowedMode,
  useHex = false,
  onSelect,
}: {
  currentSpace: ColorSpace;
  allowedMode?: ColorMode[];
  useHex?: boolean;
  onSelect: (space: ColorMode) => void;
}) {
  const activeMode = allowedMode ? ALL_SPACES.filter((s) => allowedMode.includes(s)) : ALL_SPACES;

  const activeSpace = useHex ? 'hex' : currentSpace;

  return (
    <div {...stylex.props(styles.layout)}>
      {activeMode.map((space) => (
        <button
          type="button"
          key={space}
          onClick={() => onSelect(space)}
          {...stylex.props(styles.button, space === activeSpace ? styles.btnActive : styles.btn)}
        >
          {space}
        </button>
      ))}
    </div>
  );
}

const styles = stylex.create({
  layout: {
    display: 'grid',
    gap: '.75rem',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  button: {
    alignItems: 'center',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '0.75rem',
    justifyContent: 'center',
    paddingBottom: '0.5rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
  },
  btn: {
    backgroundColor: '#323232',
    color: '#f2f3f4',
  },
  btnActive: {
    backgroundColor: '#f2f3f4',
    color: '#323232',
  },
});
