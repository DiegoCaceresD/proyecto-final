import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const cartColection = 'Cart';


const ArrayTypeSchemaNonUniqueRequired = {
    type: Array,
    required: true
};

const cartSchema = new mongoose.Schema({
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1 
      }
    }],
  });
cartSchema.plugin(mongoosePaginate)

export const CartModel = mongoose.model(cartColection, cartSchema)