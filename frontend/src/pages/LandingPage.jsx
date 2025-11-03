import { useEffect, useState, useCallback } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography, Divider } from '@mui/material'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const Card = styled(Paper)`
  && {
    padding: 2rem;
    text-align: center;
  }
`

function LandingPage() {
    const [CurrentUser, SetCurrentUser] = useState(null)
    const [Name, SetName] = useState('')
    const [Description, SetDescription] = useState('')
    const [ErrorMessage, SetErrorMessage] = useState(null)
    const [IsSubmitting, SetIsSubmitting] = useState(false)
    const [Campaigns, SetCampaigns] = useState([])
    const [IsLoadingCampaigns, SetIsLoadingCampaigns] = useState(false)
    const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

    const getCampaignData = useCallback(async () => {
        if (!CurrentUser) return
        SetIsLoadingCampaigns(true)
        try {
            const res = await fetch(`${ApiBaseUrl}/campaigns?creatorId=${CurrentUser.id}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || 'Failed to load campaigns')
            SetCampaigns(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            SetErrorMessage(err.message)
        } finally {
            SetIsLoadingCampaigns(false)
        }
    }, [ApiBaseUrl, CurrentUser])

    // Load current user from localStorage once
    useEffect(() => {
        try {
            const raw = localStorage.getItem('currentUser')
            if (raw) {
                SetCurrentUser(JSON.parse(raw))
            }
        } catch (err) {
            // Ignore malformed localStorage entries
            console.warn('Failed to parse currentUser from localStorage', err)
        }
    }, [])

    // Fetch user's campaigns when logged in
    useEffect(() => {
        getCampaignData()
    }, [getCampaignData])

    async function onCreate(e) {
        e.preventDefault()
        if (!Name || !Description) {
            SetErrorMessage('Please enter a name and description')
            return
        }
        SetErrorMessage(null)
        SetIsSubmitting(true)
        try {
            const res = await fetch(`${ApiBaseUrl}/campaigns`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: Name, description: Description, creatorId: CurrentUser.id })
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) throw new Error(data?.message || 'Failed to create campaign')
            // Prepend newly created campaign
            SetCampaigns((prev) => [data, ...prev])
            SetName('')
            SetDescription('')
        } catch (err) {
            console.error(err)
            SetErrorMessage(err.message)
        } finally {
            SetIsSubmitting(false)
        }
    }

    if (!CurrentUser) {
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
                        <Typography color="text.secondary">New here?</Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to="/register"
                        >
                            Create an Account
                        </Button>
                    </Stack>
                </Card>
            </Stack>
        )
    }

    return (
        <Stack spacing={3}>
            <Typography variant="h4" component="h1">Your Campaigns</Typography>
            {ErrorMessage && <Alert severity="error">{ErrorMessage}</Alert>}

            <Card elevation={3}>
                <form onSubmit={onCreate}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Create a Campaign</Typography>
                        <TextField
                            label="Name"
                            value={Name}
                            onChange={(e) => SetName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={Description}
                            onChange={(e) => SetDescription(e.target.value)}
                            required
                            fullWidth
                            multiline
                            minRows={2}
                        />
                        <Box>
                            <Button type="submit" variant="contained" disabled={IsSubmitting || !CurrentUser}>
                                {IsSubmitting ? 'Creating…' : 'Create Campaign'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Card>

            <Divider />

            <Stack spacing={1}>
                <Typography variant="h6">Select an existing campaign</Typography>
                {IsLoadingCampaigns ? (
                    <Typography color="text.secondary">Loading campaigns…</Typography>
                ) : Campaigns.length === 0 ? (
                    <Typography color="text.secondary">No campaigns yet. Create your first one above.</Typography>
                ) : (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {Campaigns.map((c) => (
                            <Card key={c.id} variant="outlined" component={RouterLink} to={`/campaigns/${c.id}`} sx={{ width: 1}}>
                                <Typography variant="h6" fontWeight="bold">
                                    {c.name}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {c.description}
                                </Typography>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}

export default LandingPage
