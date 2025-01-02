// import express, { type Request, type Response } from "express";
// import * as argon2 from "argon2";
// import { z } from "zod";
// import nodemailer from 'nodemailer';
// import SMTPTransport from "nodemailer/lib/smtp-transport";

// import verifyJsonToken from "../middlewares/verifyJsonToken";

// import pool from "../services/pool";
// import { htmlEmailTemplateChangePass } from "../services/newPassword"

// const router = express.Router();

// const changepasswordSchema = z.object({
//   password: z.string(),
// });

// type ChangePasswordReqBody = z.infer<typeof changepasswordSchema>;

// router.put("/changepassword", verifyJsonToken, async (req: Request<{}, {}, ChangePasswordReqBody>, res: Response) => {
//   const checkEmailQuery = `
//   SELECT * 
//   FROM users 
//   WHERE usersid = $1 AND username = $2
//   `;

//   const changePassQuery = `
//   UPDATE users SET password = $1
//   WHERE usersid = $2 AND username = $3
//   `;

//   const validateReqBody = changepasswordSchema.safeParse(req.body);
//   if (!validateReqBody.success) {
//     const validateError = validateReqBody.error.issues;
//     res.status(422).json({ error:`Validation type failed ${validateError}` });
//   };

//   const secret = process.env.ARGON_SECRET;
//   if (!secret) {
//     throw new Error("Dependencies missing.");
//   }

//   const mailerHost = process.env.MAILER_HOST;
//   const mailerUser = process.env.MAILER_USER;
//   const mailerKey = process.env.MAILER_API_KEY;

//   if (!mailerHost || !mailerUser || !mailerKey) {
//     throw new Error("Email dependencies missing.");
//   };

//   try{
//     const checkEmail = await pool.query(checkEmailQuery, [req.humanJson?.usersid, req.humanJson?.username]);
//     if (!checkEmail) {
//       res.status(500).json({ error: "unable to record in db" });
//     };

//     const hashPass = await argon2.hash(req.body.password, { type: argon2.argon2id, secret: Buffer.from(secret) });
    
//     const input = [
//       hashPass,
//       req.humanJson?.usersid,
//       req.humanJson?.username
//     ]

//     const updatePass = await pool.query(changePassQuery, input)
//     if (!updatePass) {
//       res.status(500).json({ error: "unable to record in db" });
//     }

//     const transporter = nodemailer.createTransport({
//       host: mailerHost,
//       port: 587,
//       secure: false,
//       auth: {
//       user: mailerUser, 
//       pass: mailerKey,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       }, 
//     } as SMTPTransport.Options);

//     const email = {
//       from: `aloyleowwork@gmail.com`,
//       to: `${checkEmail.rows[0].email}`,
//       subject: `ThreeEndGame New Password`,
//       html: htmlEmailTemplateChangePass(checkEmail.rows[0].username)
//     }

//     const info = await transporter.sendMail(email)
    
//     if (!info) {
//       res.status(400).json({ error: "unable to send mail" });
//     }

//     if (updatePass && info) {
//       res.status(200).json( info.response )
//     } else {
//       res.status(400).json({ error: "Something went wrong =("})
//     }  

//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   } 

// })

// export default router