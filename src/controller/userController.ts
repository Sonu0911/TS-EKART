import userModel from "../model/userModel"
import jwt from "jsonwebtoken";
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { Request, Response } from "express"
import randomstring from 'randomstring'
import nodemailer from "nodemailer";
//import SMTP from 'nodemailer-smtp-transport'

const isValidObjectId = function(objectId: string) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
 const configgg ={
    secret_jwt:"rushi-159",
    emailUser:'galchelwarrushikesh1111@gmail.com',
    emailPassword:'lowkqonzfjmrphfn'
}

export const signup = async (req: Request, res: Response) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "No input provided" })

        const { name, lname, phone, email,password,address,pincode} = data

        if (!name) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }

        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "valid phone number is required" })
        }

        if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "valid email is required" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Plz enter valid password" })
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, msg: "passowrd min length is 8 and max len is 15" })
        }

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt)

        if (!address) {
            return res.status(400).send({ status: false, msg: "address is required" })
        }

        if (!/^[1-9]{1}[0-9]{5}$/.test(pincode)) {
            return res.status(400).send({status: false,msg: "Plz enter pincode"})
        }
     
        let dupliPhone = await userModel.find({ phone: phone })
        if (dupliPhone.length > 0) {
            return res.status(400).send({ status: false, msg: "phone number already exits" })
        }

        let dupliEmail = await userModel.find({ email: email })
        if (dupliEmail.length > 0) {
            return res.status(400).send({ status: false, msg: "email is already exists" })
        }


        let savedData = await userModel.create(data)
        return res.status(201).send({
            status: true,
            msg: "user created successfully",
            data: savedData
        })

    } catch (error:any) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

export const loginUser = async (req: Request, res: Response)=> {
    try {
        let user = req.body

        if (Object.keys(user).length == 0) {
            return res.status(400).send({
                status: false,
                msg: "please provide data"
            })

        }

        let userName = req.body.email
        let password = req.body.password

        if (!userName) {
            return res.status(400).send({
                status: false,
                msg: "userName is required"
            })
        }

        if (!password) {
            return res.status(400).send({
                status: false,
                msg: "password is required"
            })
        }


        let userEmailFind = await userModel.findOne({ email: userName })
        if (!userEmailFind) {
            return res.status(400).send({
                status: false,
                msg: "userName is not correct"
            })
        };

        bcrypt.compare(password, userEmailFind.password, function(err:any, result) {
            if (result && userEmailFind) {
                let token = jwt.sign({
                    userId: userEmailFind._id,
                }, "rushi-159");

                const userData = {
                    userId: userEmailFind._id,
                    token: token
                }
                res.status(200).send({
                    status: true,
                    message: "user login successfully",
                    data: userData
                });
            } else {
                return res.status(401).send({
                    status: true,
                    message: "plz provide correct password"
                })
            }
        })

    } catch (error:any) {
        return res.status(500).send({
            status: false,
            msg: error.message
        })
    }

}

export const getUser = async(req: Request, res: Response) =>{
    try {
        let userId = req?.params?.userId.trim()

        if (!isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                msg: "path param is invalid"
            })
        }

        const findUser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!findUser) {
            return res.status(404).send({
                status: false,
                msg: "could not found"
            })
        }

        if (req.body.userId != findUser._id) {
            res.status(403).send({ status: false, message: "userId in params and token are not same" })
            return
        }

        return res.status(200).send({
            status: true,
            msg: "User found",
            data: findUser
        })


    } catch (error:any) {
        return res.status(500).send({
            status: false,
            msg: error.message
        })
    }
}


export const getAllUsers = async  (req: Request, res: Response) => {
    try {

        let findAllUsers = await userModel.find({ isDeleted: false })
        res.status(200).send({ status: true, message: "List of all users", data: findAllUsers })

    } catch (err:any) {
        res.status(400).send({status:false, message:err.message})
    }
} 

