(function () {
  const $ = (id) => document.getElementById(id);

  const setup        = $("setup");
  const quiz         = $("quiz");
  const results      = $("results");
  const nameInput    = $("name-input");
  const levelSelect  = $("level-select");
  const listSelect   = $("list-select");
  const startBtn     = $("start-btn");
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
  }

  retryBtn.addEventListener("click", () => {
    if (!session.missed.length) return;
    startSession(shuffle(session.missed.slice()));
  });

  restartBtn.addEventListener("click", () => {
    results.classList.add("hidden");
    setup.classList.remove("hidden");
  });

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

  // boot
  populateLevels();
})();
