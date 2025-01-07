import dotenv from "dotenv";
import express, { type Application} from "express";
import morgan from "morgan";
import cors from "cors";

import verifyJsonToken from "./middlewares/verifyJsonToken";

import signupRouter from "./controllers/signupController"
import loginRouter from "./controllers/loginController"
import forgetPassRouter from "./controllers/forgetPassController"
import changePassRouter from "./controllers/changePassController"
import characterSelectedRouter from "./controllers/characterSelectedController"


dotenv.config();

const app: Application = express();
const port: number = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());

app.get("/test", (req, res) => {
 res.status(201).json({test: "test"})
})

app.use("/api/user", 
  signupRouter, 
  loginRouter,
  forgetPassRouter
);

app.use(verifyJsonToken)

app.use("/api/user/verified",
  changePassRouter,
  characterSelectedRouter
);

// app.use("/api/user/verified/start", 
  
// );


app.listen(port, () =>{
  console.log(`ThreeEndventure listening on port ${port}`)
});