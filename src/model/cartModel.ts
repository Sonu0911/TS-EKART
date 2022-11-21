import mongoose,{Schema, model} from 'mongoose'
const objectId = mongoose.Schema.Types.ObjectId

interface cart{
    userId:String,
    items:[{
        quantity:Number
    }]
    ,
    totalPrice:Number,
    totalItems: Number
}

const cartSchema = new Schema<cart>({
  userId: {
    type: objectId,
    required: true,
    unique: true,
    ref: "users",
    trim: true
    },
  items: [{
    productId: {
        type: objectId,
        required: true,
        ref: "product",
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    }
  }],
    totalPrice: {
    type: Number,
    required: true,
    trim: true
  },
    totalItems: {
    type: Number,
    required: true,
    trim: true
  }});

const cartModel = model<cart>('cart', cartSchema)
export default cartModel