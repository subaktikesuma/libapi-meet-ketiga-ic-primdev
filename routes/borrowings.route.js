import express from 'express'
import {
    getBorrowings,
    getBorrowingByID,
    getBorrowingsByUser,
    createBorrowing,
    returnBorrowing,
    deleteBorrowing
} from '../controller/borrowings.controller.js'
import authenticate from '../middleware/authenticate.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { createBorrowingValidation } from '../validation/borrowings.validation.js'

const router = express.Router()

/**
 * @swagger
 * /borrowings:
 *   get:
 *     summary: Get all borrowings (ADMIN only)
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrowings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Borrowing' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 */
router.get('/', authenticate, authorize('ADMIN'), getBorrowings)

/**
 * @swagger
 * /borrowings/user/{userId}:
 *   get:
 *     summary: Get all borrowings by a specific user
 *     description: USER can only view their own borrowings. ADMIN can view any user's borrowings.
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: User ID
 *     responses:
 *       200:
 *         description: Borrowings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Borrowing' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only view your own borrowings
 *       404:
 *         description: User not found
 */
router.get('/user/:userId', authenticate, getBorrowingsByUser)

/**
 * @swagger
 * /borrowings/{id}:
 *   get:
 *     summary: Get a borrowing by ID (ADMIN only)
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Borrowing retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Borrowing' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Borrowing not found
 */
router.get('/:id', authenticate, authorize('ADMIN'), getBorrowingByID)

/**
 * @swagger
 * /borrowings:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BorrowingRequest' }
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Borrowing' }
 *       400:
 *         description: Validation failed or book not available
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or book not found
 */
router.post('/', authenticate, validate(createBorrowingValidation), createBorrowing)

/**
 * @swagger
 * /borrowings/{id}/return:
 *   patch:
 *     summary: Return a borrowed book
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Borrowing ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Borrowing' }
 *       400:
 *         description: Book already returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing not found
 */
router.patch('/:id/return', authenticate, returnBorrowing)

/**
 * @swagger
 * /borrowings/{id}:
 *   delete:
 *     summary: Delete a borrowing record (ADMIN only)
 *     tags: [Borrowings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Borrowing deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Borrowing not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBorrowing)

export default router
