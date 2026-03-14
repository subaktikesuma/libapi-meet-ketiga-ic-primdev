import express from 'express'
import database from './database.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})

app.get('/books', async (req, res) => {
    const books = await database.books.findMany()
    res.json(books)
})

app.post('/books', async (req, res) => {
    // Mendapatkan data buku baru dari request body
    const { title, author, year } = req.body

    // Menambahkan buku baru ke database menggunakan Prisma Client
    const book = await database.books.create({
        data: {
            title,
            author,
            year
        }
    })

    res.send('Book created successfully')
})

app.get('/books/:id', async (req, res) => {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
    const book = await database.books.findUnique({
        where: {
            id: id
        }
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
        res.json(`Book with ID: ${id} not found`)
    }

    res.json(book)
})

app.put('/books/:id', async (req, res) => {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mendapatkan data buku yang akan diupdate dari request body
    const { title, author, year } = req.body

    // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
    const book = await database.books.findUnique({
        where: {
            id: id
        }
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
        res.send(`Book with ID: ${id} not found`)
        return
    }

    // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
    await database.books.update({
        where: {
            id: id
        },
        data: {
            title,
            author,
            year
        }
    })

    res.send(`Book with ID: ${id} updated successfully`)
})

app.delete('/books/:id', async (req, res) => {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
    const book = await database.books.findUnique({
        where: {
            id: id
        }
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
        res.send(`Book with ID: ${id} not found`)
        return
    }

    // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
    await database.books.delete({
        where: {
            id: id
        }
    })

    res.send(`Book with ID: ${id} deleted successfully`)
})


app.get('/users', async (req, res) => {
    const users = await database.users.findMany()
    res.send(users)
})

app.post('/users', async (req, res) => {
    // Mendapatkan data user baru dari request body
    const { name, email, password } = req.body

    // Menambahkan user baru ke database menggunakan Prisma Client
    const user = await database.users.create({
        data: {
            name,
            email,
            password
        }
    })
    res.send(user)
})

app.get('/users/:id', async (req, res) => {
    // Mendapatkan ID user yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
    const user = await database.users.findUnique({
        where: {
            id: id
        }
    })
    res.send(user)
})

app.put('/users/:id', async (req, res) => {
    // Mendapatkan ID user yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mendapatkan data user yang akan diupdate dari request body
    const { name, email, password, role } = req.body

    // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
    const user = await database.users.findUnique({
        where: {
            id: id
        }
    })

    // Jika user tidak ditemukan, kirimkan pesan error
    if (!user) {
        res.send(`User with ID: ${id} not found`)
        return
    }

    // Mengupdate user dengan ID yang sesuai di database menggunakan Prisma Client
    await database.users.update({
        where: {
            id: id
        },
        data: {
            name,
            email,
            password,
            role
        }
    })
    res.send(user)
})

app.delete('/users/:id', async (req, res) => {
    // Mendapatkan ID user yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
    const user = await database.users.findUnique({
        where: {
            id: id
        }
    })

    // Jika user tidak ditemukan, kirimkan pesan error
    if (!user) {
        res.send(`User with ID: ${id} not found`)
        return
    }

    // Menghapus user dengan ID yang sesuai di database menggunakan Prisma Client
    await database.users.delete({
        where: {
            id: id
        }
    })
    res.send(user)
})
