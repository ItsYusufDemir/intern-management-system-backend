import path, { dirname } from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import { fileURLToPath } from "url";
import brcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';
import { decode } from "punycode";

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
                //create jwt
                const role = user.role;

                const accessToken = jsonwebtoken.sign(
                    { 
                        "UserInfo": {
                        "username": user.username,
                        "role": user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {'expiresIn': '15s'}
                );

                const refreshToken = jsonwebtoken.sign(
                    {'username': user.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    {'expiresIn': '30s'} //1 day
                );

                //Add jwt to the user
                await pool.query(Queries.addRefreshToken, [user.username, refreshToken]);

                console.log("User logged in");
                res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); //maxAge: 1 day
                res.json({accessToken, role});
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


const hadnleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    
    try {
        if(!cookies?.jwt) {
            return res.sendStatus(401); //unauthorized
        }
        
        
        const refreshToken = cookies.jwt;
        const response = await pool.query(Queries.getUserByRefreshToken, [refreshToken]);
        if(!response.rows.length) {
            console.log(4);
            console.log("User does not exists!")
            return res.sendStatus(403); //Forbidden
        }
        
        const user = response.rows[0];

            
        jsonwebtoken.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err || user.username !== decoded.username){
                    return res.sendStatus(403);
                } 
                const accessToken = jsonwebtoken.sign(
                    { 
                        "UserInfo": {
                        "username": user.username,
                        "role": user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {'expiresIn': '15s'}

                );
                return res.json({accessToken});
            }
        )
        
               
                
        

    }
    catch (error){
        console.log(error);
        res.status(500).json({'message': error.message});
    }


}

const handleLogout = async (req, res) => {
    //On client, also delete the accessToken

    const cookies = req.cookies;

    try {
        if(!cookies?.jwt) {
            return res.sendStatus(204); //No content
        }
        
        const refreshToken = cookies.jwt;
        const response = await pool.query(Queries.getUserByRefreshToken, [refreshToken]);
        if(!response.rows.length) {
            res.clearCookie("jwt", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            return res.sendStatus(204);
        }
        
        //Delete the refreshToken in dt
        await pool.query(Queries.deleteRefreshTokenQuery, [refreshToken]);

        console.log("User logged out");
        res.clearCookie("jwt", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); //secure: true - only servers on https
        return res.sendStatus(204);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }


}






const UserController = {
    addUser: addUser,
    login: login,
    hadnleRefreshToken: hadnleRefreshToken,
    handleLogout: handleLogout,
}

export default UserController;