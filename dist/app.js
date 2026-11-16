const main = document.querySelector('main');
const key = 'knou-cs-handbook-v1';
const chapters = courses.flatMap(course =>
  course.chapters.map((chapter, index) => ({ ...chapter, course, index }))
);
const pad = number => String(number).padStart(2, '0');
function id(ci, qi) {
  const { course, index } = chapters[ci];
  return course.slug === 'intro' ? `${index}:${qi}` : `${course.slug}:${index}:${qi}`;
}
const validIndex = (index, length) => Number.isInteger(index) && index >= 0 && index < length;
const items = chapters.flatMap((chapter, ci) => chapter.quiz.map((question, qi) => ({
  ci, qi, question, id: id(ci, qi)
})));

let state = { answers: {}, completed: [], last: 0 };
let saved = true;
try {
  const stored = JSON.parse(localStorage.getItem(key));
  if (stored) {
    for (const item of items) {
      const answer = stored.answers?.[item.id];
      if (validIndex(answer, item.question[1].length)) state.answers[item.id] = answer;
    }
    if (Array.isArray(stored.completed)) {
      state.completed = [...new Set(stored.completed.filter(index => validIndex(index, chapters.length)))];
    }
    if (validIndex(stored.last, chapters.length)) state.last = stored.last;
  }
} catch {
  // The handbook remains usable when storage is unavailable.
}

function persist() {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    saved = false;
  }
}

