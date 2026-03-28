import prisma from "../config/database.js";
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    const users = await prisma.users.findMany()
    res.json(users)
}

export const getUserByID = async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
    }
    res.json(user)
}

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await prisma.users.create({
        data: {
            name,
            email,
            password: hashPassword,
            role
        }
    })
    res.json(user)
}

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id)
    const { name, email, password, role } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await prisma.users.update({
        where: {
            id: id
        },
        data: {
            name,
            email,
            password: hashPassword,
            role
        }
    })
    res.json(user)
}

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.users.delete({
        where: {
            id: id
        }
    })
    res.json(user)
}