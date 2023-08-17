import path from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import crypto from "crypto";
import brcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { Intern } from "../models/Intern.js";
import UserController from "./User.controller.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const acceptMessage = "We'd like to tell you that your internship has been accepted! You can login from http://localhost:3000/login to your new account. We recommend you to change your password and then you can upload the required files. We wish success during this period :)\n"


const addApplication = async (req, res) => {
    const {first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success} = req.body;

    const date = Math.round(new Date().valueOf() / 1000);

    try {

        const check = await pool.query(Queries.checkEmailExists, [email]);

        if(check.rows.length !== 0){
            return res.sendStatus(409); //Conflict
        }

        const check2 = await pool.query("SELECT * FROM applications WHERE email = $1", [email]);

        if(check2.rows.length !== 0){
            return res.sendStatus(409); //Conflict
        }

        await pool.query(Queries.addApplicationQuery, ["waiting", date, first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success]);



        if(cv_url !== null){ //If the intern is added, then move the file from garbage
            const fileName = cv_url.split("/").pop()
    
            const sourceFilePath = path.join(__dirname, "../uploads/garbage", fileName);
            const destination = path.join(__dirname, "../uploads/cv", fileName);
            
            fs.rename(sourceFilePath, destination, (error) => {
                if(error){
                    console.log("Error while moving CV from garbage");
                }
            });
    
        }
    
        if(photo_url !== null){ //If the intern is added, then move the file from garbage
            const fileName = photo_url.split("/").pop()
    
            const sourceFilePath = path.join(__dirname, "../uploads/garbage", fileName);
            const destination = path.join(__dirname, "../uploads/photos", fileName);
            
            fs.rename(sourceFilePath, destination, (error) => {
                if(error){
                    console.log("Error while moving photo from garbage");
                }
            });
        }

        
        return res.sendStatus(200);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }


    
}

const getApplications = async (req, res) => {

    try {
        const response = await pool.query(Queries.getApplicationsQuery);

        return res.status(200).json(response.rows);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }
}

const deleteApplication = async (req, res) => {
    const application_id = req.params.applications_id

    try {
        await pool.query(Queries.deleteApplicationQuery, [application_id]);

        return res.sendStatus(200);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }
}

const rejectApplication = async (req, res) => {
    const application_id = req.params.applications_id;

    try {
        const response = await pool.query(Queries.rejectApplicationQuery, [application_id]);
        const email = response.rows[0].email;

        
        const response2 = await pool.query("DELETE FROM interns WHERE email = $1 RETURNING *", [email]);
        const intern = response2.rows[0];
 
        if(intern) {
            await pool.query("DELETE FROM users WHERE username = $1", [(intern.first_name + "." + intern.last_name)]);
        }
        
   
        return res.sendStatus(200);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }
}

const acceptApplication = async (req, res) => {
    const application_id = req.params.applications_id

    try {
        const results = await pool.query(Queries.acceptApplicationQuery, [application_id]);
        await pool.query(Queries.updateApplicationStatusQuery, [application_id]);

        const intern: Intern = results.rows[0];
        const randomPassword = generateRandomPassword(8);
        const hashedPassword = await brcrypt.hash(randomPassword, 10);

        //Add a new user
        const newUser: User = {
            username: (intern.first_name + "." + intern.last_name),
            password: randomPassword,
            role: 2001,
        };

        await pool.query(Queries.addUserQuery, [newUser.username, hashedPassword, newUser.role]);

        await sendPasswordEmail(intern.email, newUser.username, randomPassword);
        
        return res.sendStatus(200);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({'message': error.message});
    }
}

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const password = Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((byte) => characters[byte % characters.length])
      .join('');
  
    return password;
}


async function sendPasswordEmail(internEmail, username,  password) {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'internmanagementsystem@gmail.com',
        pass: 'apybtnqgppcesdvg',
      },
    });
  
    // Send email
    const mailOptions = {
      from: 'internmanagementsystem@gmail.com',
      to: internEmail,
      subject: 'Congratulations: Your Internship has been Accepted ',
      text: `${acceptMessage}\n Your username is: ${username}\n Your new password is: ${password}`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent to: ', internEmail);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }






const ApplicationController = {
    addApplication: addApplication,
    deleteApplication: deleteApplication,
    getApplications: getApplications,
    rejectApplication: rejectApplication,
    acceptApplication: acceptApplication,

}

export default ApplicationController;