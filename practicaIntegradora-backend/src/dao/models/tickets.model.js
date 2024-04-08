import mongoose from "mongoose"

const ticketsCollection = "tickets"

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
    },
    amount: {
        type: Number,
        default: 0
    },
    purchaser: {
        type: String
    }

})

export const ticketsModel = new mongoose.model(ticketsCollection, ticketsSchema)