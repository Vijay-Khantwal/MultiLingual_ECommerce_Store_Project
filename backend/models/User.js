import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["CONSUMER", "SELLER", "ADMIN"],
    default: "CONSUMER"
  },
  lang : {type: String, default: "english"}
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
