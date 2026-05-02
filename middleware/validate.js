import { validationResult } from 'express-validator'

const validate = (validations) => {
    return async (req, res, next) => {
        // Jalankan semua validasi
        for (const validation of validations) {
            await validation.run(req)
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            })
        }
        next()
    }
}

export default validate
