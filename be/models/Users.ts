import {model, Schema, Types} from 'mongoose'
import { IUsers } from 'interfaces'

const UserSchema = new Schema<IUsers>({
    username : {type : String, required : true, unique : true},
}, {
    timestamps : true,
})

const Users = model<IUsers>('users' , UserSchema)

export default Users