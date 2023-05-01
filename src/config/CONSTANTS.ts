const CARROT_URL = 'https://www.buymeacoffee.com/wstone';
const B_URL = 'https://github.com/will-stone/browserosaurus';
const ISSUES_URL = 'https://github.com/will-stone/browserosaurus/issues';

export { B_URL, CARROT_URL, ISSUES_URL };

export const GREEN = 'rgb(22 163 74)';
export const BLUE = 'rgb(30 64 175)';
export const PINK = 'rgb(219 39 119)';

export const BG_GRADIENT =
  'bg-gradient-to-r from-green-600/50 via-blue-800/50 to-pink-600/50';

export const BG_GRADIENT_ACTIVE =
  'bg-gradient-to-r from-green-600 via-blue-800 to-pink-600';
export const URL_EVENT_NAME = 'scheme-request-received';

//TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const colors = ((light?: boolean) => {
  const theme = {
    background: '#1d1d1d',
    text: '#d1d1d1',
  };
  return theme;
})();
