"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController = __importStar(require("../controller/userController"));
const mid = __importStar(require("../middleware/middleware"));
const productController = __importStar(require("../controller/productController"));
const orderController = __importStar(require("../controller/orderController"));
const cartController = __importStar(require("../controller/cartController"));
router.post("/register", userController.signup);
router.post("/login", userController.loginUser);
router.get("/getUser/:userId", mid.authenticate, userController.getUser);
router.get("/getAll", mid.authenticate, userController.getAllUsers);
router.put("/updateUser/:userId", mid.authenticate, userController.updateUser);
router.put("/delete/:userId", mid.authenticate, userController.deleteUser);
router.post("/createProduct", productController.createProduct);
router.post("/cart/:userId", mid.authenticate, cartController.createCart);
router.post("/order/:userId", mid.authenticate, orderController.orderPlace);
router.post("/forgotPass", userController.forgotPass);
router.get("/resetPass", userController.resetPass);
exports.default = router;
