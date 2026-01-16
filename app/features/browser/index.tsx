import type { ThemeState } from './themes';
import * as stylex from '@stylexjs/stylex';
import { ChromiumPicker } from './components/color-picker';
import { BrowserPreview } from './preview';
import { apiThemeStore, useThemeStore } from './themes';

export function Browser() {
  const themeState = useThemeStore();
  const { theme } = themeState;

  const themeKeys = Object.keys(themeState).filter(
    (key) => key !== 'theme',
  ) as (keyof Omit<ThemeState, 'theme'>)[];

  return (
    <div {...stylex.props(styles.layout)}>
      <aside {...stylex.props(styles.sidebar)}>
        <header>
          <h2>Theme Editor</h2>
          <div>
            <label htmlFor="incognito-mode">
              <input
                id="incognito-mode"
                type="checkbox"
                checked={theme.incognito}
                onChange={(e) =>
                  apiThemeStore.setState({
                    theme: { ...theme, incognito: e.target.checked },
                  })
                }
              />
              Incognito
            </label>
            <label htmlFor="inactive-mode">
              <input
                id="inactive-mode"
                type="checkbox"
                checked={theme.inactive}
                onChange={(e) =>
                  apiThemeStore.setState({
                    theme: { ...theme, inactive: e.target.checked },
                  })
                }
              />
              Inactive
            </label>
          </div>
        </header>

        <div {...stylex.props(styles.scrollArea)}>
          {themeKeys.map((group) => (
            <section key={group}>
              <ChromiumPicker
                baseKey={group}
                label={(group as string).replace(/_/g, ' ')}
              />
            </section>
          ))}
        </div>
      </aside>

      <main>
        <BrowserPreview />
      </main>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: '1rem',
    zIndex: 2,
    position: 'relative',
  },
  scrollArea: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: '1rem',
    overflow: 'auto',
    padding: '0 .5rem',
  },
});
