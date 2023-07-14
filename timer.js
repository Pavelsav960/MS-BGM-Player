const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const songSelect = document.getElementById('songSelect');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const countdownDisplay = document.getElementById('countdown');
const pauseButton = document.getElementById('pauseButton');

let countdownInterval;
let alarmSound = null; // This is the global variable
let isPaused = false; // This variable keeps track of whether the timer is paused
let endTime = null; // This will hold the target end time

startButton.addEventListener('click', () => {
  // If a timer is already running, stop it.
  if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
  }

  const hours = parseInt(hoursInput.value, 10) || 0;   // Convert to integer or default to 0 if NaN
  const minutes = parseInt(minutesInput.value, 10) || 0;
  const seconds = parseInt(secondsInput.value, 10) || 0;

  let totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds <= 0) {
      alert('Please enter a valid time.');
      return;
  }

  // Calculate the target end time in milliseconds
  endTime = Date.now() + totalSeconds * 1000;

  countdownDisplay.textContent = formatTime(totalSeconds);
  alarmSound = new Audio(songSelect.value);

  countdownInterval = setInterval(() => {
      if (!isPaused) { // Only decrement the time and update the display if not paused
          const remainingSeconds = Math.round((endTime - Date.now()) / 1000);

          countdownDisplay.textContent = formatTime(remainingSeconds);

          if (remainingSeconds <= 0) {
              clearInterval(countdownInterval);
              if (alarmSound) {
                  alarmSound.play();
              }
              alert('Time is up!');
          }
      }
  }, 1000);
});


// Function to convert total seconds into hours, minutes, and seconds
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Use padStart to ensure all values are at least 2 digits
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

resetButton.addEventListener('click', () => {
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
    clearInterval(countdownInterval); // Clear interval if it's still running
    countdownDisplay.textContent = '00:00:00'; // Reset timer display
    hoursInput.value = null;
    minutesInput.value = null;
    secondsInput.value = null;
    endTime = null; // Reset the end time
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';

    if (isPaused) {
        // Pause: clear interval
        clearInterval(countdownInterval);
    }
    else {
        // Resume: recreate interval
        countdownInterval = setInterval(() => {
            const remainingSeconds = Math.round((endTime - Date.now()) / 1000);
            countdownDisplay.textContent = formatTime(remainingSeconds);
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                if (alarmSound) {
                    alarmSound.play();
                }
                alert('Time is up!');
            }
        }, 1000);
    }
});
