import {Request,Response} from "express";
import { Users} from 'models'
import {compareSync, hashSync} from 'bcrypt'
import { sign } from 'jsonwebtoken'
class authController {
    static async auth (req : Request , res : Response) {
        const {username} = req.body
        let user = await Users.findOne({username})
        if(!user) {
            user = await Users.create({username})
        }

        const token = sign({_id : user._id} , global.Config.JWT)

        res.send({
            status : 1,
            token,
            data : user,
        })
    }
}

export default authController