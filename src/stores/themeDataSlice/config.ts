export const variableVals = [
  '--background',
  '--foreground',
  '--muted',
  '--muted-foreground',
  '--popover',
  '--popover-foreground',
  '--card',
  '--card-foreground',
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

export const defaultDarkTheme: CustomTheme = {
  name: 'default dark',
  themeVariableMap: {
    '--background': {
      label: 'background',
      cssVarName: '--background',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: false,
      inherits: ['--popover', '--card'],
    },
    '--foreground': {
      label: 'foreground',
      cssVarName: '--foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
    },
    '--muted': {
      label: 'muted',
      cssVarName: '--muted',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
    },
    '--muted-foreground': {
      label: 'muted foreground',
      cssVarName: '--muted-foreground',
      value: { h: 215, s: 20.2, l: 65.1 },
      varNotFound: false,
    },
    '--accent': {
      label: 'accent',
      cssVarName: '--accent',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
      inherits: ['--border', '--input', '--ring'],
    },
    '--popover': {
      label: 'popover',
      cssVarName: '--popover',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: false,
      inheritedFrom: '--background',
    },
    '--popover-foreground': {
      label: 'popover foreground',
      cssVarName: '--popover-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
    },
    '--card': {
      label: 'card',
      cssVarName: '--card',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: false,
      inheritedFrom: '--background',
    },
    '--card-foreground': {
      label: 'card foreground',
      cssVarName: '--card-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: true,
    },
    '--border': {
      label: 'border',
      cssVarName: '--border',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
    '--input': {
      label: 'input',
      cssVarName: '--input',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
    '--primary': {
      label: 'primary',
      cssVarName: '--primary',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
      inherits: [
        '--secondary-foreground',
        '--accent-foreground',
        '--destructive-foreground',
      ],
    },
    '--primary-foreground': {
      label: 'primary foreground',
      cssVarName: '--primary-foreground',
      value: { h: 222.2, s: 47.4, l: 11.2 },
      varNotFound: false,
    },
    '--secondary': {
      label: 'secondary',
      cssVarName: '--secondary',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
    },
    '--secondary-foreground': {
      label: 'secondary foreground',
      cssVarName: '--secondary-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--accent-foreground': {
      label: 'accent foreground',
      cssVarName: '--accent-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--destructive': {
      label: 'destructive',
      cssVarName: '--destructive',
      value: { h: 0, s: 62.8, l: 30.6 },
      varNotFound: false,
    },
    '--destructive-foreground': {
      label: 'destructive foreground',
      cssVarName: '--destructive-foreground',
      value: { h: 0, s: 85.7, l: 97.3 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--ring': {
      label: 'ring',
      cssVarName: '--ring',
      value: { h: 217.2, s: 32.6, l: 17.5 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
  },
};

export const defaultLightTheme: CustomTheme = {
  name: 'default light',
  themeVariableMap: {
    '--background': {
      label: 'background',
      cssVarName: '--background',
      value: { h: 0, s: 0, l: 100 },
      varNotFound: false,
      inherits: ['--popover', '--card'],
    },
    '--foreground': {
      label: 'foreground',
      cssVarName: '--foreground',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: false,
    },
    '--muted': {
      label: 'muted',
      cssVarName: '--muted',
      value: { h: 210, s: 40, l: 96.1 },
      varNotFound: false,
    },
    '--muted-foreground': {
      label: 'muted foreground',
      cssVarName: '--muted-foreground',
      value: { h: 215.4, s: 16.3, l: 46.9 },
      varNotFound: false,
    },
    '--accent': {
      label: 'accent',
      cssVarName: '--accent',
      value: { h: 210, s: 40, l: 96.1 },
      varNotFound: false,
      inherits: ['--border', '--input', '--ring'],
    },
    '--popover': {
      label: 'popover',
      cssVarName: '--popover',
      value: { h: 0, s: 0, l: 100 },
      varNotFound: false,
      inheritedFrom: '--background',
    },
    '--popover-foreground': {
      label: 'popover foreground',
      cssVarName: '--popover-foreground',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: false,
    },
    '--card': {
      label: 'card',
      cssVarName: '--card',
      value: { h: 0, s: 0, l: 100 },
      varNotFound: false,
      inheritedFrom: '--background',
    },
    '--card-foreground': {
      label: 'card foreground',
      cssVarName: '--card-foreground',
      value: { h: 222.2, s: 84, l: 4.9 },
      varNotFound: true,
    },
    '--border': {
      label: 'border',
      cssVarName: '--border',
      value: { h: 214.3, s: 31.8, l: 91.4 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
    '--input': {
      label: 'input',
      cssVarName: '--input',
      value: { h: 214.3, s: 31.8, l: 91.4 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
    '--primary': {
      label: 'primary',
      cssVarName: '--primary',
      value: { h: 222.2, s: 47.4, l: 11.2 },
      varNotFound: false,
      inherits: [
        '--secondary-foreground',
        '--accent-foreground',
        '--destructive-foreground',
      ],
    },
    '--primary-foreground': {
      label: 'primary foreground',
      cssVarName: '--primary-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
    },
    '--secondary': {
      label: 'secondary',
      cssVarName: '--secondary',
      value: { h: 210, s: 40, l: 96.1 },
      varNotFound: false,
    },
    '--secondary-foreground': {
      label: 'secondary foreground',
      cssVarName: '--secondary-foreground',
      value: { h: 222.2, s: 47.4, l: 11.2 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--accent-foreground': {
      label: 'accent foreground',
      cssVarName: '--accent-foreground',
      value: { h: 222.2, s: 47.4, l: 11.2 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--destructive': {
      label: 'destructive',
      cssVarName: '--destructive',
      value: { h: 0, s: 84.2, l: 60.2 },
      varNotFound: false,
    },
    '--destructive-foreground': {
      label: 'destructive foreground',
      cssVarName: '--destructive-foreground',
      value: { h: 210, s: 40, l: 98 },
      varNotFound: false,
      inheritedFrom: '--primary',
    },
    '--ring': {
      label: 'ring',
      cssVarName: '--ring',
      value: { h: 215, s: 20.2, l: 65.1 },
      varNotFound: false,
      inheritedFrom: '--accent',
    },
  },
};