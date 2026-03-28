import express from 'express'
import { userController } from '../controller/index.controller.js'

const router = express.Router()

router.get('/', userController.getUsers)

router.post('/', userController.createUser)

router.get('/:id', userController.getUserByID)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

export default router

