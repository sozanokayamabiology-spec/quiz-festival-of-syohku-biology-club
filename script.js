const API_URL =
  "https://script.google.com/macros/s/AKfycbw4hRguawb1TwJtxHgWpXal9BkB6Od52zPzMCy3-Ti4LGuJgh1u96zhcRbSf9ue3X8Q/exec";


const searchForm =
  document.getElementById("searchForm");

const nicknameInput =
  document.getElementById("nickname");

const errorMessage =
  document.getElementById("errorMessage");

const searchScreen =
  document.getElementById("searchScreen");

const resultScreen =
  document.getElementById("resultScreen");

const backButton =
  document.getElementById("backButton");


searchForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    const nickname =
      nicknameInput.value.trim();

    if (!nickname) {
      return;
    }

    errorMessage.textContent = "";

    try {

      const url =
        API_URL +
        "?nickname=" +
        encodeURIComponent(nickname);


      const response =
        await fetch(url);


      if (!response.ok) {
        throw new Error(
          "API request failed"
        );
      }


      const data =
        await response.json();


      if (!data.success) {

        errorMessage.textContent =
          "そのニックネームは見つかりませんでした。";

        return;
      }


      showResult(
        data.participant
      );


    } catch (error) {

      console.error(error);

      errorMessage.textContent =
        "結果を取得できませんでした。もう一度お試しください。";

    }

  }
);


participant.correctQuestions.forEach(function(questionId) {

  const question = QUESTIONS[questionId];

  const item =
    document.createElement("article");

  item.className =
    "question-item";


  // 問題データが存在しない場合
  if (!question) {

    item.innerHTML = `
      <div>
        <span class="question-id">
          ${questionId}
        </span>
      </div>

      <span class="correct-mark">
        ✓ CORRECT
      </span>
    `;

    questionList.appendChild(item);

    return;
  }


  item.innerHTML = `
    <div class="question-content">

      <div class="question-top">

        <span class="question-id">
          ${questionId}
        </span>

        <span class="correct-mark">
          ✓ CORRECT
        </span>

      </div>

      <p class="question-text">
        ${escapeHTML(question.question)}
      </p>

      <div class="answer-box">

        <span class="answer-label">
          CORRECT ANSWER
        </span>

        <p>
          ${escapeHTML(question.answer)}
        </p>

      </div>

    </div>
  `;


  questionList.appendChild(item);

});
  }


  searchScreen.classList.add(
    "hidden"
  );

  resultScreen.classList.remove(
    "hidden"
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


backButton.addEventListener(
  "click",
  function() {

    resultScreen.classList.add(
      "hidden"
    );

    searchScreen.classList.remove(
      "hidden"
    );

    errorMessage.textContent = "";

    nicknameInput.focus();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);