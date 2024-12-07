import express from "express";
import passport from "passport";
import "./config/passportConfig";
import cors from "cors";
import router from "./routes/Router";
import userRouter from "./routes/UserRouter";
import postRouter from "./routes/PostRouter";
import commentRouter from "./routes/CommentRouter";
import AuthRouter from "./routes/AuthRouter";
import SupportRouter from "./routes/SupportRouter";
import path from "path";

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/hello-world", router);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/support", SupportRouter);

export default app;
