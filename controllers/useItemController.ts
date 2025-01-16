import express, { type Request, type Response } from "express";
import { z } from "zod";
import { setPlayer } from "../services/items";

const router = express.Router();

const itemSchema = z.object({
  numPath: z.number(),
  name: z.string(),
  role: z.string(),
  cost: z.number(),
  description: z.string(),
  properties: z.object({
    attack: z.number(),
    health: z.number(),
    mana: z.number(),
    maxhealth: z.number(),
    maxmana: z.number(),
  })
});

const playeritemsDataSchema = z.object({
  item: itemSchema,
  items: z.array(z.string()),
  role: z.string(),
  attack: z.number(),
  maxhealth: z.number(),
  maxmana: z.number(), 
  health: z.number(),
  mana: z.number(),
});

type PlayerItems = z.infer<typeof playeritemsDataSchema>;

const playerResSchema = z.object({
  items: z.array(z.string()),
  attack: z.number(),
  maxhealth: z.number(),
  maxmana: z.number(), 
  health: z.number(),
  mana: z.number(),
});

type PlayerResData = z.infer<typeof playerResSchema>;

//should i gather item properties here or just take all properties from frontend

router.post("/useitems", async (req: Request<{}, {}, PlayerItems>, res: Response<PlayerResData | { error: string } | []>) => {

  try {

    const validateReqBody = playeritemsDataSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    const playerResData: PlayerResData = setPlayer(req.body);
    
    const validateItemsRes = playerResSchema .safeParse(playerResData);
    if (!validateItemsRes.success) {
      const validateError = validateItemsRes.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    res.status(201).json(playerResData);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router