import express from 'express'
import { bookController } from '../controller/index.controller.js'

const router = express.Router()

router.get('/', bookController.getBooks)

router.post('/', bookController.createBook)

router.get('/:id', bookController.getBookByID)

router.put('/:id', bookController.updateBook)

router.delete('/:id', bookController.deleteBook)

export default router