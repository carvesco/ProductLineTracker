import express from "express";
import mongoose from "mongoose";
import buildRoutes from "./routes/build.route.js";
const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://carvesco:eVKMjjmDe82SqzN1@productline.vpxncmg.mongodb.net/?retryWrites=true&w=majority&appName=ProductLine"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/builds", buildRoutes);
