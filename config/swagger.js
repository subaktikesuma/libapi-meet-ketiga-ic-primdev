import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'REST API for Library Management System with Authentication & Authorization',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development Server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token from POST /auth/login'
                }
            },
            schemas: {
                // Auth
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', minLength: 6, example: 'secret123' },
                        role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'secret123' }
                    }
                },
                // User
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        role: { type: 'string', example: 'USER' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Book
                Book: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'The Great Gatsby' },
                        author: { type: 'string', example: 'F. Scott Fitzgerald' },
                        year: { type: 'integer', example: 1925 },
                        available: { type: 'boolean', example: true },
                        categoryId: { type: 'integer', nullable: true, example: 2 },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                BookRequest: {
                    type: 'object',
                    required: ['title', 'author', 'year'],
                    properties: {
                        title: { type: 'string', example: 'The Great Gatsby' },
                        author: { type: 'string', example: 'F. Scott Fitzgerald' },
                        year: { type: 'integer', example: 1925 },
                        available: { type: 'boolean', example: true },
                        categoryId: { type: 'integer', nullable: true, example: 2 }
                    }
                },
                // Category
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Fiction' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                CategoryRequest: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string', example: 'Fiction' }
                    }
                },
                // Profile
                Profile: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        address: { type: 'string', example: 'Jl. Sudirman No. 1, Jakarta' },
                        phone: { type: 'string', example: '+6281234567890' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                ProfileRequest: {
                    type: 'object',
                    required: ['userId', 'address', 'phone'],
                    properties: {
                        userId: { type: 'integer', example: 1 },
                        address: { type: 'string', example: 'Jl. Sudirman No. 1, Jakarta' },
                        phone: { type: 'string', example: '+6281234567890' }
                    }
                },
                // Borrowing
                Borrowing: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        bookId: { type: 'integer', example: 2 },
                        borrow_date: { type: 'string', format: 'date-time' },
                        returned_at: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        borrower: { $ref: '#/components/schemas/User' },
                        book: { $ref: '#/components/schemas/Book' }
                    }
                },
                BorrowingRequest: {
                    type: 'object',
                    required: ['userId', 'bookId'],
                    properties: {
                        userId: { type: 'integer', example: 1 },
                        bookId: { type: 'integer', example: 2 }
                    }
                },
                // Generic responses
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Error message' }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Validation failed' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string', example: 'email' },
                                    message: { type: 'string', example: 'Must be a valid email address' }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints (public)' },
            { name: 'Users', description: 'User management (ADMIN only)' },
            { name: 'Books', description: 'Book management' },
            { name: 'Categories', description: 'Category management' },
            { name: 'Profiles', description: 'User profile management' },
            { name: 'Borrowings', description: 'Book borrowing management (many-to-many)' }
        ]
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)
export default swaggerSpec
