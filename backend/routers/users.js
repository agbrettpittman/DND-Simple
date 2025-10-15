export default async function (fastify, opts) {

    fastify.get('/', async (req, reply) => {
        // Return all items
    })

    fastify.get('/:id', async (req, reply) => {
        // Return a single item
    })

    fastify.post('/', async (req, reply) => {
        // Create new item
    })

    fastify.put('/:id', async (req, reply) => {
        // Replace/update whole item
    })

    fastify.patch('/:id', async (req, reply) => {
        // Partial update
    })

    fastify.delete('/:id', async (req, reply) => {
        // Delete item
    })

}