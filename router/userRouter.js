import express from "express";
import {
  getUsers,
  register,
  login,
  logout,
  updateProfile,
  myProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/users").get(getUsers).post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, myProfile);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/changepassword").put(isAuthenticated, changePassword);

router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

export default router;
