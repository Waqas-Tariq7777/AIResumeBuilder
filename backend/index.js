import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// 1. Configuration
dotenv.config({ path: "./.env" });

import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import aiRouter from "./routes/ai.routes.js";

const app = express();
const port = process.env.PORT || 4000;

// 2. Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set("json spaces", 2);

// 3. Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/ai", aiRouter);

// 4. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
});

app.get('/', (req,res)=>{
    res.send("hello")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then((connectionInstance) => {
    console.log(
      `MONGODB Connected Successfully !! Host: ${connectionInstance.connection.host}`,
    );

    // Start server only after DB connection succeeds
    app.listen(port, () => {
      console.log("Server is successfully running on port: ", port);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection Failed:", error);
  });
