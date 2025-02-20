import dotenv from "dotenv";
import express, { type Application} from "express";
import morgan from "morgan";
import cors from "cors";

import verifyJsonToken from "./middlewares/verifyJsonToken";

import signupRouter from "./controllers/signupController"
import loginRouter from "./controllers/loginController"
import forgetPassRouter from "./controllers/forgetPassController"
import changePassRouter from "./controllers/changePassController"
import roleSelectedRouter from "./controllers/roleSelectedController"
import playerRouter from "./controllers/playerController"
import storeItemsRouter from "./controllers/storeItemsController"
import gamePathRouter from "./controllers/pathController"
import fightRouter from "./controllers/fightController"
import roleSaveRouter from "./controllers/roleSaveController"
import inventoryRouter from "./controllers/inventoryController"
import useItemsRouter from "./controllers/useItemController"
import highScoreRouter from "./controllers/highscoreController"

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());

app.get("/api/test", (req, res) => {
 res.status(201).json({checked: false})
})

app.use("/api/user", 
  signupRouter, 
  loginRouter,
  forgetPassRouter
);

app.use("/api/user/verified",
  verifyJsonToken,
  changePassRouter,
  roleSelectedRouter,
  playerRouter,
  storeItemsRouter,
  gamePathRouter,
  fightRouter,
  roleSaveRouter,
  inventoryRouter,
  useItemsRouter,
  highScoreRouter
);

app.listen(port, () =>{
  console.log(`ThreeEndventure listening on port ${port}`)
});