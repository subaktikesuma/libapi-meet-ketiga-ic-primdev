import prisma from '../config/database.js'

export const getProfiles = async (req, res) => {
    try {
        const profiles = await prisma.profiles.findMany({
            include: { user: { select: { id: true, name: true, email: true } } }
        })
        return res.status(200).json({ message: 'Profiles retrieved successfully', data: profiles })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getProfileByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const profile = await prisma.profiles.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true, email: true } } }
        })
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        return res.status(200).json({ message: 'Profile retrieved successfully', data: profile })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const createProfile = async (req, res) => {
    try {
        const { userId, address, phone } = req.body

        const userExists = await prisma.users.findUnique({ where: { id: userId } })
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' })
        }

        const existingProfile = await prisma.profiles.findUnique({ where: { userId } })
        if (existingProfile) {
            return res.status(409).json({ message: 'Profile already exists for this user' })
        }

        const profile = await prisma.profiles.create({
            data: { userId, address, phone },
            include: { user: { select: { id: true, name: true, email: true } } }
        })
        return res.status(201).json({ message: 'Profile created successfully', data: profile })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { address, phone } = req.body

        const existingProfile = await prisma.profiles.findUnique({ where: { id } })
        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        const profile = await prisma.profiles.update({
            where: { id },
            data: { address, phone },
            include: { user: { select: { id: true, name: true, email: true } } }
        })
        return res.status(200).json({ message: 'Profile updated successfully', data: profile })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const existingProfile = await prisma.profiles.findUnique({ where: { id } })
        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        await prisma.profiles.delete({ where: { id } })
        return res.status(200).json({ message: 'Profile deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
