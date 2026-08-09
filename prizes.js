// Point prize configuration.
//
// A kid earns a prize when their lifetime point total reaches one of these
// counts. Each tier has a list of `points` (totals that trigger it) and the
// `message` shown on the home and results screens at that milestone. A total
// that appears in `big` wins the big prize; otherwise, if it's in `small`,
// the small prize. Edit the lists below to change when prizes appear.
(function () {
  window.POINT_PRIZES = {
    small: {
      points: [10, 14, 23, 35, 51, 61, 79, 91],
      message: "🍫 Send a screen shot of this to your parents to get a chocolate surprise!",
      robot: "Images/RobotStreak.svg",
    },
    big: {
      points: [29, 57, 88, 100],
      message: "🏆 Huge effort! Send a screen shot to your parents for a BIG prize!",
      robot: "Images/RobotSuperStreak.svg",
    },
  };
})();
