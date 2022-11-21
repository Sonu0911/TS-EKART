import cartModel from "../model/cartModel"
import mongoose from 'mongoose'
import { Request, Response} from 'express'
import productModel from '../model/productModel'
import userModel from '../model/userModel'

const isValidObjectId = function(objectId: string) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

export const createCart = async (req:Request, res:Response) => {
    try {
        const userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter a Valid userID" })
        }
        const isUserExist = await userModel.findById(userId)
        if (!isUserExist) {
            return res.status(404).send({ status: false, message: "User not Found" });
        }

        if (userId != req.body.userId) {
            return res.status(403).send({ status: false, message: "User not authorized to create a cart" })
        }

        const requestBody = req.body

        if (!requestBody) {
            return res.status(400).send({ status: false, message: "Please Provide Details In The Body" })
        }
        let { cartId, productId } = requestBody

        if ('cartId' in requestBody) {
            if (!cartId){
                return res.status(400).send({ status: false, message: `Cart Id Should be not be Empty` })
            }

            cartId = cartId.trim()
        
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: `Invalid Cart Id` })
            }
        }
        if (!(productId)) {
            return res.status(400).send({ status: false, message: "Enter the productId" });
        }
        productId = productId.trim()

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Enter a valid productId" })
        }

        const product = await productModel.findOne({ _id: productId, isDeleted: false }).lean().select({ price: 1 });
        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }

        let isCartExist = await cartModel.findOne({ userId: userId })
        if (!isCartExist) {
            let newCartData = {
                userId: userId,
                items:
                    [
                        {
                            productId: product._id,
                            quantity: 1
                        }
                    ],
                totalPrice: product.price,
                totalItems: 1
            }
            const newCart = await cartModel.create(newCartData)
            return res.status(201).send({ status: true, message: "Success", data: newCart })
        }

        if (!req.body.hasOwnProperty("cartId")) {
            return res.status(400).send({ status: false, msg: `Please Enter the Card Id for userId ${userId}` })
        }

        if (isCartExist._id != cartId) {
            return res.status(400).send({ Status: false, message: "Cart Id and user do not match" })
        }

        let itemLists = isCartExist.items;
        let productIdLists = itemLists.map((item:any) => item = item.productId.toString())

        // match productid with items id and then update id 
        if (productIdLists.find((item) => item == (productId))) {
            const updatedCart = await cartModel.findOneAndUpdate({ userId: userId, "items.productId": productId },
                {
                    $inc: {
                        "items.$.quantity": + 1,
                        totalPrice: + product.price
                    }
                },
                { new: true })

            return res.status(200).send({ status: true, message: "Success", data: updatedCart })
        }
        // if product Id and product does not match then we will add new item in items
        const addNewItem = await cartModel.findOneAndUpdate({ userId: userId },
            {
                $addToSet: { items: { productId: productId, quantity: 1 } },
                $inc: { totalPrice: + product.price, totalItems: +1 }
            },
            { new: true })

        // Send Response Of New Added Product in Cart 
        return res.status(201).send({ status: true, message: "Success", data: addNewItem })
    } catch (error:any) {
        res.status(500).send({ error: error.message });
    }
};