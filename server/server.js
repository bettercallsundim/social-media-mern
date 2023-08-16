import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import helmet from "helmet";
import compression from "compression";
import multer from "multer";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
const app = express();

dotenv.config();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.get("/", (req, res) => {
      res.send("Hello from backend");
    });
    console.log("DB connected");
    app.listen(4000, console.log("Server started"));
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
