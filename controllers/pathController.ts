import express, { type Request, type Response } from "express";
import { z } from "zod";
import { filterGamePaths, gamePath } from "../services/path";

const router = express.Router();

const monsterKilledSchema = z.object({
  monsterKilled: z.array(z.string())
});

type MonsterKilled = z.infer<typeof monsterKilledSchema>;

const gamePathResSchema = z.array(z.object({
  pathId: z.number(),
  pathName: z.string(),
  encounter: z.object({
    enemy: z.boolean(),
    name: z.string(),
    health: z.number(),
    attack: z.number(),
    gold: z.number()
  })
}))

type GamePathRes = z.infer<typeof gamePathResSchema>;

router.post("/path", (req: Request<{}, {}, MonsterKilled>, res: Response<GamePathRes | {error: string}>) => {
  try {

    const validateReqBody = monsterKilledSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    const importPaths = gamePath;
    if (!importPaths) {
      throw new Error("Unable to import path data")
    }

    const gamePathRes = filterGamePaths(req.body.monsterKilled, importPaths);
    
    res.status(201).json(gamePathRes);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router