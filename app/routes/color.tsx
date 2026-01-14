import type { MetaFunction } from '@remix-run/node';
import type { ColorMode, ColorSpace } from '~/features/color/core/types';
import * as stylex from '@stylexjs/stylex';
import { memo, useCallback, useMemo, useState } from 'react';
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

const Header = memo(({ mode }: { mode: ColorMode }) => (
  <header {...stylex.props(styles.header)}>
    <h1 {...stylex.props(styles.title)}>Color Hub</h1>
    <p {...stylex.props(styles.subtitle)}>
      {mode.toUpperCase()} Source → XYZ65 Hub → HSV UI
    </p>
  </header>
));

const TabList = memo(
  ({
    currentMode,
    onModeChange,
  }: {
    currentMode: ColorMode;
    onModeChange: (m: ColorMode) => void;
  }) => (
    <div {...stylex.props(styles.tabList)}>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onModeChange(m)}
          {...stylex.props(styles.tab, m === currentMode && styles.tabActive)}
        >
          {m}
        </button>
      ))}
    </div>
  ),
);

export default function ColorRoute() {
  const [mode, setMode] = useState<ColorMode>('oklch');
  const [color, setColor] = useState<ColorSpace<ColorMode>>([
    0.6, 0.15, 240,
  ] as ColorSpace<'oklch'>);

  const handleModeChange = useCallback(
    (nextMode: ColorMode) => {
      if (mode === nextMode) return;

      const nextColor = convertColor(
        color as ColorSpace<typeof mode>,
        mode,
        nextMode as Exclude<ColorMode, typeof mode>,
      );

      setMode(nextMode);
      setColor(nextColor as ColorSpace<ColorMode>);
    },
    [mode, color],
  );

  const handleInputChange = useCallback((index: number, value: string) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return;

    setColor((prev) => {
      const next = [...prev] as ColorSpace<ColorMode>;
      next[index] = num;
      return next;
    });
  }, []);

  const inputFields = useMemo(
    () => (
      <div {...stylex.props(styles.inputGrid)}>
        {color.map((val, i) => {
          const channelName = mode[i] ?? `ch${i}`;
          const inputId = `ci-${mode}-${i}`;
          return (
            <div key={inputId} {...stylex.props(styles.inputGroup)}>
              <label htmlFor={inputId} {...stylex.props(styles.codeLabel)}>
                {channelName}
              </label>
              <input
                id={inputId}
                type="number"
                step={mode.includes('rgb') || mode.includes('lab') ? 0.01 : 1}
                value={val}
                onChange={(e) => handleInputChange(i, e.target.value)}
                {...stylex.props(styles.input)}
              />
            </div>
          );
        })}
      </div>
    ),
    [color, mode, handleInputChange],
  );

  return (
    <div {...stylex.props(styles.root)}>
      <Header mode={mode} />

      <TabList currentMode={mode} onModeChange={handleModeChange} />

      <ColorPicker
        mode={mode}
        color={color as ColorSpace<typeof mode>}
        onUpdate={(next) => setColor(next as ColorSpace<ColorMode>)}
      />

      <section {...stylex.props(styles.previewCard)}>
        <div
          {...stylex.props(styles.swatchBase)}
          style={{
            backgroundColor: formatCss(mode, color as ColorSpace<typeof mode>),
          }}
        />

        {inputFields}

        <div {...stylex.props(styles.codeBlock)}>
          <span {...stylex.props(styles.codeLabel)}>CSS Output</span>
          <code {...stylex.props(styles.codeValue)}>
            {formatCss(mode, color as ColorSpace<typeof mode>)}
          </code>
        </div>
      </section>
    </div>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, sans-serif',
    gap: '2rem',
    minHeight: '100vh',
    padding: '4rem',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  tabList: {
    backgroundColor: '#161616',
    borderColor: '#333',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    gap: '4px',
    padding: '4px',
  },
  tab: {
    backgroundColor: 'transparent',
    borderRadius: '6px',
    borderWidth: 0,
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '6px 12px',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#222',
      color: '#eee',
    },
  },
  tabActive: {
    backgroundColor: '#333',
    color: '#00ffcc',
  },
  previewCard: {
    backgroundColor: '#161616',
    borderColor: '#333',
    borderRadius: '12px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '1.25rem',
    width: 300,
  },
  swatchBase: {
    borderRadius: 6,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
    height: 60,
  },
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
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#00ffcc',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '0.85rem',
    outline: 'none',
    padding: '4px 8px',
    ':focus': {
      borderColor: '#00ffcc',
    },
  },
  codeBlock: {
    borderTopColor: '#222',
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingTop: '8px',
  },
  codeLabel: {
    color: '#666',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  codeValue: {
    color: '#888',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '0.75rem',
    wordBreak: 'break-all',
  },
});
