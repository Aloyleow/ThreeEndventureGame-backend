import express, { type Request, type Response } from "express";
import * as argon2 from "argon2";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string()
})

type SignupReqBody = {
  username: string;
  email: string;
  password: string;
}

router.post("/signup", async (req: Request<{}, {}, SignupReqBody>, res: Response) => {

  const queryCheckUser = `
    SELECT *
    FROM users
    WHERE username = $1 or email = $2
  `;

  const querySignup = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const validateReqBody = signupSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const validateError = validateReqBody.error.issues;
    res.status(422).json({ error: `Validation type failed ${validateError}` });
  }

  const secret = process.env.ARGON_SECRET
  if (!secret) {
    throw new Error("Dependencies missing.");
  }

  try {

    const checkUser = await pool.query(queryCheckUser, [req.body.username, req.body.email]);

    if (checkUser.rows.length > 0) {
      const duplicate = (checkUser.rows[0].username === req.body.username) ? "Username" : "Email";
      res.status(400).json({ error: `${duplicate} is in use.` });
    }

    const hashPass = await argon2.hash(req.body.password, { type: argon2.argon2id, secret: Buffer.from(secret) });

    const input = [
      req.body.username,
      req.body.email,
      hashPass
    ];

    const userSignup = await pool.query(querySignup, input);
    if(!userSignup){
        res.status(500).json({ error: "unable to record in db." });
    }

    const { username, email } = userSignup.rows[0]
    res.status(201).json({ username, email });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
})

export default router

