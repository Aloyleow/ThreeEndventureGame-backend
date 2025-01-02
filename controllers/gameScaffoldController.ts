import express, { type Request, type Response } from "express";
import { z } from "zod";

import { roles, npc } from "../services/characters";
import { items } from "../services/items";
import { warriorSkills, mageSkills, humanSkills } from "../services/skills";

const router = express.Router();

router.get("/warrior", (req: Request, res: Response) => {
  try {

    const wScaffold = [
      roles[0],
      items,
      npc,
      warriorSkills
    ]

    if (!wScaffold || wScaffold.length < 4) {
      res.status(500).json({ error: "Unable to import data" });
    }

    res.status(200).json({ wScaffold })

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }
})

router.get("/mage", (req: Request, res: Response) => {
  try {

    const mScaffold = [
      roles[1],
      items,
      npc,
      mageSkills
    ]

    if (!mScaffold || mScaffold.length < 4) {
      res.status(500).json({ error: "Unable to import data" });
    }

    res.status(200).json({ mScaffold })

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }
})

router.get("/human", (req: Request, res: Response) => {
  try {

    const hScaffold = [
      roles[2],
      items,
      npc,
      humanSkills
    ]

    if (!hScaffold || hScaffold.length < 4) {
      res.status(500).json({ error: "Unable to import data" });
    }

    res.status(200).json({ hScaffold })

  } catch (error){
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    };
  }
})

export default router
