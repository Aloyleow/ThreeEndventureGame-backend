import  * as jwt  from "jsonwebtoken";
import { type JwtPayload } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      humanJson?: JwtPayload & { usersid: number; username: string }; 
    }
  }
}

const verifyJsonToken = (req: Request, res: Response, next: NextFunction) => {
  try {

    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({error: "INVALID AUTHORIZATION(H)!"})
      return;
    }

    const token = auth.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(401).json({error: "INVALID AUTHORIZATION(S)!"})
      return;
    }
    
    const decoded = jwt.verify(token, jwtSecret)

    req.humanJson = decoded as JwtPayload & { usersid: number; username: string };

    next()

  } catch (error: unknown) {

    if (error instanceof Error) {

        res.status(401).json({ error: error.message});

    } else {

        res.status(500).json({ error: "An unknown error occurred (authorization)" });

    };

  };
}

export default verifyJsonToken