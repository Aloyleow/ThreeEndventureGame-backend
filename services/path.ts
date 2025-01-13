type GamePath = {
  pathId: number;
  pathName: string;
  encounter: {
    enemy: boolean;
    name: string;
    health: number;
    attack: number;
    gold: number;
  }
}[]

const gamePath: GamePath = [
  {
    pathId: 1,
    pathName: "Forest", 
    encounter: {
      enemy: true,
      name: "Slime",
      health: 10,
      attack: 12,
      gold: 5,
    },
  },
  {
    pathId: 2,
    pathName: "Shed", 
    encounter: {
      enemy: true,
      name: "Zombie",
      health: 30,
      attack: 4,
      gold: 5,
    },
  },
  {
    pathId: 3,
    pathName: "Ruins", 
    encounter: {
      enemy: true,
      name: "Skeleton",
      health: 10,
      attack: 12,
      gold: 5,
    },
  },
  {
    pathId: 4,
    pathName: "River", 
    encounter: {
      enemy: true,
      name: "20kg Cockroach",
      health: 100,
      attack: 2,
      gold: 15,
    },
  },
  {
    pathId: 5,
    pathName: "Cave", 
    encounter: {
      enemy: true,
      name: "Glowing Bear",
      health: 60,
      attack: 12,
      gold: 15,
    },
  },
  {
    pathId: 6,
    pathName: "Temple", 
    encounter: {
      enemy: true,
      name: "Dragon",
      health: 80,
      attack: 18,
      gold: 30,
    },
  },
  {
    pathId: 7,
    pathName: "Mountain", 
    encounter: {
      enemy: true,
      name: "Unknown",
      health: 150,
      attack: 30,
      gold: 0,
    },
  }
];

const filterGamePaths = (monsterKilled: string[], gamePath: GamePath) => {
  
  let returnedGamePaths = []

  for (let i = 0; i < gamePath.length; i ++) {
    for (const monster of monsterKilled) {
      if (returnedGamePaths.length === 3) {
        break;
      }
      if (monster !== gamePath[i].encounter.name){
        returnedGamePaths.push(gamePath[i]);
      }
    }
  }

  return returnedGamePaths;
  
}

export { 
  gamePath,
  filterGamePaths
}