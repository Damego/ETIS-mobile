export const LightTheme = {
  dark: false,
  colors: {
    background: '#F8F8FA',
    primary: '#C62E3E',
    border: '#EAEAEA',
    text: '#000000',
    block: '#FFFFFF',
    card: '#FFFFFF',
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    primary: '#C62E3E',
    border: '#3B3B3B',
    text: '#DDDDDD',
    block: '#222222',
    card: '#222222',
  },
};
export const AmoledTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000',
  },
};