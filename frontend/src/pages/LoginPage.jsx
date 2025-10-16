import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import styled from 'styled-components'

const Card = styled(Paper)`
  && {
    max-width: 420px;
    width: 100%;
    padding: 2rem;
    margin: 0 auto;
  }
`

function LoginPage() {
  const [Email, SetEmail] = useState('')
  const [Password, SetPassword] = useState('')
  const [Error, SetError] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    // Placeholder auth for now
    if (!Email || !Password) {
      SetError('Please enter email and password')
      return
    }
    SetError(null)
    // TODO: Call backend login; for now just log
    // console.log({ Email, Password })
    alert('Login clicked (mock)')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Card elevation={3}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            {Error && <Alert severity="error">{Error}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={Email}
              onChange={(e) => SetEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={Password}
              onChange={(e) => SetPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  )
}

export default LoginPage
