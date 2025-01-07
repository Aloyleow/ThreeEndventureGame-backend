// import express, { type Request, type Response } from "express";
// import { z } from "zod";

// import { roles, npc } from "../services/characters";
// import { items } from "../services/items";
// import { warriorSkills, mageSkills, humanSkills } from "../services/skills";

// const router = express.Router();

// router.get("/warrior", (req: Request, res: Response) => {
//   try {

//     const wScaffold = [
//       roles[0],
//       items,
//       npc,
//       warriorSkills
//     ]

//     if (!wScaffold || wScaffold.length < 4) {
//       res.status(500).json({ error: "Unable to import data" });
//     }

//     res.status(200).json({ wScaffold })

//   } catch (error){
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     };
//   }
// })

// router.get("/mage", (req: Request, res: Response) => {
//   try {

//     const mScaffold = [
//       roles[1],
//       items,
//       npc,
//       mageSkills
//     ]

//     if (!mScaffold || mScaffold.length < 4) {
//       res.status(500).json({ error: "Unable to import data" });
//     }

//     res.status(200).json({ mScaffold })

//   } catch (error){
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     };
//   }
// })

// router.get("/human", (req: Request, res: Response) => {
//   try {

//     const hScaffold = [
//       roles[2],
//       items,
//       npc,
//       humanSkills
//     ]

//     if (!hScaffold || hScaffold.length < 4) {
//       res.status(500).json({ error: "Unable to import data" });
//     }

//     res.status(200).json({ hScaffold })

//   } catch (error){
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     };
//   }
// })

// export default router


// router.get("/character", async (req: Request, res: Response) => {
//   const queryWinners = `
//   SELECT characters.*, users.username
//   FROM characters
//   RIGHT JOIN users ON characters.usersId = users.usersId 
//   WHERE characters.win = true
//   ORDER BY turns ASC
//   `;

//   try {
//     const getWinners = await pool.query(queryWinners);
//     if (!getWinners){
//       res.status(500).json({ error: "unable to get info in db." });
//     };

//     res.status(201).json(getWinners.rows);
//   } catch (error){
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     };
//   };

// });

// export default router