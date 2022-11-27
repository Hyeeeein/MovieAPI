// about
export default function renderAbout() {
  const aboutEl = document.createElement("div");
  aboutEl.classList.add("about");

  aboutEl.innerHTML = /* html */ `
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

  const email = aboutEl.querySelector("#email");
  email.addEventListener("click", copyClipboard);

  function copyClipboard() {
    const emailTxt = email.textContent;
    const textarea = document.createElement("textarea");
    textarea.textContent = emailTxt;
    aboutEl.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();

    alert(
      "이메일 복사가 완료되었습니다. 저의 웹사이트를 봐주셔서 감사합니다. 언제든 연락주세요!"
    );
  }

  return aboutEl;
}
