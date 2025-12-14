import * as stylex from '@stylexjs/stylex';
import { useTabStore } from '../tabs';

export function TabPanel() {
  const tabsList = useTabStore((state) => state.tabsList);
  const tabActive = useTabStore((state) => state.tabActive);

  return (
    <div {...stylex.props(tab_panel.layout)}>
      {tabsList.map((t) => {
        const Content = t.content;
        const isActive = tabActive === t.id;

        return (
          <div
            key={t.id}
            id={`panel-${t.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${t.id}`}
            aria-hidden={!isActive}
            hidden={!isActive}
          >
            <Content />
          </div>
        );
      })}
    </div>
  );
}

const tab_panel = stylex.create({
  layout: {
    position: 'relative',
    overflowX: 'auto',
    overflowY: 'auto',
  },
});
