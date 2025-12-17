import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  price: Number,
  stock: Number,
  isActive: { type: Boolean, default: true },
  defaultName : {type : String},
  defaultDes : {type : String},

  translations: [
    {
      lang: String,
      name: String,
      description: String
    }
  ],

  images: [String]
}, { timestamps: true });

productSchema.index({ "translations.lang": 1 });
productSchema.index({ "translations.name": 1 });
productSchema.index({ "translations.description": 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });


export default mongoose.model("Product", productSchema);
