import { z } from "zod";

declare global {

 const RoleEnum = z.enum(['Knight', 'Human', 'Mage'])
 
 const characterSchema = z.object({
   image: z.string(),
   alt: z.string(),
   role: RoleEnum,
   items: z.array(z.string()),
   skills: z.array(z.string()),
   health: z.number(),
   mana: z.number(),
   gold: z.number(),
   attack: z.number(), 
   turns: z.number(), 
   active: z.boolean(),
   win: z.boolean(), 
 });

 type CharacterReqBody = z.infer<typeof characterSchema>;

 const characterDataSchema = z.object({
  image: z.string(),
  alt: z.string(),
  role: RoleEnum,
  items: z.string(),
  skills: z.string(),
  health: z.number(),
  mana: z.number(),
  gold: z.number(),
  attack: z.number(), 
  turns: z.number(), 
  active: z.boolean(),
  win: z.boolean(), 
});

type CharacterResData = z.infer<typeof characterDataSchema>;

}

export {};