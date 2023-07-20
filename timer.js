// Constants and Variables Declaration
const mapToSongs = {
  'map1': [
    'assets/audio/elliniaSound/Missing You.mp3',
    'assets/audio/elliniaSound/Moonlight Shadow.mp3',
    'assets/audio/elliniaSound/When the Morning Comes.mp3'],
  'map2': [
    'assets/audio/kerningSound/Bad Guys.mp3',
    'assets/audio/kerningSound/Jungle Book.mp3', 
    'assets/audio/kerningSound/Subway.mp3'],
  'map3': [
    'assets/audio/henesysSound/Cava Bien.mp3',
    'assets/audio/henesysSound/Go Picnic.mp3',
    'assets/audio/henesysSound/Rest N Peace.mp3'
  ],
  'map4': [
    'assets/audio/perionSound/Highland Star.mp3',
    'assets/audio/perionSound/Nightmare.mp3'
  ],
  'map5': [
    'assets/audio/sleepywoodSound/Ancient Move.mp3',
    'assets/audio/sleepywoodSound/SleepyWood.mp3'
  ],
  'map6': [
    'assets/audio/ludiSound/Fantasia.mp3',
    'assets/audio/ludiSound/Fantastic Thinking.mp3',
    'assets/audio/ludiSound/Funny Time Maker.mp3',
    'assets/audio/ludiSound/Waltz For Work.mp3'
  ],
};

const mapSelect = document.getElementById('mapSelect');
const songSelect = document.getElementById('songSelect');
const songNameDisplay = document.getElementById('currentSong');
const playPauseButton = document.getElementById('playPauseButton');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const audioElement = document.querySelector('audio');
const volumeSlider = document.getElementById('volumeSlider');
const songProgressBar = document.getElementById('songProgress');
const currentTimeElement = document.getElementById('currentTime');
const likeButton = document.getElementById('likeButton');

const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

const body = document.querySelector('body');

let currentSongIndex = 0;


// Function Definitions
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
    case 'map6': 
      body.style.backgroundImage = 'url("assets/images/ludiriumBG.jpg")';
      console.log('imin');
      break;
    case 'likedSongs':
      body.style.backgroundImage = 'url("assets/images/likedSongsBG.jpg")';
      break;
    default:
      body.style.backgroundImage = 'none';
  }
  updateSongList(map);
  audioElement.pause();
  playPauseIcon.classList.remove('fa-pause');
  playPauseIcon.classList.add('fa-play');
  songProgressBar.value = 0; // Reset the progress bar
  audioElement.currentTime = 0; // Reset the song time
  currentTimeElement.textContent = '0:00'; // Reset the displayed current time

  
}


function updateSongList(map) {
  const songList = map === 'likedSongs' ? likedSongs : mapToSongs[map] || [];
  currentSongIndex = 0;  // Reset current song index to 0 when updating song list
  songSelect.innerHTML = songList.map((songPath, index) => {
    // Get the song name by splitting the path by '/' and taking the last part, then removing the '.mp3' extension
    const songName = songPath.split('/').pop().replace('.mp3', '');
    return `<option value="${songPath}" ${index === 0 ? 'selected' : ''}>${songName}</option>`;
  }).join('');
  
  if (songList.length > 0) {
    audioElement.src = songList[0];  // Set the audio source to the first song in the list
    audioElement.currentTime = 0; // Reset the song time
    currentTimeElement.textContent = '0:00'; // Reset the displayed current time
    songNameDisplay.textContent = '' + songSelect.options[songSelect.selectedIndex].text;

    if (likedSongs.includes(songSelect.value)) {
      likeButton.classList.add('liked');
    } else {
      likeButton.classList.remove('liked');
    }
  } else {
    audioElement.src = '';
    songNameDisplay.textContent = 'No song is selected';
  }
}



function togglePlayPause(forcePlay = false) {
  console.log('togglePlayPause called, forcePlay:', forcePlay, 'audioElement.paused:', audioElement.paused);
  if (audioElement.paused || forcePlay) {
    audioElement.play().then(() => {
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });
  } else {
    audioElement.pause();
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
  }
}


