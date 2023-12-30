import mongoose from "mongoose";

const ticketCollection = 'ticket';

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

const ticketSchema = new mongoose.Schema({
    code: stringTypeSchemaUniqueRequired,
    purchase_datetime: {type: Date, default: Date.now},
    amount: numberTypeSchemaNonUniqueRequired,
    purchaser: stringTypeSchemaNonUniqueRequired
})

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);