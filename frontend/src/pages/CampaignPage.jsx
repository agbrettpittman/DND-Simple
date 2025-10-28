import { useEffect, useState, useCallback } from 'react'
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

function CampaignPage() {
    const { id } = useParams()
    const [Campaign, SetCampaign] = useState(null)
    const [ErrorMessage, SetErrorMessage] = useState(null)
    const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

    const getCampaignData = useCallback(async () => {
        SetErrorMessage(null)
        try {
            const res = await fetch(`${ApiBaseUrl}/campaigns/${id}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || 'Failed to load campaign')
            SetCampaign(data)
        } catch (err) {
            console.error(err)
            SetErrorMessage(err.message)
        }
    }, [ApiBaseUrl, id])

    useEffect(() => {
        getCampaignData()
    }, [getCampaignData])

    if (ErrorMessage) {
        return <Alert severity="error">{ErrorMessage}</Alert>
    }
    if (!Campaign) {
        return <Typography color="text.secondary">Loading…</Typography>
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4">{Campaign.name}</Typography>
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>Description</Typography>
                    <Typography>{Campaign.description}</Typography>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default CampaignPage
