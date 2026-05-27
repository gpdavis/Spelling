# Spelling Practice

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

Each session pulls 20 random words from the selected year. Australian English spellings (colour, centre, organise, travelled) are used throughout.

## Mascots

Two mascots react during the quiz and on the results screen:

- **Monty** (a dog in a bunny costume) — Kindergarten to Year 3
- **NinjaBunny** — Year 4 to Year 6

The mascot swaps between standard / correct / incorrect poses as the kid answers. A perfect score (100%) triggers a looping victory sprite animation on the results screen.

## Results go to a Google Sheet

After every completed session (initial run *and* retry-missed runs), the app posts the result to a Google Form. The form's linked spreadsheet becomes a running log of every session across every device.

Fields submitted:

| Field | Example |
|---|---|
| Name | `Lucy` |
| Level | `Year 3` |
| Score | `18` |
| Total | `20` |
| Percent | `90` |
| Missed words | `their, journey` |

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

- Name and level are remembered per-device via `localStorage`.
- Local session history is also stored in `localStorage` (independent of the Google Sheet log).
- Each device tracks its own state; there are no accounts.
- The speech voice is whatever the browser provides — quality varies by OS.

## Testing helpers

Open the browser's DevTools console (F12 → Console tab) and run:

```js
clearSpellingHistory()   // wipe local session history
resetSpellingApp()       // also forget the saved name and level
```

Each prints what it cleared. These only affect local state — they do **not** delete rows from the Google Sheet.
