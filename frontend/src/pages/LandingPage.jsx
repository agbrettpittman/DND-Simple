import { Button, Paper, Stack, Typography } from '@mui/material'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const Card = styled(Paper)`
  && {
    padding: 2rem;
    text-align: center;
  }
`

function LandingPage() {
  return (
    <Stack alignItems="center" spacing={3}>
      <Typography variant="h3" component="h1">
        Welcome to DnD Simple
      </Typography>
      <Typography color="text.secondary">
        Lightweight tools to help you manage your Dungeons & Dragons sessions.
      </Typography>
      <Card elevation={3}>
        <Stack spacing={2}>
          <Typography>
            Get started by logging in to your account.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/login"
          >
            Go to Login
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
}

export default LandingPage
