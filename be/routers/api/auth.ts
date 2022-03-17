import { Router } from "express";
import { authController as controller } from 'controllers'

const router = Router()

router.route('/auth')
    .post(controller.auth)

export default router