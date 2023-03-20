import express from "express";
import { getStats } from "../controllers/otherController.js";

const router = express.Router();

router.route("/stats").get(getStats);

export default router;
