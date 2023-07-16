// Constants and Variables Declaration
const mapToSongs = {
  'map1': ['assets/audio/Go Picnic.mp3', 'song2.mp3', 'song3.mp3'],
  'map2': ['song4.mp3', 'song5.mp3', 'song6.mp3'],
  'map3': [],
  'map4': [],
  'map5': ['assets/audio/SleepyWood.mp3'],
};
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const songSelect = document.getElementById('songSelect');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const countdownDisplay = document.getElementById('countdown');
const body = document.querySelector('body');
const mapSelect = document.getElementById('mapSelect');
let countdownInterval;
let alarmSound = null;
let isPaused = false;
let endTime = null;
let remainingTime = null;

// Function Definitions
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

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
    default:
      body.style.backgroundImage = 'none';
  }
  updateSongList(map);
}

function updateSongList(map) {
  const songList = mapToSongs[map] || [];
  songSelect.innerHTML = songList.map(songPath => {
    // Get the song name by splitting the path by '/' and taking the last part, then removing the '.mp3' extension
    const songName = songPath.split('/').pop().replace('.mp3', '');
    return `<option value="${songPath}">${songName}</option>`;
  }).join('');
}



// Event Listeners
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

mapSelect.addEventListener('change', () => {
  const selectedMap = mapSelect.value;
  changeBackground(selectedMap);
  localStorage.setItem('selectedMap', selectedMap); // Save selected map to localStorage
});

// Executable code
const savedMap = localStorage.getItem('selectedMap');
if (savedMap) {
  mapSelect.value = savedMap;
  changeBackground(savedMap);
  updateSongList(savedMap);
}
