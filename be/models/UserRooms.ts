import {model, Schema, Types} from 'mongoose'
import { IUserRoom } from 'interfaces'

const RoomSchema = new Schema<IUserRoom>({
    user : {type : Schema.Types.ObjectId , ref : 'users'},
    room : {type : Schema.Types.ObjectId , ref : 'rooms'},
    active : {type : Boolean, default : true},
})

const Rooms = model<IUserRoom>('resources' , RoomSchema)

export default Rooms