import { body } from 'express-validator'

export const createBorrowingValidation = [
    body('userId')
        .notEmpty().withMessage('userId is required')
        .isInt({ min: 1 }).withMessage('userId must be a positive integer'),
    body('bookId')
        .notEmpty().withMessage('bookId is required')
        .isInt({ min: 1 }).withMessage('bookId must be a positive integer')
]
