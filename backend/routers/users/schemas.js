// User-related schemas (Option A: direct import into routes)

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
