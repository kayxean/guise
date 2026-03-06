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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(buffer);
    }
  };

  const handleBlur = () => {
    onChange(buffer);
  };

  return (
    <div>
      <input
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        spellCheck={false}
      />
    </div>
  );
}
