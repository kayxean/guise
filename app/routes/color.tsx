import type { MetaFunction } from '@remix-run/node';
import type { ColorMode, ColorSpace } from '~/features/color/core/types';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { convertColor } from '~/features/color/core/convert';
import { formatCss } from '~/features/color/core/format';
import { ColorPicker } from '~/features/color/picker';

export const meta: MetaFunction = () => [
  { title: 'Color Playground' },
  { name: 'description', content: 'Advanced Hub-based color manipulation' },
];

const MODES: ColorMode[] = [
  'rgb',
  'hsl',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
];

type ColorValue = ColorSpace<ColorMode>;

export default function ColorRoute() {
  const [mode, setMode] = useState<ColorMode>('oklch');
  const [color, setColor] = useState<ColorValue>([
    0.6, 0.15, 240,
  ] as ColorValue);

  const handleModeChange = (nextMode: ColorMode) => {
    if (mode === nextMode) return;
    const nextColor = convertColor(
      color as ColorSpace<typeof mode>,
      mode,
      nextMode as Exclude<ColorMode, typeof mode>,
    ) as ColorValue;

    setMode(nextMode);
    setColor(nextColor);
  };

  const handleInputChange = (index: number, value: string) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return;

    const nextColor = [...color] as ColorValue;
    nextColor[index] = num;
    setColor(nextColor);
  };

  return (
    <div {...stylex.props(s.root)}>
      <header {...stylex.props(s.header)}>
        <h1 {...stylex.props(s.title)}>Color Hub</h1>
        <p {...stylex.props(s.subtitle)}>
          {mode.toUpperCase()} Source → XYZ65 Hub → HSV UI
        </p>
      </header>

      <div {...stylex.props(s.tabList)}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            {...stylex.props(s.tab, m === mode && s.tabActive)}
          >
            {m}
          </button>
        ))}
      </div>

      <ColorPicker
        mode={mode}
        color={color as ColorSpace<typeof mode>}
        onUpdate={setColor}
      />

      <section {...stylex.props(s.previewCard)}>
        <div {...stylex.props(s.swatch(mode, color))} />

        <div {...stylex.props(s.inputGrid)}>
          {color.map((val, i) => {
            const channelName = mode[i] ?? `ch${i}`;
            const inputId = `ci-${mode}-${i}`;

            return (
              <div key={inputId} {...stylex.props(s.inputGroup)}>
                <label htmlFor={inputId} {...stylex.props(s.codeLabel)}>
                  {channelName}
                </label>
                <input
                  id={inputId}
                  type="number"
                  step={mode.includes('rgb') || mode.includes('lab') ? 0.01 : 1}
                  value={val}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  {...stylex.props(s.input)}
                />
              </div>
            );
          })}
        </div>

        <div {...stylex.props(s.codeBlock)}>
          <span {...stylex.props(s.codeLabel)}>CSS Output</span>
          <code {...stylex.props(s.codeValue)}>
            {formatCss(mode, color as ColorSpace<typeof mode>)}
          </code>
        </div>
      </section>
    </div>
  );
}

const s = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '4rem',
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#666',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
  tabList: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#161616',
    padding: '4px',
    borderRadius: '8px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
  },
  tab: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#888',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    textTransform: 'uppercase',
    borderWidth: 0,
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#eee',
      backgroundColor: '#222',
    },
  },
  tabActive: {
    backgroundColor: '#333',
    color: '#00ffcc',
  },
  previewCard: {
    padding: '1.25rem',
    backgroundColor: '#161616',
    borderRadius: '12px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  swatch: (mode: ColorMode, color: ColorValue) => ({
    height: 60,
    borderRadius: 6,
    backgroundColor: formatCss(mode, color as ColorSpace<typeof mode>),
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
  }),
  inputGrid: {
    display: 'grid',
    gap: '8px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderColor: '#333',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '4px',
    color: '#00ffcc',
    padding: '4px 8px',
    fontSize: '0.85rem',
    fontFamily: 'ui-monospace, monospace',
    outline: 'none',
    ':focus': {
      borderColor: '#00ffcc',
    },
  },
  codeBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingTop: '8px',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#222',
  },
  codeLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: '#666',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  codeValue: {
    fontSize: '0.75rem',
    color: '#888',
    fontFamily: 'ui-monospace, monospace',
    wordBreak: 'break-all',
  },
});
