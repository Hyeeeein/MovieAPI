import getMovies from "./getMovies.js";

// search
export default async function renderMovies() {
  const search = document.createElement("section");
  search.innerHTML = /* html */ `
      <div class="main__txt">
        <h2>
          OMDb API <br />
          THE OPEN <br />
          MOVIE DATABASE
        </h2>
        <p>
          The OMDb API is a RESTful web service to obtain movie information,
          all content and images on the site are contributed and maintained by
          our users. If you find this service useful, please consider making a
          one-time donation or become a patron.
        </p>
      </div>
      
      <div class="forms">
        <form>
          <label for="search-form">
            <input
              class="search-form"
              id="search-form"
              type="text"
              placeholder="Search for Movies"
            />
          </label>
        </form>
        <div class="select">
          <select class="type-form">
            <option value="movie">movie</option>
            <option value="series">series</option>
            <option value="episode">episode</option>
          </select>
          <select class="count-form">
            <option value="1">10</option>
            <option value="2">20</option>
            <option value="3">30</option>
          </select>
          <select class="year-form">
            <option value="">All Years</option>
          </select>
        </div>
        <button class="search-btn">검색</button>
      </div>

      <div class="movies-wrap">
        <div class="movies--none">Search for the movie title!</div>
        <div class="movies--loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="movies">
        </div>
      </div>

      <div class="more-btn-wrap">
        <!-- more button -->
        <button class="more-btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          MORE
        </button>
      </div>
    `;

  const moviesEl = search.querySelector(".movies");
  const moviesLoading = search.querySelector(".movies--loading");
  const moreBtnWrap = search.querySelector(".more-btn-wrap");
  const moreBtnEl = search.querySelector(".more-btn");
  const inputEl = search.querySelector("#search-form");
  const srchBtn = search.querySelector(".search-btn");
  const typeOp = search.querySelector(".type-form");
  const countOp = search.querySelector(".count-form");
  const yearOp = search.querySelector(".year-form");
  const yearOptions = search.querySelectorAll(".year-form option");
  const moviesNoneTxt = search.querySelector(".movies--none");

  // 초기화
  let page = 1;
  let srchTxt = "";
  let year = "";
  let opsVal = yearOptions.value;
  let typeVal = typeOp.value;
  let countVal = countOp.value;

  let searchWord = JSON.parse(localStorage.getItem("searchWord"));
  inputEl.value = searchWord;
  let searchYear = JSON.parse(localStorage.getItem("searchYear"));
  // let searchPage = JSON.parse(localStorage.getItem("searchPage"));

  if (inputEl.value === "") {
    // input 에 값이 없으면 검색 결과 없애기
    moviesNoneTxt.classList.add("txt--show");
    moviesEl.innerHTML = "";
  } else {
    moviesNoneTxt.classList.remove("txt--show");
  }

  // 최초 호출
  if (searchWord) {
    const movies = await getMovies(searchWord, typeVal, searchYear, page);
    renderMovies(movies);
  } else {
    moviesEl.innerHTML = "";
  }

  // 영화 검색
  inputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      inputRender(e);
    }
  });
  srchBtn.addEventListener("click", async (e) => {
    inputRender(e);
  });
  async function inputRender(e) {
    moviesLoading.classList.add("load--show");
    moviesNoneTxt.classList.remove("txt--show");

    e.preventDefault();
    srchTxt = inputEl.value;
    moviesEl.innerHTML = "";
    page = 1;
    const year = yearOp.value;
    countVal = countOp.value;
    typeVal = typeOp.value;

    localStorage.setItem("searchWord", JSON.stringify(srchTxt));
    localStorage.setItem("searchType", JSON.stringify(typeVal));
    localStorage.setItem("searchYear", JSON.stringify(year));
    localStorage.setItem("searchPage", JSON.stringify(countVal));

    if (srchTxt) {
      moviesNoneTxt.classList.remove("txt--show");
      moreBtnWrap.classList.remove("btn--show");

      let searchVal = JSON.parse(localStorage.getItem("searchWord"));
      // let searchType = JSON.parse(localStorage.getItem("searchType"));

      for (let i = 1; i < countVal; i++) {
        pageCntUp();
      }

      const movies = await getMovies(searchVal, typeVal, year, page);
      renderMovies(movies);
    } else if (srchTxt === "") {
      moreBtnWrap.classList.remove("btn--show");
      moviesNoneTxt.classList.add("txt--show");
      moviesLoading.classList.remove("load--show");
    }
  }

  // 영화 목록 추가
  async function pageCntUp() {
    page += 1;
    const year = yearOp.value;
    typeVal = typeOp.value;
    const movies = await getMovies(srchTxt, typeVal, year, page);
    renderMovies(movies);
  }

  // 개봉연도 검색
  for (let i = new Date().getFullYear(); i >= 1985; i--) {
    const yearOptions = document.createElement("option");
    yearOptions.value = i;
    yearOptions.textContent = i;
    yearOp.append(yearOptions);
  }
  if (opsVal === year) {
    const movies = await getMovies(srchTxt, typeVal, searchYear, page);
    renderMovies(movies);
  }
  Array.from(yearOp).forEach((el) => {
    if (el.innerHTML === searchYear) {
      el.setAttribute("selected", true);
    }
  });

  // 무한 스크롤
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pageCntUp();
      }
    });
  });
  io.observe(moreBtnEl);

  // renderMovies
  function renderMovies(movies) {
    moreBtnWrap.classList.remove("btn--show");
    moviesEl.classList.remove("movies--none");
    if (!movies) {
      moreBtnWrap.classList.remove("btn--show");
      return;
    }
    // 클래스 초기화

    for (const movie of movies) {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = /* html */ `
        <a href='/MovieAPI/#movie/${
          movie.imdbID
        }' style='background-image: url(${
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

  return search;
}
