import { Router } from "express";
import {
  findAllTreviews,
  findTreviewById,
  addNewTreeview,
  updateTreeview,
  deleteTreeview,
  relocateTreeview,
} from "../controllers/controllers";

const router = Router();

router.get("/treeviews", findAllTreviews);
router.get("/treeviews/:id", findTreviewById);
router.post("/treeviews", addNewTreeview);
router.put("/treeviews/:id", updateTreeview);
router.delete("/treeviews/:id", deleteTreeview);
router.put("/treeviews/:id/move", relocateTreeview);

export default router;
