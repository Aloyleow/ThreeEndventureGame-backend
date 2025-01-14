import express, { type Request, type Response } from "express";
import { z } from "zod";

import { filterItemsData, items } from "../services/items";

const router = express.Router();

const itemsSchema = z.array(z.object({
  numPath: z.number(),
  name: z.string(),
  cost: z.number(),
  description: z.string(),
  properties:z.object({
    attack: z.number(),
    health: z.number(),
    mana: z.number(),
    maxhealth: z.number(),
    maxmana: z.number(),
  })
}))

type Items = z.infer<typeof itemsSchema>;

const numPathTakenSchema = z.object({
  pathTaken: z.number(),
});

type CurrentLevel = z.infer<typeof numPathTakenSchema>;

router.post("/storeitems", async (req: Request<{}, {}, CurrentLevel>, res: Response<Items | { error: string }>) => {

  try {

    const validateReqBody = numPathTakenSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }
    
    const importItems = items;
    if (!items) {
      throw new Error("Unable to import items data")
    }

    const storeItemsData: Items = filterItemsData(importItems, req.body.pathTaken)

    const validateItemsRes = itemsSchema.safeParse(storeItemsData);
    if (!validateItemsRes.success) {
      const validateError = validateItemsRes.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    res.status(201).json(storeItemsData);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});


export default router