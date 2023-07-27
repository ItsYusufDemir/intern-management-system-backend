import pool from "../utils/database.js";
import Queries from "../utils/queries.js";

const getTeams = (req, res) =>{
    pool.query(Queries.getTeamsQuery, (err, results) => {
        if(err) throw err;
        res.status(200).json(results.rows);
    })
}

const getTeamById = (req, res) =>{
    const id = req.params.id;;
    
    pool.query(Queries.getTeamByIdQuery, [id], (err, results) => {
        if(err){
            console.log("Team could Not found!");
            res.end();
        }
        else{
            if(results.rows.length == 0){
                console.log("Team does not exist with id: " + id);
                res.send("Team does not exist with id: " + id);
            }
            else{
                res.status(200).json(results.rows);
            }
        }
    })
    
}

const addTeam = (req, res) => {
    const {team_name, assignments, team_success} = req.body;

    //Check if same team exits
    pool.query(Queries.checkTeamExists, [team_name], (err, results) => {
        if(err){
            console.log("Could not check team exitst or not!");
            res.end();
        }
        else{
            if(results.rows.length) {
                console.log("Team with given team_name is already exists");
                res.end();
            }
            else{
                //Add the team to the database
                pool.query(Queries.addTeamQuery, [team_name, assignments, team_success], (err, results) =>{
                    if(err){
                        console.log("Error happened while adding team");
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("Team created successfully");
                        res.status(201).json(results.rows[0]);
                    }
                });
            }
        }

    });
}


const deleteTeam = (req, res) => {
    const id = req.params.id;

    pool.query(Queries.deleteTeamQuery, [id], (err, results) => {
        if(err){
            console.log("Error happened while deleting");
            res.end();
        }
        else{
            console.log("Intern Deleted Successfully");
            res.end();
        }
    });

}

const updateTeam = (req, res) => {
    const id = req.params.id;
    const { team_name, assignments, team_success} = req.body;

    pool.query(Queries.getTeamByIdQuery, [id], (err, results) => {
        if(err) {
            console.log("Error happened while finding team by id");
            res.end();
        }
        else{
            const noTeamFound = !results.rows.length;
            if(noTeamFound) {
                console.log("Team Does Not Exist In the Database");
                res.send("Team Does Not Exist In the Database");
            }
            else{
                pool.query(Queries.updateTeamQuery, [id, team_name, assignments, team_success], (err, results) => {
                    if(err) {
                        console.log("Error happened while updating team by id");
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("Team Updated Successfully");
                        res.status(200).send("Team Updated Successfully");
                    }
                })
            }
        }


    });
}



const TeamController = {
    getTeam: getTeams,
    getTeamById: getTeamById,
    addTeam: addTeam,
    deleteTeam: deleteTeam,
    updateTeam: updateTeam
}

export default TeamController;
