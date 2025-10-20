import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography, Link } from '@mui/material'
import styled from 'styled-components'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

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
  const [IsSubmitting, SetIsSubmitting] = useState(false)
  const Navigate = useNavigate()
  const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!Email || !Password) {
      SetError('Please enter email and password')
      return
    }
    SetError(null)
    SetIsSubmitting(true)
    try {
      const res = await fetch(`${ApiBaseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: Email, password: Password })
      })
      if (!res.ok) {
        let message = 'Login failed'
        const data = await res.json().catch(() => null)
        if (data && data.message) message = data.message
        throw new Error(message)
      }
      // success
      Navigate('/')
    } catch (err) {
      SetError(err.message)
    } finally {
      SetIsSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
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
            <Button type="submit" variant="contained" color="primary" disabled={IsSubmitting}>
              {IsSubmitting ? 'Logging in…' : 'Login'}
            </Button>
            <Typography variant="body2" align="center">
              New here?{' '}
              <Link component={RouterLink} to="/register">
                Create an account
              </Link>
            </Typography>
          </Stack>
        </form>
      </Card>
    </Box>
  )
}

export default LoginPage
