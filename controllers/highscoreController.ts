import express, { type Request, type Response } from "express";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

const highScoreDataSchema = z.array(z.object({
  username: z.string(),
  role: z.string(),
  turns: z.number()
}))

type HighScoreData = z.infer<typeof highScoreDataSchema>

router.get("/highscores", async (req: Request, res: Response<HighScoreData | { checked: string } | { error: string }>) => {

  const queryWinners = `
  SELECT 
  username, role, turns
  FROM playerroles
  WHERE active = false AND win = true
  `
  
  try {
    const checkWinners = await pool.query(queryWinners)

    const rowCount = checkWinners.rowCount ?? 0;

    if (rowCount === 0) {
      res.status(200).json({ checked: "na" })
      return
    }

    const handleHSdata: HighScoreData = checkWinners.rows

    const validateReqBody = highScoreDataSchema.safeParse(handleHSdata);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    };

    res.status(201).json(handleHSdata);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router