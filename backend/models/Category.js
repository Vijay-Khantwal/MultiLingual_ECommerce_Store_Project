import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  translations: [
    {
      language: String,
      name: String,
      description: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
