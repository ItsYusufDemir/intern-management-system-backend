import pool from "../utils/database.js";


const addRequest = async (req, res) => {

    const { document_name } = req.body;

    try {

        const checkResponse = await pool.query("SELECT * FROM document_requests WHERE document_name = $1", [document_name]);
        if(checkResponse.rows.length !== 0) {
            return res.sendStatus(403); //Forbidden
        } 

        await pool.query("INSERT INTO document_requests (document_name) VALUES ($1)", [document_name]);

        return res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const deleteRequest = async (req, res) => {

    const id = req.params.id;

    try {
        await pool.query("DELETE FROM document_requests WHERE id = $1 ", [id]);

        return res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const getRequests = async (req, res) => {


    try {
        const requestsResponse = await pool.query("SELECT * FROM document_requests");
        const requests = requestsResponse.rows;

        return res.status(200).json(requests);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}


const DocumentRequestController = {
    addRequest: addRequest,
    deleteRequest: deleteRequest,
    getRequests: getRequests,
}

export default DocumentRequestController;