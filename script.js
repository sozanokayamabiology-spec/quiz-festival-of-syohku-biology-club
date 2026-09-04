const API_URL =
  "https://script.google.com/macros/s/AKfycbw4hRguawb1TwJtxHgWpXal9BkB6Od52zPzMCy3-Ti4LGuJgh1u96zhcRbSf9ue3X8Q/exec";


// ========================================
// DOM
// ========================================

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

const resultNickname =
  document.getElementById("resultNickname");

const resultRank =
  document.getElementById("resultRank");

const resultCorrect =
  document.getElementById("resultCorrect");

const questionList =
  document.getElementById("correctQuestions");


// ========================================
// 検索
// ========================================

searchForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    const nickname =
      nicknameInput.value.trim();

    if (!nickname) {
      return;
    }

    // エラー表示をリセット
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


      // 参加者が見つからなかった場合
      if (!data.success) {

        errorMessage.textContent =
          "そのニックネームは見つかりませんでした。";

        return;
      }


      // 結果表示
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


// ========================================
// 結果表示
// ========================================

function showResult(participant) {

  // -------------------------
  // 基本情報
  // -------------------------

  resultNickname.textContent =
    participant.nickname || "";

  resultRank.textContent =
    participant.rank ?? "-";

  resultCorrect.textContent =
    participant.correctCount ?? "0";


  // -------------------------
  // 正解問題を一度クリア
  // -------------------------

  questionList.innerHTML = "";


  // -------------------------
  // 正解した問題
  // -------------------------

  const correctQuestions =
    Array.isArray(participant.correctQuestions)
      ? participant.correctQuestions
      : [];


  if (correctQuestions.length === 0) {

    questionList.innerHTML = `
      <div class="question-item">

        <div class="question-content">

          <p class="question-text">
            正解した問題はありません。
          </p>

        </div>

      </div>
    `;

  } else {

    correctQuestions.forEach(
      function (questionId) {

        const question =
          QUESTIONS[questionId];


        const item =
          document.createElement("article");


        item.className =
          "question-item";


        // -------------------------
        // 問題データが存在しない場合
        // -------------------------

        if (!question) {

          item.innerHTML = `
            <div class="question-content">

              <div class="question-top">

                <span class="question-id">
                  ${escapeHTML(questionId)}
                </span>

                <span class="correct-mark">
                  ✓ CORRECT
                </span>

              </div>

            </div>
          `;

          questionList.appendChild(item);

          return;
        }


        // -------------------------
        // 問題データが存在する場合
        // -------------------------

        item.innerHTML = `
          <div class="question-content">

            <div class="question-top">

              <span class="question-id">
                ${escapeHTML(questionId)}
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

      }
    );

  }


  // -------------------------
  // 画面切り替え
  // -------------------------

  searchScreen.classList.add(
    "hidden"
  );

  resultScreen.classList.remove(
    "hidden"
  );


  // -------------------------
  // ページ上部へ
  // -------------------------

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// 検索画面へ戻る
// ========================================

backButton.addEventListener(
  "click",
  function () {

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


// ========================================
// HTMLエスケープ
// ========================================

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}