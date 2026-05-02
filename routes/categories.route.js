import express from 'express'
import { categoryController } from '../controller/index.controller.js'
import authenticate from '../middleware/authenticate.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { createCategoryValidation, updateCategoryValidation } from '../validation/categories.validation.js'

const router = express.Router()

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, categoryController.getCategories)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.get('/:id', authenticate, categoryController.getCategoryByID)

/**
 * @swagger
 * /categories/{id}/books:
 *   get:
 *     summary: Get all books in a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Book' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.get('/:id/books', authenticate, categoryController.getBooksByCategoryID)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (ADMIN only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryRequest' }
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createCategoryValidation), categoryController.createCategory)

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (ADMIN only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryRequest' }
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Category not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateCategoryValidation), categoryController.updateCategory)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category (ADMIN only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Category not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory)

export default router
