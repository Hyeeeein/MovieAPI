import renderMovies from "./js/renderMovies.js";
import renderMovieInfo from "./js/renderMovieInfo.js";
import renderAbout from "./js/renderAbout.js";
// 확장자를 꼭 써주자...

// 최초 호출
const main = document.querySelector("main");
main.append(await renderMovies());

// 검색한 결과 지우기
const home = document.querySelector(".logo");
home.addEventListener("click", async () => {
  localStorage.clear();
  main.innerHTML = ``;
  main.append(await renderMovies());
});

// hashchange
const footer = document.querySelector("footer");

window.addEventListener("hashchange", async () => {
  let hashValue = location.hash.slice(1);
  let storeId;

  // tt~ 값 빼고 movie 만 받아오도록
  if (hashValue.includes("/")) {
    hashValue = location.hash.slice(1, 6);
  }

  switch (hashValue) {
    case "search":
      footer.classList.remove("info--ver");

      main.innerHTML = ``;
      main.append(await renderMovies());
      break;

    case "movie":
      let totalHashVal = location.hash;

      footer.classList.add("info--ver");

      // 전체 해쉬값에서 tt~ 값이 있을 때
      if (totalHashVal.includes("/")) {
        let id = location.hash.slice(7);
        main.innerHTML = ``;
        main.append(await renderMovieInfo(id));
        localStorage.setItem("id", JSON.stringify(id));
      }
      // 전체 해쉬값에서 tt~ 값이 없을 때
      else {
        storeId = JSON.parse(localStorage.getItem("id"));

        // 저장된 tt 값도 없을 때
        if (!storeId) {
          main.innerHTML = ``;
          main.append(await renderMovieInfo("tt4154756"));
        } else {
          // 저장된 tt 값 있으면 불러서 출력
          main.innerHTML = ``;
          main.append(await renderMovieInfo(storeId));
        }
      }
      break;

    case "about":
      footer.classList.remove("info--ver");

      main.innerHTML = ``;
      main.append(renderAbout());
      break;
  }
});