function stats(entries = items) {
  const answered = entries.filter(item => Object.hasOwn(state.answers, item.id));
  const wrong = answered.filter(item => state.answers[item.id] !== item.question[2]);
  return { answered, wrong, correct: answered.length - wrong.length };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

const slots = course => chapters.map((_, ci) => ci).filter(ci => chapters[ci].course === course);
const courseURL = course => `#course/${course.slug}`;
const button = (url, label, secondary = false) =>
  `<a class="button${secondary ? ' secondary' : ''}" href="${url}">${label}</a>`;
const sectionKey = ci => {
  const { course, index } = chapters[ci];
  return course.slug === 'intro' ? String(index + 1) : `${course.slug}/${index + 1}`;
};
const chapterURL = ci => `#chapter/${sectionKey(ci)}`;
const quizURL = (ci, qi) => `#quiz/${sectionKey(ci)}/${qi + 1}`;
const retryURL = (ci, qi) => `#retry/${sectionKey(ci)}/${qi + 1}`;
const lessonLabel = ch => ch.label ?? `교재 ${ch.index + 1}장 · 강의 ${ch.lectures}`;
const questionsFor = course => course ? items.filter(item => chapters[item.ci].course === course) : items;

function chapterList(course) {
  return `<div class="chapter-list">${slots(course).map(ci => {
    const chapter = chapters[ci];
    const result = stats(items.filter(item => item.ci === ci));
    const status = state.completed.includes(ci) ? '읽기 완료 · ' : '';
    return `<a class="chapter-link" href="${chapterURL(ci)}">
      <span class="ordinal">${pad(chapter.index + 1)}</span>
      <span><strong>${chapter.title}</strong><small>${lessonLabel(chapter)} · ${status}${result.answered.length}/${chapter.quiz.length}문항</small></span>
      <span class="arrow" aria-hidden="true">↗</span></a>`;
  }).join('')}</div>`;
}

function courseList() {
  return `<div class="chapter-list">${courses.map(course => {
    const entries = questionsFor(course);
    const result = stats(entries);
    return `<a class="chapter-link course-card" href="${courseURL(course)}">
      <span class="ordinal">${course.year}학년</span>
      <span><strong>${course.title}</strong><small>${result.answered.length}/${entries.length}문항 풀이 · ${result.wrong.length}문항 복습</small></span>
      <span class="arrow" aria-hidden="true">↗</span></a>`;
  }).join('')}</div>`;
}

function home() {
  const result = stats();
  const last = chapters[state.last];
  const hasProgress = result.answered.length || state.completed.length || state.last;
  return `<section class="hero">
    <div><div class="kicker">2026학년도 2학기 기말</div>
      <h1>시험 대비<br>핸드북</h1>
      <p>6과목의 핵심을 읽고 자체 제작 문제로 복습하세요.</p>
      ${hasProgress ? button(chapterURL(state.last), `${last.course.title} 이어가기 →`) : button(courseURL(courses[0]), '컴퓨터과학개론 시작 →')}
    </div>
    <div class="hero-progress"><div class="kicker">전체 풀이 진도</div><strong>${result.answered.length} <span>/ ${items.length}문항</span></strong>
      <progress aria-label="전체 풀이 진도" value="${result.answered.length}" max="${items.length}"></progress>
    </div>
  </section>
  <div class="section-head"><h2>과목 선택</h2><span>1–3학년 · 6과목</span></div>
  ${courseList()}`;
}

function coursePage(course) {
  const ids = slots(course);
  const entries = questionsFor(course);
  const firstUnread = ids.find(ci => !state.completed.includes(ci)) ?? ids[0];
  return `<div class="reading">
    ${heading(`${course.year}학년 · 2026학년도 2학기`, course.title, course.scope)}
    <div class="actions">${button(chapterURL(firstUnread), '학습 시작 →')}
      ${button(`#progress/${course.slug}`, '과목 진도', true)}
      ${button(`#review/${course.slug}`, '과목 오답', true)}
      ${button(`#sources/${course.slug}`, '공식 출처', true)}</div>
    ${scorePanel(entries)}
    <div class="section-head"><h2>학습 목차</h2><span>${ids.length}개 단원</span></div>
    ${chapterList(course)}
  </div>`;
}

function heading(kicker, title, lead = '') {
  return `<header class="pagehead"><div class="kicker">${kicker}</div><h1 tabindex="-1">${title}</h1>${lead ? `<p>${lead}</p>` : ''}</header>`;
}

function chapterPage(ci) {
  const chapter = chapters[ci];
  const [title, code, detail] = chapter.example;
  const course = chapter.course;
  const last = chapter.index === course.chapters.length - 1;
  const nextQuestion = items.find(item => item.ci === ci && !Object.hasOwn(state.answers, item.id));
  const done = state.completed.includes(ci);
  return `<article class="reading">
    ${heading(`${course.title} · ${lessonLabel(chapter)}`, chapter.title, chapter.lead)}
    <div class="actions">${button(quizURL(ci, nextQuestion?.qi ?? 0), '단원 퀴즈 →')}${button(courseURL(course), '과목 목차', true)}
      <button type="button" class="button secondary" id="mark-read" aria-pressed="${done}">${done ? '읽기 완료 ✓' : '읽기 완료 표시'}</button></div>
    <section class="panel"><h2>핵심 이론</h2>${chapter.topics.map(([name, copy]) =>
      `<div class="topic"><h3>${name}</h3><p>${copy}</p></div>`).join('')}</section>
    <section class="panel"><h2>비교표</h2><table aria-label="핵심 개념 비교">
      <thead><tr><th scope="col">개념</th><th scope="col">구분 기준</th></tr></thead>
      <tbody>${chapter.compare.map(([name, copy]) =>
        `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(copy)}</td></tr>`).join('')}</tbody>
    </table></section>
    <section class="panel"><h2>예제</h2><h3>${title}</h3><pre><code>${escapeHtml(code)}</code></pre><p>${detail}</p></section>
    <section class="panel note"><h2>핵심 암기 노트</h2><ul>${chapter.notes.map(note => `<li>${note}</li>`).join('')}</ul></section>
    <nav class="actions page-links" aria-label="장 이동">
      ${chapter.index > 0 ? button(chapterURL(ci - 1), '← 이전 단원', true) : button(courseURL(course), '← 과목 목차', true)}
      ${last ? button(`#progress/${course.slug}`, '과목 진도 →', true) : button(chapterURL(ci + 1), '다음 단원 →', true)}
    </nav>
  </article>`;
}

function quizPage(ci, qi, reviewing) {
  const chapter = chapters[ci];
  const [prompt, choices] = chapter.quiz[qi];
  const reviewURL = `#review/${chapter.course.slug}`;
  const next = reviewing ? reviewURL : qi + 1 < chapter.quiz.length ? quizURL(ci, qi + 1) : `#result/${sectionKey(ci)}`;
  const nextLabel = reviewing ? '오답 노트로' : qi + 1 < chapter.quiz.length ? '다음 문제 →' : '단원 결과 →';
  return `<div class="reading">
    ${heading(reviewing ? '오답 다시 풀기' : `${chapter.course.title} · ${qi + 1} / ${chapter.quiz.length}`, chapter.title, '자체 제작 객관식 · 한 가지 답을 선택하세요.')}
    <section class="panel">
      <form id="quiz-form" class="quiz-form">
        <fieldset><legend>${escapeHtml(prompt)}</legend>
          ${choices.map((choice, index) => `<label class="choice">
          <input type="radio" name="answer" value="${index}" required>
          <span>${String.fromCharCode(65 + index)}. ${escapeHtml(choice)}</span></label>`).join('')}
        </fieldset>
        <div id="feedback" aria-live="polite"></div>
        <div class="actions page-links"><button class="button" type="submit">채점하기</button>
          ${button(next, nextLabel, true)}</div>
      </form>
    </section>
    <nav class="actions page-links" aria-label="퀴즈 이동">
      ${button(reviewing ? reviewURL : chapterURL(ci), reviewing ? '← 오답 노트' : '← 이론으로', true)}
      ${!reviewing && qi > 0 ? button(quizURL(ci, qi - 1), '이전 문제', true) : ''}
    </nav>
  </div>`;
}

function bindQuiz(ci, qi) {
  const form = document.querySelector('#quiz-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = new FormData(form).get('answer');
    if (selected === null) return;
    const answer = Number(selected);
    const [, choices, correct, explanation] = chapters[ci].quiz[qi];
    state.answers[id(ci, qi)] = answer;
    persist();
    updateNav();
    showStorageNotice();

    form.querySelector('fieldset').disabled = true;
    form.querySelector('button').disabled = true;
    document.querySelector('#feedback').innerHTML = `<div class="feedback${answer === correct ? '' : ' wrong'}" tabindex="-1">
      <strong>${answer === correct ? '정답입니다' : '오답입니다'}</strong>
      ${answer !== correct ? `<p>내 답 · ${escapeHtml(choices[answer])}</p>` : ''}
      <p>정답 · ${escapeHtml(choices[correct])}</p><p>${escapeHtml(explanation)}</p>
    </div>`;
    document.querySelector('.feedback').focus();
  });
}

