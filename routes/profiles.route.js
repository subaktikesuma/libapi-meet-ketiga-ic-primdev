import express from 'express'
import { profileController } from '../controller/index.controller.js'

const router = express.Router()

router.get('/', profileController.getProfiles)

router.post('/', profileController.createProfile)

router.get('/:id', profileController.getProfileByID)

router.put('/:id', profileController.updateProfile)

router.delete('/:id', profileController.deleteProfile)

export default router
