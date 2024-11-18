import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, Linkeem!");
});

// Server configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
