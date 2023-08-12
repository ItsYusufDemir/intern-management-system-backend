import express from "express";
const router = express.Router();
import InternController from "../controllers/Assignment.controller.js";
import AssignmentController from "../controllers/Assignment.controller.js";

router.post("/", AssignmentController.addAssignment);
router.put("/", AssignmentController.updateAssignment);
router.get("/:intern_id", AssignmentController.getAssignmentsForIntern);
router.delete("/:assignment_id", AssignmentController.deleteAssignment);

export default router;