function scorePanel(entries) {
  const { answered, wrong, correct } = stats(entries);
  const score = answered.length ? `${Math.round(100 * correct / answered.length)}%` : '—';
  return `<div class="stats">
    <div class="stat"><strong>${answered.length}/${entries.length}</strong><span class="quiet">풀이 진도</span></div>
    <div class="stat"><strong>${score}</strong><span class="quiet">정답률</span></div>
    <div class="stat"><strong>${wrong.length}</strong><span class="quiet">복습할 오답</span></div>
  </div><progress aria-label="풀이 진도" value="${answered.length}" max="${entries.length}"></progress>
  <p class="quiet">정답 ${correct}문항 · 정답률은 풀이한 문항의 최근 채점 기준입니다.</p>`;
}

function progressPage(course) {
  const ids = course ? slots(course) : chapters.map((_, ci) => ci);
  const completed = ids.filter(ci => state.completed.includes(ci)).length;
  return `<div class="reading">
    ${heading(course?.title ?? '전체 과목', '학습 진도', '진도와 점수는 현재 브라우저에 저장됩니다.')}
    ${scorePanel(questionsFor(course))}
    <div class="section-head"><h2>${course ? '단원별 진도' : '과목별 진도'}</h2><span>읽기 완료 ${completed}/${ids.length}개</span></div>
    ${course ? chapterList(course) : courseList()}</div>`;
}

