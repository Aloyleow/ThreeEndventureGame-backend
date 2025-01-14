import express, { type Request, type Response } from "express";
import { z } from "zod";
import { enemyFightRoll, playerFightRoll } from "../services/fightFunc";

const router = express.Router();

const playerRollSchema = z.object({
  playerAttack: z.number(),
  enemyHealth: z.number(),
})

type PlayerRollData = z.infer<typeof playerRollSchema>

const FightResultsSchema = z.object({
  enemyHealth: z.number(),
  damageDealt: z.number(),
  special: z.string()
})

type FightResultsRes = z.infer<typeof FightResultsSchema>

router.post("/playerroll", (req: Request<{}, {}, PlayerRollData>, res: Response<FightResultsRes | { error: string }>) => {
  try {

    const validateReqBody = playerRollSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item => ` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    const fightResultsRes = playerFightRoll(req.body.playerAttack, req.body.enemyHealth)
    
    res.status(201).json(fightResultsRes);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

const enemyRollSchema = z.object({
  enemyAttack: z.number(),
  playerHealth: z.number(),
})

type EnemyRollData = z.infer<typeof enemyRollSchema>

router.post("/enemyroll", (req: Request<{}, {}, EnemyRollData>, res: Response<FightResultsRes | { error: string }>) => {
  try {

    const validateReqBody = enemyRollSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item => ` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    const fightResultsRes = enemyFightRoll(req.body.enemyAttack, req.body.playerHealth)
    
    res.status(201).json(fightResultsRes);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router