type PlayerRollRes = {
  enemyHealth: number;
  damageDealt: number;
  special: string;
}

const playerSpecial = (rollArray: number[]) => {
  let numberEight = 0;
  let numberZerOneTwo = 0;
  for (const num of rollArray) {
    if (num === 8) {
      numberEight++
    } else if (num === 0 || num === 1 || num === 2) {
      numberZerOneTwo ++
    }
  }

  if (numberEight > 1) {
    return "crit"
  } else if (numberEight > 3) {
    return "fatal"
  } else if (numberZerOneTwo > 3) {
    return "miss"
  } 
  
}

const playerFightRoll = (playerAttack: number, enemyHealth: number) => {

  let rollArray: number[] = [];
  let attackDamage: number = 0;
  let fightReport: string = "";

  let rollCounter = 0;
  while (rollCounter < 8) {
    rollArray.push(Math.floor(Math.random() * 10))
    rollCounter++
  }

  const rollResult = playerSpecial(rollArray);

  if (rollResult === "crit"){
    attackDamage =  playerAttack * 2
    fightReport = "You made a critical attack! Double damage applied."
  } else if (rollResult === "fatal"){
    attackDamage =  playerAttack * 3
    fightReport = "You made a FATAL attack! Triple damage applied."
  } else if (rollResult === "miss") {
    attackDamage =  playerAttack * 0
    fightReport = "You missed!"
  } else {
    attackDamage = playerAttack
  };

  const remainingHealth = enemyHealth - attackDamage;

  const fightResultRes: PlayerRollRes = {
    enemyHealth: remainingHealth,
    damageDealt: attackDamage,
    special: fightReport
  }

  return fightResultRes

}

type EnemyRollRes = {
  enemyHealth: number;
  damageDealt: number;
  special: string;
}

const enemyFightRoll = (enemyAttack: number, playerHealth: number) => {

  let rollArray: number[] = [];
  let attackDamage: number = 0;
  let fightReport: string = "";

  let rollCounter = 0;
  while (rollCounter < 8) {
    rollArray.push(Math.floor(Math.random() * 10))
    rollCounter++
  }

  const rollResult = playerSpecial(rollArray);

  if (rollResult === "crit"){
    attackDamage = enemyAttack * 2
    fightReport = "Critical attack! Double damage applied."
  } else if (rollResult === "fatal"){
    attackDamage = enemyAttack * 3
    fightReport = "FATAL attack! Triple damage applied."
  } else if (rollResult === "miss") {
    attackDamage = enemyAttack * 0
    fightReport = "Missed!"
  } else {
    attackDamage = enemyAttack
  };

  const remainingHealth: number = playerHealth - attackDamage;

  const fightResultRes: EnemyRollRes = {
    enemyHealth: remainingHealth,
    damageDealt: attackDamage,
    special: fightReport
  }

  return fightResultRes

}

export { playerFightRoll, enemyFightRoll }