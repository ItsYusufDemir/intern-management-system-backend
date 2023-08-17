import path, { dirname } from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import { fileURLToPath } from "url";
import fs from "fs";
import { Intern } from "../models/Intern.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getIntern = (req, res) =>{
    pool.query(Queries.getInternsQuery, (err, results) => {
        if(err) throw err;
        res.status(200).json(results.rows);
    })
}

const getInternById = (req, res) =>{
    const id = req.params.id;
    
    pool.query(Queries.getInternByIdQuery, [id], (err, results) => {
        if(err){
            console.log("Intern could not found");
            res.end();
        }
        else{
            if(results.rows.length == 0){
                console.log("Intern does not exist with id: " + id);
                res.send("Intern does not exist with id: " + id);
            }
            else{
                res.status(200).json(results.rows);
            }
        }
    })
    
}

const addIntern = (req, res) => {
    const {first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success} = req.body;

    //Check if e mail exits
    pool.query(Queries.checkEmailExists, [email], (err, results) => {
        if(err){
            console.log("Could not check email exitst or not!");
            return res.end();
        }
        else{
            if(results.rows.length) {
                console.log("Intern with given email is already exists");
                return res.sendStatus(409);
            }
            else{
                //Add the intern to the database
                pool.query(Queries.addInternQuery, [first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success], (err, results) =>{
                    if(err){
                        console.log("Error happened while adding intern");
                        console.log(err);
                        return res.end();
                    }
                    else{
                        console.log("Intern Created Successfully");
                         return res.status(201).json(results.rows[0]);
                    }
                });
            }
        }

    });

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



}


const deleteIntern = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(Queries.deleteInternQuery, [id]);
        const intern: Intern = result.rows[0];
        const username = intern.first_name + "." + intern.last_name;

        await pool.query(Queries.deleteAttendancesQuery, [id]);

        await pool.query(Queries.deleteAssignmentsQuery, [id]);

        await pool.query("DELETE FROM users WHERE username = $1", [username]);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    

}

const updateIntern = (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success} = req.body;

    pool.query(Queries.getInternByIdQuery, [id], (err, results) => {
        if(err) {
            console.log("Error happened while finding intern by id");
            res.end();
        }
        else{
            const noStudentFound = !results.rows.length;
            if(noStudentFound) {
                console.log("Intern Does Not Exist In the Database");
                res.send("Intern Does Not Exist In the Database");
            }
            else{
                pool.query(Queries.updateInternQuery, [id, first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success], (err, results) => {
                    if(err) {
                        console.log("Error happened while updating intern by id");
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("Intern Updated Successfully");
                        res.status(200).send("Intern Updated Successfully");
                    }
                })
            }
        }

    });

    console.log("buraya iniyor mu?", cv_url, photo_url);
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
}



const InternController = {
    getIntern: getIntern,
    getInternById: getInternById,
    addIntern: addIntern,
    deleteIntern: deleteIntern,
    updateIntern: updateIntern
}

export default InternController;

