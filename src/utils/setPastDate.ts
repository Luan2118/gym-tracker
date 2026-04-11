export default function setPastDate(number: number): string {
  const today = new Date();
  return new Date((new Date().setDate(today.getDate() - number))).toISOString();
}