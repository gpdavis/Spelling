# Spellatron

A browser-only spelling app for kids. The app says a word, says it in a sentence, the kid types it, gets reactions from one of two animated mascots, and sees a score at the end. Missed words can be retried.

No build step, no server — just static HTML/CSS/JS.

## Run locally

Open `index.html` in any modern browser (Chrome/Edge/Safari/Firefox). Speech requires the browser's built-in `SpeechSynthesis` API, which all modern browsers have.

## Published on GitHub Pages

The app is live at `https://gpdavis.github.io/Spelling/`.

## Levels and word lists

Word lists in [words.js](words.js) follow the Australian Curriculum v9 (ACARA) and the NSW NESA English K–10 scope and sequence. Each year level has three sub-lists organised by spelling pattern:

- **Kindergarten** — CVC words, sight words, common nouns
- **Year 1** — digraphs, magic-e, consonant blends
- **Year 2** — vowel teams, r-controlled vowels, silent letters / tricky patterns
- **Year 3** — prefixes & suffixes, common words, homophones
- **Year 4** — plural rules, Australian spellings, -tion / -ous / soft c & g
- **Year 5** — Greek & Latin roots, tricky letter patterns, -able / -ible / -ous
- **Year 6** — Greek & Latin roots, -ance / -ence / -cian, Australian spelling consolidation

Each session pulls 10 random words from the selected year. Australian English spellings (colour, centre, organise, travelled) are used throughout.

## Mascots

Two mascots react during the quiz and on the results screen:

- **Monty** (a dog in a bunny costume) — Kindergarten to Year 3
- **NinjaBunny** — Year 4 to Year 6

The mascot swaps between standard / correct / incorrect poses as the kid answers. A perfect score (100%) triggers a looping victory sprite animation on the results screen.

## Streaks

The app tracks how many days in a row each kid (keyed by name) has practised. The current streak shows on the home screen as `🔥 N days in a row!` after they finish a session. Missing a day resets the streak to 0; practising again the next day starts fresh at 1.

At a 10-day streak the home and results screens show:

> 🍫 Send a screen shot of this to your parents to get a chocolate surprise!

Streak data lives in `localStorage` under `spelling.streaks` as a per-name JSON map.

## Results go to a Google Sheet

The app posts one row per **attempt** to a Google Form. An attempt is the initial 10-word run plus any "Retry missed" rounds the kid plays through before clicking "New practice". The form's linked spreadsheet becomes a running log of attempts across every device.

The row is posted when the attempt ends — either by getting every word right after retries, or by the kid clicking "New practice".

Fields submitted:

| Field | Example |
|---|---|
| Name | `Lucy` |
| Level | `Year 3` |
| Score (end correct) | `10` |
| Total | `10` |
| Percent | `100` |
| Missed words | `Original: 8/10. Retries: 1. still missed: their` |

Note that **Score** is the *cumulative* correct count after retries, and the **Missed words** field packs the original score and retry count alongside any still-missed words — so a single row shows the whole journey.

The POST runs with `mode: "no-cors"` and is best-effort — the kid is never blocked if it fails, and no error is shown. The form ID and field IDs live in `app.js` (`FORM_SUBMIT_URL` and `FORM_FIELDS`); to point at a different form, replace those two constants.

To see the data, open the linked Google Form's **Responses** tab or open the Sheet it writes to.

## Editing word lists

Each entry in [words.js](words.js) is:

```js
{ word: "cat", sentence: "The cat sat on the mat.", emoji: "🐈" }
```

Optional fields:

- `emoji` — picture shown above the word (omit for abstract words)
- `homophone: true` — for words that sound like another (their/there/they're). The app plays the sentence right after the word so the kid hears the disambiguating context.

Add new levels or sub-lists by following the same shape — the dropdown is built from whatever's in the file.

## Notes

- Name, level, streaks, and local session history are all persisted per-device via `localStorage`.
- Streak data is keyed by name, so siblings sharing a device each get their own streak.
- Each device tracks its own state; there are no accounts.
- The speech voice is whatever the browser provides — quality varies by OS.

## Testing helpers

Open the browser's DevTools console (F12 → Console tab) and run:

```js
clearSpellingHistory()   // wipe local session history
resetSpellingApp()       // also forget the saved name and level
```

Each prints what it cleared. These only affect local state — they do **not** delete rows from the Google Sheet.
