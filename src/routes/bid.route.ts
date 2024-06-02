import express from "express";
import { verifyUser } from "../lib/verifyUser";
import { getBidsOnItem, placeBidOnItem } from "../controller/bid.controller";
const router = express.Router();

router.get("/:itemId/bids", getBidsOnItem);
router.post("/:itemId/bids", verifyUser, placeBidOnItem);

export default router;
