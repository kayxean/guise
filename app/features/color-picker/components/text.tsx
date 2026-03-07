import { useEffect, useState } from 'react';

export function TextPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [buffer, setBuffer] = useState<string>(color);

  useEffect(() => {
    setBuffer(color);
  }, [color]);

  const commit = () => {
    const clean = buffer.trim();
    if (clean !== color) {
      onChange(clean);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commit();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div>
      <input
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
