import getMovieInfo from "./getMovieInfo.js";

// movie
export default async function renderMovieInfo(id) {
  let Info = await getMovieInfo(id);

  // 저장된 아이디 값이 있을 때와 없을 때 설정
  if (id) {
    Info = await getMovieInfo(id);
  } else {
    Info = await getMovieInfo();
  }

  const movieInfoEl = document.createElement("div");
  movieInfoEl.classList.add("infos");

  let ratingList = "";
  for (let i = 0; i < Info.Ratings.length; i++) {
    ratingList += /* html */ `
        <p>
          <img src="img/${Info.Ratings[i].Source}.png" alt="${Info.Ratings[i].Source}">
          <span>${Info.Ratings[i].Value}</span>
        </p>
        `;
  }
  if (Info.Ratings.length === 0) {
    ratingList = "No information";
  }

  movieInfoEl.innerHTML = /* html */ `
            <div class="info--loading">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="info-list">
            <div class="info">
        <div class="main-poster">
          <img src="${
            Info.Poster == "N/A"
              ? "img/product_empty.png"
              : Info.Poster.replace("SX300", "SX2000")
          }" alt="poster" />
        </div>
        <div class='main-info'>
          <img class="info__poster" src="${
            Info.Poster == "N/A"
              ? "img/product_empty.png"
              : Info.Poster.replace("SX300", "SX700")
          }" alt="poster" />
          <div class="info__txts">
            <h2 class="title">${Info.Title}</h2>
            <div class="labels">
              <span>${
                Info.Released == "N/A" ? "No information" : Info.Released
              }</span>
              <span>${
                Info.Runtime == "N/A" ? "No information" : Info.Runtime
              }</span>
              <span>${
                Info.Country == "N/A" ? "No information" : Info.Country
              }</span>
            </div>
            <div class="plot">${
              Info.Plot == "N/A" ? "No information" : Info.Plot
            }</div>
            <div class="ratings">
              <h4>Ratings</h4>
              <div>${ratingList}</div>
            </div>
            <div class="actors">
              <h4>Actors</h4>
              <p>${Info.Actors == "N/A" ? "No information" : Info.Actors}</p>
            </div>
            <div class="director">
              <h4>Director</h4>
              <p>${
                Info.Director == "N/A" ? "No information" : Info.Director
              }</p>
            </div>
            <div class="writer">
              <h4>Writer</h4>
              <p>${Info.Writer == "N/A" ? "No information" : Info.Writer}</p>
            </div>
            <div class="genre">
              <h4>Genre</h4>
              <p>${Info.Genre == "N/A" ? "No information" : Info.Genre}</p>
            </div>
          </div>
        </div>
      </div>
          </div>
  `;
  return movieInfoEl;
}
