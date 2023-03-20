import express from "express";
import userRoute from "./router/userRouter.js";
import recipeRoute from "./router/recipeRouter.js";
import otherRoute from "./router/otherRouter.js";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";

config({
  path: "./config/config.env",
});

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", recipeRoute);
app.use("/api/v1", otherRoute);

export default app;

app.use(ErrorMiddleware);
