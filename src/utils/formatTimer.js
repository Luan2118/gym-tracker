export default function formatTimer(elapsedTime) {
  let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
  let seconds = Math.floor(elapsedTime / (1000) % 60);
  let milliSeconds = Math.floor((elapsedTime % 1000) / 10);


  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');
  milliSeconds = String(milliSeconds).padStart(2, '0');

  return `${minutes}:${seconds}:${milliSeconds}`
}