import express from "express";
const router = express.Router();
import { login, register, test } from "../controller/user.controller";

router.post("/register", register);
router.post("/login", login);
router.get("/", test);

export default router;
