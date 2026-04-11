import prisma from "../config/database.js";

export const getBooks = async (req, res) => {
    const books = await prisma.books.findMany()
    res.json(books)
}

export const getBookByID = async (req, res) => {
    const id = parseInt(req.params.id)
    const book = await prisma.books.findUnique({
        where: {
            id: id
        }
    })
    if (!book) {
        res.status(404).json({ message: 'Book not found' })
        return
    }
    res.json(book)
}

export const createBook = async (req, res) => {
    const { title, author, year, available, categoryId } = req.body
    if (categoryId) {
        const isCategoryExist = await prisma.categories.findUnique({
            where: { id: categoryId }
        })
        if (!isCategoryExist) {
            res.status(404).json({ message: 'Category not found' })
            return
        }
    }
    const book = await prisma.books.create({
        data: {
            title,
            author,
            year,
            available,
            categoryId
        }
    })
    res.json(book)
}

export const updateBook = async (req, res) => {
    const id = parseInt(req.params.id)
    const { title, author, year, available, categoryId } = req.body
    if (categoryId) {
        const isCategoryExist = await prisma.categories.findUnique({
            where: { id: categoryId }
        })
        if (!isCategoryExist) {
            res.status(404).json({ message: 'Category not found' })
            return
        }
    }
    const book = await prisma.books.update({
        where: {
            id: id
        },
        data: {
            title,
            author,
            year,
            available,
            categoryId
        }
    })
    res.json(book)
}

export const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id)
    const book = await prisma.books.delete({
        where: {
            id: id
        }
    })
    res.json(book)
}  