import express from "express";
import dotenv from "dotenv";
import router from "./routes/Router";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/hello-world", router);

export default app;
