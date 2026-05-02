import express from 'express'
import { userController } from '../controller/index.controller.js'
import authenticate from '../middleware/authenticate.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { createUserValidation, updateUserValidation } from '../validation/users.validation.js'

const router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 */
router.get('/', authenticate, authorize('ADMIN'), userController.getUsers)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUserByID)

/**
 * @swagger
 * /users/{id}/profile:
 *   get:
 *     summary: Get a user with their profile (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User with profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: User not found
 */
router.get('/:id/profile', authenticate, authorize('ADMIN'), userController.getUserByIdWithProfile)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterRequest' }
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       409:
 *         description: Email already in use
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createUserValidation), userController.createUser)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (ADMIN only)
 *     tags: [Users]
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
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: Jane Doe }
 *               email: { type: string, example: jane@example.com }
 *               password: { type: string, example: newpassword123 }
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateUserValidation), userController.updateUser)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deleteUser)

export default router
