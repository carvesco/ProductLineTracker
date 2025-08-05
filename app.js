import express from "express";
import mongoose from "mongoose";
import buildRoutes from "./routes/build.route.js";
import sessionRoutes from "./routes/session.route.js";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/builds", buildRoutes);
app.use("/session", sessionRoutes);
