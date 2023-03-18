import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the title"],
  },
  description: {
    type: String,
    required: [true, "Please enter the title"],
  },
  steps: [
    {
      step: Number,
      description: String,
    },
  ],
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Recipe = mongoose.model("Recipe", recipeSchema);