function prevSong() {
  if (currentSongIndex > 0) {
    currentSongIndex--;
  } else {
    currentSongIndex = songSelect.options.length - 1;  // Loop back to the last song if we're currently at the first song
  }
  songSelect.selectedIndex = currentSongIndex;
  audioElement.src = songSelect.value;
  songNameDisplay.textContent = '' + songSelect.options[songSelect.selectedIndex].text;

  if (likedSongs.includes(songSelect.value)) {
    likeButton.classList.add('liked');
  } else {
    likeButton.classList.remove('liked');
  }

  togglePlayPause(true);  // Automatically play the new song
}

function nextSong() {
  if (currentSongIndex < songSelect.options.length - 1) {
    currentSongIndex++;
  } else {
    currentSongIndex = 0;  // Loop back to the first song if we're currently at the last song
  }
  songSelect.selectedIndex = currentSongIndex;
  audioElement.src = songSelect.value;
  songNameDisplay.textContent = '' + songSelect.options[songSelect.selectedIndex].text;

  if (likedSongs.includes(songSelect.value)) {
    likeButton.classList.add('liked');
  } else {
    likeButton.classList.remove('liked');
  }

  togglePlayPause(true);  // Automatically play the new song
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function onSongSelectChange() {
  currentSongIndex = songSelect.selectedIndex; // Update the current song index
  audioElement.src = songSelect.value; // Update the source of the audio element to the selected song
  songNameDisplay.textContent = '' + songSelect.options[songSelect.selectedIndex].text;
  if (likedSongs.includes(songSelect.value)) {
    likeButton.classList.add('liked');
  } else {
    likeButton.classList.remove('liked');
  }
  togglePlayPause(true);  // Automatically play the new song
}


function likeSong() {
  const selectedSong = songSelect.value;
  if (!likedSongs.includes(selectedSong)) {
    likedSongs.push(selectedSong);
    likeButton.classList.add('liked');
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    alert('Added to liked songs!');
  } else {
    const songIndex = likedSongs.indexOf(selectedSong);
    likedSongs.splice(songIndex, 1);
    likeButton.classList.remove('liked');
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    alert('Removed from liked songs!');

    // If we're in the liked songs playlist, refresh the song list
    if (mapSelect.value === 'likedSongs') {
      updateSongList('likedSongs');

      // After updating the song list, pause the song, reset progress bar, and change play/pause button to "play"
      audioElement.pause();
      songProgressBar.value = 0;
      
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    }
  }
}



// Event Listeners
mapSelect.addEventListener('change', () => {
  const selectedMap = mapSelect.value;
  changeBackground(selectedMap);
  updateSongList(selectedMap);
  localStorage.setItem('selectedMap', selectedMap); // Save selected map to localStorage
});

volumeSlider.addEventListener('input', function() {
  audioElement.volume = volumeSlider.value;
});

audioElement.addEventListener('timeupdate', () => {
  if (isFinite(audioElement.duration)) {
    const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
    songProgressBar.value = progressPercent;
  }
});


songProgressBar.addEventListener('click', function(e) {
  const totalWidth = this.offsetWidth;
  const clickLocation = e.offsetX;
  const selectedPercent = (clickLocation / totalWidth);
  audioElement.currentTime = selectedPercent * audioElement.duration;
});

audioElement.addEventListener('timeupdate', () => {
    if (isFinite(audioElement.duration)) {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        songProgressBar.value = progressPercent;

        const currentTime = audioElement.currentTime;
        currentTimeElement.textContent = formatTime(currentTime); // Change this line
    }
});



playPauseButton.addEventListener('click', () => togglePlayPause());
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);
audioElement.addEventListener('ended', nextSong);
songSelect.addEventListener('change', onSongSelectChange);
likeButton.addEventListener('click', likeSong);


// Executable code
const savedMap = localStorage.getItem('selectedMap');
if (savedMap) {
  mapSelect.value = savedMap;
  changeBackground(savedMap);
  updateSongList(savedMap);
} else {
  updateSongList('map1');  // Default to 'map1' if there's no saved map
}
