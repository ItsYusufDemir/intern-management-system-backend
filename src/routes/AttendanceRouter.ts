import express from "express";
import AttendanceController from "../controllers/Attendance.controller.js";
const router = express.Router();


router.post("/", AttendanceController.takeAttendance);
router.get("/:intern_id", AttendanceController.getAttendancesForIntern);


export default router;
