import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["CONSUMER", "SELLER", "ADMIN"],
      default: "CONSUMER",
    },
    lang: { type: String, default: "english" },

    address: {
      type: addressSchema,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
