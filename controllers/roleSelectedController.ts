import express, { type Request, type Response } from "express";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

const RoleEnum = z.enum(['Knight', 'Human', 'Mage'])

const roleSelectedSchema = z.object({
  image: z.string(),
  alt: z.string(),
  role: RoleEnum,
  items: z.array(z.string()),
  skills: z.array(z.string()),
  health: z.number(),
  mana: z.number(),
  gold: z.number(),
  attack: z.number(),
  turns: z.number(),
  active: z.boolean(),
  win: z.boolean(),
});

type RoleSelectedReqBody = z.infer<typeof roleSelectedSchema>;

router.post("/roleselected", async (req: Request<{},{}, RoleSelectedReqBody>, res: Response) => {
  const queryNewRole = `
  INSERT INTO playerRoles (
  username,
  image,
  alt, 
  role,
  items,
  skills,
  health,
  mana,
  gold,
  attack, 
  turns, 
  active,
  win, 
  usersid)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;

  const queryActiveRole = `
  SELECT *
  FROM playerRoles
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  const validateReqBody = roleSelectedSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const validateError = validateReqBody.error.issues.map(item => item.message);
    throw new Error(`Req.body validation type failed ${validateError}` );
  };

  const input = [
    req.humanJson?.username,
    req.body.image,
    req.body.alt,
    req.body.role,
    req.body.items.join(","), 
    req.body.skills.join(","), 
    req.body.health,
    req.body.mana,
    req.body.gold,
    req.body.attack,
    req.body.turns,
    req.body.active,
    req.body.win,
    req.humanJson?.usersid
  ];

  try {
    const checkActiveRole = await pool.query(queryActiveRole, [req.humanJson?.username, req.humanJson?.usersid])
    if (checkActiveRole.rowCount !== 0){
      res.status(500).json({ error: "Active session in progress"})
      return;
    }

    const recordNewRole = await pool.query(queryNewRole, input);
    if (!recordNewRole) {
      res.status(500).json({ error: "unable to record in db" });
      return;
    };

    res.status(201).json({success: "Data stored"});

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router