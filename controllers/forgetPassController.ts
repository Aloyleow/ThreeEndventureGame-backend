import express, { type Request, type Response } from "express";
import * as argon2 from "argon2";
import { z } from "zod";

import pool from "../services/pool";
import { randomSix } from "../services/newPassword";

const router = express.Router();

const forgetpasswordSchema = z.object({
  email: z.string().email(),
});

type ForgetPasswordReqBody = z.infer<typeof forgetpasswordSchema>;

router.post("/forgetpassword", async (req: Request<{}, {}, ForgetPasswordReqBody>, res: Response) => {
  
  const checkEmailQuery = `
  SELECT * FROM users WHERE email = $1
  `;
  
  const changePassQuery = `
  UPDATE users SET password = $1
  WHERE
  email = $2
  `;

  const tempPassword: string = randomSix();

  const validateReqBody = forgetpasswordSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const validateError = validateReqBody.error.issues;
    res.status(422).json({ error:`Validation type failed ${validateError}` });
  };

  const secret = process.env.ARGON_SECRET;
  if (!secret) {
    throw new Error("Dependencies missing.");
  }

  console.log(secret)
  try {

    const checkEmail = await pool.query(checkEmailQuery, [req.body.email]);
    if (checkEmail.rows.length < 1) {
      res.status(401).json({ error: "Invalid email, email is not registered." })
    };
    if (checkEmail.rows.length > 1) {
      res.status(401).json({ error: "Email duplicates found" })
    };

    const hashPass = await argon2.hash(tempPassword, { 
      type: argon2.argon2id, 
      secret: Buffer.from(secret) 
    });

    const input = [
      hashPass,
      req.body.email
    ]

    const updatePass = await pool.query(changePassQuery, input)
    if (!updatePass) {
      res.status(500).json({ error: "unable to get info in db." });
    }

    const emailjsData = {
      human_name: checkEmail.rows[0].username,
      new_password: tempPassword,
      human_email: req.body.email
    }

    res.status(201).json(emailjsData)
 
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } 

})

export default router