import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle, ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import App from './App.jsx'

const GlobalStyles = createGlobalStyle`
  :root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  #root {
    width: 100%;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }
  }
`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <App />
      </StyledThemeProvider>
    </ThemeProvider>
  </StrictMode>,
)
