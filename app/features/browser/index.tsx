import * as stylex from '@stylexjs/stylex';
import { ChromiumPicker } from './components/color-picker';
import { BrowserPreview } from './preview';

export function Browser() {
  return (
    <div {...stylex.props(styles.layout)}>
      <aside {...stylex.props(styles.sidebar)}>
        <div {...stylex.props(styles.scrollArea)}>
          <ChromiumPicker baseKey="frame" path={['frame']} label="Frame" />
          <ChromiumPicker
            baseKey="frame"
            path={['frame', 'inactive']}
            label="Frame Inactive"
          />
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
