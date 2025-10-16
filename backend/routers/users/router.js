import { schema } from './schemas.js'

export default async function (fastify, opts) {
  fastify.get('/', {schema: schema.GetAllUsers}, async (req, reply) => {
    return []
  })

  fastify.get('/:id', {schema: schema.GetOneUser }, async (req, reply) => {
    const { id } = req.params
    return { id, name: 'Example', email: 'example@example.com' }
  })

  fastify.post('/', { schema: schema.CreateUser }, async (req, reply) => {
    reply.code(201)
    return { id: '1', ...req.body }
  })

  fastify.put('/:id', { schema: schema.ReplaceUser }, async (req, reply) => {
    const { id } = req.params
    return { id, ...req.body }
  })

  fastify.patch('/:id', { schema: schema.UpdateUser }, async (req, reply) => {
    const { id } = req.params
    return { id, ...req.body }
  })

  fastify.delete('/:id', { schema: schema.DeleteUser }, async (req, reply) => {
    reply.code(204)
    return null
  })
}
