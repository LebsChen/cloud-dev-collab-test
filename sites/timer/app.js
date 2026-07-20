const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const setBtn = document.getElementById('set-btn');
const display = document.getElementById('display');
const alertEl = document.getElementById('alert');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let totalSeconds = 60;
let remainingSeconds = totalSeconds;
let timerId = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readInputs() {
  const minutes = clamp(parseInt(minutesInput.value, 10) || 0, 0, 99);
  const seconds = clamp(parseInt(secondsInput.value, 10) || 0, 0, 59);
  minutesInput.value = minutes;
  secondsInput.value = seconds;
  return minutes * 60 + seconds;
}

function render() {
  const m = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const s = String(remainingSeconds % 60).padStart(2, '0');
  display.textContent = `${m}:${s}`;
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function finish() {
  stopTimer();
  display.classList.add('finished');
  alertEl.hidden = false;
  startBtn.disabled = true;
}

function clearFinished() {
  display.classList.remove('finished');
  alertEl.hidden = true;
}

setBtn.addEventListener('click', () => {
  stopTimer();
  clearFinished();
  totalSeconds = readInputs();
  remainingSeconds = totalSeconds;
  startBtn.disabled = totalSeconds === 0;
  render();
});

startBtn.addEventListener('click', () => {
  if (timerId !== null || remainingSeconds <= 0) return;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  timerId = setInterval(() => {
    remainingSeconds -= 1;
    render();
    if (remainingSeconds <= 0) {
      finish();
    }
  }, 1000);
});

pauseBtn.addEventListener('click', stopTimer);

resetBtn.addEventListener('click', () => {
  stopTimer();
  clearFinished();
  remainingSeconds = totalSeconds;
  startBtn.disabled = totalSeconds === 0;
  render();
});

render();
