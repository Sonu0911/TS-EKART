import mongoose,{Schema, model} from 'mongoose'
const objectId = mongoose.Schema.Types.ObjectId

interface order{
   userId:String;
   items:any;
   totalPrice:Number;
   totalItems: Number;
   totalQuantity: Number;
   cancellable:Boolean;
   status:String;
   deletedAt:String;
   isDeleted:Boolean;

}

const orderSchema = new Schema<order>({
        userId: {
            type: objectId,
            ref: "users",
            required: true
        },
        items: [{
            productId: {
                type: objectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
        totalPrice: {
            type: Number,
            required: true
        },
        totalItems: {
            type: Number,
            required: true
        },
        totalQuantity: {
            type: Number,
            required: true
        },
        cancellable: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "completed", "cancelled"]
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const orderModel = model<order>('order', orderSchema)
export default orderModel