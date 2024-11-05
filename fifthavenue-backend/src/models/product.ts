import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photos: {
      type: [String],
      required: [true, "Please enter Photo"],
    },
    video: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    sizes: {
      type: [String],
      required: [true, "Please enter sizes"]
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    subCategory1: {
      type: String,
      required: [true, "Please enter subCategory1"],
      trim: true,
    },
    subCategory2: {
      type: String,
      required: [true, "Please enter subCategory2"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter Description"],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
