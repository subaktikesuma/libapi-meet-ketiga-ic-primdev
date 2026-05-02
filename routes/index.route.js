import express from 'express'
import booksRoute from './books.route.js'
import usersRoute from './users.route.js'
import profilesRoute from './profiles.route.js'
import categoriesRoute from './categories.route.js'
import borrowingsRoute from './borrowings.route.js'
import authRoute from './auth.route.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library')
})

router.use('/auth', authRoute)
router.use('/books', booksRoute)
router.use('/users', usersRoute)
router.use('/profiles', profilesRoute)
router.use('/categories', categoriesRoute)
router.use('/borrowings', borrowingsRoute)

export default router