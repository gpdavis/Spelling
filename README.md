# Spellatron

A browser-only practice app for kids. Two subjects:

- **Spelling** — the app says a word (and uses it in a sentence), the kid types it.
- **Maths** — the app shows a question (`7 × 8`, `2, 4, 6, ?`, `25% of 40 = ?`), the kid types the answer.

Either way, two animated mascots react as they go, a score shows at the end, and missed items can be retried. No build step, no server — just static HTML/CSS/JS.

## Run locally

Open `index.html` in any modern browser (Chrome/Edge/Safari/Firefox). Speech requires the browser's built-in `SpeechSynthesis` API, which all modern browsers have.

## Published on GitHub Pages

The app is live at `https://gpdavis.github.io/Spelling/`.

## Subjects and year levels

Pick a year (Kindergarten through Year 6), then tap either **📝 Spelling** or **🔢 Maths** on the home screen. Maths prompts you for a topic; spelling mixes patterns from across the year.

### Spelling — [words.js](words.js)

Curriculum-grounded in Australian Curriculum v9 (ACARA) + NSW NESA English K–10. Three sub-lists per year, mixed at random in each session:

- **Kindergarten** — CVC words, sight words, common nouns
- **Year 1** — digraphs, magic-e, consonant blends
- **Year 2** — vowel teams, r-controlled vowels, silent letters / tricky patterns
- **Year 3** — prefixes & suffixes, common words, homophones
- **Year 4** — plural rules, Australian spellings, -tion / -ous / soft c & g
- **Year 5** — Greek & Latin roots, tricky letter patterns, -able / -ible / -ous
- **Year 6** — Greek & Latin roots, -ance / -ence / -cian, Australian spelling consolidation

Australian English throughout (colour, centre, organise, travelled).

### Maths — [maths.js](maths.js)

Aligned to Australian Curriculum v9 Mathematics. Each year has 3–6 topics; a session mixes 10 questions drawn at random from all topics for that year.

- **Kindergarten** — Count forward · One more / one less · Add to 5
- **Year 1** — Add and subtract to 20 · Doubles and halves · Skip count (2s, 5s, 10s)
- **Year 2** — Skip count by 2s · Skip count by 3s, 5s, 10s · Backwards skip count
- **Year 3** — × facts (2s, 3s, 4s, 5s, 10s) · Division facts · Unit fractions
- **Year 4** — × facts (6s, 7s, 8s, 9s) · Mixed × tables to 10×10 · Division facts · 11s & 12s stretch
- **Year 5** — × and ÷ by 10/100/1000 · Fraction ↔ decimal ↔ percent · Perimeter and metric conversions
- **Year 6** — Integers · Order of operations · Percent of a quantity

Topics with a fixed answer set (fractions, conversions, integers, etc.) are hand-written. Tables, skip counts, and basic arithmetic are *generators* — they synthesise a fresh question each time, so the kid never sees the same `7 × 8` twice in a row.

Each session pulls 10 questions from the chosen topic.

## Mascots

Two mascots react during the quiz and on the results screen:

- **Monty** (a dog in a bunny costume) — Kindergarten to Year 3
- **NinjaBunny** — Year 4 to Year 6

The mascot swaps between standard / correct / incorrect poses as the kid answers. A perfect score (100%) triggers a looping victory sprite animation on the results screen.

## Streaks

The app tracks how many days in a row each kid (keyed by name) has practised. The rule:

> **A day only counts toward the streak when the kid has done both spelling *and* maths on that same day.**

While today is in progress, the home and results screens show a progress line like `Today: ✅ Spelling · ⬜ Maths`. Once both are ticked, the streak counter rolls forward. Missing a day (or only doing one subject for a day) breaks the streak — it resets to 0 and starts fresh the next time both subjects are done.

At a 10-day streak the home and results screens show:

> 🍫 Send a screen shot of this to your parents to get a chocolate surprise!

When the streak ticks over to exactly 10, the results screen also fires the looping victory sprite + a confetti burst.

Streak data lives in `localStorage` under `spelling.streaks` as a per-name JSON map: `{ lastCounted, count, todayDate, todayDone }`. Older `{ last, count }` entries are migrated read-only so existing kids keep their numbers.

## Results go to a Google Sheet

