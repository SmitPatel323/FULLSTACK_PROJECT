import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0096FF' }, // A brighter, more modern blue
    secondary: { main: '#FFC107' }, // A vibrant amber/yellow
    background: { default: '#0D1117', paper: '#161B22' }, // GitHub-like dark theme
    text: { primary: '#C9D1D9', secondary: '#8B949E' },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#007FFF',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove gradients from default paper
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDataGrid: {
        styleOverrides: {
            root: {
                border: 'none',
            },
            cell: {
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            },
            columnHeaders: {
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            },
        },
    },
  },
});