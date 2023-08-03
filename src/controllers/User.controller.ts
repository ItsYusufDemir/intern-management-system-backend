import path, { dirname } from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import { fileURLToPath } from "url";
import brcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addUser = async (req, res) => {

    const {username, password, role} = req.body;

    try {
        const result = await pool.query(Queries.checkUserExistsQuery, [username]);
        if(result.rows.length) {
            console.log("User is aldeady exists!");
            res.status(409).json({'message': 'User is already exists!'}); //Conflict
        }
        else{
            const hashedPassword = await brcrypt.hash(password, 10);

            await pool.query(Queries.addUserQuery, [username, hashedPassword, role]);
            console.log("User created successfully");
            res.status(201).json({"success": 'New user ${username} created!'});
        }
    }
    catch (error){
        console.log(error);
        res.status(500).json({'message': error.message});
    }
}


const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await pool.query(Queries.getUserQuery, [username]);
        if(!response.rows.length) {
            console.log("User does not exists!")
            res.sendStatus(401); //unauthorized
        }
        else{
            const user = response.rows[0];

            const match = await brcrypt.compare(password, user.password);
            
            if(match) {
                console.log("user logged in");
            }
            else{
                res.sendStatus(401);
            }
        }

    }
    catch (error){
        console.log(error);
        res.status(500).json({'message': error.message});
    }


}


const UserController = {
    addUser: addUser,
    login: login,
}

export default UserController;