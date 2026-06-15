import express from "express";
import {
  authMe,
  blockAndReportUser,
  changePassword,
  deleteAccount,
  searchUserByUsername,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);
router.patch("/me", updateProfile);
router.patch("/password", changePassword);
router.post("/block-report", blockAndReportUser);
router.delete("/me", deleteAccount);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export default router;
