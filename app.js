import express from "express";
import mongoose from "mongoose";
import buildRoutes from "./routes/build.route.js";
import cors from "cors";
import sessionRoutes from "./routes/session.route.js";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

swaggerJSDoc;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Line Tracker API",
      version: "1.0.0",
      description:
        "A comprehensive API for tracking production line builds and work sessions",
      contact: {
        name: "API Support",
        email: "support@productlinetracker.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Build: {
          type: "object",
          required: ["BuildNumber", "numberOfParts", "timePerPart"],
          properties: {
            BuildNumber: {
              type: "number",
              description: "Unique build identifier",
            },
            numberOfParts: {
              type: "number",
              description: "Total number of parts in the build",
            },
            timePerPart: {
              type: "number",
              description: "Time required per part in seconds",
            },
          },
        },
        Session: {
          type: "object",
          required: ["loginId", "buildNumber"],
          properties: {
            loginId: {
              type: "string",
              description: "User login identifier",
            },
            buildNumber: {
              type: "number",
              description: "Associated build number",
            },
            processingTime: {
              type: "number",
              description: "Total processing time in milliseconds",
            },
            isPaused: {
              type: "boolean",
              description: "Whether the session is currently paused",
            },
            startTime: {
              type: "string",
              format: "date-time",
              description: "When the session started",
            },
            endTime: {
              type: "string",
              format: "date-time",
              description: "When the session ended",
            },
            totalActiveTime: {
              type: "number",
              description: "Total active working time in milliseconds",
            },
            pauses: {
              type: "array",
              description:
                "List of pause intervals, and time exceeded popups activation",
            },
            totalInactiveTime: {
              type: "number",
              description: "Total pause time in milliseconds",
            },
            isActive: {
              type: "boolean",
              description: "Whether the session is currently active",
            },
            defects: {
              type: "number",
              description: "Number of defects found",
            },
            totalParts: {
              type: "number",
              description: "Total parts completed",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            msg: {
              type: "string",
              description: "User-friendly message",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
