// User-related schemas

export const User = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
}

export const UserCreate = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
}

export const UserUpdate = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
}

export const UserParams = {
    type: 'object',
    properties: { id: { type: 'string' } },
    required: ['id']
}

export const ErrorResponse = {
    type: 'object',
    properties: { message: { type: 'string' } }
}

export const GetAllUsers = {
    summary: 'List users',
    tags: ['Users'],
    response: {
        200: {
            type: 'array',
            items: User
        }
    }
}

export const GetOneUser = {
    summary: 'Get user by ID',
    tags: ['Users'],
    params: UserParams,
    response: {
        200: User,
        404: ErrorResponse
    }
}

// Route-level schemas
export const CreateUser = {
    summary: 'Create user',
    tags: ['Users'],
    body: UserCreate,
    response: {
        201: User
    }
}

export const ReplaceUser = {
    summary: 'Replace user',
    tags: ['Users'],
    params: UserParams,
    body: UserCreate,
    response: {
        200: User
    }
}

export const UpdateUser = {
    summary: 'Update user',
    tags: ['Users'],
    params: UserParams,
    body: UserUpdate,
    response: {
        200: User
    }
}

export const DeleteUser = {
    summary: 'Delete user',
    tags: ['Users'],
    params: UserParams,
    response: {
        204: {
            type: 'null',
            description: 'Deleted successfully'
        }
    }
}

// Barrel export for route-level schemas to avoid namespace conflicts in routers
export const schema = {
    GetAllUsers,
    GetOneUser,
    CreateUser,
    ReplaceUser,
    UpdateUser,
    DeleteUser
}