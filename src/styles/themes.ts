export interface ITheme {
  dark: boolean;
  colors: {
    background: string;
    primary: string;
    border: string;
    text: string;
    block: string;
    card: string;
    shadow: string;
    notification: string;
  };
}

export const LightTheme: ITheme = {
  dark: false,
  colors: {
    background: '#F8F8FA',
    primary: '#C62E3E',
    border: '#EAEAEA',
    text: '#000000',
    block: '#FFFFFF',
    card: '#FFFFFF',
    shadow: '#000000',
    notification: '#EAEAEA'
  },
};

export const DarkTheme: ITheme = {
  dark: true,
  colors: {
    background: '#121212',
    primary: '#C62E3E',
    border: '#3B3B3B',
    text: '#DDDDDD',
    block: '#222222',
    card: '#222222',
    shadow: '#FFFFFF',
    notification: '#3B3B3B'
  },
};

export const BlackTheme: ITheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
    block: '#000000',
  },
};
