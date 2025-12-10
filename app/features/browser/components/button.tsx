import type { ComponentProps } from 'react';
import type { Icons } from './icons';
import { MATERIAL_ICONS } from './icons';

export function Button({
  icon,
  text,
  ...button
}: {
  icon: Icons;
  text?: string;
} & ComponentProps<'button'>) {
  const paths = MATERIAL_ICONS[icon];

  return (
    <button {...button}>
      <svg width={24} height={24} viewBox="0 0 24 24" role="presentation">
        {paths.map((shape) => (
          <path key={shape} d={shape} fill="currentColor" />
        ))}
      </svg>
      {text && <span>{text}</span>}
    </button>
  );
}

export function Icon({
  name,
  ...svg
}: { name: Icons } & ComponentProps<'svg'>) {
  const paths = MATERIAL_ICONS[name];
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      role="presentation"
      {...svg}
    >
      {paths.map((shape) => (
        <path key={shape} d={shape} fill="currentColor" />
      ))}
    </svg>
  );
}
