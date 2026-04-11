import express from 'express'
import { categoryController } from '../controller/index.controller.js'

const router = express.Router()

router.get('/', categoryController.getCategories)

router.post('/', categoryController.createCategory)

router.get('/:id', categoryController.getCategoryByID)

router.put('/:id', categoryController.updateCategory)

router.delete('/:id', categoryController.deleteCategory)

router.get('/:id/books', categoryController.getBooksByCategoryID)

export default router
