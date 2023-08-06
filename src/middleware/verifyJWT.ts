import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';

const verifyJWT = (req, res, next) => {

    console.log("req bura",req.url);

    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token: any;
    if(authHeader){ //access token is in the header of the req
        if(!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
        token = authHeader.split(' ')[1];
    }
    else if(req.query.access_token){ //access token is in the req url
        token = req.query.access_token;
    }
    else{
        return res.sendStatus(401); //There is no access token
    }
    

    jsonwebtoken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                console.log("Izin verilmedi");
                 return res.sendStatus(403); //Invalid token
            }
            req.user =decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            console.log("izin verildi");
            next();
        }
    );
    
}

export default verifyJWT;