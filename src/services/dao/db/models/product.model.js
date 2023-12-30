import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productColection = 'Product';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const numberTypeSchemaNonUniqueRequired = {
    type: Number,
    required: true
};

const booleanTypeSchemaNonUniqueRequired = {
    type: Boolean,
    required: true
};

const productSchema = new mongoose.Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    price: numberTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    stock: numberTypeSchemaNonUniqueRequired,
    status: booleanTypeSchemaNonUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired,
    cart: {
        type: Array,
        default:[]
    }
})
productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productColection, productSchema)
