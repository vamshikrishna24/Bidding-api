import express from "express";
import { verifyUser } from "../lib/verifyUser";
import {
  markAllasRead,
  retrieveNotifications,
} from "../controller/notification.controller";
const router = express.Router();

router.get("/", verifyUser, retrieveNotifications);
router.post("/mark-read", verifyUser, markAllasRead);

export default router;
