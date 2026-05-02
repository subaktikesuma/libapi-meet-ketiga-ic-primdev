import { body } from 'express-validator'

const currentYear = new Date().getFullYear()

export const createBookValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('author')
        .notEmpty().withMessage('Author is required'),
    body('year')
        .notEmpty().withMessage('Year is required')
        .isInt({ min: 1000, max: currentYear })
        .withMessage(`Year must be between 1000 and ${currentYear}`),
    body('available')
        .optional()
        .isBoolean().withMessage('Available must be true or false'),
    body('categoryId')
        .optional()
        .isInt({ min: 1 }).withMessage('categoryId must be a positive integer')
]

export const updateBookValidation = [
    body('title')
        .optional()
        .isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('author')
        .optional()
        .isLength({ min: 1 }).withMessage('Author cannot be empty'),
    body('year')
        .optional()
        .isInt({ min: 1000, max: currentYear })
        .withMessage(`Year must be between 1000 and ${currentYear}`),
    body('available')
        .optional()
        .isBoolean().withMessage('Available must be true or false'),
    body('categoryId')
        .optional()
        .isInt({ min: 1 }).withMessage('categoryId must be a positive integer')
]
