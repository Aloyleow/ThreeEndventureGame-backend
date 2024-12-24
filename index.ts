import dotenv from "dotenv";
import express, { type Application} from "express";
import morgan from "morgan";
import cors from "cors";

// import verifyJsonToken from "./middlewares/verifyJsonToken";

// import signupRouter from "./controllers/userSignupController"
// import loginRouter from "./controllers/userLoginController"
// import forgetPassRouter from "./controllers/userForgetPassController"
// import changePassRouter from "./controllers/userChangePassController"
// import charactersRouter from "./controllers/charactersController"
// import warriorRouter from "./controllers/gameScaffoldController"

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());

// app.use("/api/user", 
//   signupRouter, 
//   loginRouter,
//   forgetPassRouter
// );

// app.use("/api/user/verified",
//   changePassRouter,
//   charactersRouter
// );

// app.use(verifyJsonToken)

// app.use("/api/user/verified/start", 
//   warriorRouter
// );


app.listen(port, () =>{
  console.log(`Eleos listening on port ${port}`)
});