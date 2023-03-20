import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import { Category } from "../models/Category.js";

export const getStats = catchAsyncErrors(async (req, res, next) => {
  const usersCount = await User.count();
  const recipeCount = await Recipe.count();
  const categoryCount = await Category.count();

  const categories = await Category.aggregate([
    {
      $group: {
        _id: "$name",
        recipe_count: { $first: { $size: "$recipes" } },
      },
    },
  ])
    .sort({ recipe_count: -1 })
    .limit(1);

  const popularCategory = categories.length === 1 ? categories[0] : null;

  res.status(200).json({
    success: true,
    usersCount,
    recipeCount,
    categoryCount,
    popularCategory,
  });
});
