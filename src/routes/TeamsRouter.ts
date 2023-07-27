import express from "express";
const router = express.Router();
import TeamController from "../controllers/Team.controller.js";

router.get("/", TeamController.getTeam);
router.get("/:id", TeamController.getTeamById);
router.delete("/:id", TeamController.deleteTeam);
router.post("/", TeamController.addTeam);
router.put("/:id", TeamController.updateTeam)

export default router;