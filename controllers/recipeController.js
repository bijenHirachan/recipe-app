import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";

export const getRecipe = catchAsyncErrors(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate("categories");

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  res.status(200).json({
    success: true,
    recipe,
  });
});

export const getAllRecipes = catchAsyncErrors(async (req, res, next) => {
  const recipes = await Recipe.find().populate("categories");

  res.status(200).json({
    success: true,
    recipes,
  });
});

export const getMyRecipes = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("recipes");

  const myRecipes = user.recipes;

  res.status(200).json({
    success: true,
    myRecipes,
  });
});

export const createRecipe = catchAsyncErrors(async (req, res, next) => {
  const { title, description } = req.body;

  const file = req.file;

  if (!title || !description || !file)
    return next(new ErrorHandler("All fields are required", 400));

  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "/recipe-app/recipes",
  });

  const recipe = await Recipe.create({
    title,
    description,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    user,
  });

  user.recipes.push(recipe._id);

  await user.save();

  res.status(201).json({
    success: true,
    message: "Recipe created successfully",
    recipe,
  });
});

export const deleteRecipe = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  await cloudinary.v2.uploader.destroy(recipe.poster.public_id, {
    folder: "/recipe-app/recipes",
  });

  for (let i = 0; i < recipe.categories.length; i++) {
    const category = await Category.findById(recipe.categories[i]);
    category.recipes = category.recipes.filter(
      (rec) => rec.toString() !== recipe._id.toString()
    );

    await category.save();
  }

  const user = await User.findById(recipe.user._id);

  user.recipes = user.recipes.filter(
    (rec) => rec.toString() !== recipe._id.toString()
  );

  await user.save();
  await recipe.deleteOne();

  res.status(200).json({
    success: true,
    message: "Recipe deleted successfully",
  });
});

export const deleteStep = catchAsyncErrors(async (req, res, next) => {
  const { id, stepId } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  recipe.steps = recipe.steps.filter(
    (step) => step._id.toString() !== stepId.toString()
  );

  await recipe.save();

  return res.status(200).json({
    success: true,
    message: "Step deleted successfully",
    recipe,
  });
});

export const addStep = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) return next(new ErrorHandler("Description required", 400));

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  recipe.steps.push({ step: recipe.steps.length + 1, description });

  await recipe.save();

  return res.status(200).json({
    success: true,
    message: "Step added successfully",
    recipe,
  });
});

export const addSteps = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { steps } = req.body;

  if (!steps || steps.length < 1)
    return next(new ErrorHandler("Steps required", 400));

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  recipe.steps = steps;

  await recipe.save();

  return res.status(200).json({
    recipe,
  });
});

export const addIngredients = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length < 1)
    return next(new ErrorHandler("Ingredients required", 400));

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  recipe.ingredients = ingredients;

  await recipe.save();

  return res.status(200).json({
    recipe,
  });
});

export const addNewCategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(new ErrorHandler("Name is required", 400));

  const transformedName = name.toUpperCase();

  const category = await Category.findOne({ name: transformedName });

  if (category) return next(new ErrorHandler("Category already exists.", 400));

  const newCategory = await Category.create({ name: transformedName });

  res.status(201).json({
    newCategory,
  });
});

export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(201).json({
    categories,
  });
});

export const addCategoryToRecipe = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) return next(new ErrorHandler("Category required", 400));

  const recipe = await Recipe.findById(id);

  if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

  const choosenCategory = await Category.findById(category);

  if (!choosenCategory)
    return next(new ErrorHandler("Category Not Found", 404));

  if (!choosenCategory.recipes.includes(recipe._id)) {
    choosenCategory.recipes.push(recipe._id);
  } else {
    return res.status(400).json({
      success: false,
      message: "Category already exist.",
    });
  }

  await choosenCategory.save();

  if (!recipe.categories.includes(category)) {
    recipe.categories.push(category);
  }

  await recipe.save();

  return res.status(200).json({
    success: true,
    message: "Category added",
  });
});
export const addCategoriesToRecipe = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { categories } = req.body;

    if (!categories || categories.length < 1)
      return next(new ErrorHandler("Categories required", 400));

    const recipe = await Recipe.findById(id);

    if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

    for (let i = 0; i < categories.length; i++) {
      const category = await Category.findById(categories[i]);

      if (!category.recipes.includes(recipe._id)) {
        category.recipes.push(recipe._id);
      }

      await category.save();

      if (!recipe.categories.includes(categories[i])) {
        recipe.categories.push(categories[i]);
      }
    }

    await recipe.save();

    return res.status(200).json({
      recipe,
    });
  }
);

export const removeRecipeFromCategories = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { categories } = req.body;

    if (!categories || categories.length < 1)
      return next(new ErrorHandler("Categories required", 400));

    const recipe = await Recipe.findById(id);

    if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

    recipe.categories = recipe.categories.filter(
      (cat) => !categories.includes(cat.toString())
    );

    await recipe.save();

    for (let i = 0; i < categories.length; i++) {
      const category = await Category.findById(categories[i]);

      category.recipes = category.recipes.filter(
        (rec) => rec.toString() !== recipe._id.toString()
      );

      await category.save();
    }

    return res.status(200).json({
      recipe,
    });
  }
);

export const removeRecipeFromCategory = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) return next(new ErrorHandler("Category required", 400));

    const recipe = await Recipe.findById(id);

    if (!recipe) return next(new ErrorHandler("Recipe Not Found", 404));

    const choosenCategory = await Category.findById(category);

    if (!recipe) return next(new ErrorHandler("Category Not Found", 404));

    recipe.categories = recipe.categories.filter(
      (cat) => cat.toString() !== category.toString()
    );

    await recipe.save();

    choosenCategory.recipes = choosenCategory.recipes.filter(
      (rec) => rec.toString() !== recipe._id.toString()
    );

    await choosenCategory.save();

    return res.status(200).json({
      success: true,
      message: "Category removed successfully.",
    });
  }
);
