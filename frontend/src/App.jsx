import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
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

const Card = styled.div`
  padding: 2em;
`

const CountButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  
  &:hover {
    border-color: #646cff;
  }
  
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  
  @media (prefers-color-scheme: light) {
    background-color: #f9f9f9;
  }
`

const ReadTheDocs = styled.p`
  color: #888;
`

const StyledLink = styled.a`
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
  
  &:hover {
    color: #535bf2;
  }
  
  @media (prefers-color-scheme: light) {
    &:hover {
      color: #747bff;
    }
  }
`

function App() {
  const [count, setCount] = useState(0)

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
      <Title>Vite + React</Title>
      <Card>
        <CountButton onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </CountButton>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </Card>
      <ReadTheDocs>
        Click on the Vite and React logos to learn more
      </ReadTheDocs>
    </AppContainer>
  )
}

export default App
