import { User, UserCreate, UserUpdate, UserParams, ErrorResponse } from './schemas.js'

export default async function (fastify, opts) {
  fastify.get('/', {
    schema: {
      summary: 'List users',
      tags: ['Users'],
      response: {
        200: {
          type: 'array',
          items: User
        }
      }
    }
  }, async (req, reply) => {
    return []
  })

  fastify.get('/:id', {
    schema: {
      summary: 'Get user by ID',
      tags: ['Users'],
      params: UserParams,
      response: {
        200: User,
        404: ErrorResponse
      }
    }
  }, async (req, reply) => {
    const { id } = req.params
    return { id, name: 'Example', email: 'example@example.com' }
  })

  fastify.post('/', {
    schema: {
      summary: 'Create user',
      tags: ['Users'],
      body: UserCreate,
      response: {
        201: User
      }
    }
  }, async (req, reply) => {
    reply.code(201)
    return { id: '1', ...req.body }
  })

  fastify.put('/:id', {
    schema: {
      summary: 'Replace user',
      tags: ['Users'],
      params: UserParams,
      body: UserCreate,
      response: {
        200: User
      }
    }
  }, async (req, reply) => {
    const { id } = req.params
    return { id, ...req.body }
  })

  fastify.patch('/:id', {
    schema: {
      summary: 'Update user',
      tags: ['Users'],
      params: UserParams,
      body: UserUpdate,
      response: {
        200: User
      }
    }
  }, async (req, reply) => {
    const { id } = req.params
    return { id, ...req.body }
  })

  fastify.delete('/:id', {
    schema: {
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
  }, async (req, reply) => {
    reply.code(204)
    return null
  })
}
