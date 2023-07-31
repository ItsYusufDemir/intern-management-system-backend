import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import {v4 as uuidvv4 } from "uuid";
import { get } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', "uploads"); //The path of the uploads file which stores photos and cvs of interns


const uploadPhoto = (req, res) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No photo uploaded");
        return res.status(400).json({ message: "No photo uploaded" });
    }

    const photoFile = req.files.file;

    const uploadDir = path.resolve(__dirname, '..', "uploads/photos");

    const extension = photoFile.name.split('.').pop();
    const uniqueFilename = uuidvv4() + "." + extension;

    const imagePath = path.join(uploadDir, uniqueFilename);

    photoFile.mv(imagePath, (error) => {
        if(error) {
            console.log("Error uploading photo");
            return res.status(500).json({message: "Error uploading photo"});
        }

        const photo_url = "http://localhost:5000/uploads/photos/" + uniqueFilename;
        return res.json({photo_url});
    })
}


const uploadCV = (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
    }

    const cvFile = req.files.file;

    const uploadDir = path.resolve(__dirname, '..', "uploads/cv");

    const extension = cvFile.name.split('.').pop();
    const uniqueFilename = uuidvv4() + "." + extension;

    
    const imagePath = path.join(uploadDir, uniqueFilename);

    cvFile.mv(imagePath, (error) => {
        if(error) {
            console.log("Error uploading CV");
            return res.status(500).json({message: "Error uploading CV"});
        }

        const cv_url = "http://localhost:5000/uploads/cv/" + uniqueFilename;
        console.log(cv_url);
        return res.json({cv_url});
    })

}

const getPhoto = (req, res) => {
    const photoId = req.params.id;

    const photoPath = path.join(uploadDir, ("photos/" + photoId));

    if(!fs.existsSync(photoPath)){
        console.log("Photo not found");
        res.status(404).json({message: "Photo not found"});
    }

    res.sendFile(photoPath);
}

const getCv = (req, res) => {
    const cvId = req.params.id;

    const cvPath = path.join(uploadDir, ("cv/" + cvId));

    if(!fs.existsSync(cvPath)){
        console.log("CV not found");
        res.status(404).json({message: "CV not found"});
    }
    
    res.sendFile(cvPath);
}


const deleteCv = (req, res) => {

    const fileName = req.params.fileName;
    
    const filePath = path.join(uploadDir,"cv/", fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if(err) {
            console.log("cv not found");
            return res.status(404).json({ message: "CV not found" });
        }
    });

    fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting CV");
          return res.status(500).json({ message: "Error deleting CV"});
        }
      
        res.json({ message: "CV deleted successfully" });
    });

}

const deletePhoto = (req, res) => {

    const fileName = req.params.fileName;
    
    const filePath = path.join(uploadDir,"photos/", fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if(err) {
            console.log("Photo not found");
            return res.status(404).json({ message: "Photo not found" });
        }
        
    });

    fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting photo");
          return res.status(500).json({ message: "Error deleting photo"});
        }
      
        res.json({ message: "Photo deleted successfully" });
    });
}



const UploadController = {
    uploadPhoto: uploadPhoto,
    uploadCV: uploadCV,
    getPhoto: getPhoto,
    getCv: getCv,
    deleteCv: deleteCv,
    deletePhoto: deletePhoto,
}

export default UploadController;