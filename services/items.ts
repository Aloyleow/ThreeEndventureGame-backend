type Items = {
  levelId: number,
  name: string,
  cost: number,
  description: string,
}[]

const items: Items = [
  {
    levelId: 0,
    name: "Health potion",
    cost: 10,
    description: "blood in vial"
  },
  {
    levelId: 0,
    name: "Mana potion",
    cost: 10,
    description: "Weird substance in vial"
  },
  {
    levelId: 1,
    name: "Pineapple Juice",
    cost: 3,
    description: "yellow liquid in packet"
  },
  {
    levelId: 1,
    name: "Beer",
    cost: 6,
    description: "fizzy yellow liquid in can"
  },
  {
    levelId: 2,
    name: "Beef Steak",
    cost: 12,
    description: "soft delicious looking thing"
  },
  {
    levelId: 2,
    name: "Natto",
    cost: 4,
    description: "gooey beans"
  },
  {
    levelId: 3,
    name: "King arthur's sword",
    cost: 10,
    description: "A sword"
  }
];

const filterItemsData = (items: Items, level: number) => {
  return items.filter((obj) => obj.levelId < level);
};

export {
  filterItemsData,
  items
}