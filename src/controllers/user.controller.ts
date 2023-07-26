import pool from "../utils/database.js";
import { getStudentsQuery, getStudentByIdQuery, checkEmailExists, addStudentQuery } from "../utils/queries.js";

const getStudent = (req, res) =>{
    pool.query(getStudentsQuery, (err, results) => {
        if(err) throw err;
        res.status(200).json(results.rows);
    })
}

const getStudentById = (req, res) =>{
    const id = req.params.id;
    console.log(id);
    
    pool.query(getStudentByIdQuery, [id], (err, results) => {
        if(err){
            console.log("Student could not found");
            res.end();
        }
        else{
            res.status(200).json(results.rows);
        }
    })
    
}

const addStudent = (req, res) => {
    const {person_uid, first_name, last_name, email, gender, date_of_birth, car_uid} = req.body;

    //Check if e mail exits
    pool.query(checkEmailExists, [email], (err, results) => {
        if(err){
            console.log("Could not check email exitst or not!");
            res.end();
        }
        else{
            if(results.rows.length) {
                console.log("Student with given email is already exists");
                res.end();
            }
            else{
                //Add the student to the database
                pool.query(addStudentQuery, [first_name, last_name, email, gender, date_of_birth, car_uid], (err, results) =>{
                    if(err){
                        console.log("Error happened while adding student");
                        res.end();
                    }
                    else{
                        console.log("Student Created Successfully");
                        res.status(201).send("Student Created Successfully");
                    }
                });
            }
        }

    });
};


export {
    getStudent,
    getStudentById,
    addStudent
}

