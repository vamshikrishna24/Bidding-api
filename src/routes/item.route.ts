import express from "express";
import { verifyUser } from "../lib/verifyUser";
import {
  deleteItem,
  getItems,
  getItemsById,
  postItem,
  updateItem,
} from "../controller/item.controller";
const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItemsById);
router.post("/", verifyUser, postItem);
router.put("/:id", verifyUser, updateItem);
router.delete("/:id", verifyUser, deleteItem);

export default router;