function resultPage(ci) {
  const chapter = chapters[ci];
  const course = chapter.course;
  const last = chapter.index === course.chapters.length - 1;
  return `<div class="reading">${heading(course.title, '단원 퀴즈 결과', chapter.title)}
    ${scorePanel(items.filter(item => item.ci === ci))}
    <nav class="actions page-links" aria-label="다음 학습">
      ${button(quizURL(ci, 0), '다시 풀기', true)}${button(`#review/${course.slug}`, '과목 오답', true)}
      ${last ? button(`#progress/${course.slug}`, '과목 진도 →') : button(chapterURL(ci + 1), '다음 단원 →')}
    </nav></div>`;
}

function reviewPage(course) {
  const wrong = stats(questionsFor(course)).wrong;
  return `<div class="reading">
    ${heading(course?.title ?? '전체 과목', '오답 노트', '최근에 틀린 문항을 모았습니다. 다시 풀어 맞히면 목록에서 빠집니다.')}
    ${wrong.length ? wrong.map(({ ci, qi, question, id: itemId }) => {
      const chapter = chapters[ci];
      const [prompt, choices, correct, explanation] = question;
      return `<section class="panel">
        <div class="quiet">${chapter.course.title} · ${chapter.title} · ${qi + 1}번</div>
        <h3>${escapeHtml(prompt)}</h3>
        <details><summary>정답과 해설 보기</summary>
          <p>내 답 · ${escapeHtml(choices[state.answers[itemId]])}</p>
          <p>정답 · ${escapeHtml(choices[correct])}</p><p>${escapeHtml(explanation)}</p>
        </details>
        ${button(retryURL(ci, qi), '다시 풀기', true)}
      </section>`;
    }).join('') : `<section class="panel"><h2>복습할 오답이 없습니다</h2>${button(course ? courseURL(course) : '#home', '학습할 단원 찾기')}</section>`}
  </div>`;
}

function sourcesPage(course) {
  const selected = course ? [course] : courses;
  return `<div class="reading">${heading('2026학년도 2학기 · 기말', '학습 범위와 공식 출처')}
  <p>공식 범위와 목차를 기준으로 정리했습니다. 요약과 퀴즈는 자체 제작한 학습 자료입니다.</p>
  <p><a href="${officialScope}">공식 기말시험 범위 공지 (PDF)</a></p>
  ${selected.map(item => `<section class="panel"><h2>${item.title}</h2>
    <p>${item.scope}</p>
    <ul>${item.sources.map(([url, label]) => `<li><a href="${escapeHtml(url)}">${label}</a></li>`).join('')}</ul>
  </section>`).join('')}</div>`;
}

function updateNav(page = location.hash.slice(1).split('/')[0]) {
  const current = {course: 'home', chapter: 'home', quiz: 'home', result: 'progress', retry: 'review'}[page] || page || 'home';
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  const wrong = stats().wrong.length;
  document.querySelector('#review-count').textContent = wrong || '';
}

function render(moveFocus = false) {
  const [page, first, second, third] = location.hash.slice(1).split('/');
  if (page === 'main') {
    main.focus();
    return;
  }
  const course = courses.find(item => item.slug === first);
  const index = Number(course ? second : first) - 1;
  const qi = Number(course ? third : second) - 1;
  const ci = chapters.findIndex(ch => ch.course === (course ?? courses[0]) && ch.index === index);
  const chapterValid = ci !== -1;
  const quizValid = chapterValid && validIndex(qi, chapters[ci].quiz.length);
  const isQuiz = (page === 'quiz' || page === 'retry') && quizValid;
  if (chapterValid && (page === 'chapter' || isQuiz || page === 'result')) {
    state.last = ci;
    persist();
  }
  if (page === 'course' && course) main.innerHTML = coursePage(course);
  else if (page === 'chapter' && chapterValid) main.innerHTML = chapterPage(ci);
  else if (isQuiz) main.innerHTML = quizPage(ci, qi, page === 'retry');
  else if (page === 'result' && chapterValid) main.innerHTML = resultPage(ci);
  else if (page === 'progress') main.innerHTML = progressPage(course);
  else if (page === 'review') main.innerHTML = reviewPage(course);
  else if (page === 'sources') main.innerHTML = sourcesPage(course);
  else main.innerHTML = home();

  document.title = `${main.querySelector('h1').textContent} | 시험 핸드북`;
  if (isQuiz) bindQuiz(ci, qi);
  document.querySelector('#mark-read')?.addEventListener('click', event => {
    const toggled = !state.completed.includes(ci);
    state.completed = toggled ? [...state.completed, ci] : state.completed.filter(index => index !== ci);
    persist();
    event.target.setAttribute('aria-pressed', String(toggled));
    event.target.textContent = toggled ? '읽기 완료 ✓' : '읽기 완료 표시';
    showStorageNotice();
  });
  updateNav(page);
  showStorageNotice();
  if (moveFocus) {
    const title = main.querySelector('h1');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function showStorageNotice() {
  if (!saved && !document.querySelector('#storage-notice')) {
    main.insertAdjacentHTML('afterbegin', '<p id="storage-notice" class="panel quiet" role="status">이 브라우저에서 학습 기록을 저장할 수 없습니다. 현재 탭에서 학습을 이어갈 수 있습니다.</p>');
  }
}

document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});
window.addEventListener('hashchange', () => render(true));
if (location.hash === '#main') history.replaceState(null, '', '#home');
render();
