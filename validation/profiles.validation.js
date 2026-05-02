import { body } from 'express-validator'

export const createProfileValidation = [
    body('userId')
        .notEmpty().withMessage('userId is required')
        .isInt({ min: 1 }).withMessage('userId must be a positive integer'),
    body('address')
        .notEmpty().withMessage('Address is required'),
    body('phone')
        .notEmpty().withMessage('Phone is required')
        .isMobilePhone().withMessage('Must be a valid phone number')
]

export const updateProfileValidation = [
    body('address')
        .optional()
        .isLength({ min: 1 }).withMessage('Address cannot be empty'),
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Must be a valid phone number')
]
