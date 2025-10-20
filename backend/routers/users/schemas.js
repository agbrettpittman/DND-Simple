// User-related schemas

export const User = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
}

export const UserCreate = {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        // Temporary plaintext password.
        password: { type: 'string', minLength: 1 }
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
    properties: { id: { type: 'integer' } },
    required: ['id']
}

export const ErrorResponse = {
    type: 'object',
    properties: { message: { type: 'string' } }
}

export const LoginRequest = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
    }
}

export const LoginResponse = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
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
        201: User,
        409: ErrorResponse
    }
}

export const LoginUser = {
    summary: 'Login user (temporary, no hashing)',
    tags: ['Users'],
    body: LoginRequest,
    response: {
        200: LoginResponse,
        401: ErrorResponse
    }
}

export const ReplaceUser = {
    summary: 'Replace user',
    tags: ['Users'],
    params: UserParams,
    body: UserUpdate,
    response: {
        200: User,
        404: ErrorResponse,
        409: ErrorResponse
    }
}

export const UpdateUser = {
    summary: 'Update user',
    tags: ['Users'],
    params: UserParams,
    body: UserUpdate,
    response: {
        200: User,
        404: ErrorResponse,
        409: ErrorResponse
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
    DeleteUser,
    LoginUser
}