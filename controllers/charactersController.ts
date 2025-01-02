import express, { type Request, type Response } from "express";
import { z } from "zod";

import verifyJsonToken from "../middlewares/verifyJsonToken";

import pool from "../services/pool";


const router = express.Router();

const RoleEnum = z.enum(['Warrior', 'Human', 'Mage'])

const characterSchema = z.object({
  role: RoleEnum,
  turns: z.number().min(1),
  win: z.boolean(),
});

type CharacterReqBody = z.infer<typeof characterSchema>;

router.post("/character", verifyJsonToken, async (req: Request<{},{}, CharacterReqBody>, res: Response) => {
  const queryNewChar = `
  INSERT INTO characters (role, turns, win, usersid)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;

  const validateReqBody =characterSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const validateError = validateReqBody.error.issues;
    res.status(422).json({ error:`Validation type failed ${validateError}` });
  };

  const input = [
    req.body.role,
    req.body.turns,
    req.body.win,
    req.humanJson?.usersid
  ];

  try {
    const recordNewChar = await pool.query(queryNewChar, input);
    if (!recordNewChar) {
      res.status(500).json({ error: "unable to record in db" });
    };

    res.status(201).json(recordNewChar.rows[0]);

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }

});

router.get("/character", async (req: Request, res: Response) => {
  const queryWinners = `
  SELECT characters.*, users.username
  FROM characters
  RIGHT JOIN users ON characters.usersId = users.usersId 
  WHERE characters.win = true
  ORDER BY turns ASC
  `;

  try {
    const getWinners = await pool.query(queryWinners);
    if (!getWinners){
      res.status(500).json({ error: "unable to get info in db." });
    };

    res.status(201).json(getWinners.rows);
  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  };

});

export default router