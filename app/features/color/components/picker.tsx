import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatCss } from '../format';
import { parseColor } from '../parse';
import { createPicker } from '../utils/picker';
import { AlphaPicker } from './alpha';
import { HuePicker } from './hue';
import { SquarePicker } from './square';

interface ColorPickerProps {
  value: string;
  onChange: (css: string) => void;
  label?: string;
  subLabel?: string;
}

export function ColorPicker({
  value,
  onChange,
  label,
  subLabel,
}: ColorPickerProps) {
  const picker = useMemo(() => createPicker(parseColor(value)), [value]);

  const [view, setView] = useState(() => picker.getValue());
  const lastUpdateRef = useRef(value);

  useEffect(() => {
    if (value !== lastUpdateRef.current) {
      picker.assign(parseColor(value));
      lastUpdateRef.current = value;

      setView(picker.getValue());
    }
  }, [value, picker]);

  useEffect(() => {
    return picker.subscribe((nextView, color) => {
      setView(nextView);
      const newCss = formatCss(color);

      if (newCss !== lastUpdateRef.current) {
        lastUpdateRef.current = newCss;
        onChange(newCss);
      }
    });
  }, [picker, onChange]);

  const solidColor = useMemo(() => {
    return formatCss(picker.getSolid());
  }, [picker]);

  const previewColor = useMemo(() => {
    return formatCss(picker.getColor());
  }, [picker]);

  return (
    <div {...stylex.props(styles.layout)}>
      {label && <div {...stylex.props(styles.label)}>{label}</div>}
      {subLabel && (
        <div {...stylex.props(styles.pathIndicator)}>{subLabel}</div>
      )}

      <div {...stylex.props(styles.preview(previewColor))} />

      <SquarePicker
        hue={view.h}
        x={view.s}
        y={view.v}
        onSelect={(s, v) => picker.update(s, 1 - v, 'sv')}
      />

      <HuePicker
        hue={view.h}
        onSelect={(h) => picker.update(h / 360, 0, 'h')}
      />

      <AlphaPicker
        alpha={view.a}
        color={solidColor}
        onSelect={(a) => picker.update(a, 0, 'a')}
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
    padding: '1rem .5rem',
    width: '100%',
  },
  label: {
    color: '#efefef',
    fontSize: '.875rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  pathIndicator: {
    color: '#666',
    fontFamily: 'Google Sans Code, monospace',
    fontSize: '.75rem',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  preview: (color: string) => ({
    backgroundColor: color,
    borderRadius: '.25rem',
    height: '3rem',
    width: '3rem',
  }),
});
