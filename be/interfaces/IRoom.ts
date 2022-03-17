import { Types } from "mongoose";
import { IUsers } from ".";
interface IUser extends Types.ObjectId , IUsers{}
export default interface IResource  {
    owner : IUser,
        
}