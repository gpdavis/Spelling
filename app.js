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
  const startSpellingBtn = $("start-spelling-btn");
  const startMathsBtn    = $("start-maths-btn");
  const historyBtn   = $("history-btn");
  const wordEmoji    = $("word-emoji");
  const questionContextEl = $("question-context");
  const questionImageEl   = $("question-image");
  const questionTextEl    = $("question-text");
  const numberLineEl      = $("number-line");
  const wordControlsEl    = $("word-controls");
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
  const stargazeBtn     = $("stargaze-btn");
  const captionToggleBtn  = $("caption-toggle-btn");
  const spaceCaption      = $("space-caption");
  const spaceCaptionTitle = $("space-caption-title");
  const spaceCaptionText  = $("space-caption-text");

  const HISTORY_KEY = "spelling.history";
  const NAME_KEY    = "spelling.name";
  const LEVEL_KEY   = "spelling.level";
  const POINTS_CACHE_KEY = "spelling.pointsCache"; // last Sheet-derived day map (offline cache)
  const LOCAL_TODAY_KEY  = "spelling.localToday";  // optimistic "done today" overlay (this device)
  const WORDS_PER_SESSION = 10;
  const WEEKLY_POOL_SIZE = 25;
  // Both spelling and maths need this final score or better to earn the day's tick.
  const PASS_PCT = 0.8;
  // Doing both subjects earns a point; doing them again the same day earns
  // another, but a day can't earn more than this many.
  const POINTS_PER_DAY_CAP = 3;

  const lists       = window.WORD_LISTS || {};
  const mathsLists  = window.MATHS_LISTS || {};
  const mathsGens   = window.MATHS_GENERATORS || {};

  // Prize milestones live in prizes.js (window.POINT_PRIZES).
  const PRIZES = window.POINT_PRIZES || { small: { points: [], message: "" }, big: { points: [], message: "" } };

  // Which prize, if any, a total of `count` points wins. Big takes precedence
  // over small if a point count somehow appears in both lists. Returns the
  // prize tier object ({ points, message }) or null.
  function prizeForCount(count) {
    if (!count) return null;
    if (PRIZES.big && Array.isArray(PRIZES.big.points) && PRIZES.big.points.includes(count)) return PRIZES.big;
    if (PRIZES.small && Array.isArray(PRIZES.small.points) && PRIZES.small.points.includes(count)) return PRIZES.small;
    return null;
  }

  const quizMascot    = $("quiz-mascot");
  const resultsMascot = $("results-mascot");
  const resultsCelebrationVideo = $("results-celebration-video");
  const homePointsEl       = $("home-points");
  const homeChocolateEl    = $("home-chocolate");
  const resultsPointsEl    = $("results-points");
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

  function mascotAnimSrc(level) {
    return `Images/${mascotFor(level)}Animation.png`;
  }

  function mascotCelebrationSrc(level) {
    return `Images/${mascotFor(level)}Celebration.mp4`;
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

  function showCorrectTick(originX, originY) {
    const tick = document.createElement("div");
    tick.className = "correct-tick";
    tick.style.left = originX + "px";
    tick.style.top = originY + "px";
    tick.innerHTML =
      '<svg viewBox="0 0 24 24" width="100" height="100" aria-hidden="true">' +
      '<path d="M4 12.5l5 5L20 6" fill="none" stroke="currentColor" ' +
      'stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
    document.body.appendChild(tick);
    setTimeout(() => tick.remove(), 900);
  }

  function showWrongCross(originX, originY) {
    const cross = document.createElement("div");
    cross.className = "wrong-cross";
    cross.style.left = originX + "px";
    cross.style.top = originY + "px";
    cross.innerHTML =
      '<svg viewBox="0 0 24 24" width="100" height="100" aria-hidden="true">' +
      '<path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" ' +
      'stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
    document.body.appendChild(cross);
    setTimeout(() => cross.remove(), 1500);
  }

  function celebrateFromMascot() {
    const rect = quizMascot.getBoundingClientRect();
    if (!rect.width) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    launchConfetti(centerX, centerY);
    showCorrectTick(rect.right - rect.width * 0.15, rect.bottom - rect.height * 0.15);
  }

  function flashWrongFromMascot() {
    const rect = quizMascot.getBoundingClientRect();
    if (!rect.width) return;
    showWrongCross(rect.right - rect.width * 0.15, rect.bottom - rect.height * 0.15);
  }

  let resultsAnimTimer = null;

  function stopResultsAnimation() {
    if (resultsAnimTimer) {
      clearInterval(resultsAnimTimer);
      resultsAnimTimer = null;
    }
    resultsMascot.classList.remove("animated");
    resultsMascot.classList.remove("hidden");
    resultsCelebrationVideo.pause();
    resultsCelebrationVideo.removeAttribute("src");
    resultsCelebrationVideo.classList.add("hidden");
  }

  function playResultsCelebrationVideo(level) {
    stopResultsAnimation();
    resultsMascot.classList.add("hidden");
    resultsCelebrationVideo.classList.remove("hidden");
    resultsCelebrationVideo.src = mascotCelebrationSrc(level);
    resultsCelebrationVideo.play().catch(() => {});
  }

  function playResultsAnimation(level) {
    stopResultsAnimation();
    resultsMascot.classList.add("animated");
    resultsMascot.style.backgroundImage = `url("${mascotAnimSrc(level)}")`;
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

  const HAPPY_FRAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17];
  const UNHAPPY_FRAMES = [12, 13, 14];

  function framePosition(frame) {
    const col = frame % 6;
    const row = Math.floor(frame / 6);
    return `${(col / 5) * 100}% ${(row / 2) * 100}%`;
  }

  function pickFrame(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function setQuizMascot(state) {
    if (!session) return;
    quizMascot.style.backgroundImage = `url("${mascotAnimSrc(session.level)}")`;
    let frame = 0;
    if (state === "correct") frame = pickFrame(HAPPY_FRAMES);
    else if (state === "wrong") frame = pickFrame(UNHAPPY_FRAMES);
    quizMascot.style.backgroundPosition = framePosition(frame);
    quizMascot.classList.remove("react");
    if (state) {
      void quizMascot.offsetWidth;
      quizMascot.classList.add("react");
    }
  }

  let session = null;
  // An "attempt" wraps the initial session plus any retry-missed rounds the kid plays
  // through before either reaching 0 missed or clicking "New practice".
  let attempt = null;

  // ---- points (Google Sheet–backed) ----
  //
  // The Form's linked Sheet is the source of truth, so a kid's points follow
  // them across devices. We read it as CSV (the Sheet is shared "anyone with
  // the link can view") and compute the point total per name+year.
  //
  // A point is earned each time BOTH spelling and maths are passed (≥PASS_PCT)
  // on the same day — missing a day doesn't cost anything, it just doesn't add
  // a point. Doing both subjects again the same day earns a second point, up
  // to POINTS_PER_DAY_CAP per day. The total is the sum across every day ever
  // played, so it only ever goes up.
  //
  // Two wrinkles the code handles:
  //   * A just-finished quiz won't appear in the Sheet for a few seconds, so we
  //     keep an optimistic local overlay of today's passes on this device.
  //   * The Sheet read can fail (offline), so the last good day-map is cached
  //     in localStorage and used until a fresh read lands.

  const POINTS_SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1ijGzT_benZ01we7Sb9svit0o_mefw7h_2i3Oye1deMw/gviz/tq?tqx=out:csv";

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Identity = name (case-insensitive, trimmed) + year (exact).
  function pointsKey(name, year) {
    return `${String(name || "").trim().toLowerCase()}|${String(year || "").trim()}`;
  }

  // ---- reading the Sheet ----

  // Minimal RFC-4180-ish CSV parser: handles quoted fields, "" escapes, and
  // commas / newlines inside quotes. Returns an array of string arrays.
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n") {
        row.push(field); rows.push(row); row = []; field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Form timestamps arrive as "DD/MM/YYYY HH:mm:ss" (AU locale), which
  // new Date() would misread — pull the parts out by hand → "YYYY-MM-DD".
  function sheetDateKey(ts) {
    const m = String(ts).match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }

  // "Year 4 · Maths · Division facts" → { year: "Year 4", subject: "maths" }.
  // Legacy rows with no subject segment return subject: null and are ignored.
  function parseLevel(level) {
    const parts = String(level).split("·").map((s) => s.trim());
    const sub = (parts[1] || "").toLowerCase();
    const subject = sub === "maths" ? "maths" : sub === "spelling" ? "spelling" : null;
    return { year: parts[0] || "", subject };
  }

  // Fold the Sheet rows into key → { "YYYY-MM-DD": { spelling, maths } }, where
  // each count is how many separate *sittings* of that subject passed
  // (≥PASS_PCT) that day. A sitting is the first attempt plus any retries the
  // kid played through before "New practice" — each row is tagged with its
  // round label ("First attempt" / "Retry N"), so a "First attempt" row opens
  // a new sitting and any "Retry" rows fold into the sitting still open for
  // that name+year+subject+day. This keeps a kid retrying after already
  // passing from inflating the count — the sitting only ever adds one pass.
  function buildDayMap(rows) {
    const sittings = {}; // key -> date -> subject -> [passed, passed, ...]
    const passMark = PASS_PCT * 100;
    for (let i = 1; i < rows.length; i++) { // row 0 is the header
      const r = rows[i];
      if (!r || r.length < 7) continue;
      const { year, subject } = parseLevel(r[2]);
      if (!subject) continue;
      const date = sheetDateKey(r[0]);
      if (!date) continue;
      const pct = parseFloat(r[5]);
      const passed = isFinite(pct) && pct >= passMark;
      const key = pointsKey(r[1], year);
      const isRetry = /^\s*Retry\b/.test(String(r[6] || ""));

      const byDate = sittings[key] || (sittings[key] = {});
      const bySubject = byDate[date] || (byDate[date] = { spelling: [], maths: [] });
      const list = bySubject[subject];

      if (isRetry && list.length) {
        list[list.length - 1] = list[list.length - 1] || passed;
      } else {
        list.push(passed);
      }
    }

    const map = {};
    for (const key in sittings) {
      const days = map[key] = {};
      for (const date in sittings[key]) {
        const bySubject = sittings[key][date];
        days[date] = {
          spelling: bySubject.spelling.filter(Boolean).length,
          maths: bySubject.maths.filter(Boolean).length,
        };
      }
    }
    return map;
  }

  function loadDayMapCache() {
    try { return JSON.parse(localStorage.getItem(POINTS_CACHE_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  // In-memory day-map; seeded from cache so the home screen renders instantly,
  // then replaced when the Sheet read lands.
  let sheetDayMap = loadDayMapCache();

  async function refreshPointsFromSheet() {
    if (!POINTS_SHEET_CSV_URL) return;
    try {
      const res = await fetch(POINTS_SHEET_CSV_URL, { cache: "no-store" });
      if (!res.ok) return;
      sheetDayMap = buildDayMap(parseCSV(await res.text()));
      try { localStorage.setItem(POINTS_CACHE_KEY, JSON.stringify(sheetDayMap)); } catch (e) {}
      if (!setup.classList.contains("hidden")) refreshHomePoints();
    } catch (e) { /* offline — keep the cached map */ }
  }

  // ---- optimistic "done today" overlay (this device) ----

  function loadLocalToday() {
    try { return JSON.parse(localStorage.getItem(LOCAL_TODAY_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  // Called once per completed sitting (see the `attempt.recorded` guard in
  // showResults) that passed ≥PASS_PCT, so retrying after already passing
  // never counts twice.
  function recordLocalPass(name, year, subject) {
    const all = loadLocalToday();
    const key = pointsKey(name, year);
    const today = todayStr();
    let e = all[key];
    if (!e || e.date !== today) e = { date: today, spelling: 0, maths: 0 };
    e[subject] = (e[subject] || 0) + 1;
    all[key] = e;
    try { localStorage.setItem(LOCAL_TODAY_KEY, JSON.stringify(all)); } catch (err) {}
  }

  function localTodayFor(key) {
    const e = loadLocalToday()[key];
    if (e && e.date === todayStr()) return { spelling: e.spelling || 0, maths: e.maths || 0 };
    return { spelling: 0, maths: 0 };
  }

  // ---- computing the points total ----

  // Returns { count, todayCount, todayDone: { spelling, maths } } for
  // name+year: `count` is the lifetime point total, `todayCount` is how many
  // of those were earned today, combining the Sheet history with today's
  // optimistic local passes (taking whichever says more, since the local
  // overlay is redundant once the Sheet catches up).
  function getPointsStatus(name, year) {
    if (!name) return { count: 0, todayCount: 0, todayDone: {} };
    const key = pointsKey(name, year);
    const src = sheetDayMap[key] || {};
    const days = {};
    for (const d in src) days[d] = { spelling: src[d].spelling || 0, maths: src[d].maths || 0 };

    const today = todayStr();
    const loc = localTodayFor(key);
    if (loc.spelling || loc.maths || days[today]) {
      const d = days[today] || (days[today] = { spelling: 0, maths: 0 });
      d.spelling = Math.max(d.spelling, loc.spelling);
      d.maths = Math.max(d.maths, loc.maths);
    }

    let count = 0;
    for (const d in days) {
      count += Math.min(days[d].spelling, days[d].maths, POINTS_PER_DAY_CAP);
    }

    const todayInfo = days[today] || { spelling: 0, maths: 0 };
    const todayDone = { spelling: todayInfo.spelling > 0, maths: todayInfo.maths > 0 };
    const todayCount = Math.min(todayInfo.spelling, todayInfo.maths, POINTS_PER_DAY_CAP);
    return { count, todayCount, todayDone };
  }

  // ---- "stargaze" mode: hide the app to admire today's space background ----

  function exitStargazing() {
    document.body.classList.remove("stargazing");
    stargazeBtn.textContent = "✨ Stargaze";
    updateCaptionToggleBtn();
  }

  // The day's space photo stays off-screen (plain starfield gradient shown
  // instead) until both spelling and maths are done — it's the payoff for
  // finishing, not a preview visible from the setup screen.
  let spaceAvailable = false;

  function setStargazeAvailable(available) {
    stargazeBtn.classList.toggle("hidden", !available);
    if (!available) exitStargazing();
    spaceAvailable = available;
    refreshSpaceBackground();
  }

  stargazeBtn.addEventListener("click", () => {
    const active = document.body.classList.toggle("stargazing");
    stargazeBtn.textContent = active ? "↩ Back to Spellatron" : "✨ Stargaze";
    updateCaptionToggleBtn();
  });

  // Whether the kid wants the title/explanation panel showing over the photo
  // — remembered across visits so a kid who hides it once doesn't have to
  // hide it again every day.
  const CAPTION_VISIBLE_KEY = "spelling.captionVisible";
  let captionVisible = localStorage.getItem(CAPTION_VISIBLE_KEY) !== "0";

  // Shows/hides the toggle button itself (only relevant while stargazing
  // with a caption actually loaded) and keeps its label in sync.
  function updateCaptionToggleBtn() {
    const hasCaption = !!(apodInfo && apodInfo.title);
    const stargazing = document.body.classList.contains("stargazing");
    captionToggleBtn.classList.toggle("hidden", !(spaceAvailable && stargazing && hasCaption));
    captionToggleBtn.textContent = captionVisible ? "🙈 Hide info" : "ℹ️ Show info";
  }

  captionToggleBtn.addEventListener("click", () => {
    captionVisible = !captionVisible;
    try { localStorage.setItem(CAPTION_VISIBLE_KEY, captionVisible ? "1" : "0"); } catch (e) {}
    refreshSpaceBackground();
  });

  function renderPointsInto(name, year, pointsEl, chocolateEl) {
    pointsEl.textContent = "";
    const line = document.createElement("div");
    line.className = "points-line";

    if (!name) {
      line.textContent = "Complete spelling and maths to earn a point";
      pointsEl.appendChild(line);
      pointsEl.classList.remove("hidden");
      chocolateEl.classList.add("hidden");
      setStargazeAvailable(false);
      return;
    }

    const { count, todayCount, todayDone } = getPointsStatus(name, year);
    const spellingDone = !!todayDone.spelling;
    const mathsDone    = !!todayDone.maths;
    const bothDoneOnce  = spellingDone && mathsDone;

    if (count > 0) {
      line.textContent = `⭐ ${count} point${count === 1 ? "" : "s"}!`;
    } else if (spellingDone || mathsDone) {
      line.textContent = "Almost there! Do both today to earn a point.";
    } else {
      line.textContent = "Complete spelling and maths to earn a point";
    }
    pointsEl.appendChild(line);

    const sub = document.createElement("div");
    sub.className = "points-sub";
    if (!bothDoneOnce) {
      const s = spellingDone ? "✅" : "⬜";
      const m = mathsDone    ? "✅" : "⬜";
      sub.textContent = `Today: ${s} Spelling · ${m} Maths`;
    } else if (todayCount < POINTS_PER_DAY_CAP) {
      sub.textContent = `🎉 +${todayCount} today — do both again for another point!`;
    } else {
      sub.textContent = `🎉 +${todayCount} today — that's the max for today!`;
    }
    pointsEl.appendChild(sub);

    pointsEl.classList.remove("hidden");

    const prize = prizeForCount(count);
    chocolateEl.textContent = "";
    if (prize) {
      if (prize.robot) {
        const img = document.createElement("img");
        img.className = "prize-robot";
        img.src = prize.robot;
        img.alt = "";
        chocolateEl.appendChild(img);
      }
      const msg = document.createElement("div");
      msg.className = "prize-msg";
      msg.textContent = prize.message;
      chocolateEl.appendChild(msg);
      chocolateEl.classList.toggle("big", prize === PRIZES.big);
      chocolateEl.classList.remove("hidden");
    } else {
      chocolateEl.classList.add("hidden");
    }

    setStargazeAvailable(bothDoneOnce);
  }

  function refreshHomePoints() {
    renderPointsInto(nameInput.value.trim(), levelSelect.value, homePointsEl, homeChocolateEl);
    maybeCelebrateHomePrize();
  }

  // Set true whenever the kid arrives at the home screen (boot / "New
  // practice" / back from history) so the *next* points render celebrates if
  // a prize is active — replaying the animation each time they reopen the
  // site on the prize day, not just the moment they first hit it. Left true
  // across the initial cached render if the Sheet fetch hasn't landed yet, so
  // the celebration still fires once the real point total is known instead of
  // silently missing it.
  let pendingPrizeCelebration = false;

  // Plays the prize animation (bounce + confetti) on the home screen's prize
  // box. Only fires when `pendingPrizeCelebration` is armed, so typing a name
  // or switching level/tab-refocus (which also call refreshHomePoints) don't
  // replay it mid-session.
  function maybeCelebrateHomePrize() {
    if (!pendingPrizeCelebration) return;
    const prize = prizeForCount(getPointsStatus(nameInput.value.trim(), levelSelect.value).count);
    if (!prize) return;
    pendingPrizeCelebration = false;
    homeChocolateEl.classList.remove("celebrate");
    void homeChocolateEl.offsetWidth;
    homeChocolateEl.classList.add("celebrate");
    const rect = homeChocolateEl.getBoundingClientRect();
    if (rect.width) launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
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
    pendingPrizeCelebration = true;
    refreshHomePoints();
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
    refreshHomePoints();
  });

  // The home points total is per name+year, so refresh it when the year changes too.
  levelSelect.addEventListener("change", refreshHomePoints);

  changeBtn.addEventListener("click", expandSetup);

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

  startMathsBtn.addEventListener("click", () => {
    const name  = nameInput.value.trim();
    const level = levelSelect.value;
    if (!name) { nameInput.focus(); return; }
    if (!level || !mathsLists[level]) return;
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(LEVEL_KEY, level);
    const questions = buildMathsSession(level);
    if (!questions.length) return;
    beginAttempt({ name, level, subject: "maths", subList: null, words: questions });
  });

  function beginAttempt({ name, level, subject, subList, words }) {
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
      recorded: false, // has this attempt (across all its retries) already earned its point?
    };
    startSession(words, level, subject, subList);
  }

  // A level can carry one of these — a bonus sub-list of silly, seriously-hard
  // words. One is guaranteed into the weekly pool below (never weighted into
  // the regular draw), and then guaranteed into every day's session too (see
  // below) — so a kid sees it in rotation every single day of the week.
  const CHALLENGE_LIST_KEY = "Challenge word of the week";

  function buildSpellingSession(level) {
    const subs = lists[level] || {};
    const challengeWords = subs[CHALLENGE_LIST_KEY] || [];
    const all = [];
    // Words can carry an optional `weight` (default 1) — entered into the pool
    // that many times so persistently-missed words come up more often, at the
    // expense of words the kid already has solid.
    Object.entries(subs).forEach(([key, arr]) => {
      if (key === CHALLENGE_LIST_KEY) return;
      arr.forEach((w) => {
        const copies = Math.max(1, Math.round(w.weight || 1));
        for (let i = 0; i < copies; i++) all.push(w);
      });
    });
    if (!all.length && !challengeWords.length) return [];

    const now = new Date();
    // The week (Mon–Sun) has a single stable 20-word pool, so a kid practises
    // the same set all week. Seed by level + the week's Monday so each year
    // level gets its own pool and it only changes when a new week starts.
    // `all` contains repeated entries for weighted words (see above), so pick
    // unique words as we walk the shuffle rather than slicing it directly —
    // otherwise a heavily-weighted word could land twice in the same pool.
    // When there's a challenge list, one slot is reserved for it below so the
    // pool still ends up at the usual size.
    const weekRng = mulberry32(hashSeed(`${level}|week|${mondayKey(now)}`));
    const regularPoolSize = challengeWords.length ? WEEKLY_POOL_SIZE - 1 : WEEKLY_POOL_SIZE;
    const weekPool = pickUniqueWords(seededShuffle(all, weekRng), regularPoolSize);

    let challengeWord = null;
    if (challengeWords.length) {
      // A different challenge word each week (own seed, so it doesn't track
      // whichever regular word the week's shuffle happens to put first).
      const challengeRng = mulberry32(hashSeed(`${level}|challenge|${mondayKey(now)}`));
      challengeWord = challengeWords[Math.floor(challengeRng() * challengeWords.length)];
    }

    // Each day draws a stable 10 from the regular pool — same 10 all day (so
    // retries and repeat sessions reinforce the same words), a fresh draw
    // each morning. The week's challenge word (if any) isn't left to chance
    // here — it's appended to every day's session so it comes up daily,
    // not just on whichever days the daily draw happens to land on it.
    const dayRng = mulberry32(hashSeed(`${level}|day|${dateKey(now)}`));
    const dailyCount = challengeWord ? WORDS_PER_SESSION - 1 : WORDS_PER_SESSION;
    const daySession = pickUniqueWords(seededShuffle(weekPool, dayRng), dailyCount);
    return challengeWord ? daySession.concat(challengeWord) : daySession;
  }

  // Walks a shuffled (possibly weight-duplicated) word list and returns up to
  // `n` entries with distinct `.word` values, in shuffle order.
  function pickUniqueWords(shuffled, n) {
    const seen = new Set();
    const out = [];
    for (const w of shuffled) {
      if (out.length >= n) break;
      if (seen.has(w.word)) continue;
      seen.add(w.word);
      out.push(w);
    }
    return out;
  }

  function buildMathsSession(level) {
    const subs = mathsLists[level] || {};
    // Topics can carry an optional `weight` (default 1) — entered into the
    // topic-picker that many times so weaker topics get asked about more
    // often, at the expense of topics already mastered.
    const entries = [];
    Object.entries(subs).forEach((entry) => {
      const copies = Math.max(1, Math.round(entry[1].weight || 1));
      for (let i = 0; i < copies; i++) entries.push(entry);
    });
    if (!entries.length) return [];
    const seen = new Set();
    const out = [];
    // Pick a random topic each iteration; skip duplicates. Cap attempts so a
    // small total question space can't hang the page.
    let tries = 0;
    while (out.length < WORDS_PER_SESSION && tries < 400) {
      tries += 1;
      const [topicName, topic] = entries[Math.floor(Math.random() * entries.length)];
      let q = null;
      if (Array.isArray(topic)) {
        const picked = topic[Math.floor(Math.random() * topic.length)];
        // Clone so we can attach context without mutating the source list
        if (picked) q = { ...picked };
      } else if (topic.generator && mathsGens[topic.generator]) {
        q = mathsGens[topic.generator](topic.args || {});
      }
      if (!q || !q.question) continue;
      if (!q.context) q.context = topicName;
      // Remember where this question came from so a retry can re-ask the same
      // kind of question with different numbers (see regenerateMathsQuestion).
      q.source = Array.isArray(topic)
        ? { topicName }
        : { topicName, generator: topic.generator, args: topic.args || {} };
      if (seen.has(q.question)) continue;
      seen.add(q.question);
      out.push(q);
    }
    return out;
  }

  // Given a maths question the kid missed, produce a fresh question of the same
  // kind so a retry reinforces the concept rather than the memorised answer:
  //   - generator-backed topics: re-run the generator for new numbers
  //   - hand-written list topics: pick a different entry from the same list
  // Falls back to the original question if we can't do better.
  function regenerateMathsQuestion(q, level) {
    const src = q && q.source;
    if (!src) return q;

    if (src.generator && mathsGens[src.generator]) {
      // Try a few times to avoid handing back the identical question.
      for (let i = 0; i < 10; i++) {
        const fresh = mathsGens[src.generator](src.args || {});
        if (!fresh || !fresh.question) continue;
        if (fresh.question === q.question && i < 9) continue;
        if (!fresh.context) fresh.context = q.context;
        fresh.source = src;
        return fresh;
      }
      return q;
    }

    const topic = (mathsLists[level] || {})[src.topicName];
    if (Array.isArray(topic) && topic.length) {
      const others = topic.filter((e) => e && e.question !== q.question);
      const pool = others.length ? others : topic;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      if (picked && picked.question) {
        const fresh = { ...picked };
        if (!fresh.context) fresh.context = q.context || src.topicName;
        fresh.source = src;
        return fresh;
      }
    }
    return q;
  }

  // ---- quiz ----

  function startSession(words, level, subject, subList) {
    session = {
      words,
      i: 0,
      correct: 0,
      missed: [],
      answers: [],
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
    setQuizMascot();
    showCurrent();
    answerInput.focus();
  }

  function current() {
    return session.words[session.i];
  }

  // SVG namespace for shape rendering
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVG_NS, name);
    if (attrs) {
      for (const k in attrs) el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  function renderRectangleShape(shape) {
    const { w, h, unit } = shape;
    // Scale so the longer side is a fixed length, keeping aspect ratio
    const maxSide = 180;
    const scale = maxSide / Math.max(w, h);
    const rw = Math.max(50, w * scale);
    const rh = Math.max(50, h * scale);
    const padX = 38, padY = 30;
    const svgW = rw + padX * 2;
    const svgH = rh + padY * 2;
    const svg = svgEl("svg", {
      viewBox: `0 0 ${svgW} ${svgH}`,
      xmlns: SVG_NS,
      role: "img",
    });
    svg.appendChild(svgEl("rect", {
      x: padX, y: padY, width: rw, height: rh,
      fill: "rgba(129, 140, 248, 0.12)",
      stroke: "currentColor",
      "stroke-width": "2",
    }));
    const widthLabel = svgEl("text", {
      x: padX + rw / 2, y: padY - 10,
      "text-anchor": "middle",
      fill: "currentColor",
      "font-size": "16",
      "font-weight": "600",
    });
    widthLabel.textContent = `${w} ${unit || ""}`.trim();
    svg.appendChild(widthLabel);
    const heightLabel = svgEl("text", {
      x: padX + rw + 8, y: padY + rh / 2 + 6,
      "text-anchor": "start",
      fill: "currentColor",
      "font-size": "16",
      "font-weight": "600",
    });
    heightLabel.textContent = `${h} ${unit || ""}`.trim();
    svg.appendChild(heightLabel);
    return svg;
  }

  // Analogue clock face for "tell the time" questions. shape = { type, h, m }.
  function renderClockShape(shape) {
    const cx = 100, cy = 100, r = 88;
    const h = Number(shape.h) || 0;
    const m = Number(shape.m) || 0;
    const svg = svgEl("svg", { viewBox: "0 0 200 200", xmlns: SVG_NS, role: "img" });

    svg.appendChild(svgEl("circle", {
      cx, cy, r,
      fill: "rgba(129, 140, 248, 0.10)",
      stroke: "currentColor",
      "stroke-width": "3",
    }));

    // Minute ticks — 60 short marks around the rim, one per minute, so a
    // clockAnyMinute question can actually be read precisely rather than
    // guessed between the hour marks. Skipped every 5th position since the
    // hour tick below already marks it.
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const ang = (i * 6) * Math.PI / 180;
      const sin = Math.sin(ang), cos = Math.cos(ang);
      const inner = r - 5;
      svg.appendChild(svgEl("line", {
        x1: cx + r * sin, y1: cy - r * cos,
        x2: cx + inner * sin, y2: cy - inner * cos,
        stroke: "currentColor",
        "stroke-width": "1.3",
        opacity: "0.7",
      }));
    }

    // Hour ticks + numbers 1–12
    for (let i = 1; i <= 12; i++) {
      const ang = (i * 30) * Math.PI / 180;
      const sin = Math.sin(ang), cos = Math.cos(ang);
      const inner = r - (i % 3 === 0 ? 12 : 8);
      svg.appendChild(svgEl("line", {
        x1: cx + r * sin, y1: cy - r * cos,
        x2: cx + inner * sin, y2: cy - inner * cos,
        stroke: "currentColor",
        "stroke-width": i % 3 === 0 ? "3" : "1.5",
      }));
      const nr = r - 26;
      const num = svgEl("text", {
        x: cx + nr * sin, y: cy - nr * cos + 6,
        "text-anchor": "middle",
        fill: "currentColor",
        "font-size": "17",
        "font-weight": "600",
      });
      num.textContent = String(i);
      svg.appendChild(num);
    }

    // Hands: 12 o'clock is straight up; angle grows clockwise.
    const minAng = (m % 60) * 6 * Math.PI / 180;
    const hourAng = (((h % 12) + m / 60) * 30) * Math.PI / 180;
    const hourLen = r * 0.5, minLen = r * 0.78;
    svg.appendChild(svgEl("line", {
      x1: cx, y1: cy,
      x2: cx + hourLen * Math.sin(hourAng), y2: cy - hourLen * Math.cos(hourAng),
      stroke: "currentColor", "stroke-width": "5", "stroke-linecap": "round",
    }));
    svg.appendChild(svgEl("line", {
      x1: cx, y1: cy,
      x2: cx + minLen * Math.sin(minAng), y2: cy - minLen * Math.cos(minAng),
      stroke: "currentColor", "stroke-width": "3", "stroke-linecap": "round",
    }));
    svg.appendChild(svgEl("circle", { cx, cy, r: "4.5", fill: "currentColor" }));
    return svg;
  }

  function renderShape(shape) {
    if (!shape || !shape.type) return null;
    if (shape.type === "rectangle") return renderRectangleShape(shape);
    if (shape.type === "clock") return renderClockShape(shape);
    return null;
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
      if (cur.context) {
        questionContextEl.textContent = cur.context;
        questionContextEl.classList.remove("hidden");
      } else {
        questionContextEl.classList.add("hidden");
      }
      questionImageEl.textContent = "";
      const shapeSvg = renderShape(cur.shape);
      if (shapeSvg) {
        questionImageEl.appendChild(shapeSvg);
        questionImageEl.classList.remove("hidden");
      } else {
        questionImageEl.classList.add("hidden");
      }
      questionTextEl.textContent = cur.question;
      questionTextEl.classList.remove("hidden");
      // Clock/time answers need a colon / letters, so switch off the numeric keypad.
      if (cur.shape && cur.shape.type === "clock") {
        answerInput.setAttribute("inputmode", "text");
        answerInput.setAttribute("placeholder", "e.g. 3:30 or half past 3");
      } else if (cur.timeCheck === "24h") {
        answerInput.setAttribute("inputmode", "text");
        answerInput.setAttribute("placeholder", "e.g. 15:45");
      } else if (cur.timeCheck === "12h") {
        answerInput.setAttribute("inputmode", "text");
        answerInput.setAttribute("placeholder", "e.g. 3:45 pm");
      } else {
        answerInput.setAttribute("inputmode", "numeric");
        answerInput.setAttribute("placeholder", "Type the answer here");
      }
      if (cur.aid === "numberline") {
        ensureNumberLine();
        numberLineEl.classList.remove("hidden");
      } else {
        numberLineEl.classList.add("hidden");
      }
    } else {
      questionContextEl.classList.add("hidden");
      questionImageEl.classList.add("hidden");
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
      setQuizMascot();
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
      .replace(/−/g, "-")
      // Thousands commas are just formatting ("7,000") — a bare "7000" is
      // just as correct, so strip them before comparing either side.
      .replace(/,/g, "");
  }

  // Minutes-since-12 (0–719) so equivalent clock readings compare equal.
  function timeToMinutes(h, m) {
    return (((h % 12) + 12) % 12) * 60 + ((m % 60) + 60) % 60;
  }

  const WORD_NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };

  // Parse a kid's time answer to minutes-since-12, accepting both digital
  // ("3:30", "3.30", "3") and spoken forms ("half past 3", "quarter to 4",
  // "3 o'clock"). Returns null if it isn't a recognisable time.
  function parseTimeGuess(raw) {
    const s = String(raw).trim().toLowerCase().replace(/['’]/g, "").replace(/\s+/g, " ");
    const toNum = (tok) => (/^\d+$/.test(tok) ? parseInt(tok, 10) : WORD_NUMS[tok]);
    let mt;
    if ((mt = s.match(/^half past (\w+)$/)))                 { const h = toNum(mt[1]); return h ? timeToMinutes(h, 30) : null; }
    if ((mt = s.match(/^(?:a )?quarter past (\w+)$/)))       { const h = toNum(mt[1]); return h ? timeToMinutes(h, 15) : null; }
    if ((mt = s.match(/^(?:a )?quarter to (\w+)$/)))         { const h = toNum(mt[1]); return h ? timeToMinutes(h - 1, 45) : null; }
    if ((mt = s.match(/^(\w+) o?clock$/)))                   { const h = toNum(mt[1]); return h ? timeToMinutes(h, 0) : null; }
    if ((mt = s.match(/^(\d{1,2})\s*[:.]\s*(\d{2})$/)))      { return timeToMinutes(parseInt(mt[1], 10), parseInt(mt[2], 10)); }
    if ((mt = s.match(/^(\d{1,2})$/)))                       { return timeToMinutes(parseInt(mt[1], 10), 0); }
    return null;
  }

  // Parses a 24-hour time guess ("15:45", "1545", "3:45" — leading zero on
  // the hour is optional) to minutes-since-midnight (0–1439), or null.
  function parse24HourGuess(raw) {
    const s = String(raw).trim().toLowerCase().replace(/\s+/g, "");
    let h, m;
    let mt = s.match(/^(\d{1,2})[:.](\d{2})$/);
    if (mt) {
      h = parseInt(mt[1], 10); m = parseInt(mt[2], 10);
    } else if ((mt = s.match(/^(\d{3,4})$/))) {
      const digits = mt[1];
      const splitAt = digits.length - 2;
      h = parseInt(digits.slice(0, splitAt), 10);
      m = parseInt(digits.slice(splitAt), 10);
    } else {
      return null;
    }
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  // Parses a 12-hour time guess with am/pm ("3:45 pm", "3:45pm", "03:45 PM")
  // to minutes-since-midnight (0–1439), or null.
  function parse12HourGuess(raw) {
    const s = String(raw).trim().toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
    const mt = s.match(/^(\d{1,2}):?(\d{2})?(am|pm)$/);
    if (!mt) return null;
    const h = parseInt(mt[1], 10);
    const m = mt[2] !== undefined ? parseInt(mt[2], 10) : 0;
    if (h < 1 || h > 12 || m > 59) return null;
    let h24 = h % 12;
    if (mt[3] === "pm") h24 += 12;
    return h24 * 60 + m;
  }

  // "half past 3", "quarter to 4", "3 o'clock" — for showing the answer.
  function clockPhrase(h, m) {
    const hr = ((h - 1 + 12) % 12) + 1;
    const next = (hr % 12) + 1;
    if (m === 0) return `${hr} o'clock`;
    if (m === 15) return `quarter past ${hr}`;
    if (m === 30) return `half past ${hr}`;
    if (m === 45) return `quarter to ${next}`;
    return `${hr}:${String(m).padStart(2, "0")}`;
  }

  function checkAnswer(guess, cur) {
    if (session.subject === "maths") {
      // Clock questions compare by clock time, not as plain numbers.
      if (cur.shape && cur.shape.type === "clock") {
        const g = parseTimeGuess(guess);
        return g !== null && g === timeToMinutes(cur.shape.h, cur.shape.m);
      }
      // 24-hour conversions compare as minutes-since-midnight — am/pm
      // matters here (unlike the clock face above), so no mod-12 folding —
      // and the hour's leading zero / colon are optional either way.
      if (cur.timeCheck === "24h" || cur.timeCheck === "12h") {
        const g = cur.timeCheck === "24h" ? parse24HourGuess(guess) : parse12HourGuess(guess);
        return g !== null && g === cur.answerMinutes;
      }
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
    if (session.subject !== "maths") return `"${cur.word}"`;
    if (cur.shape && cur.shape.type === "clock") {
      return `${cur.answer} (${clockPhrase(cur.shape.h, cur.shape.m)})`;
    }
    if (cur.shape) {
      return cur.unit ? `${cur.answer} ${cur.unit}` : String(cur.answer);
    }
    return `${cur.question} = ${cur.answer}`;
  }

  function promptText(cur) {
    return session.subject === "maths" ? cur.question : cur.word;
  }

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const guess = answerInput.value.trim();
    if (!guess) return;
    const cur = current();
    const wasCorrect = checkAnswer(guess, cur);
    answerInput.value = "";
    session.answers.push({
      prompt: promptText(cur),
      correctAnswer: correctAnswerText(cur),
      userAnswer: guess,
      correct: wasCorrect,
    });
    if (wasCorrect) {
      session.correct += 1;
      feedback.textContent = "✅ Correct!";
      feedback.className = "good";
      setQuizMascot("correct");
      celebrateFromMascot();
      session.i += 1;
      setTimeout(advanceQuiz, 900);
    } else {
      session.missed.push({ ...cur, userAnswer: guess });
      feedback.textContent = `❌ You answered "${guess}". The answer was ${correctAnswerText(cur)}.`;
      feedback.className = "bad";
      setQuizMascot("wrong");
      flashWrongFromMascot();
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
      const correctText = session.subject === "maths"
        ? `${w.question} = ${w.answer}`
        : w.word;
      li.textContent = w.userAnswer
        ? `${correctText} (you answered: ${w.userAnswer})`
        : correctText;
      missedList.appendChild(li);
    });
    retryBtn.disabled = session.missed.length === 0;
    const entry = saveSessionToHistory();
    const roundLabel = attempt && attempt.retries > 0 ? `Retry ${attempt.retries}` : "First attempt";
    postRoundToForm(entry, roundLabel);

    // Both subjects need ≥80% (counting any retry rounds) to earn the day's
    // tick. If it doesn't qualify we leave the point total untouched. The
    // `attempt.recorded` guard means a full attempt — first try plus any
    // retries — only ever earns its point once, no matter how many times its
    // cumulative score crosses the pass mark across showResults calls.
    const finalPct = attempt && attempt.originalTotal
      ? attempt.endCorrect / attempt.originalTotal
      : pct;
    const earnsTick = finalPct >= PASS_PCT;
    if (earnsTick && attempt && !attempt.recorded) {
      attempt.recorded = true;
      recordLocalPass(session.name, session.level, session.subject);
    }
    const points = getPointsStatus(session.name, session.level).count;
    renderPointsInto(session.name, session.level, resultsPointsEl, resultsChocolateEl);

    if (!earnsTick) {
      const subjectLabel = session.subject === "maths" ? "maths" : "spelling";
      const note = document.createElement("div");
      note.className = "spelling-tick-note";
      note.textContent = `Score ${Math.round(PASS_PCT * 100)}% or more to tick ${subjectLabel} off for today — try Retry missed!`;
      resultsPointsEl.appendChild(note);
      resultsPointsEl.classList.remove("hidden");
    }

    const justHitPrize = earnsTick && !!prizeForCount(points);
    if (pct === 1) {
      playResultsCelebrationVideo(session.level);
    } else if (justHitPrize) {
      playResultsAnimation(session.level);
    } else {
      stopResultsAnimation();
      resultsMascot.style.backgroundImage = `url("${mascotAnimSrc(session.level)}")`;
      resultsMascot.style.backgroundPosition = "0% 0%";
      resultsMascot.classList.add("animated");
    }
    if (justHitPrize) {
      setTimeout(() => {
        const celebrationEl = pct === 1 ? resultsCelebrationVideo : resultsMascot;
        const r = celebrationEl.getBoundingClientRect();
        if (r.width) launchConfetti(r.left + r.width / 2, r.top + r.height / 2);
      }, 250);
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

  // Posts one row per round played — the first attempt and each retry each
  // get their own row, reflecting just that round's questions and score.
  function postRoundToForm(entry, roundLabel) {
    try {
      const total = entry.total;
      const pct = total ? Math.round((entry.correct / total) * 100) : 0;
      const levelLabel = entry.subject === "maths"
        ? `${entry.level} · Maths${entry.list ? " · " + entry.list : ""}`
        : `${entry.level} · Spelling`;
      const data = new FormData();
      data.append(FORM_FIELDS.name,   entry.name);
      data.append(FORM_FIELDS.level,  levelLabel);
      data.append(FORM_FIELDS.score,  String(entry.correct));
      data.append(FORM_FIELDS.total,  String(total));
      data.append(FORM_FIELDS.pct,    String(pct));
      const questionsText = entry.answers && entry.answers.length
        ? entry.answers.map((a) => a.correct
            ? `✓ ${a.prompt}`
            : `✗ ${a.prompt} (you: "${a.userAnswer}")`
          ).join(", ")
        : (entry.missed.length ? `missed: ${entry.missed.join(", ")}` : "perfect");
      data.append(FORM_FIELDS.missed, `${roundLabel} — ${questionsText}`);
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
      answers: session.answers,
    };
    const all = loadHistory();
    all.push(entry);
    const trimmed = all.slice(-500);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    return entry;
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
    let retryWords = session.missed.slice();
    if (session.subject === "maths") {
      // Same questions, different numbers — so they practise the skill, not the answer.
      retryWords = retryWords.map((q) => regenerateMathsQuestion(q, session.level));
    }
    startSession(shuffle(retryWords), session.level, session.subject, session.subList);
  });

  restartBtn.addEventListener("click", () => {
    stopResultsAnimation();
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

    if (e.answers && e.answers.length) {
      const details = document.createElement("details");
      details.className = "entry-answers";
      const summary = document.createElement("summary");
      summary.textContent = "See answers";
      details.appendChild(summary);
      const ul = document.createElement("ul");
      e.answers.forEach((a) => {
        const item = document.createElement("li");
        item.className = a.correct ? "answer-correct" : "answer-wrong";
        item.textContent = a.correct
          ? `✅ ${a.prompt}`
          : `❌ ${a.prompt} — wrote "${a.userAnswer}" (answer: ${a.correctAnswer})`;
        ul.appendChild(item);
      });
      details.appendChild(ul);
      li.appendChild(details);
    } else if (e.missed && e.missed.length) {
      // Older history entries were saved before per-answer detail existed.
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

  // ---- seeded (deterministic) shuffling ----
  //
  // Spelling sessions need a *stable* random draw: the same 20 words all week
  // and the same 10 all day. A seeded PRNG gives us that — same seed in, same
  // sequence out — so the choice survives reloads, retries, and "New practice".

  // FNV-1a string hash → 32-bit unsigned seed.
  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32 — tiny, fast, well-distributed PRNG returning [0, 1).
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Fisher–Yates using a supplied rng; returns a new array (source untouched).
  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Local-date key "YYYY-M-D" — identifies a single day for the daily draw.
  function dateKey(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  // Key for the Monday of d's week — identifies a week for the weekly pool.
  function mondayKey(d) {
    const dow = d.getDay(); // 0=Sun … 6=Sat
    const toMonday = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + toMonday);
    return dateKey(monday);
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

  // ---- daily space background (NASA APOD) ----
  //
  // Uses a personal api.nasa.gov key (1000 req/hr) rather than the shared
  // DEMO_KEY, which is rate-limited per IP address and gets exhausted by
  // anyone else on the same network/key. We still cache the chosen image per
  // calendar day in localStorage — normal use is one real fetch per device
  // per day. Video-of-the-day entries have no still image, so on those days
  // we pull a random image from the last year of the archive instead.
  const APOD_API = "https://api.nasa.gov/planetary/apod";
  const APOD_KEY = "otl7VnoT3MLbrG96UP5bjqMJzfFOvAktrzDjhlhj";
  const APOD_CACHE_KEY = "spelling.apodCache";
  const APOD_RANDOM_ATTEMPTS = 5;

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function randomPastDateStr() {
    const daysAgo = 1 + Math.floor(Math.random() * 365);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  async function fetchApod(dateStr) {
    try {
      const res = await fetch(`${APOD_API}?api_key=${APOD_KEY}&date=${dateStr}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  // Set once the day's photo (and its title/explanation) is fetched or read
  // from cache. Kept separate from *showing* it — see setStargazeAvailable —
  // so the fetch can happen on boot while the reveal waits for completion.
  let apodInfo = null;

  function apodInfoFrom(data) {
    return {
      imageUrl: data.url,
      title: data.title || "",
      explanation: data.explanation || "",
      copyright: data.copyright || "",
    };
  }

  function refreshSpaceBackground() {
    const spaceBg = $("space-bg");
    if (spaceAvailable && apodInfo && apodInfo.imageUrl) {
      spaceBg.style.backgroundImage =
        `linear-gradient(180deg, rgba(11,18,32,0.15), rgba(11,18,32,0.55)), url("${apodInfo.imageUrl}")`;
      spaceCaptionTitle.textContent = apodInfo.title;
      spaceCaptionText.textContent = apodInfo.copyright
        ? `${apodInfo.explanation} (📷 ${apodInfo.copyright})`
        : apodInfo.explanation;
      spaceCaption.classList.toggle("hidden", !apodInfo.title || !captionVisible);
    } else {
      spaceBg.style.backgroundImage = "";
      spaceCaption.classList.add("hidden");
    }
    updateCaptionToggleBtn();
  }

  async function loadApodBackground() {
    const today = todayStr();
    let cache = null;
    try { cache = JSON.parse(localStorage.getItem(APOD_CACHE_KEY) || "null"); } catch (e) { cache = null; }
    if (cache && cache.date === today) {
      apodInfo = cache.imageUrl ? cache : null;
      refreshSpaceBackground();
      return;
    }

    const todayData = await fetchApod(today);
    if (!todayData) return; // network hiccup / rate limit — don't cache, try again next load

    // Deliberately using `url` (standard resolution, usually well under 1MB)
    // rather than `hdurl`, which can be 5-10+ MB — far too heavy for a page
    // background, especially on the tablets this app tends to run on.
    let info = todayData.media_type === "image" ? apodInfoFrom(todayData) : null;

    if (!info) {
      for (let i = 0; i < APOD_RANDOM_ATTEMPTS && !info; i++) {
        const pastData = await fetchApod(randomPastDateStr());
        if (pastData && pastData.media_type === "image") {
          info = apodInfoFrom(pastData);
        }
      }
    }

    localStorage.setItem(APOD_CACHE_KEY, JSON.stringify(info ? { date: today, ...info } : { date: today, imageUrl: null }));
    apodInfo = info;
    refreshSpaceBackground();
  }

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
    if (!document.hidden) {
      checkForUpdate();
      refreshPointsFromSheet();
    }
  });

  // boot
  populateLevels();
  applySetupMode();
  refreshPointsFromSheet();
  checkForUpdate();
  loadApodBackground();
  setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
})();
