export const isPastDate = (date) => {
  const now = new Date().getTime();
  return now > new Date(date).getTime();
};

export const isOver18 = (value) => {
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age >= 18;
};
