(function () {
  const $ = (id) => document.getElementById(id);

  const setup        = $("setup");
  const quiz         = $("quiz");
  const results      = $("results");
  const history      = $("history");
  const setupHeading = $("setup-heading");
  const setupFields  = $("setup-fields");
  const greeting     = $("greeting");
  const changeBtn    = $("change-settings-btn");
  const nameInput    = $("name-input");
  const levelSelect  = $("level-select");
  const startSpellingBtn    = $("start-spelling-btn");
  const mathsSublists       = $("maths-sublists");
  const mathsSublistButtons = $("maths-sublist-buttons");
  const historyBtn   = $("history-btn");
  const wordEmoji    = $("word-emoji");
  const questionTextEl = $("question-text");
  const numberLineEl   = $("number-line");
  const wordControlsEl = $("word-controls");
  const sayWordBtn   = $("say-word-btn");
  const saySentBtn   = $("say-sentence-btn");
  const answerForm   = $("answer-form");
  const answerInput  = $("answer-input");
  const feedback     = $("feedback");
  const nextBtn      = $("next-btn");
  const progress     = $("progress");
  const scoreEl      = $("score");
  const missedList   = $("missed-list");
  const retryBtn     = $("retry-missed-btn");
  const restartBtn   = $("restart-btn");
  const historyFilter   = $("history-filter");
  const historyList     = $("history-list");
  const historySummary  = $("history-summary");
  const backHistoryBtn  = $("back-from-history-btn");

  const HISTORY_KEY = "spelling.history";
  const NAME_KEY    = "spelling.name";
  const LEVEL_KEY   = "spelling.level";
  const STREAK_KEY  = "spelling.streaks";
  const WORDS_PER_SESSION = 10;
  const CHOCOLATE_STREAK = 10;

  const lists       = window.WORD_LISTS || {};
  const mathsLists  = window.MATHS_LISTS || {};
  const mathsGens   = window.MATHS_GENERATORS || {};

  const quizMascot    = $("quiz-mascot");
  const resultsMascot = $("results-mascot");
  const homeStreakEl       = $("home-streak");
  const homeChocolateEl    = $("home-chocolate");
  const resultsStreakEl    = $("results-streak");
  const resultsChocolateEl = $("results-chocolate");

  const MASCOT_BY_LEVEL = {
    "Kindergarten": "Monty",
    "Year 1": "Monty",
    "Year 2": "Monty",
    "Year 3": "Monty",
    "Year 4": "NinjaBunny",
    "Year 5": "NinjaBunny",
    "Year 6": "NinjaBunny",
  };

  function mascotFor(level) {
    return MASCOT_BY_LEVEL[level] || "Monty";
  }

  function mascotSrc(level, variant) {
    return `Images/${mascotFor(level)}_${variant}.png`;
  }

  const CONFETTI_COLORS = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#fb7185", "#facc15", "#22d3ee"];

  function launchConfetti(originX, originY) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = document.createElement("div");
    container.className = "confetti-burst";
    const count = 40;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 200;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed * 0.6;
      const rot = (Math.random() * 900 - 450).toFixed(0) + "deg";
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const duration = 2200 + Math.random() * 1400;
      const delay = Math.random() * 180;
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = color;
      piece.style.setProperty("--tx", tx.toFixed(1) + "px");
      piece.style.setProperty("--ty", ty.toFixed(1) + "px");
      piece.style.setProperty("--rot", rot);
      piece.style.animationDuration = duration + "ms";
      piece.style.animationDelay = delay + "ms";
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4800);
  }

  function celebrateFromMascot() {
    const rect = quizMascot.getBoundingClientRect();
    if (!rect.width) return;
    launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  let resultsAnimTimer = null;

  function stopResultsAnimation() {
    if (resultsAnimTimer) {
      clearInterval(resultsAnimTimer);
      resultsAnimTimer = null;
    }
    resultsMascot.classList.remove("animated");
  }

  function setStaticResultsMascot(level, variant) {
    stopResultsAnimation();
    resultsMascot.style.backgroundImage = `url("${mascotSrc(level, variant)}")`;
    resultsMascot.style.backgroundPosition = "center";
  }

  function playResultsAnimation(level) {
    stopResultsAnimation();
    resultsMascot.classList.add("animated");
    resultsMascot.style.backgroundImage = `url("Images/${mascotFor(level)}Animation.png")`;
    const cols = 6, rows = 3, total = cols * rows;
    const skip = new Set([13, 14]);
    let frame = -1;
    function nextFrame() {
      do { frame = (frame + 1) % total; } while (skip.has(frame));
      return frame;
    }
    function step() {
      const f = nextFrame();
      const col = f % cols;
      const row = Math.floor(f / cols);
      const x = (col / (cols - 1)) * 100;
      const y = (row / (rows - 1)) * 100;
      resultsMascot.style.backgroundPosition = `${x}% ${y}%`;
    }
    step();
    resultsAnimTimer = setInterval(step, 220);
  }

  function setQuizMascot(variant) {
    if (!session) return;
    quizMascot.src = mascotSrc(session.level, variant);
    quizMascot.classList.remove("react");
    if (variant !== "Standard") {
      void quizMascot.offsetWidth;
      quizMascot.classList.add("react");
    }
  }

  let session = null;
  // An "attempt" wraps the initial session plus any retry-missed rounds the kid plays
  // through before either reaching 0 missed or clicking "New practice".
  let attempt = null;

  // ---- streaks ----

  function loadStreaks() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function daysBetween(a, b) {
    const ad = new Date(a + "T00:00:00").getTime();
    const bd = new Date(b + "T00:00:00").getTime();
    return Math.round((bd - ad) / 86400000);
  }

  // Streak entry shape:
  //   { lastCounted: "YYYY-MM-DD",   // last day the streak ticked up (both subjects done)
  //     count: N,
  //     todayDate: "YYYY-MM-DD",     // the day todayDone applies to
  //     todayDone: { spelling: true, maths: true } }
  //
  // Old shape was { last, count } and assumed any practice ticked the streak.
  // We migrate read-only so existing kids don't lose their numbers.
  function readStreakEntry(all, name) {
    const raw = all[name];
    if (!raw) return null;
    // New shape always carries a `todayDate` key (even if null). Anything
    // without it is the legacy `{ last, count }` shape and needs migrating.
    if ("todayDate" in raw) return raw;
    return {
      lastCounted: raw.last || null,
      count: raw.count || 0,
      todayDate: null,
      todayDone: {},
    };
  }

  // Records that `name` practised `subject` today. Returns the live streak count
  // after this practice. The count only ticks once both spelling AND maths have
  // been done on the same day.
  function recordPracticeForToday(name, subject) {
    if (!name || !subject) return 0;
    const all = loadStreaks();
    const today = todayStr();
    const entry = readStreakEntry(all, name) || {
      lastCounted: null,
      count: 0,
      todayDate: null,
      todayDone: {},
    };
    if (entry.todayDate !== today) {
      entry.todayDate = today;
      entry.todayDone = {};
    }
    entry.todayDone[subject] = true;
    const bothDone = entry.todayDone.spelling && entry.todayDone.maths;
    if (bothDone && entry.lastCounted !== today) {
      const gap = entry.lastCounted ? daysBetween(entry.lastCounted, today) : null;
      entry.count = gap === 1 ? entry.count + 1 : 1;
      entry.lastCounted = today;
    }
    all[name] = entry;
    localStorage.setItem(STREAK_KEY, JSON.stringify(all));
    return entry.count;
  }

  // Returns { count, todayDone: { spelling, maths } } for display.
  // count is 0 once a day is missed (last counted day was 2+ days ago).
  function getStreakStatus(name) {
    if (!name) return { count: 0, todayDone: {} };
    const all = loadStreaks();
    const entry = readStreakEntry(all, name);
    if (!entry) return { count: 0, todayDone: {} };
    const today = todayStr();
    const gap = entry.lastCounted ? daysBetween(entry.lastCounted, today) : null;
    const liveCount = (gap === 0 || gap === 1) ? (entry.count || 0) : 0;
    const todayDone = entry.todayDate === today ? (entry.todayDone || {}) : {};
    return { count: liveCount, todayDone };
  }

  function currentStreakFor(name) {
    return getStreakStatus(name).count;
  }

  function renderStreakInto(name, streakEl, chocolateEl) {
    if (!name) {
      streakEl.classList.add("hidden");
      chocolateEl.classList.add("hidden");
      return;
    }
    const { count, todayDone } = getStreakStatus(name);
    const spellingDone = !!todayDone.spelling;
    const mathsDone    = !!todayDone.maths;
    const bothDone     = spellingDone && mathsDone;

    const lines = [];
    if (count > 0) {
      const dayWord = count === 1 ? "day" : "days";
      lines.push(`<div class="streak-line">🔥 ${count} ${dayWord} in a row!</div>`);
    } else if (spellingDone || mathsDone) {
      lines.push(`<div class="streak-line">Almost there! Do both today to start a streak.</div>`);
    } else {
      lines.push(`<div class="streak-line">Do spelling and maths today to start a streak!</div>`);
    }

    if (!bothDone) {
      const s = spellingDone ? "✅" : "⬜";
      const m = mathsDone    ? "✅" : "⬜";
      lines.push(`<div class="streak-sub">Today: ${s} Spelling · ${m} Maths</div>`);
    }

    streakEl.innerHTML = lines.join("");
    streakEl.classList.remove("hidden");

    if (count >= CHOCOLATE_STREAK) {
      chocolateEl.classList.remove("hidden");
    } else {
      chocolateEl.classList.add("hidden");
    }
  }

  function refreshHomeStreak() {
    renderStreakInto(nameInput.value.trim(), homeStreakEl, homeChocolateEl);
  }

  // ---- setup screen ----

  function populateLevels() {
    levelSelect.innerHTML = "";
    // Union of years present in either subject so the kid picks a year once
    const years = new Set([...Object.keys(lists), ...Object.keys(mathsLists)]);
    years.forEach((lvl) => {
      const opt = document.createElement("option");
      opt.value = lvl;
      opt.textContent = lvl;
      levelSelect.appendChild(opt);
    });
    const savedLevel = localStorage.getItem(LEVEL_KEY);
    if (savedLevel && years.has(savedLevel)) {
      levelSelect.value = savedLevel;
    }
  }

  function countWordsInLevel(level) {
    const subs = lists[level] || {};
    return Object.values(subs).reduce((sum, arr) => sum + arr.length, 0);
  }

  function applySetupMode() {
    const savedName  = localStorage.getItem(NAME_KEY)  || "";
    const savedLevel = localStorage.getItem(LEVEL_KEY) || "";
    if (savedName && savedLevel && (lists[savedLevel] || mathsLists[savedLevel])) {
      collapseSetup(savedName, savedLevel);
    } else {
      expandSetup();
    }
    refreshMathsTopics(levelSelect.value);
    refreshHomeStreak();
    maybeReloadForUpdate();
  }

  function collapseSetup(name, level) {
    nameInput.value = name;
    levelSelect.value = level;
    setupHeading.classList.add("hidden");
    setupFields.classList.add("hidden");
    greeting.classList.remove("hidden");
    greeting.querySelector(".name").textContent = `Hi ${name}!`;
    greeting.querySelector(".meta").textContent = `${level} · ${WORDS_PER_SESSION} questions per round`;
    changeBtn.classList.remove("hidden");
  }

  function expandSetup() {
    setupHeading.classList.remove("hidden");
    setupFields.classList.remove("hidden");
    greeting.classList.add("hidden");
    changeBtn.classList.add("hidden");
  }

  nameInput.value = localStorage.getItem(NAME_KEY) || "";
  nameInput.addEventListener("input", () => {
    localStorage.setItem(NAME_KEY, nameInput.value.trim());
    refreshHomeStreak();
  });

  changeBtn.addEventListener("click", expandSetup);

  levelSelect.addEventListener("change", () => {
    refreshMathsTopics(levelSelect.value);
  });

  startSpellingBtn.addEventListener("click", () => {
    const name  = nameInput.value.trim();
    const level = levelSelect.value;
    if (!name) { nameInput.focus(); return; }
    if (!level || !lists[level]) return;
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(LEVEL_KEY, level);
    const words = buildSpellingSession(level);
    if (!words.length) return;
    beginAttempt({ name, level, subject: "spelling", subList: null, words });
  });

  function refreshMathsTopics(level) {
    const subs = mathsLists[level] || {};
    mathsSublistButtons.innerHTML = "";
    Object.keys(subs).forEach((subName) => {
      const btn = document.createElement("button");
      btn.textContent = subName;
      btn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) { nameInput.focus(); return; }
        const questions = buildMathsSession(level, subName);
        if (!questions.length) return;
        localStorage.setItem(NAME_KEY, name);
        localStorage.setItem(LEVEL_KEY, level);
        beginAttempt({
          name,
          level,
          subject: "maths",
          subList: subName,
          words: questions,
        });
      });
      mathsSublistButtons.appendChild(btn);
    });
  }

  function beginAttempt({ name, level, subject, subList, words }) {
    if (attempt && !attempt.posted) postAttemptToForm(attempt);
    attempt = {
      name,
      level,
      subject,
      subList,
      originalTotal: words.length,
      originalCorrect: null,
      retries: 0,
      endCorrect: 0,
      lastMissed: [],
      posted: false,
    };
    startSession(words, level, subject, subList);
  }

  function buildSpellingSession(level) {
    const subs = lists[level] || {};
    const all = [];
    Object.values(subs).forEach((arr) => arr.forEach((w) => all.push(w)));
    return shuffle(all).slice(0, Math.min(WORDS_PER_SESSION, all.length));
  }

  function buildMathsSession(level, subName) {
    const sub = (mathsLists[level] || {})[subName];
    if (!sub) return [];
    if (Array.isArray(sub)) {
      return shuffle(sub.slice()).slice(0, Math.min(WORDS_PER_SESSION, sub.length));
    }
    if (sub.generator && mathsGens[sub.generator]) {
      const gen = mathsGens[sub.generator];
      const args = sub.args || {};
      const seen = new Set();
      const out = [];
      // Cap attempts so a small generator space can't loop forever
      let tries = 0;
      while (out.length < WORDS_PER_SESSION && tries < 200) {
        tries += 1;
        const q = gen(args);
        if (!q || !q.question) continue;
        if (seen.has(q.question)) continue;
        seen.add(q.question);
        out.push(q);
      }
      return out;
    }
    return [];
  }

  // ---- quiz ----

  function startSession(words, level, subject, subList) {
    session = {
      words,
      i: 0,
      correct: 0,
      missed: [],
      name: nameInput.value.trim() || "friend",
      level: level || levelSelect.value,
      subject: subject || "spelling",
      subList: subList || null,
    };
    setup.classList.add("hidden");
    results.classList.add("hidden");
    quiz.classList.remove("hidden");
    feedback.textContent = "";
    feedback.className = "";
    answerForm.classList.remove("hidden");
    nextBtn.classList.add("hidden");
    answerInput.value = "";
    if (session.subject === "maths") {
      answerInput.setAttribute("inputmode", "numeric");
      answerInput.setAttribute("placeholder", "Type the answer here");
    } else {
      answerInput.setAttribute("inputmode", "text");
      answerInput.setAttribute("placeholder", "Type the word here");
    }
    setQuizMascot("Standard");
    showCurrent();
    answerInput.focus();
  }

  function current() {
    return session.words[session.i];
  }

  function ensureNumberLine() {
    if (numberLineEl.childElementCount) return;
    for (let i = 0; i <= 20; i++) {
      const m = document.createElement("div");
      m.className = "nl-mark" + (i % 5 === 0 ? " major" : "");
      const tick = document.createElement("div");
      tick.className = "tick";
      const num = document.createElement("div");
      num.className = "num";
      num.textContent = i;
      m.appendChild(tick);
      m.appendChild(num);
      numberLineEl.appendChild(m);
    }
  }

  function showCurrent() {
    const label = session.subject === "maths" ? "Question" : "Word";
    progress.textContent = `${label} ${session.i + 1} of ${session.words.length}`;
    const cur = current();
    if (session.subject === "maths") {
      wordEmoji.classList.add("hidden");
      wordControlsEl.classList.add("hidden");
      questionTextEl.textContent = cur.question;
      questionTextEl.classList.remove("hidden");
      if (cur.aid === "numberline") {
        ensureNumberLine();
        numberLineEl.classList.remove("hidden");
      } else {
        numberLineEl.classList.add("hidden");
      }
    } else {
      questionTextEl.classList.add("hidden");
      numberLineEl.classList.add("hidden");
      wordControlsEl.classList.remove("hidden");
      const emoji = cur.emoji;
      if (emoji) {
        wordEmoji.textContent = emoji;
        wordEmoji.classList.remove("hidden");
      } else {
        wordEmoji.textContent = "";
        wordEmoji.classList.add("hidden");
      }
      speakWordWithContext(cur);
    }
  }

  sayWordBtn.addEventListener("click", () => {
    if (session && session.subject !== "maths") speakWordWithContext(current());
  });
  saySentBtn.addEventListener("click", () => {
    if (session && session.subject !== "maths") speakSentence(current().sentence);
  });

  function advanceQuiz() {
    nextBtn.classList.add("hidden");
    answerForm.classList.remove("hidden");
    feedback.textContent = "";
    feedback.className = "";
    if (session.i >= session.words.length) {
      showResults();
    } else {
      setQuizMascot("Standard");
      showCurrent();
      answerInput.focus();
    }
  }

  nextBtn.addEventListener("click", advanceQuiz);

  function normaliseMathsAnswer(s) {
    return String(s)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[×x]/g, "*")
      .replace(/[÷]/g, "/")
      .replace(/−/g, "-");
  }

  function checkAnswer(guess, cur) {
    if (session.subject === "maths") {
      const g = normaliseMathsAnswer(guess);
      const t = normaliseMathsAnswer(cur.answer);
      if (g === t) return true;
      const gn = parseFloat(g);
      const tn = parseFloat(t);
      return !isNaN(gn) && !isNaN(tn) && gn === tn;
    }
    return guess.trim().toLowerCase() === String(cur.word).toLowerCase();
  }

  function correctAnswerText(cur) {
    return session.subject === "maths"
      ? `${cur.question} = ${cur.answer}`
      : `"${cur.word}"`;
  }

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const guess = answerInput.value.trim();
    if (!guess) return;
    const cur = current();
    const wasCorrect = checkAnswer(guess, cur);
    answerInput.value = "";
    if (wasCorrect) {
      session.correct += 1;
      feedback.textContent = "✅ Correct!";
      feedback.className = "good";
      setQuizMascot("Correct" + (1 + Math.floor(Math.random() * 3)));
      celebrateFromMascot();
      session.i += 1;
      setTimeout(advanceQuiz, 900);
    } else {
      session.missed.push(cur);
      feedback.textContent = `❌ The answer was ${correctAnswerText(cur)}.`;
      feedback.className = "bad";
      setQuizMascot("Incorrect" + (1 + Math.floor(Math.random() * 3)));
      session.i += 1;
      answerForm.classList.add("hidden");
      nextBtn.classList.remove("hidden");
      nextBtn.focus();
    }
  });

  // ---- results ----

  function showResults() {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    const total = session.words.length;
    const pct = total ? session.correct / total : 0;

    if (attempt) {
      if (attempt.originalCorrect === null) {
        attempt.originalTotal = total;
        attempt.originalCorrect = session.correct;
        attempt.endCorrect = session.correct;
      } else {
        attempt.endCorrect += session.correct;
      }
      attempt.lastMissed = session.missed.map((w) => w.word || w.question);
    }

    if (attempt && attempt.retries > 0) {
      const retryWord = attempt.retries === 1 ? "retry" : "retries";
      scoreEl.textContent =
        `${session.name}: ${attempt.endCorrect} of ${attempt.originalTotal} correct ` +
        `(started ${attempt.originalCorrect}/${attempt.originalTotal}, ${attempt.retries} ${retryWord})`;
    } else {
      scoreEl.textContent = `${session.name}: ${session.correct} of ${total} correct`;
    }

    missedList.innerHTML = "";
    session.missed.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = session.subject === "maths"
        ? `${w.question} = ${w.answer}`
        : w.word;
      missedList.appendChild(li);
    });
    retryBtn.disabled = session.missed.length === 0;
    saveSessionToHistory();

    const streak = recordPracticeForToday(session.name, session.subject);
    renderStreakInto(session.name, resultsStreakEl, resultsChocolateEl);

    const justHitChocolate = streak === CHOCOLATE_STREAK;
    if (pct === 1 || justHitChocolate) {
      playResultsAnimation(session.level);
    } else {
      const variant = pct >= 0.7 ? "Correct1" : pct >= 0.4 ? "Standard" : "Incorrect3";
      setStaticResultsMascot(session.level, variant);
    }
    if (justHitChocolate) {
      setTimeout(() => {
        const r = resultsMascot.getBoundingClientRect();
        if (r.width) launchConfetti(r.left + r.width / 2, r.top + r.height / 2);
      }, 250);
    }

    if (attempt && session.missed.length === 0) {
      postAttemptToForm(attempt);
    }
  }

  const FORM_SUBMIT_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSe9LGA5PJRHobQFzmjqtwyBwr00_rnRtc2WENiIc_qJJ_YRSg/formResponse";
  const FORM_FIELDS = {
    name:   "entry.1806740295",
    level:  "entry.1102747939",
    score:  "entry.495004592",
    total:  "entry.1263955883",
    pct:    "entry.82973578",
    missed: "entry.1636150148",
  };

  function postAttemptToForm(a) {
    if (!a || a.posted) return;
    a.posted = true;
    try {
      const total = a.originalTotal;
      const pct = total ? Math.round((a.endCorrect / total) * 100) : 0;
      const levelLabel = a.subject === "maths"
        ? `${a.level} · Maths${a.subList ? " · " + a.subList : ""}`
        : `${a.level} · Spelling`;
      const data = new FormData();
      data.append(FORM_FIELDS.name,   a.name);
      data.append(FORM_FIELDS.level,  levelLabel);
      data.append(FORM_FIELDS.score,  String(a.endCorrect));
      data.append(FORM_FIELDS.total,  String(total));
      data.append(FORM_FIELDS.pct,    String(pct));
      const remaining = a.lastMissed && a.lastMissed.length
        ? `still missed: ${a.lastMissed.join(", ")}`
        : "perfect";
      const original = a.originalCorrect == null ? "—" : `${a.originalCorrect}/${total}`;
      data.append(FORM_FIELDS.missed, `Original: ${original}. Retries: ${a.retries}. ${remaining}`);
      fetch(FORM_SUBMIT_URL, { method: "POST", mode: "no-cors", body: data }).catch(() => {});
    } catch (e) { /* best effort */ }
  }

  function saveSessionToHistory() {
    const entry = {
      ts: Date.now(),
      name: session.name,
      level: session.level,
      subject: session.subject,
      list: session.subList || "",
      total: session.words.length,
      correct: session.correct,
      missed: session.missed.map((w) => w.word || w.question),
    };
    const all = loadHistory();
    all.push(entry);
    const trimmed = all.slice(-500);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  retryBtn.addEventListener("click", () => {
    if (!session.missed.length) return;
    stopResultsAnimation();
    if (attempt) attempt.retries += 1;
    startSession(shuffle(session.missed.slice()), session.level, session.subject, session.subList);
  });

  restartBtn.addEventListener("click", () => {
    stopResultsAnimation();
    if (attempt && !attempt.posted) postAttemptToForm(attempt);
    attempt = null;
    results.classList.add("hidden");
    setup.classList.remove("hidden");
    applySetupMode();
  });

  // ---- history view ----

  historyBtn.addEventListener("click", () => {
    setup.classList.add("hidden");
    renderHistory();
    history.classList.remove("hidden");
  });

  backHistoryBtn.addEventListener("click", () => {
    history.classList.add("hidden");
    setup.classList.remove("hidden");
    applySetupMode();
  });

  historyFilter.addEventListener("change", renderHistory);

  function renderHistory() {
    const all = loadHistory();
    const names = Array.from(new Set(all.map((e) => e.name))).sort();
    const prev = historyFilter.value;
    historyFilter.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "__all__";
    allOpt.textContent = "Everyone";
    historyFilter.appendChild(allOpt);
    names.forEach((n) => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      historyFilter.appendChild(opt);
    });
    if (prev && (prev === "__all__" || names.includes(prev))) {
      historyFilter.value = prev;
    }

    const filterName = historyFilter.value || "__all__";
    const entries = all
      .filter((e) => filterName === "__all__" || e.name === filterName)
      .sort((a, b) => b.ts - a.ts);

    historyList.innerHTML = "";
    if (!entries.length) {
      historySummary.textContent = "";
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No practice sessions yet.";
      historyList.appendChild(li);
      return;
    }

    const totalCorrect = entries.reduce((s, e) => s + e.correct, 0);
    const totalAsked   = entries.reduce((s, e) => s + e.total,   0);
    const pct = totalAsked ? Math.round((totalCorrect / totalAsked) * 100) : 0;
    historySummary.textContent =
      `${entries.length} session${entries.length === 1 ? "" : "s"} · ` +
      `${totalCorrect}/${totalAsked} correct (${pct}%)`;

    entries.forEach((e) => historyList.appendChild(renderEntry(e)));
  }

  function renderEntry(e) {
    const li = document.createElement("li");
    const pct = e.total ? Math.round((e.correct / e.total) * 100) : 0;
    const tone = pct >= 90 ? "good" : pct >= 60 ? "ok" : "bad";

    const top = document.createElement("div");
    top.className = "entry-top";

    const left = document.createElement("div");
    const subj = e.subject ? ` · ${e.subject === "maths" ? "Maths" : "Spelling"}` : "";
    const metaText = e.list ? `${e.level}${subj} › ${e.list}` : `${e.level}${subj}`;
    left.innerHTML =
      `<div><span class="entry-name"></span> — <span class="entry-meta"></span></div>` +
      `<div class="entry-meta when"></div>`;
    left.querySelector(".entry-name").textContent = e.name;
    left.querySelector(".entry-meta").textContent = metaText;
    left.querySelector(".when").textContent = formatWhen(e.ts);

    const score = document.createElement("div");
    score.className = `entry-score ${tone}`;
    score.textContent = `${e.correct}/${e.total} (${pct}%)`;

    top.appendChild(left);
    top.appendChild(score);
    li.appendChild(top);

    if (e.missed && e.missed.length) {
      const m = document.createElement("div");
      m.className = "entry-missed";
      m.textContent = `Missed: ${e.missed.join(", ")}`;
      li.appendChild(m);
    }
    return li;
  }

  function formatWhen(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (sameDay)     return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;
    return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" }) + `, ${time}`;
  }

  // ---- speech ----

  // Words with this many letters or fewer are repeated and slowed down,
  // because short words are otherwise hard to make out via TTS.
  const SHORT_WORD_MAX_LETTERS = 4;
  const SHORT_WORD_RATE   = 0.7;
  const NORMAL_WORD_RATE  = 0.9;
  const SENTENCE_RATE     = 0.95;
  const REPEAT_GAP_MS     = 500;

  let pendingRepeat = null;

  function cancelSpeech() {
    if (pendingRepeat) { clearTimeout(pendingRepeat); pendingRepeat = null; }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function makeUtterance(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.0;
    u.lang = "en-US";
    return u;
  }

  function speakWord(word) {
    if (!("speechSynthesis" in window)) return;
    cancelSpeech();
    const text = String(word).trim();
    const letters = text.replace(/[^a-zA-Z]/g, "").length;
    const isShort = letters > 0 && letters <= SHORT_WORD_MAX_LETTERS;
    const rate = isShort ? SHORT_WORD_RATE : NORMAL_WORD_RATE;

    const u1 = makeUtterance(text, rate);
    if (isShort) {
      u1.onend = () => {
        pendingRepeat = setTimeout(() => {
          pendingRepeat = null;
          window.speechSynthesis.speak(makeUtterance(text, rate));
        }, REPEAT_GAP_MS);
      };
    }
    window.speechSynthesis.speak(u1);
  }

  function speakSentence(sentence) {
    if (!("speechSynthesis" in window)) return;
    cancelSpeech();
    window.speechSynthesis.speak(makeUtterance(String(sentence), SENTENCE_RATE));
  }

  // For homophones (words that sound like another word), say the word, pause,
  // then say the sentence — the sentence is what tells the kid which spelling
  // is meant. The "Say word" button uses this same flow.
  function speakWordWithContext(entry) {
    if (!entry || !entry.homophone || !entry.sentence) {
      speakWord(entry ? entry.word : "");
      return;
    }
    if (!("speechSynthesis" in window)) return;
    cancelSpeech();
    const text = String(entry.word).trim();
    const letters = text.replace(/[^a-zA-Z]/g, "").length;
    const isShort = letters > 0 && letters <= SHORT_WORD_MAX_LETTERS;
    const rate = isShort ? SHORT_WORD_RATE : NORMAL_WORD_RATE;

    const u1 = makeUtterance(text, rate);
    u1.onend = () => {
      pendingRepeat = setTimeout(() => {
        pendingRepeat = null;
        window.speechSynthesis.speak(makeUtterance(String(entry.sentence), SENTENCE_RATE));
      }, REPEAT_GAP_MS);
    };
    window.speechSynthesis.speak(u1);
  }

  // ---- utils ----

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Hidden helper for testing — open the browser's DevTools console
  // and call clearSpellingHistory() to wipe all saved history.
  window.clearSpellingHistory = function () {
    const n = loadHistory().length;
    localStorage.removeItem(HISTORY_KEY);
    if (!history.classList.contains("hidden")) renderHistory();
    console.log(`Cleared ${n} spelling history entr${n === 1 ? "y" : "ies"}.`);
    return n;
  };

  // Hidden helper for testing — also clears the saved name and level so the
  // setup screen shows again on next load.
  window.resetSpellingApp = function () {
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(LEVEL_KEY);
    nameInput.value = "";
    applySetupMode();
    console.log("Cleared saved name and level. Refresh to see setup screen.");
  };

  // ---- auto-update on new deploys ----
  //
  // GitHub Pages sets ETag/Last-Modified headers on every file. We capture
  // index.html's header at boot, re-fetch it periodically (cache-busted), and
  // reload the app when the value changes. To avoid yanking a kid out of a
  // session, the reload only fires when the setup screen is visible — if an
  // update is detected mid-quiz, we hold it until they return to setup.
  const UPDATE_CHECK_URL = "index.html";
  const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  let knownVersionTag = null;
  let updatePending = false;

  async function fetchVersionTag() {
    try {
      const res = await fetch(UPDATE_CHECK_URL + "?_v=" + Date.now(), {
        method: "HEAD",
        cache: "no-store",
      });
      if (!res.ok) return null;
      return res.headers.get("ETag") || res.headers.get("Last-Modified") || null;
    } catch (e) { return null; }
  }

  async function checkForUpdate() {
    const tag = await fetchVersionTag();
    if (!tag) return;
    if (knownVersionTag === null) {
      knownVersionTag = tag;
      return;
    }
    if (tag !== knownVersionTag) {
      updatePending = true;
      maybeReloadForUpdate();
    }
  }

  function maybeReloadForUpdate() {
    if (!updatePending) return;
    if (!setup.classList.contains("hidden")) {
      location.reload();
    }
  }

  // Re-check whenever the tab comes back into focus
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkForUpdate();
  });

  // boot
  populateLevels();
  applySetupMode();
  checkForUpdate();
  setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
})();
