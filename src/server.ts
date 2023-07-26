import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import {Intern} from "./models/Intern.js";
import internsRouter from "./routes/internsRoute.js";


const app = express();

app.use(cors({
  credentials: true
}));

app.use(express.json());

app.use(morgan("dev"));


app.use(bodyParser.json()); //converts body to json

const server = http.createServer(app);

server.listen(5000, ()=>{
  console.log("Server running on port 5000");

  //conncec to db here
})

//Interns Router
app.use("/api/interns", internsRouter);


//Teams router


//Register: post /user

//Login: post /session

//logout: delete /session



//Invalid Router
app.use((req, res) => {
  res.json({ message: "Opps! Invalid" });
})









/*
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import {Intern} from "./models/Intern";


const app = express();

app.use(cors({
  credentials: true
}))

app.use(morgan("dev"));


app.use(bodyParser.json()); //converts body to json

const server = http.createServer(app);

server.listen(5000, ()=>{
  console.log("Server running on port 5000");
})

app.get("/interns", (req, res) =>{
  fs.readFile(__dirname + "/" + "/../data/interns.json", "utf8", (err, jsonString) =>{
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


app.post("/interns", (req, res) => {
  fs.readFile(__dirname + "/" + "/../data/interns.json", "utf8", (err, jsonString) =>{
    if(err) {
      console.log("json file couldn't be read");
      res.end();
    }
    else{
      let interns:Intern[] = JSON.parse(jsonString) 
      
      let newIntern: Intern = req.body;
      interns.push(newIntern);


      fs.writeFile( __dirname + "/../data/interns.json", JSON.stringify(interns), (err) => {
          if (err) {
            console.log("Error writing file:", err);
            res.status(500).send("Error writing file");
            return;
          }

          res.json({ message: "Intern added successfully" });
        }
      );

    }
  });


});





*/

















