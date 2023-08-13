//Intern Queries
const getInternsQuery = "SELECT * FROM interns";
const getInternByIdQuery = "SELECT * FROM interns WHERE intern_id = $1";  //$1 is the first parameter
const checkEmailExists = "SELECT s FROM interns s WHERE s.email = $1";
const addInternQuery = ("INSERT INTO interns (first_name, last_name, id_no, phone_number, email, uni, major, grade, gpa, team_id, birthday, internship_starting_date, internship_ending_date, cv_url, photo_url, overall_success)" + 
"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;");
const deleteInternQuery = "DELETE FROM interns WHERE intern_id = $1";
const updateInternQuery = "UPDATE interns SET first_name = $2, last_name = $3, id_no = $4, phone_number = $5, email = $6, uni = $7, major = $8, grade = $9, gpa = $10, team_id = $11, birthday = $12, internship_starting_date = $13, internship_ending_date = $14, cv_url = $15, photo_url = $16, overall_success = $17 WHERE intern_id = $1";

//Team Queries
const getTeamsQuery = "SELECT * FROM teams";
const getTeamByIdQuery = "SELECT * FROM teams WHERE team_id = $1";  //$1 is the first parameter
const checkTeamExists = "SELECT s FROM teams s WHERE s.team_name = $1";
const addTeamQuery = ("INSERT INTO teams (team_name)" + 
"VALUES ($1) RETURNING *;");
const deleteTeamQuery = "DELETE FROM teams WHERE team_name = $1";
const updateTeamQuery = "UPDATE teams SET team_name = $2 WHERE team_id = $1";

//User Queries
const addUserQuery = ("INSERT INTO users (username, password, role)" + 
"VALUES ($1, $2, $3) RETURNING user_id");
const checkUserExistsQuery = "SELECT s FROM users s WHERE s.username = $1";
const getUserQuery = "SELECT * FROM users WHERE username = $1";
const addRefreshToken = "UPDATE users SET refresh_token = $2 WHERE username = $1";
const getUserByRefreshToken = "SELECT * FROM users WHERE refresh_token = $1";
const deleteRefreshTokenQuery = "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1"
const addSupervisorQuery = ("INSERT INTO supervisors (user_id, team_id)" + 
"VALUES ($1, $2)");
const getUsersQuery = "SELECT u.*, s.team_id AS team_id FROM users u LEFT JOIN supervisors s ON u.user_id = s.user_id";
const deleteUserQuery = "DELETE FROM users WHERE user_id = $1";
const deleteSupervisorQuery = "DELETE FROM supervisors WHERE user_id = $1";
const updateUserQuery = "UPDATE users SET username = $2, password = $3, role = $4  WHERE user_id = $1"

//Assignment Queries
const getAssignmentsQuery = "SELECT * FROM assignments";
const getAssignmentsByInternIdQuery = "SELECT * FROM assignments WHERE intern_id = $1";
const addAssignmentQuery = "INSERT INTO assignments (intern_id, description, deadline, weight, complete)" +
"VALUES ($1, $2, $3, $4, $5) RETURNING assignment_id";
const updateAssignmentQuery = "UPDATE assignments SET intern_id = $2, description = $3, deadline = $4, grade = $5, weight = $6, complete = $7 WHERE assignment_id = $1";
const deleteAssignmentQuery = "DELETE FROM assignments WHERE assignment_id = $1 RETURNING intern_id";

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
    addSupervisorQuery: addSupervisorQuery,
    getUsersQuery: getUsersQuery,
    deleteUserQuery: deleteUserQuery,
    deleteSupervisorQuery: deleteSupervisorQuery,
    updateUserQuery: updateUserQuery,

    getAssignmentsQuery: getAssignmentsQuery,
    getAssignmentsByInternIdQuery: getAssignmentsByInternIdQuery,
    addAssignmentQuery: addAssignmentQuery,
    updateAssignmenQuery: updateAssignmentQuery,
    deleteAssignmentQuery: deleteAssignmentQuery,
}

export default Queries;