//Intern Queries
const getInternsQuery = "SELECT * FROM interns";
const getInternByIdQuery = "SELECT * FROM interns WHERE intern_id = $1";  //$1 is the first parameter
const checkEmailExists = "SELECT s FROM interns s WHERE s.email = $1";
const addInternQuery = ("INSERT INTO interns (first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success, assignment_grades)" + 
"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *;");
const deleteInternQuery = "DELETE FROM interns WHERE intern_id = $1";
const updateInternQuery = "UPDATE interns SET first_name = $2, last_name = $3, id_no = $4, phone_number = $5, email = $6, uni = $7, major = $8, grade = $9, gpa = $10, team_id = $11, birthday = $12, internship_starting_date = $13, internship_ending_date = $14, cv_url = $15, photo_url = $16, overall_success = $17, assignment_grades = $18 WHERE intern_id = $1";

//Team Queries
const getTeamsQuery = "SELECT * FROM teams";
const getTeamByIdQuery = "SELECT * FROM teams WHERE team_id = $1";  //$1 is the first parameter
const checkTeamExists = "SELECT s FROM teams s WHERE s.team_name = $1";
const addTeamQuery = ("INSERT INTO teams (team_name, assignments, team_success)" + 
"VALUES ($1, $2, $3) RETURNING *;");
const deleteTeamQuery = "DELETE FROM teams WHERE team_id = $1";
const updateTeamQuery = "UPDATE teams SET team_name = $2, assignments = $3, team_success = $4 WHERE team_id = $1";

//User Queries
const addUserQuery = ("INSERT INTO users (username, password, role)" + 
"VALUES ($1, $2, $3);");
const checkUserExistsQuery = "SELECT s FROM users s WHERE s.username = $1";
const getUserQuery = "SELECT * FROM users WHERE username = $1";
const addRefreshToken = "UPDATE users SET refresh_token = $2 WHERE username = $1";
const getUserByRefreshToken = "SELECT * FROM users WHERE refresh_token = $1";
const deleteRefreshTokenQuery = "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1"




const Queries = {
    getInternsQuery: getInternsQuery ,
    getInternByIdQuery: getInternByIdQuery,
    checkEmailExists: checkEmailExists,
    addInternQuery: addInternQuery,
    deleteInternQuery: deleteInternQuery ,
    updateInternQuery: updateInternQuery,

    getTeamsQuery: getTeamsQuery,
    getTeamByIdQuery: getTeamByIdQuery,
    checkTeamExists: checkTeamExists,
    addTeamQuery: addTeamQuery,
    deleteTeamQuery: deleteTeamQuery,
    updateTeamQuery: updateTeamQuery,

    addUserQuery: addUserQuery,
    checkUserExistsQuery: checkUserExistsQuery,
    getUserQuery: getUserQuery,
    addRefreshToken: addRefreshToken,
    getUserByRefreshToken: getUserByRefreshToken,
    deleteRefreshTokenQuery: deleteRefreshTokenQuery,
}

export default Queries;