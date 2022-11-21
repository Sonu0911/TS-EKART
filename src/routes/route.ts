import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import * as userController from '../controller/userController';
import * as mid from "../middleware/middleware"
import * as productController from '../controller/productController'
import * as orderController from "../controller/orderController"
import * as cartController from '../controller/cartController'

//==============USER============
router.post("/register", userController.signup)
router.post("/login", userController.loginUser)
router.get("/getUser/:userId",mid.authenticate,userController.getUser)
router.get("/getAll", mid.authenticate,userController.getAllUsers)
router.put("/updateUser/:userId", mid.authenticate,userController.updateUser)
router.put("/delete/:userId", mid.authenticate,userController.deleteUser)

//==============PRODUCT==========

router.post("/createProduct",productController.createProduct)

//===============CART============

router.post("/cart/:userId",mid.authenticate,cartController.createCart)

//==============ORDER===============

router.post("/order/:userId", mid.authenticate,orderController.orderPlace)


export default router