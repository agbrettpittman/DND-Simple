// Campaign-User membership schemas

export const CampaignUser = {
    type: 'object',
    properties: {
        campaignId: { type: 'integer' },
        userId: { type: 'integer' },
        role: { type: 'string', enum: ['DM', 'Player'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
}

export const CampaignUserCreate = {
    type: 'object',
    required: ['campaignId', 'userId'],
    properties: {
        campaignId: { type: 'integer' },
        userId: { type: 'integer' },
        role: { type: 'string', enum: ['DM', 'Player'] }
    }
}

export const CampaignUserUpdate = {
    type: 'object',
    required: ['campaignId', 'userId', 'role'],
    properties: {
        campaignId: { type: 'integer' },
        userId: { type: 'integer' },
        role: { type: 'string', enum: ['DM', 'Player'] }
    }
}

export const CampaignUserDelete = {
    type: 'object',
    required: ['campaignId', 'userId'],
    properties: {
        campaignId: { type: 'integer' },
        userId: { type: 'integer' }
    }
}

export const CampaignUserQuery = {
    type: 'object',
    properties: {
        campaignId: { type: 'integer' },
        userId: { type: 'integer' }
    }
}

export const ErrorResponse = {
    type: 'object',
    properties: { message: { type: 'string' } }
}

export const ListMemberships = {
    summary: 'List campaign-user memberships (filterable)',
    tags: ['Campaign Users'],
    querystring: CampaignUserQuery,
    response: {
        200: { type: 'array', items: CampaignUser }
    }
}

export const CreateMembership = {
    summary: 'Add a user to a campaign',
    tags: ['Campaign Users'],
    body: CampaignUserCreate,
    response: {
        201: CampaignUser,
        400: ErrorResponse,
        409: ErrorResponse
    }
}

export const UpdateMembership = {
    summary: 'Update a user\'s role in a campaign',
    tags: ['Campaign Users'],
    body: CampaignUserUpdate,
    response: {
        200: CampaignUser,
        400: ErrorResponse,
        404: ErrorResponse
    }
}

export const DeleteMembership = {
    summary: 'Remove a user from a campaign',
    tags: ['Campaign Users'],
    body: CampaignUserDelete,
    response: {
        204: { type: 'null' },
        404: ErrorResponse
    }
}

export const schema = {
    ListMemberships,
    CreateMembership,
    UpdateMembership,
    DeleteMembership
}
