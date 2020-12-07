import React from 'react';
import { ThemeProvider } from 'styled-components';

export const MainTheme = {
  colors: {
    primary: '#28acde',
    secondary: '#ffffff',
    teritary: '#FFAD25',
    quaternary: '#282c2f',
  },
  darkerColors: {
    primary: '#5FC7FF',
  },
  alphaColors: {
    primary: 'rgba(40, 172, 222, 0.25)',
  },
  errorColors: {
    primary: '#FF0000',
    secondary: '#282c2f',
  },
  warningColors: {
    primary: '#FFC10C',
  },
};

interface ThemeProps {
  children?: any;
}

const Theme = (props: ThemeProps) => {
  const { children } = props;
  return <ThemeProvider theme={MainTheme}>{children}</ThemeProvider>;
};

export default Theme;
