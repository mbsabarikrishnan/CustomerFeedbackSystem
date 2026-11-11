import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), ".env") });

const app = express();

// Middleware lets React call this backend and lets Express read JSON.
app.use(cors());
app.use(express.json());

// Simple route to check whether the backend is running.
app.get("/api/health", (req, res) => {
  res.json({ message: "Customer Feedback API is running" });
});

// All feedback endpoints begin with /api/feedback.
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Create server/.env from .env.example.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

startServer();
