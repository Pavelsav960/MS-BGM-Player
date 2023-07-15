const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const songSelect = document.getElementById('songSelect');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const countdownDisplay = document.getElementById('countdown');
const body = document.querySelector('body'); // Add this
const mapSelect = document.getElementById('mapSelect');

let countdownInterval;
let alarmSound = null;
let isPaused = false;
let endTime = null;
let remainingTime = null;

startButton.addEventListener('click', () => {
  // If a timer is already running, stop it.
  if (startButton.textContent === 'Stop') {
    clearInterval(countdownInterval);
    remainingTime = endTime - Date.now();
    startButton.textContent = 'Start';
    isPaused = true;
    return;
  }

  let totalSeconds;
  if (!isPaused) {
    const hours = parseInt(hoursInput.value, 10) || 0;
    const minutes = parseInt(minutesInput.value, 10) || 0;
    const seconds = parseInt(secondsInput.value, 10) || 0;
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
      alert('Please enter a valid time.');
      return;
    }
    endTime = Date.now() + totalSeconds * 1000;
    countdownDisplay.textContent = formatTime(totalSeconds);
    alarmSound = new Audio(songSelect.value);
  } else {
    totalSeconds = Math.round(remainingTime / 1000);
    endTime = Date.now() + remainingTime;
    isPaused = false;
  }

  startButton.textContent = 'Stop';

  countdownInterval = setInterval(() => {
    const remainingSeconds = Math.round((endTime - Date.now()) / 1000);

    countdownDisplay.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      if (alarmSound) {
        alarmSound.play();
      }
      alert('Time is up!');
      startButton.textContent = 'Start';
    }
  }, 1000);
});


function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

resetButton.addEventListener('click', () => {
  if (alarmSound) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
  clearInterval(countdownInterval);
  countdownDisplay.textContent = '00:00:00';
  hoursInput.value = null;
  minutesInput.value = null;
  secondsInput.value = null;
  endTime = null;
  isPaused = false;
  remainingTime = null;

  startButton.textContent = 'Start';
});


// Function to change the background
function changeBackground(map) {
  switch (map) {
    case 'map1':
      body.style.backgroundImage = 'url("assets/images/MS_BG.jpg")';
      break;
    case 'map2':
      body.style.backgroundImage = 'url("assets/images/kerningBG.png")';
      break;
    case 'map3': 
      body.style.backgroundImage = 'url("assets/images/henesysBg.jpg")';
      break;
    case 'map4': 
      body.style.backgroundImage = 'url("assets/images/perionBG.png")';
      break;
    case 'map5': 
      body.style.backgroundImage = 'url("assets/images/dungeonBG.png")';
      break;
    // add more cases as per your map options
    default:
      body.style.backgroundImage = 'none';
  }
}

// Event listener for map select
mapSelect.addEventListener('change', () => {
  console.log(mapSelect.value); // Add this line
  changeBackground(mapSelect.value);
});
