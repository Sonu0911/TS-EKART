"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const createProduct = async (req, res) => {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: true, message: "Please Provide product data in body" });
        let { title, description, category, price } = data;
        if (!title) {
            res.status(400).send({ status: false, message: 'please provide title' });
            return;
        }
        if (!description) {
            res.status(400).send({ status: false, message: 'please provide description' });
            return;
        }
        if (!category) {
            res.status(400).send({ status: false, message: 'please provide category' });
            return;
        }
        if (!price) {
            res.status(400).send({ status: false, message: 'please provide price' });
            return;
        }
        if (category) {
            if (!["Electronics", "Clothing"].includes(category)) {
                return res.status(400).send({ status: false, message: "Category should be from [Electronics, Clothing]" });
            }
        }
        const isTitlePresent = await productModel_1.default.findOne({ title: title });
        if (isTitlePresent) {
            res.status(400).send({ status: false, message: "This title is already in use, plz provide anothor title" });
            return;
        }
        const productCreated = await productModel_1.default.create(data);
        res.status(201).send({ status: true, message: "Success", data: productCreated });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};
exports.createProduct = createProduct;
