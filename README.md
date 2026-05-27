# Spelling Practice

A tiny browser-only spelling app for kids. The app says a word, says it in a sentence, the kid types it, and gets a score at the end. Missed words can be retried.

No build step, no server — just three static files.

## Run locally

Open `index.html` in any modern browser (Chrome/Edge/Safari/Firefox). Speech requires the browser's built-in `SpeechSynthesis` API, which all modern browsers have.

## Publish on GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After ~1 minute the app is live at `https://<your-username>.github.io/Spelling/`.

Share that URL with the kids — they can bookmark it on a phone/tablet/laptop.

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
