"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderPlace = void 0;
const orderModel_1 = __importDefault(require("../model/orderModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../model/userModel"));
const cartModel_1 = __importDefault(require("../model/cartModel"));
const isValidObjectId = function (objectId) {
    return mongoose_1.default.Types.ObjectId.isValid(objectId);
};
const orderPlace = async (req, res) => {
    try {
        const body = req.body;
        if (!(body)) {
            return res.status(400).send({ status: false, msg: "Product details must be present" });
        }
        const userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters" });
        }
        if (userId !== req.body.userId) {
            return res.status(401).send({ status: false, msg: "Unauthorised access" });
        }
        const { cartId, cancellable, status } = body;
        if (!cartId) {
            return res.status(400).send({ status: false, msg: "cartId must be present" });
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, msg: "Invalid cartId" });
        }
        const userSearch = await userModel_1.default.findOne({ _id: userId });
        if (!userSearch) {
            return res.status(400).send({ status: false, msg: "User does not exist" });
        }
        const cartSearch = await cartModel_1.default.findOne({ userId }).select({ items: 1, totalPrice: 1, totalItems: 1 });
        if (!cartSearch) {
            return res.status(400).send({ status: false, msg: "Cart does not exist" });
        }
        if (status) {
            if (!isValidObjectId(status)) {
                return res.status(400).send({ status: false, msg: "Order status by default is pending" });
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
        };
        let createdOrder = await orderModel_1.default.create(order);
        return res.status(201).send({ status: true, message: "Success", data: createdOrder });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};
exports.orderPlace = orderPlace;
