import express from "express";
const router = express.Router();
import UserController from "../controllers/User.controller.js";



//router.get("/:id", TeamController.getTeamById);
router.post("/", UserController.addUser);


export default router;