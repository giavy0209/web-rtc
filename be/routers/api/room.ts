import { Router } from "express";
import { roomController as controller } from 'controllers'
import { isAuth } from "../../middleware";

const router = Router()

router.route('/room')
    .get(isAuth,controller.get)
    .post(isAuth,controller.post)
export default router