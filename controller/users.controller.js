import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        return res.status(200).json({ message: 'Users retrieved successfully', data: users })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getUserByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const user = await prisma.users.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User retrieved successfully', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const existingUser = await prisma.users.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' })
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, role: role || 'USER' },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        return res.status(201).json({ message: 'User created successfully', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name, email, password, role } = req.body

        const existingUser = await prisma.users.findUnique({ where: { id } })
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        const updateData = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (password) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
            updateData.password = await bcrypt.hash(password, saltRounds)
        }
        if (role) updateData.role = role

        const user = await prisma.users.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        return res.status(200).json({ message: 'User updated successfully', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const existingUser = await prisma.users.findUnique({ where: { id } })
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        await prisma.users.delete({ where: { id } })
        return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getUserByIdWithProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const user = await prisma.users.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, role: true, createdAt: true,
                profile: true
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User retrieved successfully', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}