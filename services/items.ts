type PlayeritemsData = {
  item: {
    numPath: number;
    name: string;
    role: string;
    cost: number;
    description: string;
    properties: {
      attack: number;
      health: number;
      mana: number;
      maxhealth: number;
      maxmana: number;
    }
  },
  items: string[];
  role: string;
  attack: number;
  maxhealth: number;
  maxmana: number;
  health: number;
  mana: number;
};

type PlayerNewData = {
  items: string[];
  attack: number;
  maxhealth: number;
  maxmana: number;
  health: number;
  mana: number;
}


type Items = {
  numPath: number;
  name: string;
  role: string;
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
    role: "any",
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
    role: "any",
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
    role: "any",
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
    role: "any",
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
    role: "any",
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
    role: "any",
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
    role: "Knight",
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
    role: "Mage",
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
    role: "Human",
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

const setInventory = (items: Items, itemNames: string[]): Items => {

  let inventoryRes = [];

  for (let i = 0; i < itemNames.length; i++) {
    for (const obj of items) {
      if (obj.name === itemNames[i]) {
        inventoryRes.push(obj);
      }
    }
  };

  return inventoryRes;
}
//   const totalMH = player.maxhealth + item.properties.maxhealth;
//   const totalMM = player.maxmana + item.properties.maxmana;
//   const adjustedHealth = player.health + item.properties.health;
//   const adjustedMana = player.maxmana + item.properties.maxmana;
//   const adjustedAttack = player.attack + item.properties.attack;

//   const filterItems = (prevItems: PlayerType) => {
//     const inventoryItemIdx = prevItems.items.findIndex((playerItems) => playerItems === item.name)
//     if (inventoryItemIdx !== -1){
//       return [...prevItems.items.slice(0, inventoryItemIdx), ...prevItems.items.slice(inventoryItemIdx + 1)];
//     }
//     return prevItems.items;
//   };

//   const filterInventory = (inv: ItemsResponse) => {
//     const inventoryItemIdx = inv.findIndex((invItem) => invItem.name === item.name)
//     if (inventoryItemIdx !== -1){
//       return [...inv.slice(0, inventoryItemIdx), ...inv.slice(inventoryItemIdx + 1)];
//     }
//     return inv;
//   };

//   setPlayer({
//     ...player,
//     health: adjustedHealth > totalMH ? player.maxhealth : adjustedHealth,
//     maxhealth: totalMH,
//     mana: adjustedMana > totalMM ? player.maxmana : adjustedMana,
//     maxmana: totalMM,
//     attack: adjustedAttack,
//     items: filterItems(player)
//   })
//   setInventory(filterInventory(inventory))
// }

const setPlayer = (playerItemsData: PlayeritemsData): PlayerNewData => {

  const totalMH = playerItemsData.maxhealth + playerItemsData.item.properties.maxhealth;
  const totalMM = playerItemsData.maxmana + playerItemsData.item.properties.maxmana;
  const adjustedHealth = playerItemsData.health + playerItemsData.item.properties.health;
  const adjustedMana = playerItemsData.maxmana + playerItemsData.item.properties.maxmana;
  const adjustedAttack = playerItemsData.attack + playerItemsData.item.properties.attack;

  const filterItems = () => {
    const inventoryItemIdx = playerItemsData.items.findIndex((usedItem) => usedItem === playerItemsData.item.name)
    if (inventoryItemIdx !== -1) {
      return [...playerItemsData.items.slice(0, inventoryItemIdx), ...playerItemsData.items.slice(inventoryItemIdx + 1)];
    }
    return playerItemsData.items;
  };

  if (playerItemsData.role === playerItemsData.item.role || playerItemsData.item.role === "any") {
    const playerResData: PlayerNewData = {
      items: filterItems(),
      attack: adjustedAttack,
      health: adjustedHealth > totalMH ? playerItemsData.maxhealth : adjustedHealth,
      maxhealth: totalMH,
      mana: adjustedMana > totalMM ? playerItemsData.maxmana : adjustedMana,
      maxmana: totalMM,
    }
    return playerResData;
  } else {
    const playerResData: PlayerNewData = {
      items: filterItems(),
      attack: adjustedAttack / 2,
      health: adjustedHealth > totalMH ? playerItemsData.maxhealth : adjustedHealth / 2 ,
      maxhealth: totalMH,
      mana: adjustedMana > totalMM ? playerItemsData.maxmana : adjustedMana / 2,
      maxmana: totalMM,
    }
    return playerResData;
  }
}

export {
  filterItemsData,
  items,
  setInventory,
  setPlayer
}