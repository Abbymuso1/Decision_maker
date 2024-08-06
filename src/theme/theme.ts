import { createTheme, ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Extend TypographyVariants to include the new variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    title: React.CSSProperties;
    subtitle3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
  }
}

// Extend the Typography's props to include the new variants
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitle3: true;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#337357',
    },
    secondary: {
      main: '#071e22',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: 12,
      color: '#071e22',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 10,
      color: '#337357',
      fontWeight: 200,
    },
    h3: {
      fontSize: 35,
      color: '#071e22',
      fontWeight: 300,
    },
    subtitle1: {
      fontSize: 18,
      color: '#071e22',
      fontWeight: 500,
      fontStyle: 'italic',
    },
    subtitle2: {
      fontFamily: 'Lora, serif',
      fontSize: 36,
      color: '#337357',
      fontWeight: '700',
      textAlign: 'left',
    },
    subtitle3: {
      fontFamily: 'Lora, serif',
      fontSize: 24,
      color: '#337357',
      fontWeight: '700',
      textAlign: 'left',
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
