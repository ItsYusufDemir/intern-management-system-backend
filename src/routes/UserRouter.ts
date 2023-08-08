import express from "express";
const router = express.Router();
import UserController from "../controllers/User.controller.js";



//router.get("/:id", TeamController.getTeamById);
router.post("/", UserController.addUser);
router.get("/", UserController.getUsers);
router.delete("/:username", UserController.deleteUser);


export default router;