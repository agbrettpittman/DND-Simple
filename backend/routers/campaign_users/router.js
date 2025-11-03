import { schema } from './schemas.js'
import prisma from '#prisma'

export default async function (fastify, opts) {
    // List memberships with optional filters
    fastify.get('/', { schema: schema.ListMemberships }, async (req, reply) => {
        const { campaignId, userId } = req.query || {}
        const where = {}
        if (campaignId !== undefined) where.campaignId = Number(campaignId)
        if (userId !== undefined) where.userId = Number(userId)
        const rows = await prisma.campaignUser.findMany({
            where,
            orderBy: { id: 'desc' },
            select: { campaignId: true, userId: true, role: true, createdAt: true, updatedAt: true }
        })
        return rows
    })

    // Create membership (defaults Player, except creator is DM)
    fastify.post('/', { schema: schema.CreateMembership }, async (req, reply) => {
        const { campaignId, userId } = req.body
        let { role } = req.body

        // Validate campaign and determine creator
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId }, select: { id: true, creatorId: true } })
        if (!campaign) {
            reply.code(400)
            return { message: 'Invalid campaignId' }
        }

        // Validate user exists
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
        if (!user) {
            reply.code(400)
            return { message: 'Invalid userId' }
        }

        const isCreator = userId === campaign.creatorId
        if (!role) {
            role = isCreator ? 'DM' : 'Player'
        }

        // Enforce role constraints: creator must be DM; non-creators cannot be DM
        if (isCreator && role !== 'DM') {
            reply.code(400)
            return { message: 'Creator must have role DM' }
        }
        if (!isCreator && role === 'DM') {
            reply.code(400)
            return { message: 'Only the campaign creator can be DM' }
        }

        try {
            const created = await prisma.campaignUser.create({
                data: { campaignId, userId, role },
                select: { campaignId: true, userId: true, role: true, createdAt: true, updatedAt: true }
            })
            reply.code(201)
            return created
        } catch (err) {
            if (err.code === 'P2002') {
                reply.code(409)
                return { message: 'User already in campaign' }
            }
            reply.code(500)
            return { message: 'Internal server error' }
        }
    })

    // Update membership role
    fastify.patch('/', { schema: schema.UpdateMembership }, async (req, reply) => {
        const { campaignId, userId, role } = req.body

        const membership = await prisma.campaignUser.findUnique({
            where: { campaignId_userId: { campaignId, userId } },
            select: { campaignId: true, userId: true }
        })
        if (!membership) {
            reply.code(404)
            return { message: 'Membership not found' }
        }

        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId }, select: { creatorId: true } })
        const isCreator = userId === campaign.creatorId
        if (isCreator && role !== 'DM') {
            reply.code(400)
            return { message: 'Creator must have role DM' }
        }
        if (!isCreator && role === 'DM') {
            reply.code(400)
            return { message: 'Only the campaign creator can be DM' }
        }

        const updated = await prisma.campaignUser.update({
            where: { campaignId_userId: { campaignId, userId } },
            data: { role },
            select: { campaignId: true, userId: true, role: true, createdAt: true, updatedAt: true }
        })
        return updated
    })

    // Delete membership
    fastify.delete('/', { schema: schema.DeleteMembership }, async (req, reply) => {
        const { campaignId, userId } = req.body
        const membership = await prisma.campaignUser.findUnique({
            where: { campaignId_userId: { campaignId, userId } },
            select: { campaignId: true, userId: true }
        })
        if (!membership) {
            reply.code(404)
            return { message: 'Membership not found' }
        }
        await prisma.campaignUser.delete({ where: { campaignId_userId: { campaignId, userId } } })
        reply.code(204)
        return null
    })
}
