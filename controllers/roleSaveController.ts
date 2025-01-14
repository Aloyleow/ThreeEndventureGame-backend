import express, { type Request, type Response } from "express";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

const RoleEnum = z.enum(['Knight', 'Human', 'Mage'])

const roleSaveSchema = z.object({
  image: z.string(),
  alt: z.string(),
  role: RoleEnum,
  pathtaken: z.array(z.string()),
  items: z.array(z.string()),
  skills: z.array(z.string()),
  health: z.number(),
  maxhealth: z.number(),
  mana: z.number(),
  maxmana: z.number(),
  gold: z.number(),
  attack: z.number(),
  turns: z.number(),
  active: z.boolean(),
  win: z.boolean(),
});

type RoleSelectedReqBody = z.infer<typeof roleSaveSchema>;

router.put("/rolesave", async (req: Request<{},{}, RoleSelectedReqBody>, res: Response<"ThreeEndventure" | { error: string }>) => {
  const queryEditRole = `
  UPDATE playerRoles
  SET
  image = $1,
  alt = $2, 
  role = $3,
  pathtaken = $4,
  items = $5,
  skills = $6,
  health = $7,
  maxhealth = $8,
  mana = $9,
  maxmana = $10,
  gold = $11,
  attack = $12, 
  turns = $13, 
  active = $14,
  win = $15 
  WHERE username = $16 AND usersid = $17 AND active = true
  `;

  const queryActiveRole = `
  SELECT *
  FROM playerRoles
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  const validateReqBody = roleSaveSchema.safeParse(req.body);
  if (!validateReqBody.success) {
    const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
    throw new Error(`Validation type failed ${validateError}`);
  };
  
  const input = [
    req.body.image,
    req.body.alt,
    req.body.role,
    req.body.pathtaken.join(","),
    req.body.items.join(","), 
    req.body.skills.join(","), 
    req.body.health,
    req.body.maxhealth,
    req.body.mana,
    req.body.maxmana,
    req.body.gold,
    req.body.attack,
    req.body.turns,
    req.body.active,
    req.body.win,
    req.humanJson?.username,
    req.humanJson?.usersid
  ];

  try {
    const checkActiveRole = await pool.query(queryActiveRole, [req.humanJson?.username, req.humanJson?.usersid])
    if (checkActiveRole.rowCount !== 1){
      throw new Error("No session in progress");
    };

    const recordEditedRole = await pool.query(queryEditRole, input);
    if (!recordEditedRole) {
      throw new Error("unable to record in db");
    };

    res.status(201).json("ThreeEndventure");

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router