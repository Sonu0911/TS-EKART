import {Schema, model} from 'mongoose'

interface User{
    fname:string;
    lname:string;
    email:string;
    phone:string;
    password:string;
    address:string;
    pincode:Number
}

const userSchema = new Schema<User>({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address:{
        type:String,
        required: true
    },
    pincode:{
        type:Number,
        required: true
    }
});

const UserModel = model<User>('users', userSchema)
export default UserModel