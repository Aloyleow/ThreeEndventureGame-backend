type Roles = {
  role: string;
  health: number;
  mana: number;
  gold: number;
  attack: number;
}[];

export const roles: Roles = [
  {
    role: "Warrior",
    health: 100,
    mana: 0,
    gold: 20,
    attack: 3
  },
  {
    role: "Mage",
    health: 50,
    mana: 50,
    gold: 20,
    attack: 5
  },
  {
    role: "Human",
    health: 30,
    mana: 0,
    gold: 80,
    attack: 1
  }
];

type NPC = {
  role: string;
  health: number;
  
  attack: number;
}[];

export const npc: NPC = [
  {
    role: "Trader",
    health: 30,
    attack: 888
  },
  {
    role: "Santa Clause",
    health: 30,
    attack: 8888
  },
  {
    role: "Slime",
    health: 20,
    attack: 8
  },
  {
    role: "Skeleton",
    health: 10,
    attack: 12
  },
  {
    role: "Zombie",
    health: 30,
    attack: 4
  },
  {
    role: "Dragon",
    health: 100,
    attack: 30,
  }
]