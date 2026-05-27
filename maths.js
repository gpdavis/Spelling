// Maths question lists. Two flavours of entries:
//
//   1. Hand-written: { question: "½ of 10 = ?", answer: "5" }
//   2. Generator-backed sub-lists: { generator: "name", args: { ... } }
//      The generator is called once per question at session start to produce a
//      { question, answer } pair. See MATHS_GENERATORS below for the catalogue.
//
// Levels and topics follow the Australian Curriculum v9 (ACARA) Mathematics.
// Year 2 leans heavily on skip counting (AC9M2A01) and Year 4 on
// multiplication facts to 10×10 plus related division (AC9M4A02).

(function () {
  function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const MATHS_GENERATORS = {
    // ---- Foundation / Kindergarten ----
    kindyCountForward() {
      const start = randInt(1, 15);
      return { question: `${start}, ${start + 1}, ${start + 2}, ?`, answer: String(start + 3), context: "Counting forward" };
    },
    kindyOneMoreLess() {
      const n = randInt(1, 18);
      return Math.random() < 0.5
        ? { question: `1 more than ${n} = ?`, answer: String(n + 1), context: "One more" }
        : { question: `1 less than ${n + 1} = ?`, answer: String(n), context: "One less" };
    },
    kindyAddTo5() {
      const a = randInt(0, 5);
      const b = randInt(0, 5 - a);
      return { question: `${a} + ${b} = ?`, answer: String(a + b), context: "Add to 5" };
    },

    // ---- Year 1 ----
    y1AddSubTo20() {
      if (Math.random() < 0.5) {
        const a = randInt(2, 15);
        const b = randInt(2, 20 - a);
        return { question: `${a} + ${b} = ?`, answer: String(a + b), context: "Addition" };
      } else {
        const a = randInt(6, 20);
        const b = randInt(1, a - 1);
        return { question: `${a} − ${b} = ?`, answer: String(a - b), context: "Subtraction" };
      }
    },
    y1DoublesHalves() {
      if (Math.random() < 0.5) {
        const n = randInt(1, 10);
        return { question: `Double ${n} = ?`, answer: String(n * 2), context: "Doubles" };
      } else {
        const half = randInt(1, 10);
        return { question: `Half of ${half * 2} = ?`, answer: String(half), context: "Halves" };
      }
    },

    // ---- Skip counting (Y1 + Y2) ----
    skipCount({ steps, direction = "forward" }) {
      const step = pick(steps);
      const back = direction === "back";
      const dir = back ? -1 : 1;
      // Choose a start that keeps the whole sequence in [0, 120] either way.
      const margin = step * 4;
      const start = back ? randInt(margin, 120) : randInt(0, 120 - margin);
      const seq = [start, start + dir * step, start + 2 * dir * step, start + 3 * dir * step];
      const answer = start + 4 * dir * step;
      const context = back
        ? `Backward skip counting by ${step}`
        : `Skip counting by ${step}`;
      return { question: `${seq.join(", ")}, ?`, answer: String(answer), context };
    },

    // ---- Year 2: simple +/- with a number line and friends-to-10 ----
    y2AddNumberLine() {
      const a = randInt(1, 12);
      const b = randInt(1, 20 - a);
      return { question: `${a} + ${b} = ?`, answer: String(a + b), aid: "numberline", context: "Addition" };
    },
    y2SubNumberLine() {
      const a = randInt(5, 20);
      const b = randInt(1, a - 1);
      return { question: `${a} − ${b} = ?`, answer: String(a - b), aid: "numberline", context: "Subtraction" };
    },
    friendsToTen() {
      const a = randInt(1, 9);
      return Math.random() < 0.5
        ? { question: `${a} + ? = 10`, answer: String(10 - a), context: "Friends to 10" }
        : { question: `What goes with ${a} to make 10?`, answer: String(10 - a), context: "Friends to 10" };
    },

    // ---- Multiplication and division ----
    timesTables({ tables, maxMultiplier = 10 }) {
      const a = pick(tables);
      const b = randInt(2, maxMultiplier);
      // randomise which side the "interesting" factor lands on so kids
      // don't see a fixed table column every time
      const value = a * b;
      const context = `Times tables (${a}×)`;
      return Math.random() < 0.5
        ? { question: `${a} × ${b}`, answer: String(value), context }
        : { question: `${b} × ${a}`, answer: String(value), context };
    },
    divisionFacts({ tables, maxMultiplier = 10 }) {
      const divisor = pick(tables);
      const quotient = randInt(2, maxMultiplier);
      const dividend = divisor * quotient;
      return { question: `${dividend} ÷ ${divisor}`, answer: String(quotient), context: "Division facts" };
    },
  };

  window.MATHS_GENERATORS = MATHS_GENERATORS;

  window.MATHS_LISTS = {
    "Kindergarten": {
      "Count forward": { generator: "kindyCountForward" },
      "One more / one less": { generator: "kindyOneMoreLess" },
      "Add to 5": { generator: "kindyAddTo5" }
    },

    "Year 1": {
      "Add and subtract to 20": { generator: "y1AddSubTo20" },
      "Doubles and halves": { generator: "y1DoublesHalves" },
      "Skip count (2s, 5s, 10s)": { generator: "skipCount", args: { steps: [2, 5, 10] } }
    },

    "Year 2": {
      "Skip count by 2s": { generator: "skipCount", args: { steps: [2] } },
      "Skip count by 3s, 4s, 5s, 10s": { generator: "skipCount", args: { steps: [3, 4, 5, 10] } },
      "Backwards skip count": { generator: "skipCount", args: { steps: [2, 3, 4, 5, 10], direction: "back" } },
      "Simple addition (with number line)": { generator: "y2AddNumberLine" },
      "Simple subtraction (with number line)": { generator: "y2SubNumberLine" },
      "Friends to 10": { generator: "friendsToTen" }
    },

    "Year 3": {
      "× facts (2s, 3s, 4s, 5s, 10s)": { generator: "timesTables", args: { tables: [2, 3, 4, 5, 10] } },
      "Division facts (matching)":     { generator: "divisionFacts", args: { tables: [2, 3, 4, 5, 10] } },
      "Unit fractions": [
        { question: "½ of 10 = ?",  answer: "5" },
        { question: "½ of 16 = ?",  answer: "8" },
        { question: "½ of 24 = ?",  answer: "12" },
        { question: "¼ of 8 = ?",   answer: "2" },
        { question: "¼ of 16 = ?",  answer: "4" },
        { question: "¼ of 20 = ?",  answer: "5" },
        { question: "⅓ of 9 = ?",   answer: "3" },
        { question: "⅓ of 12 = ?",  answer: "4" },
        { question: "⅓ of 15 = ?",  answer: "5" },
        { question: "⅕ of 10 = ?",  answer: "2" },
        { question: "⅕ of 15 = ?",  answer: "3" },
        { question: "⅕ of 25 = ?",  answer: "5" },
        { question: "⅛ of 8 = ?",   answer: "1" },
        { question: "⅛ of 16 = ?",  answer: "2" },
        { question: "⅛ of 24 = ?",  answer: "3" }
      ]
    },

    "Year 4": {
      "× facts (6s, 7s, 8s, 9s)":   { generator: "timesTables", args: { tables: [6, 7, 8, 9] } },
      "Mixed × tables (to 10×10)":  { generator: "timesTables", args: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] } },
      "Division facts":             { generator: "divisionFacts", args: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] } },
      "× 11s and 12s (stretch)":    { generator: "timesTables", args: { tables: [11, 12], maxMultiplier: 12 } }
    },

    "Year 5": {
      "× and ÷ by 10, 100, 1000": [
        { question: "47 × 10 = ?",     answer: "470" },
        { question: "138 × 10 = ?",    answer: "1380" },
        { question: "5 × 100 = ?",     answer: "500" },
        { question: "26 × 100 = ?",    answer: "2600" },
        { question: "9 × 1000 = ?",    answer: "9000" },
        { question: "34 × 1000 = ?",   answer: "34000" },
        { question: "320 ÷ 10 = ?",    answer: "32" },
        { question: "4500 ÷ 10 = ?",   answer: "450" },
        { question: "800 ÷ 100 = ?",   answer: "8" },
        { question: "6200 ÷ 100 = ?",  answer: "62" },
        { question: "7000 ÷ 1000 = ?", answer: "7" },
        { question: "45000 ÷ 1000 = ?",answer: "45" },
        { question: "8.4 × 10 = ?",    answer: "84" },
        { question: "0.6 × 100 = ?",   answer: "60" },
        { question: "12 ÷ 100 = ?",    answer: "0.12" }
      ],
      "Fraction ↔ decimal ↔ percent": [
        { question: "½ as a decimal",      answer: "0.5" },
        { question: "¼ as a decimal",      answer: "0.25" },
        { question: "¾ as a decimal",      answer: "0.75" },
        { question: "0.5 as a percent",    answer: "50%" },
        { question: "0.25 as a percent",   answer: "25%" },
        { question: "0.1 as a percent",    answer: "10%" },
        { question: "50% as a fraction",   answer: "1/2" },
        { question: "25% as a fraction",   answer: "1/4" },
        { question: "10% as a fraction",   answer: "1/10" },
        { question: "75% as a fraction",   answer: "3/4" },
        { question: "⅒ as a percent",      answer: "10%" },
        { question: "⅒ as a decimal",      answer: "0.1" },
        { question: "0.75 as a percent",   answer: "75%" },
        { question: "100% as a fraction",  answer: "1" },
        { question: "20% as a fraction",   answer: "1/5" }
      ],
      "Perimeter and metric conversions": [
        { question: "Perimeter of a 6 cm × 4 cm rectangle (cm)", answer: "20" },
        { question: "Perimeter of a 5 cm × 5 cm square (cm)",    answer: "20" },
        { question: "Perimeter of a 8 m × 3 m rectangle (m)",    answer: "22" },
        { question: "Perimeter of a 10 cm × 7 cm rectangle (cm)",answer: "34" },
        { question: "How many cm in 2 m?",                       answer: "200" },
        { question: "How many cm in 1.5 m?",                     answer: "150" },
        { question: "How many mm in 4 cm?",                      answer: "40" },
        { question: "How many m in 3 km?",                       answer: "3000" },
        { question: "How many g in 2 kg?",                       answer: "2000" },
        { question: "How many g in 0.5 kg?",                     answer: "500" },
        { question: "How many mL in 1 L?",                       answer: "1000" },
        { question: "How many mL in 2.5 L?",                     answer: "2500" },
        { question: "How many kg in 4000 g?",                    answer: "4" },
        { question: "How many L in 2500 mL?",                    answer: "2.5" },
        { question: "How many m in 250 cm?",                     answer: "2.5" }
      ]
    },

    "Year 6": {
      "Integers": [
        { question: "−3 + 5 = ?",    answer: "2" },
        { question: "−4 + 7 = ?",    answer: "3" },
        { question: "5 − 8 = ?",     answer: "-3" },
        { question: "2 − 6 = ?",     answer: "-4" },
        { question: "−2 + (−5) = ?", answer: "-7" },
        { question: "−6 + 6 = ?",    answer: "0" },
        { question: "−10 + 4 = ?",   answer: "-6" },
        { question: "7 − 12 = ?",    answer: "-5" },
        { question: "−3 − 4 = ?",    answer: "-7" },
        { question: "−1 + 8 = ?",    answer: "7" },
        { question: "0 − 5 = ?",     answer: "-5" },
        { question: "−8 + 3 = ?",    answer: "-5" },
        { question: "−5 + 10 = ?",   answer: "5" },
        { question: "9 − 15 = ?",    answer: "-6" },
        { question: "−7 − 2 = ?",    answer: "-9" }
      ],
      "Order of operations": [
        { question: "3 + 4 × 2 = ?",     answer: "11" },
        { question: "(3 + 4) × 2 = ?",   answer: "14" },
        { question: "10 − 6 ÷ 2 = ?",    answer: "7" },
        { question: "(10 − 6) ÷ 2 = ?",  answer: "2" },
        { question: "5 × 2 + 3 = ?",     answer: "13" },
        { question: "5 × (2 + 3) = ?",   answer: "25" },
        { question: "20 ÷ 4 + 1 = ?",    answer: "6" },
        { question: "20 ÷ (4 + 1) = ?",  answer: "4" },
        { question: "8 + 6 × 3 = ?",     answer: "26" },
        { question: "(8 + 6) × 3 = ?",   answer: "42" },
        { question: "9 − 2 × 3 = ?",     answer: "3" },
        { question: "(9 − 2) × 3 = ?",   answer: "21" },
        { question: "12 ÷ 2 + 4 = ?",    answer: "10" },
        { question: "12 ÷ (2 + 4) = ?",  answer: "2" },
        { question: "2 × 3 + 4 × 5 = ?", answer: "26" }
      ],
      "Percent of a quantity": [
        { question: "50% of 20 = ?",   answer: "10" },
        { question: "50% of 80 = ?",   answer: "40" },
        { question: "25% of 40 = ?",   answer: "10" },
        { question: "25% of 100 = ?",  answer: "25" },
        { question: "10% of 60 = ?",   answer: "6" },
        { question: "10% of 80 = ?",   answer: "8" },
        { question: "10% of 250 = ?",  answer: "25" },
        { question: "20% of 50 = ?",   answer: "10" },
        { question: "20% of 100 = ?",  answer: "20" },
        { question: "5% of 200 = ?",   answer: "10" },
        { question: "75% of 80 = ?",   answer: "60" },
        { question: "100% of 42 = ?",  answer: "42" },
        { question: "10% of $80 = ?",  answer: "$8" },
        { question: "25% of $40 = ?",  answer: "$10" },
        { question: "50% of $30 = ?",  answer: "$15" }
      ]
    }
  };
})();
