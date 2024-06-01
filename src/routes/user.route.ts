import express from "express";
const router = express.Router();
import { login, profile, register } from "../controller/user.controller";
import { verifyUser } from "./../lib/verifyUser";

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", verifyUser, profile);

export default router;
