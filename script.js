const resultsDiv = document.getElementById('results');
const audioPlayer = document.getElementById('audioPlayer');
const nowPlaying = document.getElementById('nowPlaying');
const playlistEl = document.getElementById('playlist');

let playlist = [];
let currentTrackIndex = -1;
let isDark = false;

function searchMusic() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return alert("Enter something to search!");

  fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e8b84c6074msh5e2c37f347ff002p1195e0jsnfffe5d97dc57',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  })
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = '';
      data.data.slice(0, 10).forEach((track, index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.innerHTML = `🎵 <strong>${track.title}</strong> - ${track.artist.name} <button onclick='addToPlaylist(${JSON.stringify(track).replace(/'/g, "&apos;")})'>➕</button>`;
        resultsDiv.appendChild(songDiv);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch songs.");
    });
}

function addToPlaylist(track) {
  playlist.push({
    title: track.title,
    artist: track.artist.name,
    preview: track.preview
  });
  updatePlaylist();
}

function updatePlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = `${track.title} - ${track.artist}`;
    li.onclick = () => playTrack(index);
    playlistEl.appendChild(li);
  });
}

function playTrack(index) {
  currentTrackIndex = index;
  const track = playlist[index];
  audioPlayer.src = track.preview;
  nowPlaying.textContent = `Now Playing: ${track.title} - ${track.artist}`;
  audioPlayer.play();
}

function playPause() {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
}

function nextTrack() {
  if (playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  playTrack(currentTrackIndex);
}

function prevTrack() {
  if (playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  playTrack(currentTrackIndex);
}

function toggleTheme() {
  isDark = !isDark;
  document.body.style.background = isDark ? '#111' : 'linear-gradient(to right, #141e30, #243b55)';
  document.body.style.color = isDark ? 'white' : 'white';
}
