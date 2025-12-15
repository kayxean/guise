import type { ColorFormat, ColorMode } from './types';
import * as stylex from '@stylexjs/stylex';
import { createStore } from '~/features/store';
import { convertColor } from './convert';
import { parseCss } from './parse';
import { createPRNG, randomColor, randomMode } from './random';

interface ColorState extends Record<string, unknown> {
  color: ColorFormat<ColorMode>;
  rgb: ColorFormat<'rgb'>;
  hsl: ColorFormat<'hsl'>;
  hwb: ColorFormat<'hwb'>;
  lab: ColorFormat<'lab'>;
  lch: ColorFormat<'lch'>;
  oklab: ColorFormat<'oklab'>;
  oklch: ColorFormat<'oklch'>;
}

const createColorSpace = (): ColorState => {
  const token = createPRNG(Date.now());
  const mode = randomMode(token);

  let colorSpace: ColorState;

  switch (mode) {
    case 'rgb': {
      const currentColor = randomColor('rgb', token);
      colorSpace = {
        color: currentColor,
        rgb: currentColor,
        hsl: convertColor(currentColor, 'hsl'),
        hwb: convertColor(currentColor, 'hwb'),
        lab: convertColor(currentColor, 'lab'),
        lch: convertColor(currentColor, 'lch'),
        oklab: convertColor(currentColor, 'oklab'),
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'hsl': {
      const currentColor = randomColor('hsl', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: currentColor,
        hwb: convertColor(currentColor, 'hwb'),
        lab: convertColor(currentColor, 'lab'),
        lch: convertColor(currentColor, 'lch'),
        oklab: convertColor(currentColor, 'oklab'),
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'hwb': {
      const currentColor = randomColor('hwb', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: convertColor(currentColor, 'hsl'),
        hwb: currentColor,
        lab: convertColor(currentColor, 'lab'),
        lch: convertColor(currentColor, 'lch'),
        oklab: convertColor(currentColor, 'oklab'),
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'lab': {
      const currentColor = randomColor('lab', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: convertColor(currentColor, 'hsl'),
        hwb: convertColor(currentColor, 'hwb'),
        lab: currentColor,
        lch: convertColor(currentColor, 'lch'),
        oklab: convertColor(currentColor, 'oklab'),
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'lch': {
      const currentColor = randomColor('lch', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: convertColor(currentColor, 'hsl'),
        hwb: convertColor(currentColor, 'hwb'),
        lab: convertColor(currentColor, 'lab'),
        lch: currentColor,
        oklab: convertColor(currentColor, 'oklab'),
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'oklab': {
      const currentColor = randomColor('oklab', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: convertColor(currentColor, 'hsl'),
        hwb: convertColor(currentColor, 'hwb'),
        lab: convertColor(currentColor, 'lab'),
        lch: convertColor(currentColor, 'lch'),
        oklab: currentColor,
        oklch: convertColor(currentColor, 'oklch'),
      };
      break;
    }
    case 'oklch': {
      const currentColor = randomColor('oklch', token);
      colorSpace = {
        color: currentColor,
        rgb: convertColor(currentColor, 'rgb'),
        hsl: convertColor(currentColor, 'hsl'),
        hwb: convertColor(currentColor, 'hwb'),
        lab: convertColor(currentColor, 'lab'),
        lch: convertColor(currentColor, 'lch'),
        oklab: convertColor(currentColor, 'oklab'),
        oklch: currentColor,
      };
      break;
    }
    default: {
      colorSpace = {
        color: randomColor(mode, token),
        rgb: randomColor('rgb', token),
        hsl: randomColor('hsl', token),
        hwb: randomColor('hwb', token),
        lab: randomColor('lab', token),
        lch: randomColor('lch', token),
        oklab: randomColor('oklab', token),
        oklch: randomColor('oklch', token),
      };
    }
  }

  return colorSpace;
};

const [useColorStore, apiColorStore] = createStore<ColorState>(createColorSpace());

export function Playground() {
  const color = useColorStore((state) => state.color);
  const rgb = useColorStore((state) => state.rgb);
  const hsl = useColorStore((state) => state.hsl);
  const hwb = useColorStore((state) => state.hwb);
  const lab = useColorStore((state) => state.lab);
  const lch = useColorStore((state) => state.lch);
  const oklab = useColorStore((state) => state.oklab);
  const oklch = useColorStore((state) => state.oklch);

  return (
    <div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={color} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={rgb} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={hsl} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={hwb} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={lab} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={lch} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={oklab} />
      </div>
      <div {...stylex.props(styles.section)}>
        <ColorCard color={oklch} />
      </div>
    </div>
  );
}

function ColorCard({ color }: { color: ColorFormat<ColorMode> }) {
  const cssColor = parseCss(color);
  const colorTokens = { color, cssColor };

  const shuffleColor = () => {
    const updateColor = createColorSpace();
    apiColorStore.setState(updateColor);
  };

  return (
    <div {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.preview)} style={{ backgroundColor: cssColor }}>
        <button
          type="button"
          aria-label="Shuffle Color"
          onClick={shuffleColor}
          {...stylex.props(styles.content)}
        ></button>
      </div>
      <pre {...stylex.props(styles.metadata)}>
        <code {...stylex.props(styles.code)}>{JSON.stringify(colorTokens, null, 2)}</code>
      </pre>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    alignContent: 'baseline',
    display: 'grid',
    gap: '1.5rem',
    padding: '1rem .75rem',
  },
  section: {
    display: 'inline-grid',
    margin: '0 auto',
    maxWidth: '80rem',
    width: '100%',
  },
  card: {
    alignContent: 'baseline',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: {
      default: null,
      '@media (width >= 48em)': '.75fr 1fr',
    },
  },
  preview: {
    borderRadius: '.5rem',
    display: 'inline-grid',
    paddingTop: 'calc(9 / 21 * 100%)',
    position: 'relative',
    width: '100%',
  },
  content: {
    backgroundColor: '#0000',
    borderRadius: 'inherit',
    bottom: 0,
    cursor: 'pointer',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  metadata: {
    alignContent: 'center',
    display: 'inline-grid',
    maxWidth: '100%',
    overflowX: 'auto',
    width: '100%',
  },
  code: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
});
