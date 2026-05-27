# Spelling Practice

A tiny browser-only spelling app for kids. The app says a word, says it in a sentence, the kid types it, and gets a score at the end. Missed words can be retried.

No build step, no server — just three static files.

## Run locally

Open `index.html` in any modern browser (Chrome/Edge/Safari/Firefox). Speech requires the browser's built-in `SpeechSynthesis` API, which all modern browsers have.

## Published on GitHub Pages

The app is live at `https://gpdavis.github.io/Spelling/`.


## Editing word lists

All words live in [words.js](words.js). Each entry is:

```js
{ word: "cat", sentence: "The cat sat on the mat." }
```

Add new levels or lists by following the same shape — the dropdowns are built from whatever's in that file.

## Notes

- Progress (name) is remembered per-device via `localStorage`.
- Each device tracks its own state; there are no accounts.
- The speech voice is whatever the browser provides — quality varies by OS.

## Testing helpers

To wipe all saved history on the current device, open the browser's DevTools console (F12 → Console tab) and run:

```js
clearSpellingHistory()
```

It prints how many entries were cleared and refreshes the history view if it's open.
