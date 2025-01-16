type Items = {
  numPath: number;
  name: string;
  cost: number;
  description: string;
  properties: {
    attack: number;
    health: number;
    mana: number;
    maxhealth: number;
    maxmana: number;
  }
}[];

const items: Items = [
  {
    numPath: 0,
    name: "Health potion",
    cost: 10,
    description: "blood in vial",
    properties: {
      attack: 0,
      health: 10,
      mana: 0,
      maxhealth: 0,
      maxmana: 0,
    }
  },
  {
    numPath: 0,
    name: "Mana potion",
    cost: 10,
    description: "Weird substance in vial",
    properties: {
      attack: 0,
      health: 0,
      mana: 5,
      maxhealth: 0,
      maxmana: 0,
    }
  },
  {
    numPath: 1,
    name: "Pineapple Juice",
    cost: 3,
    description: "yellow liquid in packet",
    properties: {
      attack: 0,
      health: 0,
      mana: 5,
      maxhealth: 10,
      maxmana: 5,
    }
  },
  {
    numPath: 1,
    name: "Beer",
    cost: 6,
    description: "fizzy yellow liquid in can",
    properties: {
      attack: 10,
      health: -1,
      mana: 10,
      maxhealth: -1,
      maxmana: 10,
    }
  },
  {
    numPath: 2,
    name: "Beef Steak",
    cost: 12,
    description: "soft delicious looking thing",
    properties: {
      attack: 0, 
      health: 10,
      mana: 0,
      maxhealth: 20,
      maxmana: 0,
    }
  },
  {
    numPath: 2,
    name: "Natto",
    cost: 4,
    description: "gooey beans",
    properties: {
      attack: 8,
      health: 10,
      mana: 0,
      maxhealth: 10,
      maxmana: 0,
    }
  },
  {
    numPath: 3,
    name: "King arthur's sword",
    cost: 10,
    description: "A sword",
    properties: {
      attack: 30,
      health: 0,
      mana: 0,
      maxhealth: 0,
      maxmana: 0,
    }
  },
  {
    numPath: 3,
    name: "Merlin's Staff",
    cost: 20,
    description: "A staff",
    properties: {
      attack: 50,
      health: 0,
      mana: 0,
      maxhealth: 0,
      maxmana: 0,
    }
  },
  {
    numPath: 3,
    name: "AMD Ryzen 9k",
    cost: 48,
    description: "A chip",
    properties: {
      attack: 50,
      health: 10,
      mana: 10,
      maxhealth: 10,
      maxmana: 10,
    }
  }
];

const filterItemsData = (items: Items, pathTaken: number) => {
  return items.filter((obj) => obj.numPath <= pathTaken);
};

const setInventory = (items: Items, itemNames: string[]) => {
  
  let inventoryRes = [];

  for (let i = 0; i < itemNames.length; i++) {
    for (const obj of items) {
      if (obj.name === itemNames[i]){
        inventoryRes.push(obj);
      }
    }
  };

  return inventoryRes;
}

export {
  filterItemsData,
  items,
  setInventory
}