import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,
  status: {
    type: String,
    enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
