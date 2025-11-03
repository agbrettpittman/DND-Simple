import { schema } from './schemas.js'
import prisma from '#prisma'

export default async function (fastify, opts) {
    // List campaigns, optionally filter by creatorId
    fastify.get('/', { schema: schema.GetAllCampaigns }, async (req, reply) => {
        const { creatorId } = req.query || {}
        const where = {}
        if (creatorId !== undefined) {
            where.creatorId = Number(creatorId)
        }
        const rows = await prisma.campaign.findMany({
            where,
            orderBy: { id: 'desc' },
            select: { id: true, name: true, description: true, creatorId: true, createdAt: true, updatedAt: true }
        })
        return rows
    })

    // Get one campaign
    fastify.get('/:id', { schema: schema.GetOneCampaign }, async (req, reply) => {
        const { id } = req.params
        const row = await prisma.campaign.findUnique({
            where: { id },
            select: { id: true, name: true, description: true, creatorId: true, createdAt: true, updatedAt: true }
        })
        if (!row) {
            reply.code(404)
            return { message: 'Campaign not found' }
        }
        return row
    })

    // Create campaign
    fastify.post('/', { schema: schema.CreateCampaign }, async (req, reply) => {
        const { name, description, creatorId } = req.body
        try {
            const created = await prisma.campaign.create({
                data: { name, description, creatorId },
                select: { id: true, name: true, description: true, creatorId: true, createdAt: true, updatedAt: true }
            })
            // Ensure creator is added as DM in membership table (idempotent with unique constraint)
            try {
                await prisma.campaignUser.create({ data: { campaignId: created.id, userId: creatorId, role: 'DM' } })
            } catch (e) {
                // Ignore unique violations (already present)
                if (e.code !== 'P2002') throw e
            }
            reply.code(201)
            return created
        } catch (err) {
            // Handle foreign key constraint (invalid creatorId)
            if (err.code === 'P2003') {
                reply.code(400)
                return { message: 'Invalid creatorId' }
            }
            reply.code(500)
            return { message: 'Internal server error' }
        }
    })

    // List users in a campaign with their roles
    fastify.get('/:id/users', { schema: schema.GetCampaignUsers }, async (req, reply) => {
        const { id } = req.params
        const campaign = await prisma.campaign.findUnique({ where: { id }, select: { id: true } })
        if (!campaign) {
            reply.code(404)
            return { message: 'Campaign not found' }
        }
        const memberships = await prisma.campaignUser.findMany({
            where: { campaignId: id },
            orderBy: { id: 'asc' },
            select: {
                role: true,
                user: { select: { id: true, name: true, email: true } }
            }
        })
        // Map to output { id, name, email, role }
        return memberships.map(m => ({ id: m.user.id, name: m.user.name, email: m.user.email, role: m.role }))
    })
}
