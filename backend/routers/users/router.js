import { schema } from './schemas.js'
import db from '../../db.js'

export default async function (fastify, opts) {
  const listStmt = db.prepare('SELECT id, name, email FROM users ORDER BY id DESC')
  const getStmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?')
  const getByEmailStmt = db.prepare('SELECT id FROM users WHERE email = ?')
  const insertStmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
  const replaceStmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
  const patchNameStmt = db.prepare('UPDATE users SET name = COALESCE(?, name) WHERE id = ?')
  const patchEmailStmt = db.prepare('UPDATE users SET email = COALESCE(?, email) WHERE id = ?')
  const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?')

  fastify.get('/', {schema: schema.GetAllUsers}, async (req, reply) => {
    const rows = listStmt.all()
    return rows
  })

  fastify.get('/:id', {schema: schema.GetOneUser }, async (req, reply) => {
    const { id } = req.params
    const user = getStmt.get(id)
    if (!user) {
      reply.code(404)
      return { message: 'User not found' }
    }
    return user
  })

  fastify.post('/', { schema: schema.CreateUser }, async (req, reply) => {
    const { name, email } = req.body
    // uniqueness check
    const exists = getByEmailStmt.get(email)
    if (exists) {
      reply.code(409)
      return { message: 'Email already in use' }
    }
    const info = insertStmt.run(name, email)
    reply.code(201)
    return getStmt.get(info.lastInsertRowid)
  })

  fastify.put('/:id', { schema: schema.ReplaceUser }, async (req, reply) => {
    const { id } = req.params
    const { name, email } = req.body
    const user = getStmt.get(id)
    if (!user) {
      reply.code(404)
      return { message: 'User not found' }
    }
    // If email changed, check uniqueness
    if (email !== user.email) {
      const exists = getByEmailStmt.get(email)
      if (exists) {
        reply.code(409)
        return { message: 'Email already in use' }
      }
    }
    replaceStmt.run(name, email, id)
    return getStmt.get(id)
  })

  fastify.patch('/:id', { schema: schema.UpdateUser }, async (req, reply) => {
    const { id } = req.params
    const current = getStmt.get(id)
    if (!current) {
      reply.code(404)
      return { message: 'User not found' }
    }
    const { name, email } = req.body
    if (email && email !== current.email) {
      const exists = getByEmailStmt.get(email)
      if (exists) {
        reply.code(409)
        return { message: 'Email already in use' }
      }
    }
    if (name !== undefined) patchNameStmt.run(name, id)
    if (email !== undefined) patchEmailStmt.run(email, id)
    return getStmt.get(id)
  })

  fastify.delete('/:id', { schema: schema.DeleteUser }, async (req, reply) => {
    const { id } = req.params
    const user = getStmt.get(id)
    if (!user) {
      reply.code(404)
      return { message: 'User not found' }
    }
    deleteStmt.run(id)
    reply.code(204)
    return null
  })
}
