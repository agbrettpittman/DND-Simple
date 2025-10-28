// Campaign-related schemas

export const Campaign = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        creatorId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
}

export const CampaignCreate = {
    type: 'object',
    required: ['name', 'description', 'creatorId'],
    properties: {
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        creatorId: { type: 'integer' }
    }
}

export const CampaignParams = {
    type: 'object',
    properties: { id: { type: 'integer' } },
    required: ['id']
}

export const ErrorResponse = {
    type: 'object',
    properties: { message: { type: 'string' } }
}

export const GetCampaignsQuery = {
    type: 'object',
    properties: {
        creatorId: { type: 'integer' }
    }
}

export const GetAllCampaigns = {
    summary: 'List campaigns (optionally filter by creatorId)',
    tags: ['Campaigns'],
    querystring: GetCampaignsQuery,
    response: {
        200: {
            type: 'array',
            items: Campaign
        }
    }
}

export const GetOneCampaign = {
    summary: 'Get campaign by ID',
    tags: ['Campaigns'],
    params: CampaignParams,
    response: {
        200: Campaign,
        404: ErrorResponse
    }
}

export const CreateCampaign = {
    summary: 'Create campaign',
    tags: ['Campaigns'],
    body: CampaignCreate,
    response: {
        201: Campaign,
        400: ErrorResponse
    }
}

export const schema = {
    GetAllCampaigns,
    GetOneCampaign,
    CreateCampaign
}
