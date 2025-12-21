import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user?.address) {
      return res.status(400).json({ message: "Address not found" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.productId.name}`,
        });
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.productId.price * i.quantity,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: totalAmount * 100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error("Payment cancelled or failed");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart empty");
    }

    const items = cart.items.map((i) => ({
      productId: i.productId._id,
      sellerId: i.productId.sellerId,
      quantity: i.quantity,
      price: i.productId.price,
    }));

    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Insufficient stock for product");
      }
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      address: user.address,
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "SUCCESS",
      },
      status: "PAID",
    });

    await Cart.updateOne({ userId }, { $set: { items: [] } });

    res.json({
      message: "Payment successful",
      orderId: order._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message || "Payment failed",
    });
  }
};
