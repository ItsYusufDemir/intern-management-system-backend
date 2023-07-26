import pool from "../utils/database.js";
import { getStudentsQuery, getStudentByIdQuery, checkEmailExists, addStudentQuery, deleteStudentQuery, updateStudentQuery} from "../utils/queries.js";

const getStudent = (req, res) =>{
    pool.query(getStudentsQuery, (err, results) => {
        if(err) throw err;
        res.status(200).json(results.rows);
    })
}

const getStudentById = (req, res) =>{
    const id = req.params.id;;
    
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
    const { first_name, last_name, email, gender, date_of_birth, car_uid} = req.body;

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
}


const deleteStudent = (req, res) => {
    const id = req.params.id;

    pool.query(deleteStudentQuery, [id], (err, results) => {
        if(err){
            console.log("Error happened while deleting");
            res.end();
        }
        else{
            console.log("Student Deleted Successfully");
            res.end();
        }
    });

}

const updateStudent = (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, email, gender, date_of_birth, car_uid} = req.body;

    pool.query(getStudentByIdQuery, [id], (err, results) => {
        if(err) {
            console.log("Error happened while finding student by id");
            res.end();
        }
        else{
            const noStudentFound = !results.rows.length;
            if(noStudentFound) {
                console.log("Student Does Not Exist In the Database");
                res.send("Student Does Not Exist In the Database");
            }
            else{
                pool.query(updateStudentQuery, [id, first_name, last_name, email, gender, date_of_birth, car_uid], (err, results) => {
                    if(err) {
                        console.log("Error happened while updating student by id");
                        res.end();
                    }
                    else{
                        res.status(200).send("Student Updated Successfully");
                    }
                })
            }
        }


    });
}





export {
    getStudent,
    getStudentById,
    addStudent,
    deleteStudent,
    updateStudent,
}

