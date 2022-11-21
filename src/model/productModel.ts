import {Schema, model} from 'mongoose'

interface product{
    title:String;
    description:String;
    price:Number;
    category:String;
    availableSizes?:String;
    isFreeShipping:Boolean;
    isDeleted:Boolean;
}

const productSchema = new Schema<product>({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    category: {
        type: [String],
        enum: ["Electronics", "Clothing"],
        trim: true
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const productModel = model<product>('product', productSchema)
export default productModel