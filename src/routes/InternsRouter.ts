import express from "express";
const router = express.Router();
import InternController from "../controllers/Intern.controller.js";



  router.get("/", InternController.getIntern);

  router.get("/:id", InternController.getInternById);
  
  router.delete("/:id", InternController.deleteIntern);
  
  router.post("/", InternController.addIntern);

  router.put("/:id", InternController.updateIntern);


export default router;