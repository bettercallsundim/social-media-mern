import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();

//middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://social-media-mern-lemon.vercel.app",
      "http://192.168.1.7:3000",
    ],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

//db connection
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
