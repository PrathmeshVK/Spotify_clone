import { left_nav, top_nav, loggedOutBottom, top_nav_login, playerBottom } from "../utils/components.js";
import { refreshToken, getPlaylists } from "../utils/api_calls.js";

let spotify_login_flag = JSON.parse(localStorage.getItem('spotify_login_flag'));
const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const background = document.querySelectorAll('.background_color')[0];
const nav_bottom = document.querySelector('#page_bottom');
const TOKEN = localStorage.getItem('spotify_token') || '';
const page_right = document.querySelector('#page_right');
const current_user = localStorage.getItem("spotify_current_user");
const liked_playlists = JSON.parse(localStorage.getItem("spotify_liked_playlists"));
const liked_songs = JSON.parse(localStorage.getItem("spotify_liked_songs"));
const liked_albums = JSON.parse(localStorage.getItem("spotify_liked_albums"));
const library_grid = document.getElementById("library-grid");

nav_left_container.innerHTML = left_nav();
nav_top_container.innerHTML = top_nav_login();
nav_bottom.innerHTML = playerBottom();

const signupChecks = () => {

  const user_pop = document.querySelectorAll('.user_pop')[0];
  const user_options = document.querySelector('#user_options');
  const logout_button = document.querySelector('#logout_btn');
  const username = document.querySelectorAll('.user_name');
  const back_button = document.querySelector("#back_button");
  const forward_button = document.querySelector("#forward_button");

  try {
    forward_button.onclick = () => {
      history.forward();
    }
    back_button.onclick = () => {
      history.back();
    }
  } catch { }

  username.forEach(element => {
    element.textContent = localStorage.getItem('spotify_current_user');
  });

  user_pop.onclick = () => {
    let val = user_options.style.visibility;
    if (val == "hidden") {
      user_options.style.visibility = "visible";
    } else {
      user_options.style.visibility = "hidden";
    }
  }

  logout_button.onclick = () => {
    localStorage.setItem('spotify_login_flag', JSON.stringify(false));
    location.reload();
  }

}

let displayLikedSection = () => {

  let likedSection = document.getElementById("liked-section");

  let likedSongsNames = document.createElement("div");

  liked_songs[current_user].forEach(e => {
    // console.log(e.track.name);
    let names = document.createElement("span");
    names.innerHTML = `${e.track.name} &#x2022; `;
    likedSongsNames.append(names);
  })


  let sectionTitle = document.createElement("h1");
  sectionTitle.textContent = "Liked Songs";
  sectionTitle.style.fontSize = "1.8em";

  let songNumber = document.createElement("h4");
  songNumber.textContent = `${liked_songs[current_user].length} liked songs`;

  let play_btn = document.createElement('button');
  play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
        </path>
      </svg>`;
  play_btn.setAttribute("class", "play-btn-liked");
  likedSection.append(likedSongsNames, sectionTitle, songNumber, play_btn);

  likedSection.onclick = () => {
    location.href = "./liked.html";
  };

};

let displayLikedPlaylists = (data) => {

  // parent.innerHTML = null;
  data.forEach(element => {
    const playlist_tab = document.createElement('div');
    const image_contaier = document.createElement('div');
    const desc_container = document.createElement('div');
    const image = document.createElement('img');
    const play_btn = document.createElement('button');
    const title = document.createElement('p');
    const description = document.createElement('p');

    image.src = element.image;
    title.textContent = element.name;
    description.textContent = element.desc;
    play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
        </path>
      </svg>`;

    playlist_tab.setAttribute('class', 'playlist_tab');
    image_contaier.setAttribute('class', 'mini_background_container');
    desc_container.setAttribute('class', 'short_desc_container');

    playlist_tab.onclick = () => {
      localStorage.setItem("spotify_curr_playlist", JSON.stringify({ name: element.name, id: element.id, desc: element.description, image: element.image }));
      location = "playlist.html";
    }

    desc_container.append(title, description);
    image_contaier.append(image, play_btn);
    playlist_tab.append(image_contaier, desc_container);
    library_grid.append(playlist_tab);
  });


}

let displayLikedAlbums = (data) => {

  // parent.innerHTML = null;
  data.forEach(element => {
    const playlist_tab = document.createElement('div');
    const image_contaier = document.createElement('div');
    const desc_container = document.createElement('div');
    const image = document.createElement('img');
    const play_btn = document.createElement('button');
    const title = document.createElement('p');
    const description = document.createElement('p');

    image.src = element.img;
    title.textContent = element.name;
    description.textContent = element.desc;
    play_btn.innerHTML = `<svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
        </path>
      </svg>`;

    playlist_tab.setAttribute('class', 'playlist_tab');
    image_contaier.setAttribute('class', 'mini_background_container');
    desc_container.setAttribute('class', 'short_desc_container');

    playlist_tab.onclick = () => {
      localStorage.setItem("spotify_current_album", JSON.stringify({ name: element.name, id: element.id, img: element.img, desc: element.desc }));
      location = "album.html";
    }

    desc_container.append(title, description);
    image_contaier.append(image, play_btn);
    playlist_tab.append(image_contaier, desc_container);
    library_grid.append(playlist_tab);
  });


}

let getLibraryData = async () => {
  try {
    let playlists_data = await liked_playlists[current_user];
    displayLikedPlaylists(playlists_data);
  } catch { }
  try {
    let likedSongs_data = await liked_songs[current_user];
    displayLikedSection();
  } catch { }
  try {
    let albums_data = await liked_albums[current_user];
    displayLikedAlbums(albums_data);
  } catch { }
  // console.log(playlists_data);
  // console.log(likedSongs_data);
};

onload = () => {
  getLibraryData();
  signupChecks();
};

