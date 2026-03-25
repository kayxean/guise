import type { ColorMode } from '@kayxean/chromatrix/types';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { formatCss } from '@kayxean/chromatrix/format';
import { parseColor } from '@kayxean/chromatrix/parse';
import { createPicker } from '@kayxean/chromatrix/utils/picker';
import { AlphaPicker } from './components/alpha';
import { HuePicker } from './components/hue';
import { SpacePicker } from './components/space';
import { SquarePicker } from './components/square';
import { TextPicker } from './components/text';

export function ColorPicker({
  value,
  onChange,
  label,
  id,
  useHex = true,
  allowedMode,
}: {
  value: string;
  onChange: (css: string) => void;
  label?: string;
  id?: string;
  useHex?: boolean;
  allowedMode?: ColorMode[];
}) {
  const pickerRef = useRef<ReturnType<typeof createPicker> | null>(null);
  if (!pickerRef.current) {
    pickerRef.current = createPicker(parseColor(value));
  }
  const picker = pickerRef.current;

  const [view, setView] = useState(() => picker.getValue());
  const [asHex, setAsHex] = useState(useHex);
  const lastUpdateRef = useRef(value);

  useEffect(() => {
    if (value !== lastUpdateRef.current) {
      picker.assign(parseColor(value));
      lastUpdateRef.current = value;
      setView(picker.getValue());
    }
  }, [value, picker]);

  useLayoutEffect(() => {
    return picker.subscribe((nextView, color) => {
      setView(nextView);
      const newCss = formatCss(color, asHex);

      if (newCss !== lastUpdateRef.current) {
        lastUpdateRef.current = newCss;
        onChange(newCss);
      }
    });
  }, [picker, onChange, asHex]);

  const previewColor = formatCss(picker.getColor(), asHex);
  const solidColor = formatCss(picker.getSolid(), asHex);

  return (
    <div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.preview(previewColor))} />

      {label && <div>{label}</div>}
      {id && <div>{id}</div>}

      <div>
        <code>{previewColor}</code>
      </div>

      <SquarePicker
        hue={view.h}
        x={view.s}
        y={view.v}
        onSelect={(s, v) => picker.update(s, v, 'sv')}
      />

      <HuePicker hue={view.h} onSelect={(h) => picker.update(h / 360, 0, 'h')} />

      <AlphaPicker alpha={view.a} color={solidColor} onSelect={(a) => picker.update(a, 0, 'a')} />

      <SpacePicker
        allowedMode={allowedMode}
        currentSpace={picker.getSpace()}
        useHex={asHex}
        onSelect={(s) => {
          const isHex = s === 'hex';
          const nextSpace = isHex ? 'rgb' : s;

          setAsHex(isHex);
          picker.setSpace(nextSpace);

          const currentColor = picker.getColor();
          const newCss = formatCss(currentColor, isHex);

          if (newCss !== lastUpdateRef.current) {
            lastUpdateRef.current = newCss;
            onChange(newCss);
          }
        }}
      />

      <TextPicker
        color={value}
        id={id || 'text'}
        onChange={(next) => {
          try {
            picker.assign(parseColor(next));
          } catch (e) {
            console.warn(e);
          }
        }}
      />
    </div>
  );
}

const styles = stylex.create({
  layout: {
    backgroundColor: '#282828',
    borderRadius: '.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '.75rem',
    paddingBottom: '.5rem',
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
    paddingTop: '.5rem',
    width: '100%',
  },
  preview: (color: string) => ({
    backgroundColor: color,
    borderRadius: '.25rem',
    height: '3rem',
    width: '3rem',
  }),
});
