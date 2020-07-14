const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
      .map(
        song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
      )
      .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
        : ''
      }
      ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
        : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  try {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    lyr.innerHTML = `<h1 class="display-4"><strong>${artist}</strong> - ${songTitle}</h1><br><br>
    <span style="font-size:18px">${lyrics}</span>`;
  }
  catch (e) {
    lyr.innerHTML = '<br><br><br><h1 class="display-2">Sorry!!<h1><br> <h3 style="font-size: 30px">Could not find the lyrics<h3><br><br>'
  }
  document.getElementById('head').style.opacity = "0.0";
  document.getElementById('more').style.opacity = "0.0";
  document.getElementById('result').style.opacity = "0.0";
  document.getElementById('lyric').style.display = "block";
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
document.getElementById('img').onclick = function () {
  document.getElementById('head').style.opacity = "1";
  document.getElementById('more').style.opacity = "1";
  document.getElementById('result').style.opacity = "1";
  document.getElementById('lyric').style.display = "none";
}
