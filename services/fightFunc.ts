type PlayerRollRes = {
  enemyHealth: number;
  damageDealt: number;
  damageType: string;
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

const death = (calculateHealth: number) => {
  if (calculateHealth < 0){
    return 0;
  } else {
    return calculateHealth
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
    fightReport = `You did ${attackDamage} damage`
  };

  const calculateHealth = enemyHealth - attackDamage;
  const remainingHealth = death(calculateHealth)

  

  const fightResultRes: PlayerRollRes = {
    enemyHealth: remainingHealth,
    damageDealt: attackDamage,
    damageType: fightReport
  }

  return fightResultRes

}

type EnemyRollRes = {
  enemyHealth: number;
  damageDealt: number;
  damageType: string;
}

const enemyFightRoll = (enemyAttack: number, enemyName: string, playerHealth: number) => {

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
    fightReport = `${enemyName} made a Critical attack! Double damage applied.`
  } else if (rollResult === "fatal"){
    attackDamage = enemyAttack * 3
    fightReport = `${enemyName} made a FATAL attack! Triple damage applied.`
  } else if (rollResult === "miss") {
    attackDamage = enemyAttack * 0
    fightReport = `${enemyName} missed!`
  } else {
    attackDamage = enemyAttack
    fightReport = `${enemyName} did ${attackDamage} damage`
  };

  const calculateHealth = playerHealth - attackDamage;
  const remainingHealth = death(calculateHealth)

  const fightResultRes: EnemyRollRes = {
    enemyHealth: remainingHealth,
    damageDealt: attackDamage,
    damageType: fightReport
  }

  return fightResultRes

}

export { playerFightRoll, enemyFightRoll }