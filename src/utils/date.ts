export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}
export function minusMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() - minutes * 60000);
}
