import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const existingUser = await prisma.users.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, role: role || 'USER' },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })

        return res.status(201).json({
            message: 'User registered successfully',
            data: user
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        )

        return res.status(200).json({
            message: 'Login successful',
            token,
            data: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
