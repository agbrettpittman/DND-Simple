import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const AppContainer = styled(Container)`
  && {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
`

const logoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const Logo = styled.img`
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
  
  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  
  &.react:hover {
    filter: drop-shadow(0 0 2em #61dafbaa);
  }
  
  @media (prefers-reduced-motion: no-preference) {
    &.react {
      animation: ${logoSpin} infinite 20s linear;
    }
  }
`

const Title = styled.h1`
  font-size: 3.2em;
  line-height: 1.1;
`

const Card = styled(Paper)`
  padding: 2em;
`

const CountButton = styled(Button)`
  && {
    text-transform: none;
  }
`

const ReadTheDocs = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`

const StyledLink = styled.a`
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: inherit;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`

function App() {
  const [Count, SetCount] = useState(0)

  return (
    <AppContainer>
      <LogoContainer>
        <StyledLink href="https://vite.dev" target="_blank">
          <Logo src={viteLogo} alt="Vite logo" />
        </StyledLink>
        <StyledLink href="https://react.dev" target="_blank">
          <Logo src={reactLogo} className="react" alt="React logo" />
        </StyledLink>
      </LogoContainer>
      <Typography variant="h3" component={Title} gutterBottom>
        Vite + React + MUI
      </Typography>
      <Card elevation={3}>
        <Stack spacing={2} alignItems="center">
          <CountButton
            variant="contained"
            color="primary"
            onClick={() => SetCount((Prev) => Prev + 1)}
          >
            Count is {Count}
          </CountButton>
          <Typography variant="body2" color="text.secondary">
            Edit <code>src/App.jsx</code> and save to test HMR
          </Typography>
        </Stack>
      </Card>
      <ReadTheDocs>
        Click on the Vite and React logos to learn more
      </ReadTheDocs>
    </AppContainer>
  )
}

export default App
