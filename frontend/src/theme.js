import { createTheme } from '@mui/material/styles'

// Central theme shared by MUI and styled-components
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#646cff',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 10,
  },
})

export default theme
