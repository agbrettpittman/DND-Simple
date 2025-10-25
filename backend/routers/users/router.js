import { schema } from './schemas.js'
import bcrypt from 'bcrypt'
import prisma from '#prisma'

const SaltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10

export default async function (fastify, opts) {
    fastify.get('/', { schema: schema.GetAllUsers }, async (req, reply) => {
        const rows = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { id: 'desc' }
        })

        console.log(`Retrieved ${rows.length} users from database.`)
        return rows
    })

    fastify.get('/:id', { schema: schema.GetOneUser }, async (req, reply) => {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true }
        })
        if (!user) {
            reply.code(404)
            return { message: 'User not found' }
        }
        return user
    })

    fastify.post('/', { schema: schema.CreateUser }, async (req, reply) => {
        const { name, email, password } = req.body
        console.log(`Creating user with email: ${email}`)
        // uniqueness check
        const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } })
        if (exists) {
            reply.code(409)
            return { message: 'Email already in use' }
        }
        try {
            const hash = await bcrypt.hash(password, SaltRounds)
            const created = await prisma.user.create({
                data: { name, email, password: hash },
                select: { id: true, name: true, email: true }
            })
            reply.code(201)
            return created
        } catch (err) {
            // In case of race condition on unique constraint
            if (err.code === 'P2002') {
                reply.code(409)
                return { message: 'Email already in use' }
            }
            reply.code(500)
            return { message: 'Internal server error' }
        }
    })

    // Temporary login endpoint – compares plaintext password (to be replaced with hashing later)
    fastify.post('/login', { schema: schema.LoginUser }, async (req, reply) => {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, password: true }
        })
        if (!user) {
            reply.code(401).send({ message: 'Invalid email or password' })
            return
        }
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
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } })
        if (!user) {
            reply.code(404)
            return { message: 'User not found' }
        }
        // If email changed, check uniqueness
        if (email !== user.email) {
            const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } })
            if (exists) {
                reply.code(409)
                return { message: 'Email already in use' }
            }
        }
        const updated = await prisma.user.update({
            where: { id },
            data: { name, email },
            select: { id: true, name: true, email: true }
        })
        return updated
    })

    fastify.patch('/:id', { schema: schema.UpdateUser }, async (req, reply) => {
        const { id } = req.params
        const current = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } })
        if (!current) {
            reply.code(404)
            return { message: 'User not found' }
        }
        const { name, email } = req.body
        if (email && email !== current.email) {
            const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } })
            if (exists) {
                reply.code(409)
                return { message: 'Email already in use' }
            }
        }
        const data = {}
        if (name !== undefined) data.name = name
        if (email !== undefined) data.email = email
        const updated = await prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true }
        })
        return updated
    })

    fastify.delete('/:id', { schema: schema.DeleteUser }, async (req, reply) => {
        const { id } = req.params
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
        if (!user) {
            reply.code(404)
            return { message: 'User not found' }
        }
        await prisma.user.delete({ where: { id } })
        reply.code(204)
        return null
    })
}
