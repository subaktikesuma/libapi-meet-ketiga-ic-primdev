import prisma from '../config/database.js'

export const getBooks = async (req, res) => {
    try {
        const books = await prisma.books.findMany({
            include: { categories: { select: { id: true, name: true } } }
        })
        return res.status(200).json({ message: 'Books retrieved successfully', data: books })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const getBookByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const book = await prisma.books.findUnique({
            where: { id },
            include: { categories: { select: { id: true, name: true } } }
        })
        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }
        return res.status(200).json({ message: 'Book retrieved successfully', data: book })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const createBook = async (req, res) => {
    try {
        const { title, author, year, available, categoryId } = req.body

        if (categoryId) {
            const isCategoryExist = await prisma.categories.findUnique({ where: { id: categoryId } })
            if (!isCategoryExist) {
                return res.status(404).json({ message: 'Category not found' })
            }
        }

        const book = await prisma.books.create({
            data: { title, author, year, available, categoryId },
            include: { categories: { select: { id: true, name: true } } }
        })
        return res.status(201).json({ message: 'Book created successfully', data: book })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const updateBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { title, author, year, available, categoryId } = req.body

        const existingBook = await prisma.books.findUnique({ where: { id } })
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' })
        }

        if (categoryId) {
            const isCategoryExist = await prisma.categories.findUnique({ where: { id: categoryId } })
            if (!isCategoryExist) {
                return res.status(404).json({ message: 'Category not found' })
            }
        }

        const book = await prisma.books.update({
            where: { id },
            data: { title, author, year, available, categoryId },
            include: { categories: { select: { id: true, name: true } } }
        })
        return res.status(200).json({ message: 'Book updated successfully', data: book })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deleteBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const existingBook = await prisma.books.findUnique({ where: { id } })
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' })
        }
        await prisma.books.delete({ where: { id } })
        return res.status(200).json({ message: 'Book deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}