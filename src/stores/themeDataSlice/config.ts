import { CustomTheme } from '.';

export const variableVals = [
  '--background',
  '--foreground',
  '--muted',
  '--muted-foreground',
  '--popover',
  '--popover-foreground',
  '--card',
  '--card-muted',
  '--border',
  '--input',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--ring',
] as const;

export const availableThemes = ['dark', 'light', 'system', 'custom'] as const;

export const darkTheme = {
  '--background': {
    label: 'background',
    cssVarName: '--background',
    value: { h: 224, s: 71, l: 4 },
    varNotFound: false,
  },
  '--foreground': {
    label: 'foreground',
    cssVarName: '--foreground',
    value: { h: 213, s: 31, l: 91 },
    varNotFound: false,
  },
  '--muted': {
    label: 'muted',
    cssVarName: '--muted',
    value: { h: 223, s: 47, l: 11 },
    varNotFound: false,
  },
  '--muted-foreground': {
    label: 'muted foreground',
    cssVarName: '--muted-foreground',
    value: { h: 215, s: 16, l: 56 },
    varNotFound: false,
  },
  '--popover': {
    label: 'popover',
    cssVarName: '--popover',
    value: { h: 224, s: 71, l: 4 },
    varNotFound: false,
  },
  '--popover-foreground': {
    label: 'popover foreground',
    cssVarName: '--popover-foreground',
    value: { h: 215, s: 20, l: 65 },
    varNotFound: false,
  },
  '--card': {
    label: 'card',
    cssVarName: '--card',
    value: { h: 224, s: 71, l: 4 },
    varNotFound: false,
  },
  '--card-muted': {
    label: 'card muted',
    cssVarName: '--card-muted',
    value: { h: 0, s: 0, l: 0 },
    varNotFound: true,
  },
  '--border': {
    label: 'border',
    cssVarName: '--border',
    value: { h: 216, s: 34, l: 17 },
    varNotFound: false,
  },
  '--input': {
    label: 'input',
    cssVarName: '--input',
    value: { h: 216, s: 34, l: 17 },
    varNotFound: false,
  },
  '--primary': {
    label: 'primary',
    cssVarName: '--primary',
    value: { h: 210, s: 40, l: 98 },
    varNotFound: false,
  },
  '--primary-foreground': {
    label: 'primary foreground',
    cssVarName: '--primary-foreground',
    value: { h: 222, s: 47, l: 1 },
    varNotFound: false,
  },
  '--secondary': {
    label: 'secondary',
    cssVarName: '--secondary',
    value: { h: 222, s: 47, l: 11 },
    varNotFound: false,
  },
  '--secondary-foreground': {
    label: 'secondary foreground',
    cssVarName: '--secondary-foreground',
    value: { h: 210, s: 40, l: 98 },
    varNotFound: false,
  },
  '--accent': {
    label: 'accent',
    cssVarName: '--accent',
    value: { h: 216, s: 34, l: 17 },
    varNotFound: false,
  },
  '--accent-foreground': {
    label: 'accent foreground',
    cssVarName: '--accent-foreground',
    value: { h: 210, s: 40, l: 98 },
    varNotFound: false,
  },
  '--destructive': {
    label: 'destructive',
    cssVarName: '--destructive',
    value: { h: 0, s: 63, l: 31 },
    varNotFound: false,
  },
  '--destructive-foreground': {
    label: 'destructive foreground',
    cssVarName: '--destructive-foreground',
    value: { h: 210, s: 40, l: 98 },
    varNotFound: false,
  },
  '--ring': {
    label: 'ring',
    cssVarName: '--ring',
    value: { h: 216, s: 34, l: 17 },
    varNotFound: false,
  },
};

export const defaultCustomTheme: CustomTheme = {
  name: 'default',
  isActive: false,
  themeVariableMap: darkTheme,
};
