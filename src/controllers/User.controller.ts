import path, { dirname } from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addUser = (req, res) => {

    const {name, pwd, role} = req.body;

    pool.query(Queries.checkUserExists, [name], (err,results) => {
        if(err){
            console.log("Error happened while checking user");
            res.end();
        }
        else{
            if(results.rows.length){
                console.log("User is aldready exists");
                res.status(400).json();
            }
            else{
                pool.query(Queries.addUserQuery, [name, pwd, role], (err, results) =>{
                    if(err){
                        console.log("Error happened while adding user");
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("User Created Successfully");
                        res.end()
                    }
                });
            }
        }
    })

   


}


const UserController = {
    addUser: addUser,
}

export default UserController;