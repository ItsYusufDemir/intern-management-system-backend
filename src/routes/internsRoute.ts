import express from "express";
const router = express.Router();
import fs from "fs";
import {Intern} from "../models/Intern.js";
import {getStudent, getStudentById, addStudent} from "../controllers/user.controller.js";


  router.get("/", getStudent);

  router.get("/:id", getStudentById);
  
  router.delete("/:id", (req, res) =>{
    const id = req.params.id;
  
    console.log("Delete intern with id: ", id);
  
    res.end();
  })
  
  router.post("/", addStudent);


export default router;