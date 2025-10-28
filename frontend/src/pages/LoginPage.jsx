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
    const [ErrorMessage, SetErrorMessage] = useState(null)
    const [IsSubmitting, SetIsSubmitting] = useState(false)
    const Navigate = useNavigate()
    const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

    async function onSubmit(e) {
        e.preventDefault()
        if (!Email || !Password) {
            SetErrorMessage('Please enter email and password')
            return
        }
        SetErrorMessage(null)
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
            // success: store current user locally for simple auth state
            const user = await res.json()
            try {
                localStorage.setItem('currentUser', JSON.stringify(user))
            } catch (err) {
                // Storage may be unavailable; proceed without persisting session
                console.warn('Failed to store currentUser in localStorage', err)
            }
            Navigate('/')
        } catch (err) {
            console.error(err)
            SetErrorMessage(err.message)
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
                        {ErrorMessage && <Alert severity="error">{ErrorMessage}</Alert>}
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
