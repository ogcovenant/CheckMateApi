export const getWeekAndDays = (date: Date) => {
  const weekDays:Array<string> = [];

  const sunday = new Date(date.getTime());
  sunday.setDate(date.getDate() - date.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday.getTime());
    day.setDate(sunday.getDate() + i);
    weekDays.push(day.toLocaleDateString());
  }

  return weekDays;
};