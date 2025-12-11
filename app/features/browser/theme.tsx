export function Theme() {
  const colors = {
    background_tab: '#121314',
    background_tab_inactive: '#121314',
    background_tab_incognito: '#121314',
    background_tab_incognito_inactive: '#121314',
    frame: '#000000',
    frame_inactive: '#000000',
    frame_incognito: '#000000',
    frame_incognito_inactive: '#000000',
    bookmark_text: '#A4A5A6',
    ntp_background: '#121314',
    ntp_text: '#A4A5A6',
    omnibox_background: '#242526',
    omnibox_text: '#A4A5A6',
    tab_background_text: '#A4A5A6',
    tab_background_text_inactive: '#A4A5A6',
    tab_background_text_incognito: '#A4A5A6',
    tab_background_text_incognito_inactive: '#A4A5A6',
    tab_text: '#F2F3F4',
    toolbar: '#121314',
    toolbar_button_icon: '#727374',
    toolbar_text: '#A4A5A6',
  } satisfies Record<string, string>;

  const styles = Object.entries(colors)
    .map(([key, value]) => `--${key}:${value};`)
    .join('');

  return <style>{`@layer browser{:root{${styles}}}`}</style>;
}
