import prisma from "../config/database.js";

export const getCategories = async (req, res) => {
    const categories = await prisma.categories.findMany({
        include: {
            books: true
        }
    })
    res.json(categories)
}

export const getCategoryByID = async (req, res) => {
    const id = parseInt(req.params.id)
    const category = await prisma.categories.findUnique({
        where: {
            id: id
        },
        include: {
            books: true
        }
    })
    if (!category) {
        res.status(404).json({ message: 'Category not found' })
        return
    }
    res.json(category)
}

export const createCategory = async (req, res) => {
    const { name } = req.body
    const category = await prisma.categories.create({
        data: {
            name
        }
    })
    res.json(category)
}

export const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id)
    const { name } = req.body
    const category = await prisma.categories.update({
        where: {
            id: id
        },
        data: {
            name
        }
    })
    res.json(category)
}

export const deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id)
    const category = await prisma.categories.delete({
        where: {
            id: id
        }
    })
    res.json(category)
}

export const getBooksByCategoryID = async (req, res) => {
    const id = parseInt(req.params.id)
    const category = await prisma.categories.findUnique({
        where: {
            id: id
        },
        include: {
            books: true
        }
    })
    if (!category) {
        res.status(404).json({ message: 'Category not found' })
        return
    }
    res.json(category.books)
}
