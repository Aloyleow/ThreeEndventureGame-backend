import express, { type Request, type Response } from "express";
import { z } from "zod";

import { filterItemsData, items } from "../services/items";

const router = express.Router();

type Items = {
  levelId: number,
  name: string,
  cost: number,
  description: string,
}[];

const currentLevelSchema = z.object({
  level: z.number(),
});


type CurrentLevel = z.infer<typeof currentLevelSchema>;

router.post("/storeitems", async (req: Request<{}, {}, CurrentLevel>, res: Response) => {

  try {

    const validateReqBody = currentLevelSchema.safeParse(req.body);
    if (!validateReqBody.success) {
      const validateError = validateReqBody.error.issues.map(item => item.message);
      res.status(422).json({ error: `Validation type failed ${validateError}` });
      return;
    }

    const importItems = items;
    if (!items) {
      throw new Error("Unable to import items data")
    }

    const storeItemsData: Items = filterItemsData(importItems, req.body.level)

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