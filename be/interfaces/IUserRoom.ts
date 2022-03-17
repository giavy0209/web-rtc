import { Types } from "mongoose";
import { IUsers,IRoom } from ".";

interface IUser extends Types.ObjectId , IUsers {}
interface Iroom extends Types.ObjectId , IRoom {}

export default interface IUserRoom {
    user : IUser,
    room : Iroom,
    active : boolean,
}