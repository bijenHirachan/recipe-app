import express from "express";
import {
  addCategoriesToRecipe,
  addCategoryToRecipe,
  addIngredients,
  addNewCategory,
  addSteps,
  createRecipe,
  deleteRecipe,
  getAllCategories,
  getAllRecipes,
  getMyRecipes,
  removeRecipeFromCategories,
  removeRecipeFromCategory,
  getRecipe,
  addStep,
  deleteStep,
} from "../controllers/recipeController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import { ownsRecipe } from "../middlewares/ownsRecipe.js";

const router = express.Router();

router.route("/recipes").get(getAllRecipes);
router.route("/recipes/:id").get(getRecipe);
router.route("/myrecipes").get(isAuthenticated, getMyRecipes);
router.route("/createrecipe").post(isAuthenticated, singleUpload, createRecipe);
router
  .route("/deleterecipe/:id")
  .delete(isAuthenticated, ownsRecipe, deleteRecipe);
router.route("/createcategory").post(isAuthenticated, addNewCategory);
router.route("/allcategories").get(getAllCategories);

router.route("/recipe/:id/addsteps").put(isAuthenticated, ownsRecipe, addSteps);
router.route("/recipe/:id/addstep").put(isAuthenticated, ownsRecipe, addStep);
router
  .route("/recipe/:id/deletestep/:stepId")
  .delete(isAuthenticated, deleteStep);
router
  .route("/recipe/:id/addingredients")
  .put(isAuthenticated, ownsRecipe, addIngredients);
router
  .route("/recipe/:id/addcategory")
  .put(isAuthenticated, ownsRecipe, addCategoryToRecipe);
router
  .route("/recipe/:id/addcategories")
  .put(isAuthenticated, ownsRecipe, addCategoriesToRecipe);
router
  .route("/recipe/:id/removecategories")
  .put(isAuthenticated, ownsRecipe, removeRecipeFromCategories);
router
  .route("/recipe/:id/removecategory")
  .put(isAuthenticated, ownsRecipe, removeRecipeFromCategory);

export default router;
