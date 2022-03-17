import {Request,Response} from "express";
import { Rooms} from 'models'
import { IRequest } from "interfaces";
class roomController {
    static async get (req : IRequest , res : Response) {
        const {_id} = req
        const {room} = req.query
        const data = await Rooms.findById(room)
        
        res.send({
            status : 1,
            data : data
        })
    }
    static async post (req : IRequest , res : Response) {
        const {_id} = req
        console.log(_id);
        
        const room = await Rooms.create({owner : _id})
        res.send({
            status : 1,
            data : room
        })
    }
}

export default roomController