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
  const startBtn     = $("start-btn");
  const historyBtn   = $("history-btn");
  const wordEmoji    = $("word-emoji");
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
  const WORDS_PER_SESSION = 20;

  const lists = window.WORD_LISTS || {};

  const quizMascot    = $("quiz-mascot");
  const resultsMascot = $("results-mascot");

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
    let frame = 0;
    function step() {
      const col = frame % cols;
      const row = Math.floor(frame / cols);
      const x = (col / (cols - 1)) * 100;
      const y = (row / (rows - 1)) * 100;
      resultsMascot.style.backgroundPosition = `${x}% ${y}%`;
      frame = (frame + 1) % total;
    }
    step();
    resultsAnimTimer = setInterval(step, 90);
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

  // ---- setup screen ----

  function populateLevels() {
    levelSelect.innerHTML = "";
    Object.keys(lists).forEach((lvl) => {
      const opt = document.createElement("option");
      opt.value = lvl;
      opt.textContent = lvl;
      levelSelect.appendChild(opt);
    });
    const savedLevel = localStorage.getItem(LEVEL_KEY);
    if (savedLevel && lists[savedLevel]) {
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
    if (savedName && savedLevel && lists[savedLevel]) {
      collapseSetup(savedName, savedLevel);
    } else {
      expandSetup();
    }
  }

  function collapseSetup(name, level) {
    nameInput.value = name;
    levelSelect.value = level;
    setupHeading.classList.add("hidden");
    setupFields.classList.add("hidden");
    greeting.classList.remove("hidden");
    const count = Math.min(WORDS_PER_SESSION, countWordsInLevel(level));
    greeting.querySelector(".name").textContent = `Hi ${name}!`;
    greeting.querySelector(".meta").textContent = `${level} · ${count} random words`;
    changeBtn.classList.remove("hidden");
    startBtn.textContent = "Start practice";
  }

  function expandSetup() {
    setupHeading.classList.remove("hidden");
    setupFields.classList.remove("hidden");
    greeting.classList.add("hidden");
    changeBtn.classList.add("hidden");
    startBtn.textContent = "Start";
  }

  nameInput.value = localStorage.getItem(NAME_KEY) || "";
  nameInput.addEventListener("input", () => {
    localStorage.setItem(NAME_KEY, nameInput.value.trim());
  });

  changeBtn.addEventListener("click", expandSetup);

  startBtn.addEventListener("click", () => {
    const name  = nameInput.value.trim();
    const level = levelSelect.value;
    if (!name) { nameInput.focus(); return; }
    if (!level || !lists[level]) return;
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(LEVEL_KEY, level);
    const words = buildRandomSession(level);
    if (!words.length) return;
    startSession(words, level);
  });

  function buildRandomSession(level) {
    const subs = lists[level] || {};
    const all = [];
    Object.values(subs).forEach((arr) => arr.forEach((w) => all.push(w)));
    return shuffle(all).slice(0, Math.min(WORDS_PER_SESSION, all.length));
  }

  // ---- quiz ----

  function startSession(words, level) {
    session = {
      words,
      i: 0,
      correct: 0,
      missed: [],
      name: nameInput.value.trim() || "friend",
      level: level || levelSelect.value,
    };
    setup.classList.add("hidden");
    results.classList.add("hidden");
    quiz.classList.remove("hidden");
    feedback.textContent = "";
    feedback.className = "";
    answerInput.value = "";
    setQuizMascot("Standard");
    showCurrent();
    answerInput.focus();
  }

  function current() {
    return session.words[session.i];
  }

  function showCurrent() {
    progress.textContent = `Word ${session.i + 1} of ${session.words.length}`;
    const emoji = current().emoji;
    if (emoji) {
      wordEmoji.textContent = emoji;
      wordEmoji.classList.remove("hidden");
    } else {
      wordEmoji.textContent = "";
      wordEmoji.classList.add("hidden");
    }
    speakWordWithContext(current());
  }

  sayWordBtn.addEventListener("click", () => speakWordWithContext(current()));
  saySentBtn.addEventListener("click", () => speakSentence(current().sentence));

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

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const guess = answerInput.value.trim().toLowerCase();
    if (!guess) return;
    const target = current().word.toLowerCase();
    const wasCorrect = guess === target;
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
      session.missed.push(current());
      feedback.textContent = `❌ The word was "${current().word}".`;
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
    if (pct === 1) {
      playResultsAnimation(session.level);
    } else {
      const variant = pct >= 0.7 ? "Correct1" : pct >= 0.4 ? "Standard" : "Incorrect3";
      setStaticResultsMascot(session.level, variant);
    }
    scoreEl.textContent = `${session.name}: ${session.correct} of ${total} correct`;
    missedList.innerHTML = "";
    session.missed.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w.word;
      missedList.appendChild(li);
    });
    retryBtn.disabled = session.missed.length === 0;
    saveSessionToHistory();
    postSessionToForm();
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

  function postSessionToForm() {
    try {
      const total = session.words.length;
      const pct = total ? Math.round((session.correct / total) * 100) : 0;
      const data = new FormData();
      data.append(FORM_FIELDS.name,   session.name);
      data.append(FORM_FIELDS.level,  session.level);
      data.append(FORM_FIELDS.score,  String(session.correct));
      data.append(FORM_FIELDS.total,  String(total));
      data.append(FORM_FIELDS.pct,    String(pct));
      data.append(FORM_FIELDS.missed, session.missed.map((w) => w.word).join(", "));
      fetch(FORM_SUBMIT_URL, { method: "POST", mode: "no-cors", body: data }).catch(() => {});
    } catch (e) { /* best effort */ }
  }

  function saveSessionToHistory() {
    const entry = {
      ts: Date.now(),
      name: session.name,
      level: session.level,
      list: "",
      total: session.words.length,
      correct: session.correct,
      missed: session.missed.map((w) => w.word),
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
    startSession(shuffle(session.missed.slice()), session.level);
  });

  restartBtn.addEventListener("click", () => {
    stopResultsAnimation();
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
    const metaText = e.list ? `${e.level} › ${e.list}` : e.level;
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

  // boot
  populateLevels();
  applySetupMode();
})();
