import prisma from '../config/database.js'

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany()
        return res.status(200).json({ message: 'Categories retrieved successfully', data: categories })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getCategoryByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const category = await prisma.categories.findUnique({
            where: { id },
            include: { books: true }
        })
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ message: 'Category retrieved successfully', data: category })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await prisma.categories.create({ data: { name } })
        return res.status(201).json({ message: 'Category created successfully', data: category })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name } = req.body

        const existingCategory = await prisma.categories.findUnique({ where: { id } })
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }

        const category = await prisma.categories.update({ where: { id }, data: { name } })
        return res.status(200).json({ message: 'Category updated successfully', data: category })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const existingCategory = await prisma.categories.findUnique({ where: { id } })
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }
        await prisma.categories.delete({ where: { id } })
        return res.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getBooksByCategoryID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const category = await prisma.categories.findUnique({
            where: { id },
            include: { books: true }
        })
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ message: 'Books retrieved successfully', data: category.books })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
