import express from "express";
const router = express.Router();
import UploadController from "../controllers/Upload.controller.js";

router.post("/photos", UploadController.uploadPhoto);
router.post("/cv", UploadController.uploadCV);
router.get("/photos/:id", UploadController.getPhoto);
router.get("/cv/:id", UploadController.getCv);
router.delete("/cv/:fileName", UploadController.deleteCv);
router.delete("/photos/:fileName", UploadController.deletePhoto);



export default router;