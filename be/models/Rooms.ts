import {model, Schema, Types} from 'mongoose'
import { IRoom } from 'interfaces'

const RoomSchema = new Schema<IRoom>({
    owner : {type : Schema.Types.ObjectId , ref : 'users'}
})

const Rooms = model<IRoom>('rooms' , RoomSchema)

export default Rooms