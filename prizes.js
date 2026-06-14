// Streak prize configuration.
//
// A kid earns a prize when their streak reaches one of these day counts. Each
// tier has a list of `days` (streak lengths that trigger it) and the `message`
// shown on the home and results screens at that milestone. A streak length that
// appears in `big` wins the big prize; otherwise, if it's in `small`, the small
// prize. Edit the lists below to change when prizes appear.
(function () {
  window.STREAK_PRIZES = {
    small: {
      days: [10, 14, 23, 35, 48, 61, 79, 91],
      message: "🍫 Send a screen shot of this to your parents to get a chocolate surprise!",
    },
    big: {
      days: [29, 57, 88],
      message: "🏆 Huge effort! Send a screen shot to your parents for a BIG prize!",
    },
  };
})();
