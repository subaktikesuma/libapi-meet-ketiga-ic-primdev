import { body } from 'express-validator'

export const createUserValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN')
]

export const updateUserValidation = [
    body('name')
        .optional()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .optional()
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN')
]
