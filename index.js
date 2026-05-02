import express from 'express'
import swaggerUi from 'swagger-ui-express'
import router from './routes/index.route.js'
import swaggerSpec from './config/swagger.js'

const app = express()
const port = 3000

app.use(express.json())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Library API Docs',
    swaggerOptions: {
        persistAuthorization: true // token tetap tersimpan saat refresh
    }
}))

app.use(router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`)
})
