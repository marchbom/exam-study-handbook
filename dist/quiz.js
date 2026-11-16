function stepList(steps) {
  return `<ol class="solution-steps">${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
}

function solution(question, answer) {
  const [, choices, correct, explanation, reasons] = question;
  const wrong = answer !== correct;
  return `${wrong ? `<p><strong>내 답</strong> · ${escapeHtml(choices[answer])}</p>` : ""}
    <p><strong>정답</strong> · ${escapeHtml(choices[correct])}</p>
    <p><strong>풀이</strong></p>
    ${Array.isArray(explanation) ? stepList(explanation) : `<p>${escapeHtml(explanation)}</p>`}
    ${wrong && reasons?.[answer] ? `<p><strong>내 답이 틀린 이유</strong> · ${escapeHtml(reasons[answer])}</p>` : ""}`;
}

function quizPage(ci, qi, reviewing) {
  const chapter = chapters[ci];
  const [prompt, choices, , , , context] = chapter.quiz[qi];
  const scenario =
    context ?? (chapter.course.slug === "english" ? chapter.example[1] : "");
  const reviewURL = `#review/${chapter.course.slug}`;
  const next = reviewing
    ? reviewURL
    : qi + 1 < chapter.quiz.length
      ? quizURL(ci, qi + 1)
      : `#result/${sectionKey(ci)}`;
  const nextLabel = reviewing
    ? "오답 노트로"
    : qi + 1 < chapter.quiz.length
      ? "다음 문제 →"
      : "단원 결과 →";
  return `<div class="reading">
    ${heading(reviewing ? "오답 다시 풀기" : `${chapter.course.title} · ${qi + 1} / ${chapter.quiz.length}`, chapter.title, "자체 제작 객관식 · 답을 선택하면 바로 채점됩니다.")}
    <section class="panel">
      ${scenario ? `<pre class="quiz-context"><code>${escapeHtml(scenario)}</code></pre>` : ""}
      <form id="quiz-form" class="quiz-form">
        <fieldset><legend>${escapeHtml(prompt)}</legend>
          ${choices
            .map(
              (choice, index) => `<label class="choice">
          <input type="radio" name="answer" value="${index}" required>
          <span>${String.fromCharCode(65 + index)}. ${escapeHtml(choice)}</span></label>`,
            )
            .join("")}
        </fieldset>
        <div id="feedback" aria-live="polite"></div>
        <div id="quiz-next" class="actions page-links" hidden>${button(next, nextLabel)}</div>
      </form>
    </section>
    <nav class="actions page-links" aria-label="퀴즈 이동">
      ${button(reviewing ? reviewURL : chapterURL(ci), reviewing ? "← 오답 노트" : "← 이론으로", true)}
      ${!reviewing && qi > 0 ? button(quizURL(ci, qi - 1), "이전 문제", true) : ""}
    </nav>
  </div>`;
}

function bindQuiz(ci, qi) {
  const form = document.querySelector("#quiz-form");
  const fieldset = form.querySelector("fieldset");
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("change", (event) => {
    if (fieldset.disabled || event.target.name !== "answer") return;
    const answer = Number(event.target.value);
    const question = chapters[ci].quiz[qi];
    const correct = question[2];
    if (!validIndex(answer, question[1].length)) return;

    state.answers[id(ci, qi)] = answer;
    persist();
    updateNav();
    showStorageNotice();

    fieldset.disabled = true;
    document.querySelector("#feedback").innerHTML =
      `<div class="feedback${answer === correct ? "" : " wrong"}" tabindex="-1">
      <strong>${answer === correct ? "정답입니다" : "오답입니다"}</strong>
      ${solution(question, answer)}
    </div>`;
    document.querySelector("#quiz-next").hidden = false;
    document.querySelector(".feedback").focus();
  });
}
