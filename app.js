(function () {
  const $ = (id) => document.getElementById(id);

  const setup        = $("setup");
  const quiz         = $("quiz");
  const results      = $("results");
  const history      = $("history");
  const nameInput    = $("name-input");
  const levelSelect  = $("level-select");
  const listSelect   = $("list-select");
  const startBtn     = $("start-btn");
  const historyBtn   = $("history-btn");
  const wordEmoji    = $("word-emoji");
  const sayWordBtn   = $("say-word-btn");
  const saySentBtn   = $("say-sentence-btn");
  const answerForm   = $("answer-form");
  const answerInput  = $("answer-input");
  const feedback     = $("feedback");
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

  const lists = window.WORD_LISTS || {};

  let session = null; // { words: [...], i: 0, correct: 0, missed: [], name: "" }

  // ---- setup screen ----

  function populateLevels() {
    levelSelect.innerHTML = "";
    Object.keys(lists).forEach((lvl) => {
      const opt = document.createElement("option");
      opt.value = lvl;
      opt.textContent = lvl;
      levelSelect.appendChild(opt);
    });
    populateListsForLevel();
  }

  function populateListsForLevel() {
    listSelect.innerHTML = "";
    const lvl = levelSelect.value;
    const subs = lists[lvl] || {};
    Object.keys(subs).forEach((listName) => {
      const opt = document.createElement("option");
      opt.value = listName;
      opt.textContent = listName;
      listSelect.appendChild(opt);
    });
  }

  levelSelect.addEventListener("change", populateListsForLevel);

  // Remember name across sessions.
  nameInput.value = localStorage.getItem("spelling.name") || "";
  nameInput.addEventListener("input", () => {
    localStorage.setItem("spelling.name", nameInput.value.trim());
  });

  startBtn.addEventListener("click", () => {
    const lvl  = levelSelect.value;
    const name = listSelect.value;
    const wordList = (lists[lvl] && lists[lvl][name]) || [];
    if (!wordList.length) return;
    startSession(shuffle(wordList.slice()));
  });

  // ---- quiz ----

  function startSession(words) {
    session = {
      words,
      i: 0,
      correct: 0,
      missed: [],
      name: nameInput.value.trim() || "friend",
    };
    setup.classList.add("hidden");
    results.classList.add("hidden");
    quiz.classList.remove("hidden");
    feedback.textContent = "";
    feedback.className = "";
    answerInput.value = "";
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
    speak(current().word);
  }

  sayWordBtn.addEventListener("click", () => speak(current().word));
  saySentBtn.addEventListener("click", () => speak(current().sentence));

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const guess = answerInput.value.trim().toLowerCase();
    if (!guess) return;
    const target = current().word.toLowerCase();
    if (guess === target) {
      session.correct += 1;
      feedback.textContent = "✅ Correct!";
      feedback.className = "good";
    } else {
      session.missed.push(current());
      feedback.textContent = `❌ The word was "${current().word}".`;
      feedback.className = "bad";
    }
    answerInput.value = "";
    session.i += 1;
    if (session.i >= session.words.length) {
      setTimeout(showResults, 900);
    } else {
      setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "";
        showCurrent();
        answerInput.focus();
      }, 900);
    }
  });

  // ---- results ----

  function showResults() {
    quiz.classList.add("hidden");
    results.classList.remove("hidden");
    const total = session.words.length;
    scoreEl.textContent = `${session.name}: ${session.correct} of ${total} correct`;
    missedList.innerHTML = "";
    session.missed.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w.word;
      missedList.appendChild(li);
    });
    retryBtn.disabled = session.missed.length === 0;
    saveSessionToHistory();
  }

  function saveSessionToHistory() {
    const entry = {
      ts: Date.now(),
      name: session.name,
      level: levelSelect.value,
      list: listSelect.value,
      total: session.words.length,
      correct: session.correct,
      missed: session.missed.map((w) => w.word),
    };
    const all = loadHistory();
    all.push(entry);
    // Keep newest 500 entries.
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
    startSession(shuffle(session.missed.slice()));
  });

  restartBtn.addEventListener("click", () => {
    results.classList.add("hidden");
    setup.classList.remove("hidden");
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
    left.innerHTML =
      `<div><span class="entry-name"></span> — <span class="entry-meta"></span></div>` +
      `<div class="entry-meta when"></div>`;
    left.querySelector(".entry-name").textContent = e.name;
    left.querySelector(".entry-meta").textContent = `${e.level} › ${e.list}`;
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

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.0;
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
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

  // boot
  populateLevels();
})();
