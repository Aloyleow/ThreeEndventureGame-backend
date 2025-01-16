import express, { type Request, type Response } from "express";
import { z } from "zod";
import { items, setInventory } from "../services/items";

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
}));

type Inventory = z.infer<typeof itemsSchema>;

const playerItemsSchema = z.object({
  items: z.array(z.string())
});

type PlayerData = z.infer<typeof playerItemsSchema>;

router.post("/inventory", async (req: Request<{}, {}, PlayerData>, res: Response<Inventory | { error: string } | []>) => {

  try {

    const validateReqBody = playerItemsSchema.safeParse(req.body);
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