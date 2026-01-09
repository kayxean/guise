import type { KeyboardEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { createStore } from '~/features/store';
import { Icon } from '../components/icons';
import { chrome } from '../tokens.stylex';

interface State extends Record<string, unknown> {
  count: number;
  text: string;
}

const [useStore, apiStore] = createStore<State>({
  count: 0,
  text: 'Hello World!',
});

const increaseCount = () => {
  apiStore.setState((s) => ({ ...s, count: s.count + 1 }));
};

const decreaseCount = () => {
  apiStore.setState((s) => ({ ...s, count: s.count - 1 }));
};

const restoreCount = () => {
  apiStore.setState((s) => ({ ...s, count: 0 }));
};

export function CounterApp() {
  const count = useStore((state) => state.count);

  const increaseRef = useRef<HTMLButtonElement>(null);
  const decreaseRef = useRef<HTMLButtonElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowLeft': {
        decreaseCount();
        const decrease = decreaseRef.current;
        if (decrease) {
          requestAnimationFrame(() => {
            decrease.focus();
          });
        }
        break;
      }
      case 'ArrowUp':
      case 'ArrowRight': {
        increaseCount();
        const increase = increaseRef.current;
        if (increase) {
          requestAnimationFrame(() => {
            increase.focus();
          });
        }
        break;
      }
      case 'Escape':
        restoreCount();
        break;
      default:
        return;
    }
  };

  return (
    <div
      role="application"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      {...stylex.props(styles.layout)}
    >
      <h1
        tabIndex={-1}
        onDoubleClick={restoreCount}
        {...stylex.props(styles.count)}
      >
        {count}
      </h1>
      <div {...stylex.props(styles.action)}>
        <button
          ref={decreaseRef}
          type="button"
          aria-label="Decrement"
          onClick={decreaseCount}
          {...stylex.props(styles.button)}
        >
          <Icon name="remove" {...stylex.props(styles.icon)} />
        </button>
        <button
          ref={increaseRef}
          type="button"
          aria-label="Increment"
          onClick={increaseCount}
          {...stylex.props(styles.button)}
        >
          <Icon name="add" {...stylex.props(styles.icon)} />
        </button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    alignItems: 'center',
    backgroundColor: chrome.app_background,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    minHeight: 'calc(100dvh - 5.5rem)',
    outline: 'none',
    padding: '1.5rem .75rem',
    position: 'relative',
  },
  count: {
    color: chrome.app_text,
    fontSize: '8rem',
    fontWeight: 500,
    lineHeight: 1,
    outline: 'none',
    userSelect: 'none',
  },
  action: {
    display: 'flex',
    gap: '.75rem',
  },
  button: {
    alignItems: 'center',
    backgroundColor: {
      default: chrome.app_button_background,
      ':hover': chrome.app_button_hover,
    },
    borderRadius: '50%',
    color: chrome.app_button_icon,
    cursor: 'pointer',
    display: 'inline-flex',
    height: '3rem',
    justifyContent: 'center',
    width: '3rem',
  },
  icon: {
    height: '1.5rem',
    width: '1.5rem',
  },
});
