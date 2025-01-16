import express, { type Request, type Response } from "express";
import { z } from "zod";
import { items, setInventory } from "../services/items";

const router = express.Router();

const itemSchema = z.object({
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
});

type Inventory = z.infer<typeof itemSchema>;

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

router.post("/useitems", async (req: Request<{}, {}, PlayerItems>, res: Response<Inventory | { error: string } | []>) => {

  try {

    const validateReqBody = playeritemsDataSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }
    
    const importItems = items;
    if (!items) {
      throw new Error("Unable to import items data")
    }

    const inventoryItemsData: Inventory = setInventory(importItems, req.body.items) || []
    if (!inventoryItemsData || inventoryItemsData.length === 0) {
      res.status(201).json([])
      return
    }

    const validateItemsRes = itemsSchema.safeParse(inventoryItemsData);
    if (!validateItemsRes.success) {
      const validateError = validateItemsRes.error.issues.map(item =>` ${item.path}: ${item.message}`);
      throw new Error(`Validation type failed ${validateError}`);
    }

    res.status(201).json(inventoryItemsData);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

});

export default router