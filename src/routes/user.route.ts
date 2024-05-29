import express from "express";
const router = express.Router();
import { test } from "../controller/user.controller";

router.get("/", test);

export default router;
