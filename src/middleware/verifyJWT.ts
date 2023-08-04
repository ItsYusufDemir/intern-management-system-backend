import jsonwebtoken from "jsonwebtoken";
import 'dotenv/config';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jsonwebtoken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403); //Invalid token
            req.user =decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            console.log("izin verildi");
            next();
        }
    );
    
}

export default verifyJWT;