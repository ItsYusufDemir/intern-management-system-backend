import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import internsRoute from "./routes/InternsRouter.js";
import teamsRoute from "./routes/TeamsRouter.js";
import uploadRouter from "./routes/UploadRouter.js";
import userRouter from "./routes/UserRouter.js";
import loginRouter from "./routes/LoginRouter.js";
import logout from "./routes/logout.js";
import fileUpload from "express-fileupload";
import chalk from 'chalk';
import { emptyGarbegeFolder } from "./utils/garbage.js";
import verifyJWT from "./middleware/verifyJWT.js";
import cookieParser from "cookie-parser";
import verifyRole from "./middleware/verifyRole.js";
import ROLES_LIST from "../roles_list.js";

const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.raw({ limit: '50mb', type: 'application/octet-stream' }));
app.use(fileUpload());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Allow sending cookies and other credentials
};


//middleware for cookies
app.use(cookieParser());


app.use(cors(corsOptions));

app.use(express.json());

//Print coming requests to the console
app.use(morgan(function (tokens, req, res){
  return [
    "\n",
    chalk.hex('#1946BD').bold(tokens.method(req, res)),
    chalk.hex("#3A5FE9")(tokens.url(req, res)),
    chalk.hex("#2ed573").bold(tokens.status(req, res)),
    chalk.white(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold(' ' + tokens.date(req, res)),
  ].join(" ");
}));


app.use(bodyParser.json()); //converts body to json

emptyGarbegeFolder(); //Empty garbage folder while starting

const server = http.createServer(app);

server.listen(5000, ()=>{
  console.log("Server running on port 5000");
})



app.use("/auth", loginRouter); //Login
app.use("/refresh", loginRouter); //Refresh access token
app.use("/logout", logout); //Logout

//Verify before fetching data
app.use(verifyJWT);

//Interns Router
app.use("/api/interns", verifyRole(ROLES_LIST.Admin, ROLES_LIST.Supervisor), internsRoute);

//Teams router
app.use("/api/teams", verifyRole(ROLES_LIST.Admin, ROLES_LIST.Supervisor), teamsRoute);

//Register: post /user
app.use("/api/users", verifyRole(ROLES_LIST.Admin), userRouter);


//Uploads
app.use("/uploads", verifyRole(ROLES_LIST.Admin, ROLES_LIST.Supervisor), uploadRouter);






//Invalid Router
app.use((req, res) => {
  res.json({ message: "Opps! Invalid" });
})
