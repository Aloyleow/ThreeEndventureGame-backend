export const randomSix = (): string => {
  const randomNumber = Math.floor(111111 + Math.random() * 888888);
  return randomNumber.toString();
};


