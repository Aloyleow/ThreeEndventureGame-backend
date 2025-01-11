import express, { type Request, type Response } from "express";
import { z } from "zod";

import pool from "../services/pool";

const router = express.Router();

const RoleEnum = z.enum(['Knight', 'Human', 'Mage'])

const playerDataSchema = z.object({
  image: z.string(),
  alt: z.string(),
  role: RoleEnum,
  items: z.array(z.string()),
  skills: z.array(z.string()),
  health: z.number(),
  maxHealth: z.number(),
  mana: z.number(),
  maxMana: z.number(),
  gold: z.number(),
  attack: z.number(),
  turns: z.number(),
  active: z.boolean(),
  win: z.boolean(),
});

type PlayerData = z.infer<typeof playerDataSchema>;

router.get("/player", async (req: Request, res: Response<PlayerData | { checked: string } | { error: string }>) => {

  const queryActiveRole = `
  SELECT *
  FROM playerRoles
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  try {
    const checkActiveRole = await pool.query(queryActiveRole, [req.humanJson?.username, req.humanJson?.usersid])

    const rowCount = checkActiveRole.rowCount ?? 0;

    if (rowCount === 0) {
      res.status(200).json({ checked: "na" })
      return
    }
    if (rowCount > 1) {
      throw new Error("More than 1 active sessions")
    }

    const {
      image,
      alt,
      role,
      items,
      skills,
      health,
      maxHealth,
      mana,
      maxMana,
      gold,
      attack,
      turns,
      active,
      win,
    } = checkActiveRole.rows[0];

    const handleData: PlayerData = {
      image,
      alt,
      role,
      items: items.split(","),
      skills: skills.split(","),
      health,
      maxHealth,
      mana,
      maxMana,
      gold,
      attack,
      turns,
      active,
      win,
    };

    const validateReqBody = playerDataSchema.safeParse(handleData);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item => item.message);
      res.status(422).json({ error: `Validation type failed ${validateError}` });
      return;
    }

    res.status(201).json(handleData);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

router.delete("/player", async (req: Request, res: Response<"ThreeEndventure" | { error: string }>) => {

  const queryActiveRole = `
  SELECT *
  FROM playerRoles
  WHERE username = $1 AND usersid = $2 AND active = true
  `
  const queryDeleteActive = `
  DELETE
  FROM playerRoles
  WHERE username = $1 AND usersid = $2 AND active = true
  `

  try {
    const checkActiveRole = await pool.query(queryActiveRole, [req.humanJson?.username, req.humanJson?.usersid])

    const rowCount = checkActiveRole.rowCount ?? 0;
    if (rowCount === 0) {
      throw new Error("No session to delete")
    }
    if (rowCount > 1) {
      throw new Error("More than 1 active sessions")
    }

    const deleteActiveRole = await pool.query(queryDeleteActive, [req.humanJson?.username, req.humanJson?.usersid])
    if (!deleteActiveRole) {
      throw new Error("Unable to delete data")
    }

    res.status(201).json("ThreeEndventure");

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router