The app posts one row per **attempt** to a Google Form. An attempt is the initial 10-question run plus any "Retry missed" rounds the kid plays through before clicking "New practice". The form's linked spreadsheet becomes a running log of attempts across every device, spelling and maths combined.

The row is posted when the attempt ends — either by getting every answer right after retries, or by the kid clicking "New practice".

Fields submitted:

| Field | Spelling example | Maths example |
|---|---|---|
| Name | `Lucy` | `Lucy` |
| Level | `Year 3 · Spelling` | `Year 4 · Maths` |
| Score (end correct) | `10` | `9` |
| Total | `10` | `10` |
| Percent | `100` | `90` |
| Missed | `Original: 8/10. Retries: 1. still missed: their` | `Original: 8/10. Retries: 0. still missed: 7 × 8` |

Note that **Score** is the *cumulative* correct count after retries, and the **Missed words** field packs the original score and retry count alongside any still-missed words — so a single row shows the whole journey.

The POST runs with `mode: "no-cors"` and is best-effort — the kid is never blocked if it fails, and no error is shown. The form ID and field IDs live in `app.js` (`FORM_SUBMIT_URL` and `FORM_FIELDS`); to point at a different form, replace those two constants.

To see the data, open the linked Google Form's **Responses** tab or open the Sheet it writes to.

## Editing the lists

### Spelling — [words.js](words.js)

Each entry is:

```js
{ word: "cat", sentence: "The cat sat on the mat.", emoji: "🐈" }
```

Optional fields:

- `emoji` — picture shown above the word (omit for abstract words)
- `homophone: true` — for words that sound like another (their/there/they're). The app plays the sentence right after the word so the kid hears the disambiguating context.

### Maths — [maths.js](maths.js)

Two ways to define a topic. **Hand-written** — an array of `{ question, answer }`:

```js
"Unit fractions": [
  { question: "½ of 10 = ?", answer: "5" },
  ...
]
```

**Generator-backed** — `{ generator: "name", args: { ... } }`:

```js
"Skip count by 2s": { generator: "skipCount", args: { steps: [2] } }
```

Generators live in the same file (`MATHS_GENERATORS`). To add a new pattern, write a function that returns `{ question, answer }` and reference it by name in `MATHS_LISTS`.

Answer matching for maths normalises whitespace, case, and operator glyphs (`×` ↔ `*`, `÷` ↔ `/`, `−` ↔ `-`), then falls back to a numeric compare. So `12 ` and `12` both pass for an answer of `"12"`.

## Auto-update on new deploys

The app polls its own `index.html` every 5 minutes (and whenever the tab comes back into focus) using a HEAD request with `cache: "no-store"`. It compares the `ETag` / `Last-Modified` header to what it saw at boot; if it changed, the app reloads itself — but only when the user is on the home screen, so a kid is never yanked out of a quiz. If a new version drops mid-session, the reload is held until they return to setup.

This works out of the box on GitHub Pages — no version file to maintain. To disable, remove the `checkForUpdate()` and `setInterval` calls at the bottom of `app.js`.

## Notes

- Name, level, streaks, and local session history are all persisted per-device via `localStorage`.
- Streak data is keyed by name, so siblings sharing a device each get their own streak.
- Each device tracks its own state; there are no accounts.
- The speech voice is whatever the browser provides — quality varies by OS.

## Automated tests

Playwright tests cover the home screen, both quiz flows, and the mascot frame logic. They live in [tests/](tests/) and run against a local `http-server` that Playwright starts on `:4567` automatically.

One-time setup (requires [Node.js](https://nodejs.org)):

```powershell
npm install
npx playwright install chromium
```

Run the suite:

```powershell
npm test               # headless
npm run test:ui        # interactive UI runner
npm run test:headed    # watch the browser drive itself
```

Tests stub [words.js](words.js) and [maths.js](maths.js) via `page.route()` with single-question fixtures, so each spec knows the exact expected answer.

## Testing helpers

Open the browser's DevTools console (F12 → Console tab) and run:

```js
clearSpellingHistory()   // wipe local session history
resetSpellingApp()       // also forget the saved name and level
```

Each prints what it cleared. These only affect local state — they do **not** delete rows from the Google Sheet.
