(async () => {
  // 초기화 코드들~
  const moviesEl = document.querySelector(".movies");
  const moviesLoading = document.querySelector(".movies--loading");

  const moreBtnWrap = document.querySelector(".more-btn-wrap");
  const moreBtnEl = document.querySelector(".more-btn");

  const forms = document.querySelector(".forms");
  const inputEl = document.querySelector("#search-form");
  const srchBtn = document.querySelector(".search-btn");
  const typeOp = document.querySelector(".type-form");
  const countOp = document.querySelector(".count-form");
  const yearOp = document.querySelector(".year-form");
  const yearOptions = document.querySelectorAll(".year-form option");

  const moviesNoneTxt = document.querySelector(".movies--none");
  const main = document.querySelector("main");
  const section = document.querySelector("section");
  const mainTxt = document.querySelector(".main__txt");
  const moviesWrap = document.querySelector(".movies-wrap");

  const infoWrap = document.querySelector(".info-wrap");
  const infoList = document.querySelector(".info-list");
  const infoLoading = document.querySelector(".info--loading");

  const about = document.querySelector(".about");

  let page = 1;
  let srchTxt = "";
  let inputID = "tt4154756";
  let year = "";
  let opsVal = yearOptions.value;
  let typeVal = typeOp.value;

  if (srchTxt === "") {
    moviesNoneTxt.classList.add("txt--show");
  }

  // 최초 호출!
  const movies = await getMovies();
  page += 1;
  renderMovies(movies);

  // 검색 입력 받아오기
  srchBtn.addEventListener("click", async (e) => {
    inputRender(e);
  });
  inputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      inputRender(e);
    }
  });
  async function inputRender(e) {
    moviesLoading.classList.add("load--show");
    moviesNoneTxt.classList.remove("txt--show");

    e.preventDefault();
    srchTxt = inputEl.value;
    // inputEl.value = "";
    moviesEl.innerHTML = "";
    page = 1;
    const year = yearOp.value;
    countVal = countOp.value;
    typeVal = typeOp.value;

    if (srchTxt) {
      moreBtnWrap.classList.remove("btn--show");

      const movies = await getMovies(srchTxt, typeVal, year, page);
      renderMovies(movies);
      for (let i = 1; i < countVal; i++) {
        pageCntUp();
      }
    } else if (srchTxt === "") {
      moreBtnWrap.classList.remove("btn--show");
      moviesNoneTxt.classList.add("txt--show");
      moviesLoading.classList.remove("load--show");
    }
  }

  // 더보기 버튼 클릭!
  moreBtnEl.addEventListener("click", async () => {
    pageCntUp();
  });

  // 개봉연도 검색
  for (let i = 2022; i >= 1985; i--) {
    const yearOptions = document.createElement("option");
    yearOptions.value = i;
    yearOptions.textContent = i;
    yearOp.append(yearOptions);
  }
  if (opsVal === year) {
    const movies = await getMovies(srchTxt, typeVal, opsVal, page);
    renderMovies(movies);
  }

  // 페이지 더 가져오는 function
  async function pageCntUp() {
    page += 1;
    const year = yearOp.value;
    typeVal = typeOp.value;

    const movies = await getMovies(srchTxt, typeVal, year, page);
    renderMovies(movies);
  }

  // 상세정보
  window.addEventListener("hashchange", () => {
    const hashValue = location.hash.slice(1);
    if (hashValue === "") {
      renderSearch();
      mainTxt.classList.remove("txt--none");
      moviesWrap.classList.remove("wrap--none");
    } else if (hashValue === "search") {
      inputEl.value = "";
      renderSearch();
      mainTxt.classList.remove("txt--none");
      moviesWrap.classList.remove("wrap--none");
      infoWrap.classList.add("wrap--none");
    } else if (hashValue === "movie") {
      section.classList.remove("section--none");
      about.classList.add("about--none");

      initMovies();
      initInfo();
      if (inputID) {
        renderMovieInfo(inputID);
      }
    } else if (hashValue === "about") {
      renderAbout();
    } else {
      inputID = location.hash.slice(1);
      renderMovieInfo(inputID);
    }
  });

  // 무한 스크롤
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pageCntUp();
      }
    });
  });
  io.observe(moreBtnEl);

  // api
  async function getMovies(search = "", type = "", year = "", page = 1) {
    const url = `https://omdbapi.com/?apikey=7035c60c&s=${search}&type=${type}&y=${year}&page=${page}`;
    const res = await fetch(url);
    const { Search: movies, totalResults } = await res.json();
    return movies;
  }
  async function getMovieInfo(id = "tt4154756") {
    const res = await fetch(
      `https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`
    );
    const json = await res.json();
    if (json.Response === "True") {
      return json;
    }
    return json.Error;
  }

  // 검색페이지 랜더링 함수
  async function renderSearch() {
    section.classList.remove("section--none");
    moviesNoneTxt.classList.add("txt--show");
    about.classList.add("about--none");

    initMovies();
    initInfo();
    const movies = await getMovies();
    renderMovies(movies);
  }
  function renderAbout() {
    about.classList.remove("about--none");
    section.classList.add("section--none");

    about.innerHTML = /* html */ `
        <div class="profile">
          <div class="profile__img"></div>
          <div class="profile__txt">
            <h2>Kim Hyein</h2>
            <p id='email'>kimhye06@gmail.com</p>
            <a id='vlog' href='https://jane-it-story-blog.tistory.com/' target="_blank">VLOG</a>
            <a id='github' href='https://github.com/Hyeeeein' target="_blank">GitHub</a>
          </div>
        </div>
    `;

    function copyClipboard() {
      const email = document.getElementById("email").textContent;
      const textarea = document.createElement("textarea");
      textarea.textContent = email;
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      alert(
        "이메일 복사가 완료되었습니다. 저의 웹사이트를 봐주셔서 감사합니다. 언제든 연락주세요!"
      );
    }

    const email = document.getElementById("email");
    email.addEventListener("click", copyClipboard);
  }
  // 랜더링 초기화 함수
  function initMovies() {
    moviesEl.innerHTML = "";
    moviesEl.classList.add("movies--none");
    page = 1;
    moreBtnWrap.classList.remove("btn--show");
  }
  function initInfo() {
    infoList.innerHTML = "";
    mainTxt.classList.add("txt--none");
    moviesWrap.classList.add("wrap--none");
    infoLoading.classList.remove("load--show");
  }
  // 영화 목록 가져오는 function
  function renderMovies(movies) {
    forms.classList.remove("forms--hidden");
    infoWrap.classList.add("wrap--none");

    if (!movies) {
      moreBtnWrap.classList.remove("btn--show");
      return;
    }

    // 클래스 초기화
    moreBtnWrap.classList.remove("btn--show");
    moviesEl.classList.remove("movies--none");

    for (const movie of movies) {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = /* html */ `
        <a href='/#${movie.imdbID}' style='background-image: url(${
        movie.Poster === "N/A" ? "img/product_empty.png" : movie.Poster
      })'>
          <div class='movie__txt'>
            <p>${movie.Year}</p>
            <h3>${movie.Title}</h3>
          </div>
        </a>
      `;
      moviesEl.append(movieEl);
    }

    // 로딩된 후 효과
    moreBtnWrap.classList.add("btn--show");
    moviesLoading.classList.remove("load--show");
  }

  // 상세 정보 가져오는 function
  async function renderMovieInfo(inputID) {
    infoWrap.classList.remove("wrap--none");
    infoLoading.classList.add("load--show");
    forms.classList.add("forms--hidden");
    moviesWrap.classList.add("wrap--none");
    mainTxt.classList.add("txt--none");

    let id;
    let Info;

    initMovies();

    if (!inputID) {
      id = location.hash.slice(1);
      return;
    } else {
      id = inputID;
    }
    Info = await getMovieInfo(id);

    // rating
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

    // 화면에 출력할 상세정보 요소 양식
    infoList.innerHTML = /* html */ `
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
    `;

    infoLoading.classList.remove("load--show");
  }
})();
