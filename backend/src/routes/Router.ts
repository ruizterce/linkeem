import { Router } from "express";
import { getHelloWorld } from "../controllers/Controller";

const router = Router();

router.get("/", getHelloWorld);

export default router;
