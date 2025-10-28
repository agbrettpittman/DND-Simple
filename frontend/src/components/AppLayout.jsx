import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

const MainContainer = styled(Container)`
  && {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
`

function AppLayout() {
  const [IsLoggedIn, SetIsLoggedIn] = useState(false)
  useEffect(() => {
    try {
      SetIsLoggedIn(!!localStorage.getItem('currentUser'))
    } catch (err) {
      SetIsLoggedIn(false)
    }
  }, [])

  const onLogout = () => {
    try {
      localStorage.removeItem('currentUser')
    } catch (err) {}
    window.location.href = '/'
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DnD Simple
          </Typography>
          {IsLoggedIn ? (
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <MainContainer>
        <Outlet />
      </MainContainer>
    </Box>
  )
}

export default AppLayout
