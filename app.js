import express from "express";
import mongoose from "mongoose";
import buildRoutes from "./routes/build.route.js";
import cors from "cors";
import sessionRoutes from "./routes/session.route.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;

mongoose
  .connect(process.env.dbString)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/builds", buildRoutes);
app.use("/session", sessionRoutes);
