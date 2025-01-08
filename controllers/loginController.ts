import express, { type Request, type Response } from "express";
import * as argon2 from "argon2";
import { z } from "zod";
import jwt from "jsonwebtoken";

import pool from "../services/pool";

const router = express.Router();

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

type LoginReqBody = z.infer<typeof loginSchema>;

type JwtPayload = {
  usersid: number;
  username: string;
};

router.post("/login", async (req: Request<{}, {}, LoginReqBody>, res: Response) => {

  const queryCheckUser = `
    SELECT * FROM users WHERE username = $1
    `;

  try {

    const validateReqBody = loginSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item => item.message);
      res.status(422).json({ error: `Validation type failed ${validateError}` });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("Jwt Secret missing.")
    }

    const secret = process.env.ARGON_SECRET
    if (!secret) {
      throw new Error("Argon Secret missing.");
    }

    const checkUser = await pool.query(queryCheckUser, [req.body.username]);
    if (checkUser.rows.length < 1) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    };
    if (checkUser.rows.length > 1) {
      throw new Error("Duplicated users.");
    }

    const checkPassword = checkUser.rows[0].password;
    if (!checkPassword) {
      throw new Error("unable to get info in db.");
    };

    const matchPassword = await argon2.verify(checkPassword, req.body.password, { secret: Buffer.from(secret) });
    if (!matchPassword) {
      res.status(401).json({ error: "Invalid username or password." })
      return;
    }

    const token = jwt.sign(
      { usersid: checkUser.rows[0].usersid, username: req.body.username } as JwtPayload,
      jwtSecret,
      { expiresIn: "1hr" }
    );
    if (!token) {
      throw new Error("Unable to form login token.")
    }

    res.status(201).json({ token });

  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }

  }
  
});

export default router