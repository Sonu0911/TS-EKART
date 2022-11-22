"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCart = void 0;
const cartModel_1 = __importDefault(require("../model/cartModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../model/productModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const isValidObjectId = function (objectId) {
    return mongoose_1.default.Types.ObjectId.isValid(objectId);
};
const createCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter a Valid userID" });
        }
        const isUserExist = await userModel_1.default.findById(userId);
        if (!isUserExist) {
            return res.status(404).send({ status: false, message: "User not Found" });
        }
        if (userId != req.body.userId) {
            return res.status(403).send({ status: false, message: "User not authorized to create a cart" });
        }
        const requestBody = req.body;
        if (!requestBody) {
            return res.status(400).send({ status: false, message: "Please Provide Details In The Body" });
        }
        let { cartId, productId } = requestBody;
        if ('cartId' in requestBody) {
            if (!cartId) {
                return res.status(400).send({ status: false, message: `Cart Id Should be not be Empty` });
            }
            cartId = cartId.trim();
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: `Invalid Cart Id` });
            }
        }
        if (!(productId)) {
            return res.status(400).send({ status: false, message: "Enter the productId" });
        }
        productId = productId.trim();
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Enter a valid productId" });
        }
        const product = await productModel_1.default.findOne({ _id: productId, isDeleted: false }).lean().select({ price: 1 });
        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" });
        }
        let isCartExist = await cartModel_1.default.findOne({ userId: userId });
        if (!isCartExist) {
            let newCartData = {
                userId: userId,
                items: [
                    {
                        productId: product._id,
                        quantity: 1
                    }
                ],
                totalPrice: product.price,
                totalItems: 1
            };
            const newCart = await cartModel_1.default.create(newCartData);
            return res.status(201).send({ status: true, message: "Success", data: newCart });
        }
        if (!req.body.hasOwnProperty("cartId")) {
            return res.status(400).send({ status: false, msg: `Please Enter the Card Id for userId ${userId}` });
        }
        if (isCartExist._id != cartId) {
            return res.status(400).send({ Status: false, message: "Cart Id and user do not match" });
        }
        let itemLists = isCartExist.items;
        let productIdLists = itemLists.map((item) => item = item.productId.toString());
        if (productIdLists.find((item) => item == (productId))) {
            const updatedCart = await cartModel_1.default.findOneAndUpdate({ userId: userId, "items.productId": productId }, {
                $inc: {
                    "items.$.quantity": +1,
                    totalPrice: +product.price
                }
            }, { new: true });
            return res.status(200).send({ status: true, message: "Success", data: updatedCart });
        }
        const addNewItem = await cartModel_1.default.findOneAndUpdate({ userId: userId }, {
            $addToSet: { items: { productId: productId, quantity: 1 } },
            $inc: { totalPrice: +product.price, totalItems: +1 }
        }, { new: true });
        return res.status(201).send({ status: true, message: "Success", data: addNewItem });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
};
exports.createCart = createCart;
