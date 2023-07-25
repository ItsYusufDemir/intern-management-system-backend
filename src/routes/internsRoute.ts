import express from "express";
const router = express.Router();
import fs from "fs";
import {Intern} from "../models/Intern";

router.get("/", (req, res) =>{
    fs.readFile(__dirname + "/" + "/../../data/interns.json", "utf8", (err, jsonString) =>{
      if(err){
        console.log("json file couldn't be read");
        res.end();
      }
      else{
        let interns:Intern[] = JSON.parse(jsonString) 
        console.log(interns);
            
        res.end(jsonString);
      }
    })
  })
  router.get("/:id", (req, res) =>{
    const id = req.params.id;
  
    console.log("Get intern with id: ", id);
  
    res.end();
  })
  
  router.delete("/:id", (req, res) =>{
    const id = req.params.id;
  
    console.log("Delete intern with id: ", id);
  
    res.end();
  })
  
  router.post("/", (req, res) => {
    
    const newIntern: Intern = req.body;
  
    console.log(newIntern);
  
    res.end();
  });


export default router;