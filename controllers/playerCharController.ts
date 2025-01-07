import express, { type Request, type Response } from "express";

import pool from "../services/pool";

const router = express.Router();

router.get("/playerchar", async (req: Request, res: Response) => {

  const queryActiveChar = `
  SELECT *
  FROM characterselected
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  try {
    const checkActiveChar = await pool.query(queryActiveChar, [req.humanJson?.username, req.humanJson?.usersid])
    
    const rowCount = checkActiveChar.rowCount ?? 0;
    
    if (rowCount === 0){
      res.status(200).json({ checked: "na" })
      return 
    }
    if (rowCount > 1) {
      throw new Error("More than 1 active sessions")
    }

    res.status(201).json(checkActiveChar.rows[0]);

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }

})

router.delete("/playerchar", async (req: Request, res: Response) => {

  const queryActiveChar = `
  SELECT *
  FROM characterselected
  WHERE username = $1 AND usersid = $2 AND active = true
  `
  const queryDeleteActive = `
  DELETE
  FROM characterselected
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  try {
    const checkActiveChar = await pool.query(queryActiveChar, [req.humanJson?.username, req.humanJson?.usersid])
    
    const rowCount = checkActiveChar.rowCount ?? 0;
    if (rowCount === 0){
      throw new Error("No session to delete")
    }
    if (rowCount > 1) {
      throw new Error("More than 1 active sessions")
    }

    const deleteActiveChar = await pool.query(queryDeleteActive, [req.humanJson?.username, req.humanJson?.usersid])
    if (!deleteActiveChar) {
      throw new Error("Unable to delete data")
    }

    res.status(201).json({ checked: "deleted" });

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }

})

export default router