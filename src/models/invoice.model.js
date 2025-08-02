const mongoose = require("mongoose");

// Separate schema for invoice items with _id disabled
const InvoiceItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // snapshot at the time of sale
    quantity: {type: Number, required: true},
    price: {type: Number, required: true}, // price at time of sale
    total: {type: Number, required: true}
}, { _id: false });

const InvoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, unique: true },
        items: [InvoiceItemSchema],
        totalAmount: {type: Number, required: true},
        paymentMethod: { type: String, enum: ["cash", "card", "upi"], default: "cash" },
        soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
