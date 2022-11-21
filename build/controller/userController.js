"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUser = exports.loginUser = exports.signup = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const isValidObjectId = function (objectId) {
    return mongoose_1.default.Types.ObjectId.isValid(objectId);
};
const signup = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "No input provided" });
        const { fname, lname, phone, email, password } = data;
        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is required" });
        }
        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is required" });
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "valid phone number is required" });
        }
        if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "valid email is required" });
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "Plz enter valid password" });
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, msg: "passowrd min length is 8 and max len is 15" });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        data.password = await bcrypt_1.default.hash(data.password, salt);
        let dupliPhone = await userModel_1.default.find({ phone: phone });
        if (dupliPhone.length > 0) {
            return res.status(400).send({ status: false, msg: "phone number already exits" });
        }
        let dupliEmail = await userModel_1.default.find({ email: email });
        if (dupliEmail.length > 0) {
            return res.status(400).send({ status: false, msg: "email is already exists" });
        }
        let savedData = await userModel_1.default.create(data);
        return res.status(201).send({
            status: true,
            msg: "user created successfully",
            data: savedData
        });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};
exports.signup = signup;
const loginUser = async (req, res) => {
    try {
        let user = req.body;
        if (Object.keys(user).length == 0) {
            return res.status(400).send({
                status: false,
                msg: "please provide data"
            });
        }
        let userName = req.body.email;
        let password = req.body.password;
        if (!userName) {
            return res.status(400).send({
                status: false,
                msg: "userName is required"
            });
        }
        if (!password) {
            return res.status(400).send({
                status: false,
                msg: "password is required"
            });
        }
        let userEmailFind = await userModel_1.default.findOne({ email: userName });
        if (!userEmailFind) {
            return res.status(400).send({
                status: false,
                msg: "userName is not correct"
            });
        }
        ;
        bcrypt_1.default.compare(password, userEmailFind.password, function (err, result) {
            if (result && userEmailFind) {
                let token = jsonwebtoken_1.default.sign({
                    userId: userEmailFind._id,
                }, "rushi-159");
                const userData = {
                    userId: userEmailFind._id,
                    token: token
                };
                res.status(200).send({
                    status: true,
                    message: "user login successfully",
                    data: userData
                });
            }
            else {
                return res.status(401).send({
                    status: true,
                    message: "plz provide correct password"
                });
            }
        });
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        });
    }
};
exports.loginUser = loginUser;
const getUser = async (req, res) => {
    try {
        let userId = req?.params?.userId.trim();
        if (!isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                msg: "path param is invalid"
            });
        }
        const findUser = await userModel_1.default.findOne({ _id: userId, isDeleted: false });
        if (!findUser) {
            return res.status(404).send({
                status: false,
                msg: "could not found"
            });
        }
        if (req.body.userId != findUser._id) {
            res.status(403).send({ status: false, message: "userId in params and token are not same" });
            return;
        }
        return res.status(200).send({
            status: true,
            msg: "User found",
            data: findUser
        });
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        });
    }
};
exports.getUser = getUser;
const getAllUsers = async (req, res) => {
    try {
        let findAllUsers = await userModel_1.default.find({ isDeleted: false });
        res.status(200).send({ status: true, message: "List of all users", data: findAllUsers });
    }
    catch (err) {
        res.status(400).send({ status: false, message: err.message });
    }
};
exports.getAllUsers = getAllUsers;
