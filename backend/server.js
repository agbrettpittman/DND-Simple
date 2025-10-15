// Require the framework and instantiate it
import dotenv from 'dotenv'
import Fastify from 'fastify'
import users from './routers/users'

// Load environment variables from .env file
dotenv.config()

const fastify = Fastify({
    logger: true
})

fastify.register(users, { prefix: '/users' })

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

// Run the server!
const start = async () => {
    try {
        const host = process.env.SERVER_IP || '127.0.0.1'
        const port = parseInt(process.env.SERVER_PORT) || 8000
        
        await fastify.listen({ host, port })
        console.log(`Server listening on ${host}:${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()