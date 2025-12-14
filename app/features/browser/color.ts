import { createStore } from '~/features/store';

interface ColorState extends Record<string, unknown> {
  background_tab: string;
  background_tab_inactive: string;
  background_tab_incognito: string;
  background_tab_incognito_inactive: string;
  frame: string;
  frame_inactive: string;
  frame_incognito: string;
  frame_incognito_inactive: string;
  bookmark_text: string;
  ntp_background: string;
  ntp_text: string;
  omnibox_background: string;
  omnibox_text: string;
  tab_background_text: string;
  tab_background_text_inactive: string;
  tab_background_text_incognito: string;
  tab_background_text_incognito_inactive: string;
  tab_text: string;
  toolbar: string;
  toolbar_button_icon: string;
  toolbar_text: string;
}

const [useColorStore, apiColorStore] = createStore<ColorState>({
  background_tab: '#121314',
  background_tab_inactive: '#121314',
  background_tab_incognito: '#121314',
  background_tab_incognito_inactive: '#121314',
  frame: '#020304',
  frame_inactive: '#020304',
  frame_incognito: '#020304',
  frame_incognito_inactive: '#020304',
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
});

export { useColorStore, apiColorStore };
