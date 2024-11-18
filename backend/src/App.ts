import express from "express";
import router from "./routes/Router";
import userRouter from "./routes/UserRouter";
import postRouter from "./routes/PostRouter";

// Initialize the app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/hello-world", router);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

export default app;
