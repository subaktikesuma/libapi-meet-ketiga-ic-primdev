import express from 'express'
import { bookController } from '../controller/index.controller.js'
import authenticate from '../middleware/authenticate.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { createBookValidation, updateBookValidation } from '../validation/books.validation.js'

const router = express.Router()

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/', authenticate, bookController.getBooks)

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Book' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/:id', authenticate, bookController.getBookByID)

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (ADMIN only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookRequest' }
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Book' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Category not found
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createBookValidation), bookController.createBook)

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book (ADMIN only)
 *     tags: [Books]
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
 *           schema: { $ref: '#/components/schemas/BookRequest' }
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Book not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateBookValidation), bookController.updateBook)

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (ADMIN only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), bookController.deleteBook)

export default router