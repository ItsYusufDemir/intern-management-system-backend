import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';

const verifyJWT = (req, res, next) => {


    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token: any;
    if(authHeader){ //access token is in the header of the req
        if(!authHeader?.startsWith("Bearer ")) {
            console.log("izin verilmedi beraer ile başlamıyor")
             return res.sendStatus(401);
        }
        token = authHeader.split(' ')[1];
    }
    else if(req.query.access_token){ //access token is in the req url
        token = req.query.access_token;
    }
    else{
        console.log("izin verilmedi authheader yok", req.headers);
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
            req.user = decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            req.user_id = decoded.UserInfo.user_id
            console.log("izin verildi");
            next();
        }
    );
    
}

export default verifyJWT;