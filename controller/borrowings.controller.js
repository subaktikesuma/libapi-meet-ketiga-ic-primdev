import prisma from '../config/database.js'

// GET semua borrowing (beserta data user dan buku)
export const getBorrowings = async (req, res) => {
    try {
        const borrowings = await prisma.borrowings.findMany({
            include: {
                borrower: { select: { id: true, name: true, email: true } },
                book: { select: { id: true, title: true, author: true } }
            }
        })
        return res.status(200).json({ message: 'Borrowings retrieved successfully', data: borrowings })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// GET satu borrowing by ID
export const getBorrowingByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const borrowing = await prisma.borrowings.findUnique({
            where: { id },
            include: {
                borrower: { select: { id: true, name: true, email: true } },
                book: { select: { id: true, title: true, author: true } }
            }
        })
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing not found' })
        }
        return res.status(200).json({ message: 'Borrowing retrieved successfully', data: borrowing })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// GET semua buku yang dipinjam oleh user tertentu
export const getBorrowingsByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId)

        // USER hanya bisa lihat borrowing milik sendiri
        if (req.user.role === 'USER' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Forbidden. You can only view your own borrowings.' })
        }

        const user = await prisma.users.findUnique({ where: { id: userId } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const borrowings = await prisma.borrowings.findMany({
            where: { userId },
            include: {
                book: { select: { id: true, title: true, author: true, year: true } }
            }
        })
        return res.status(200).json({ message: 'Borrowings retrieved successfully', data: borrowings })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// POST buat borrowing baru (user meminjam buku)
export const createBorrowing = async (req, res) => {
    try {
        const { userId, bookId } = req.body

        const user = await prisma.users.findUnique({ where: { id: userId } })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const book = await prisma.books.findUnique({ where: { id: bookId } })
        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }
        if (!book.available) {
            return res.status(400).json({ message: 'Book is not available for borrowing' })
        }

        const [borrowing] = await prisma.$transaction([
            prisma.borrowings.create({
                data: { userId, bookId },
                include: {
                    borrower: { select: { id: true, name: true, email: true } },
                    book: { select: { id: true, title: true, author: true } }
                }
            }),
            prisma.books.update({ where: { id: bookId }, data: { available: false } })
        ])

        return res.status(201).json({ message: 'Book borrowed successfully', data: borrowing })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// PATCH kembalikan buku
export const returnBorrowing = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const borrowing = await prisma.borrowings.findUnique({ where: { id } })
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing not found' })
        }
        if (borrowing.returned_at) {
            return res.status(400).json({ message: 'Book has already been returned' })
        }

        const [updated] = await prisma.$transaction([
            prisma.borrowings.update({
                where: { id },
                data: { returned_at: new Date() },
                include: {
                    borrower: { select: { id: true, name: true, email: true } },
                    book: { select: { id: true, title: true, author: true } }
                }
            }),
            prisma.books.update({ where: { id: borrowing.bookId }, data: { available: true } })
        ])

        return res.status(200).json({ message: 'Book returned successfully', data: updated })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// DELETE hapus data borrowing
export const deleteBorrowing = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const borrowing = await prisma.borrowings.findUnique({ where: { id } })
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing not found' })
        }
        await prisma.borrowings.delete({ where: { id } })
        return res.status(200).json({ message: 'Borrowing deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}
