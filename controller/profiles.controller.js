import prisma from "../config/database.js";

export const getProfiles = async (req, res) => {
    const profiles = await prisma.profiles.findMany({
        include: {
            user: true
        }
    })
    res.json(profiles)
}

export const getProfileByID = async (req, res) => {
    const id = parseInt(req.params.id)
    const profile = await prisma.profiles.findUnique({
        where: {
            id: id
        },
        include: {
            user: true
        }
    })
    if (!profile) {
        res.status(404).json({ message: 'Profile not found' })
        return
    }
    res.json(profile)
}

export const createProfile = async (req, res) => {
    const { userId, address, phone } = req.body
    const profile = await prisma.profiles.create({
        data: {
            userId,
            address,
            phone
        }
    })
    res.json(profile)
}

export const updateProfile = async (req, res) => {
    const id = parseInt(req.params.id)
    const { address, phone } = req.body
    const profile = await prisma.profiles.update({
        where: {
            id: id
        },
        data: {
            address,
            phone
        }
    })
    res.json(profile)
}

export const deleteProfile = async (req, res) => {
    const id = parseInt(req.params.id)
    const profile = await prisma.profiles.delete({
        where: {
            id: id
        }
    })
    res.json(profile)
}
