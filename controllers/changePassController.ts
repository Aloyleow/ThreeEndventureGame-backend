import express, { type Request, type Response } from "express";
import * as argon2 from "argon2";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

type EmailJsData = {
  human_name: string,
  human_email: string,
}

const changepasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

type ChangePasswordReqBody = z.infer<typeof changepasswordSchema>;

router.put("/changepassword", async (req: Request<{}, {}, ChangePasswordReqBody>, res: Response<EmailJsData | { error: string }>) => {

  const checkUserQuery = `
  SELECT *
  FROM users
  WHERE usersid = $1 AND username = $2
  `

  const changePassQuery = `
  UPDATE users SET password = $1
  WHERE usersid = $2 AND username = $3
  `;

  try {

    const validateReqBody = changepasswordSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(issues => issues.message);
      res.status(422).json({ error: `Validation type failed ${validateError}` });
      return;
    };

    const secret = process.env.ARGON_SECRET;
    if (!secret) {
      throw new Error("Dependencies missing.");
    }

    if (!req.humanJson?.usersid || !req.humanJson?.username) {
      res.status(400).json({ error: "Invalid user context" });
      return;
    }

    const checkUser = await pool.query(checkUserQuery, [req.humanJson?.usersid, req.humanJson?.username]);
    if (!checkUser) {
      throw new Error("Unable to retrieve user info");
    };

    const checkPassword = checkUser.rows[0].password;
    if (!checkPassword) {
      throw new Error("unable to get password in db.");
    };

    const matchPassword = await argon2.verify(checkPassword, req.body.oldPassword, { secret: Buffer.from(secret) });
    if (!matchPassword) {
      res.status(401).json({ error: "Invalid password." })
      return;
    }
    if (req.body.newPassword === req.body.oldPassword) {
      res.status(401).json({ error: "New password must not be same as old password" })
      return;
    }

    const hashPass = await argon2.hash(req.body.newPassword, { type: argon2.argon2id, secret: Buffer.from(secret) });

    const input = [
      hashPass,
      req.humanJson?.usersid,
      req.humanJson?.username
    ]

    const updatePass = await pool.query(changePassQuery, input)
    if (!updatePass) {
      res.status(500).json({ error: "unable to record in db" });
      return;
    }

    const emailjsData: EmailJsData = {
      human_name: checkUser.rows[0].username,
      human_email: checkUser.rows[0].email
    }

    res.status(200).json(emailjsData)

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router