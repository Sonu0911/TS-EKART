import orderModel from "../model/orderModel";
import { Request,Response } from "express";
import mongoose from 'mongoose';
import UserModel from "../model/userModel"
import productModel from "../model/productModel"
import cartModel from "../model/cartModel"

const isValidObjectId = function(objectId: string) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

export const orderPlace = async (req: Request, res: Response)=>{
  try{  
       const body = req.body
       if (!(body)) {
           return res.status(400).send({ status: false, msg: "Product details must be present" })
       }

       const userId = req.params.userId;
       if (!isValidObjectId(userId)) {
           return res.status(400).send({ status: false, msg: "Invalid parameters" });
       }

       if (userId !== req.body.userId) {
           return res.status(401).send({ status: false, msg: "Unauthorised access" })
       }

       const { cartId, cancellable, status } = body

       if (!cartId) {
           return res.status(400).send({ status: false, msg: "cartId must be present" })
       }

       if (!isValidObjectId(cartId)) {
           return res.status(400).send({ status: false, msg: "Invalid cartId" })
       }

       const userSearch = await UserModel.findOne({ _id: userId })
       if (!userSearch) {
           return res.status(400).send({ status: false, msg: "User does not exist" })
       }

       const cartSearch = await cartModel.findOne({ userId }).select({ items: 1, totalPrice: 1, totalItems: 1 })
       if (!cartSearch) {
           return res.status(400).send({ status: false, msg: "Cart does not exist" })
       }

       if (status) {
           if (!isValidObjectId(status)) {
               return res.status(400).send({ status: false, msg: "Order status by default is pending" })
           }
       }
       let order = {
           userId,
           items: cartSearch.items,
           totalPrice: cartSearch.totalPrice,
           totalItems: cartSearch.totalItems,
           totalQuantity: cartSearch.totalItems,
           cancellable,
           status
       }

       let createdOrder = await orderModel.create(order)
       return res.status(201).send({ status: true, message: "Success", data: createdOrder })
   
  }catch(error:any){
   return res.status(500).send({status:false,msg:error.message});
  }
}