import express from 'express'
import { profileController } from '../controller/index.controller.js'
import authenticate from '../middleware/authenticate.js'
import authorize from '../middleware/authorize.js'
import validate from '../middleware/validate.js'
import { createProfileValidation, updateProfileValidation } from '../validation/profiles.validation.js'

const router = express.Router()

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles (ADMIN only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Profile' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 */
router.get('/', authenticate, authorize('ADMIN'), profileController.getProfiles)

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a profile by ID (ADMIN only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Profile' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Profile not found
 */
router.get('/:id', authenticate, authorize('ADMIN'), profileController.getProfileByID)

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a profile for a user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProfileRequest' }
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Profile' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Profile already exists for this user
 */
router.post('/', authenticate, validate(createProfileValidation), profileController.createProfile)

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
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
 *               address: { type: string, example: Jl. Gatot Subroto No. 5, Jakarta }
 *               phone: { type: string, example: '+6281234567890' }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.put('/:id', authenticate, validate(updateProfileValidation), profileController.updateProfile)

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete a profile (ADMIN only)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - ADMIN only
 *       404:
 *         description: Profile not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), profileController.deleteProfile)

export default router