export const updateUser = async (req: Request, res: Response) => {
    try{
      let userId = req?.params?.userId

      let data=req.body;

      if(Object.keys(data).length==0){
        return res.status(400).send({status:false,msg:"enter valid data"})
      }

      let findUser = await userModel.findOne({_id:userId,isDeleted:false})
      if(!findUser){
        return res.status(404).send({status:false,msg:"user not found"})
      }

      if (req.body.userId != findUser._id) {
        res.status(403).send({ status: false, message: "userId in params and token are not same" })
        return
      }

      const { fname, lname, phone, email,password} = data

      if (fname){
        if(!fname) return res.status(400).send({ status: false, msg: "first Name is not valid" });
      }
   
      if (lname){
        if(!lname) return res.status(400).send({ status: false, msg: "last Name is not valid" });
      }

      if (phone){
        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "valid phone number is required" })
        }  
      }

      if(email){
        if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "valid email is required" })
        }
      }

      if(password){
        if (!password) {
            return res.status(400).send({ status: false, msg: "Plz enter valid password" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, msg: "passowrd min length is 8 and max len is 15" })
        }
      }
      
       let updatedUser = await userModel.findOneAndUpdate({_id:userId}, {$set:{fname:fname,lname:lname,email:email,phone:phone,password:password}}, {new:true})
       return res.status(200).send({status:true,msg:'successfully updated', data:updatedUser})

    }
     catch(error:any){
        return res.status(500).send({status:false,msg:error.message})
    }
}


export const deleteUser=async (req: Request, res: Response) => {
    try{
      let userId=req?.params?.userId

      if (!isValidObjectId(userId)) {
         return res.status(400).send({ status: false, msg: "Invalid UserId" })
        }

      let findUser=await userModel.findOne({_id: userId,isDeleted: false})
      if(!findUser){
        return res.status(404).send({status:false,msg:"user is not found"})
      }

      if (req.body.userId != findUser._id) {
        res.status(403).send({ status: false, message: "You are not authorized to delete" })
        return
      }

      const userDeleted=await userModel.findOneAndUpdate({_id:userId},{$set:{isDeleted:true,DeletedAt:Date.now()}},{new:true})

      return res.status(200).send({status:true,msg:"user is deleted",data:userDeleted})

    }
    catch(error:any){
     return res.status(500).send({status:false,message:error.message})
    }

}

const sendPasswordMail = async (name:String,email:String,token:String)=>{
 
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
          user:configgg.emailUser,
          pass:configgg.emailPassword
      }
    })

    let mailOptions:any = {
      from:configgg.emailUser,
      to:email,
      subject:'To reset password',
      html:'<p> hii '+name+', to reset your password <a href="http://localhost:3000/resetPass?token='+token+'"> copy this link</a></p>'
    }

    transporter.sendMail(mailOptions,(error:any,info:any)=> {
        if(error){
          console.log(error)
        }else{
          console.log("mail has been sent"+info.response)
        }
    })
     
  } 


export const forgotPass=async (req: Request, res: Response)=>{
   try{
       let data = req.body;
       let email = req.body.email
      // let password = req.body.password

       if (Object.keys(data).length == 0) {
        return res.status(400).send({status: false,msg: "please provide data"})
       }   

       if(!email){
        return res.status(400).send({status: false,msg:"userName is required"})
       }

       const findUser= await userModel.findOne({email: email})
       if(!findUser){
         return res.status(404).send({status: false,msg:"user is not found"})
       }
       const randomString =  randomstring.generate()
       const userData= await userModel.updateOne({email:email},{$set:{token:randomString}},{new:true})

       sendPasswordMail(findUser.name,findUser.email,randomString)
       return res.status(200).send({status:true, msg:"plz check your inbox"})
   }
  catch(error:any){
    return res.status(500).send({status:false,msg:error.message})
}
}

export const resetPass=async (req: Request, res: Response)=>{
  try{
   let token=req.query.token
   let tokenData = await userModel.findOne({token:token})
   if(tokenData){
      const password = req.body.password
      const newPass =  await bcrypt.hash(password, 10)
      const resPass = await userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPass,token:" "}},{new:true})
      return res.status(200).send({status:true, msg:"password  is reset",data:resPass})
   }else{
    return res.status(500).send({status:false,msg:"this link is expired"})
   }
  }
  catch(error:any){
    return res.status(500).send({status:false,msg:error.message})
  }
}
