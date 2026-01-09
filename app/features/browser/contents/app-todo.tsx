import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';
import { createStore } from '~/features/store';
import { createToken } from '~/features/utils';
import { Icon } from '../components/icons';
import { chrome } from '../tokens.stylex';

interface State extends Record<string, unknown> {
  todos: {
    id: number;
    text: string;
    done: boolean;
  }[];
}

const [useStore, apiStore] = createStore<State>({
  todos: [
    { id: 1, text: 'Do something', done: false },
    { id: 2, text: 'Oh, no!', done: false },
    { id: 3, text: 'Wait what?', done: false },
  ],
});

const addTodo = (text: string) => {
  apiStore.setState((s) => ({
    ...s,
    todos: [...s.todos, { id: Date.now(), text, done: false }],
  }));
};

const toggleTodo = (id: number) => {
  apiStore.setState((s) => ({
    ...s,
    todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  }));
};

const removeTodo = (id: number) => {
  apiStore.setState((s) => ({
    ...s,
    todos: s.todos.filter((t) => t.id !== id),
  }));
};

export function TodoApp() {
  const todos = useStore((s) => s.todos);
  const [input, setInput] = useState('');

  const input_id = useMemo(() => createToken(), []);

  return (
    <div {...stylex.props(styles.layout)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            addTodo(input.trim());
            setInput('');
          }
        }}
        {...stylex.props(styles.form)}
      >
        <input
          id={input_id}
          type="text"
          autoComplete="off"
          spellCheck="false"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Create a new task"
          {...stylex.props(styles.input)}
        />
        <button type="submit" {...stylex.props(styles.action)}>
          <Icon name="add_small" {...stylex.props(styles.icon)} />
        </button>
      </form>

      <ul {...stylex.props(styles.list)}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            {...stylex.props(styles.item, stylex.defaultMarker())}
          >
            <button
              type="button"
              onClick={() => toggleTodo(todo.id)}
              {...stylex.props(styles.button, styles.button_left)}
            >
              {todo.done ? (
                <Icon
                  name="radio_button_checked"
                  {...stylex.props(styles.icon)}
                />
              ) : (
                <Icon
                  name="radio_button_unchecked"
                  {...stylex.props(styles.icon)}
                />
              )}
            </button>
            <p
              {...stylex.props(styles.text, todo.done && styles.text_disabled)}
            >
              {todo.text}
            </p>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => removeTodo(todo.id)}
              {...stylex.props(styles.button, styles.button_right)}
            >
              <Icon name="close_small" {...stylex.props(styles.icon)} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    alignContent: 'baseline',
    backgroundColor: chrome.app_background,
    display: 'grid',
    gap: '1rem',
    minHeight: 'calc(100dvh - 5.5rem)',
    padding: '1rem .75rem',
    position: 'relative',
  },
  form: {
    alignItems: 'center',
    display: 'grid',
    gap: '.75rem',
    gridTemplateColumns: '1fr auto',
    height: '3rem',
    margin: '0 auto',
    maxWidth: '48rem',
    width: '100%',
  },
  input: {
    backgroundColor: {
      default: chrome.app_input_background,
      ':hover': chrome.app_input_hover,
    },
    borderRadius: '1.25rem',
    color: chrome.app_input_text,
    fontSize: '.875rem',
    height: '2.25rem',
    lineHeight: 1,
    outline: 'none',
    padding: '.063rem 1rem',
    width: '100%',
    '::placeholder': {
      color: chrome.omnibox_placeholder,
    },
  },
  action: {
    alignItems: 'center',
    backgroundColor: {
      default: chrome.app_button_background,
      ':hover': chrome.app_button_hover,
    },
    borderRadius: '50%',
    color: chrome.app_button_icon,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    height: '2.25rem',
    width: '2.25rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    listStyle: 'none',
    margin: '0 auto',
    maxWidth: '48rem',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    backgroundColor: {
      default: chrome.app_button_background,
      ':hover': chrome.app_button_hover,
    },
    borderRadius: '.5rem',
    display: 'grid',
    gap: '.375rem',
    gridTemplateColumns: 'auto 1fr auto',
    padding: '.375rem',
    position: 'relative',
    userSelect: 'none',
    zIndex: 1,
  },
  button: {
    alignItems: 'center',
    borderRadius: '50%',
    color: chrome.app_button_icon,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  button_left: {
    backgroundColor: chrome.transparent,
    height: '2rem',
    width: '2rem',
    ':after': {
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: -1,
    },
  },
  button_right: {
    backgroundColor: {
      default: chrome.app_button_background,
      ':hover': chrome.app_background,
    },
    height: '1.5rem',
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover')]: 1,
    },
    width: '1.5rem',
  },
  icon: {
    height: '1.5rem',
    width: '1.5rem',
  },
  text: {
    color: chrome.app_text,
    fontSize: '1rem',
    lineHeight: '2rem',
    maxWidth: 'calc(100dvw - 6.5rem)',
    overflow: 'hidden',
    pointerEvents: 'none',
    textDecoration: 'none',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  text_disabled: {
    color: chrome.app_button_icon,
    textDecoration: 'line-through',
  },
});
