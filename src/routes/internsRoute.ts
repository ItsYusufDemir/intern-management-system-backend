import express from "express";
const router = express.Router();
import fs from "fs";
import {Intern} from "../models/Intern.js";
import {getStudent, getStudentById, addStudent, deleteStudent, updateStudent} from "../controllers/user.controller.js";


  router.get("/", getStudent);

  router.get("/:id", getStudentById);
  
  router.delete("/:id", deleteStudent);
  
  router.post("/", addStudent);

  router.put("/:id", updateStudent);


export default router;