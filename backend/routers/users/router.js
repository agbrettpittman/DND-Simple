import { schema } from './schemas.js'
import db from '../../db.js'
import bcrypt from 'bcrypt'

const SaltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10

export default async function (fastify, opts) {

  //Prepared Statements
  const listStmt = db.prepare('SELECT id, name, email FROM users ORDER BY id DESC')
  const getStmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?')
  const getByEmailStmt = db.prepare('SELECT id FROM users WHERE email = ?')
  const insertStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
  const replaceStmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
  const patchNameStmt = db.prepare('UPDATE users SET name = COALESCE(?, name) WHERE id = ?')
  const patchEmailStmt = db.prepare('UPDATE users SET email = COALESCE(?, email) WHERE id = ?')
  const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?')
  const getAuthStmt = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?')


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
    const { name, email, password } = req.body
    // uniqueness check
    const exists = getByEmailStmt.get(email)
    if (exists) {
      reply.code(409)
      return { message: 'Email already in use' }
    }
    bcrypt.hash(password, SaltRounds, function (err, hash) {
        // Store hash in your password DB.
        const info = insertStmt.run(name, email, hash)
        reply.code(201)
        return getStmt.get(info.lastInsertRowid)
    });
  })

  // Temporary login endpoint – compares plaintext password (to be replaced with hashing later)
  fastify.post('/login', { schema: schema.LoginUser }, async (req, reply) => {
    const { email, password } = req.body
    const user = getAuthStmt.get(email)
    try {
        const authStatus = await bcrypt.compare(password, user.password)
        if (!authStatus) {
            reply.code(401).send({ message: 'Invalid email or password' })
        }
        reply.code(200).send({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (err) {
        reply.code(500).send({ message: 'Internal server error' })
    }
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
