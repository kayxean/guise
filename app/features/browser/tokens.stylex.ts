import * as stylex from '@stylexjs/stylex';

export const dynamic = stylex.create({
  bg: (color: string) => ({ backgroundColor: color }),
  bg_hover: (color: string, hover: string) => ({
    backgroundColor: { default: color, ':hover': hover },
  }),
  text: (color: string) => ({ color: color }),
  text_hover: (color: string, hover: string) => ({
    color: { default: color, ':hover': hover },
  }),
  shadow: (color: string) => ({ boxShadow: color }),
  border: (color: string) => ({ borderColor: color }),
  image: (color: string) => ({ backgroundImage: color }),
});

export const chrome = stylex.defineConsts({
  button_hover: '#ffffff1c',
  input_hover: '#ffffff1c',
  omnibox_placeholder: '#a4a5a6',
  transparent: '#0000',
  ntp_link: '#f2f3f4',
  ntp_button_icon: '#f2f3f4',
  ntp_button_background: '#161718',
  ntp_profile_background: '#000',
  ntp_doodle: '#f2f3f4',
  ntp_omnibox_background: '#f2f3f4',
  ntp_omnibox_text: '#020304',
  ntp_omnibox_placeholder: '#727374',
  ntp_omnibox_action: '#5f6368',
  ntp_omnibox_action_alt: '#020304',
  ntp_omnibox_ai_mode: '#e2e7ea',
  app_background: '#202124',
  app_text: '#e3e3e3',
  app_input_background: '#282828',
  app_input_hover: '#373737',
  app_input_text: '#c4c7c5',
  app_button_background: '#292a2d',
  app_button_hover: '#3c4043',
  app_button_icon: '#9aa0a6',
});
