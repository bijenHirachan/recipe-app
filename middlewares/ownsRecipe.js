import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const ownsRecipe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  let owns = false;

  user.recipes.forEach((rec) => {
    if (rec._id.toString() === recipe._id.toString()) {
      owns = true;
    }
  });

  if (owns === true) {
    next();
  } else {
    return next(new ErrorHandler("Sorry! You don't own the recipe.", 401));
  }
});
