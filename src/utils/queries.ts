const getStudentsQuery = "SELECT * FROM person";
const getStudentByIdQuery = "SELECT * FROM person WHERE person_uid = $1";  //$1 is the first parameter
const checkEmailExists = "SELECT s FROM person s WHERE s.email = $1";
const addStudentQuery = ("INSERT INTO person (person_uid, first_name, last_name, email, gender, date_of_birth, car_uid)" + 
"VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)");
const deleteStudentQuery = "DELETE FROM person WHERE person_uid = $1";
const updateStudentQuery = "UPDATE person SET first_name = $2, last_name = $3, email = $4, gender = $5, date_of_birth = $6, car_uid = $7 WHERE person_uid = $1";

export {
    getStudentsQuery,
    getStudentByIdQuery,
    checkEmailExists,
    addStudentQuery,
    deleteStudentQuery,
    updateStudentQuery,
}