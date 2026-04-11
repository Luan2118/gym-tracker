export default function formatTimer(elapsedTime: number): string {

  const min = Math.floor(elapsedTime / (1000 * 60) % 60);
  const sec = Math.floor(elapsedTime / (1000) % 60);
  const milliSec = Math.floor((elapsedTime % 1000) / 10);

  const minutes = String(min).padStart(2, '0');
  const seconds = String(sec).padStart(2, '0');
  const milliSeconds = String(milliSec).padStart(2, '0');

  return `${minutes}:${seconds}:${milliSeconds}`
}