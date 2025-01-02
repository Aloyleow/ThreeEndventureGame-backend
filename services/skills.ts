type Skills = {
  name: string,
  attack: number,
  mana: number,
  health: number,
  description: string
}[];

export const warriorSkills: Skills = [
  {
    name: "Short Sword Long Reach",
    attack: 7,
    mana: 0,
    health: 0,
    description: "Using the shortest tool to reach the furthest solution."
  }
]

export const mageSkills: Skills = [
  {
    name: "Small Orb",
    attack: 15,
    mana: 10,
    health: 0,
    description: "Legend says the orb is made of bad vibes."
  }
]

export const humanSkills: Skills = [
  {
    name: "Scream",
    attack: 0,
    mana: 0,
    health: 2,
    description: "Fear is your greatest ally"
  }
]

