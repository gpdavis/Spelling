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
  function formatThousands(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    // +1/-1 (just count on/back one) and +10/-10 (just bump the tens digit)
    // are trivial, so the second number always skips those two values.
    y2AddNumberLine() {
      const a = randInt(1, 12);
      const maxB = 20 - a;
      let b;
      do { b = randInt(2, maxB); } while (b === 10);
      return { question: `${a} + ${b} = ?`, answer: String(a + b), aid: "numberline", context: "Addition" };
    },
    y2SubNumberLine() {
      const a = randInt(5, 20);
      const maxB = a - 1;
      let b;
      do { b = randInt(2, maxB); } while (b === 10);
      return { question: `${a} − ${b} = ?`, answer: String(a - b), aid: "numberline", context: "Subtraction" };
    },
    // friendsToTen() {
    //   const a = randInt(1, 9);
    //   return Math.random() < 0.5
    //     ? { question: `${a} + ? = 10`, answer: String(10 - a), context: "Friends to 10" }
    //     : { question: `What goes with ${a} to make 10?`, answer: String(10 - a), context: "Friends to 10" };
    // },

    // ---- Place value recognition to 9,999 (Y2) ----
    // Uses a 4-digit number with distinct digits (and no leading zero) so
    // "value of the digit X" questions always have one unambiguous answer.
    placeValueTo9999() {
      const digits = [];
      while (digits.length < 4) {
        const d = randInt(0, 9);
        if (digits.length === 0 && d === 0) continue;
        if (!digits.includes(d)) digits.push(d);
      }
      const [th, h, t, o] = digits;
      const n = th * 1000 + h * 100 + t * 10 + o;
      const formatted = formatThousands(n);
      const places = [
        { name: "thousands", digit: th, value: th * 1000 },
        { name: "hundreds", digit: h, value: h * 100 },
        { name: "tens", digit: t, value: t * 10 },
        { name: "ones", digit: o, value: o },
      ];
      const place = pick(places);
      return Math.random() < 0.5
        ? { question: `What digit is in the ${place.name} place in ${formatted}?`, answer: String(place.digit), context: "Place value" }
        : { question: `What is the value of the ${place.digit} in ${formatted}?`, answer: String(place.value), context: "Place value" };
    },

    // ---- Telling the time (Y2: to the quarter-hour, AC9M2M03) ----
    // Renders an analogue clock (see shape.type "clock" in app.js). The answer
    // is the digital time; the app also accepts "half past 3" style phrasing.
    clockToQuarter() {
      const h = randInt(1, 12);
      const m = pick([0, 15, 30, 45]);
      return {
        question: "What time is it?",
        answer: `${h}:${String(m).padStart(2, "0")}`,
        shape: { type: "clock", h, m },
        context: "Telling the time",
      };
    },

    // ---- Telling the time (Y4: any minute, AC9M4M02) ----
    // Same analogue clock as clockToQuarter, but the minute hand can land
    // anywhere — reading times like "8:37" is harder than the quarter-hour
    // positions a Y2 kid gets.
    clockAnyMinute() {
      const h = randInt(1, 12);
      const m = randInt(0, 59);
      return {
        question: "What time is it?",
        answer: `${h}:${String(m).padStart(2, "0")}`,
        shape: { type: "clock", h, m },
        context: "Telling the time",
      };
    },

    // ---- 24-hour time conversion (Y4, AC9M4M02) ----
    // Text-only in both directions (no clock face — the whole point is the
    // am/pm ⇄ 24-hour notation, which an analogue face can't show anyway).
    // See convert24Hour's checkAnswer/correctAnswerText branch in app.js:
    // answers are compared as minutes-since-midnight, not exact text, so
    // "3:45", "03:45" and "345" (and "3:45pm" / "3:45 PM") all count.
    convert24Hour() {
      const h12 = randInt(1, 12);
      const m = randInt(0, 59);
      const period = pick(["am", "pm"]);
      const mm = String(m).padStart(2, "0");
      let h24 = h12 % 12;
      if (period === "pm") h24 += 12;

      if (Math.random() < 0.5) {
        // 12-hour -> 24-hour
        return {
          question: `Convert ${h12}:${mm} ${period} to 24-hour time.`,
          answer: `${String(h24).padStart(2, "0")}:${mm}`,
          answerMinutes: h24 * 60 + m,
          timeCheck: "24h",
          context: "24-hour time",
        };
      }
      // 24-hour -> 12-hour
      return {
        question: `Convert ${String(h24).padStart(2, "0")}:${mm} (24-hour time) to a 12-hour time. Include am or pm.`,
        answer: `${h12}:${mm} ${period}`,
        answerMinutes: h24 * 60 + m,
        timeCheck: "12h",
        context: "24-hour time",
      };
    },

    // ---- Multiplication and division ----
    // `avoid` keeps specific factors out of the *other* side of the
    // question too — e.g. tables: [6,7,8,9] alone would still let a "×2"
    // fact sneak in via `b`, since that side is just any number up to
    // maxMultiplier. Pass avoid: [2, 11] wherever those need to stay retired.
    timesTables({ tables, maxMultiplier = 10, avoid = [] }) {
      const a = pick(tables);
      let b;
      do { b = randInt(2, maxMultiplier); } while (avoid.includes(b));
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

    // ---- Year 4: the same × / ÷ facts, dressed up as a mini story ----
    // Every branch is built so the numbers always divide evenly / multiply to
    // a whole answer — no remainders sneaking in except the one template
    // that's explicitly about leftovers.
    y4WordProblem() {
      // Regular nouns only (plural = singular + "s") so templates can just
      // append "s" wherever they need the plural, no irregular forms to trip on.
      const items = ["lamington", "cupcake", "party pie", "jelly bean", "marble", "footy card",
        "Anzac biscuit", "dumpling", "pizza slice", "sticker", "texta", "ice block"];
      const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
      const article = (s) => (/^[aeiou]/i.test(s) ? "An" : "A");

      const templates = [
        // Equal groups (multiplication)
        () => {
          const containers = [
            { singular: "box", plural: "boxes" },
            { singular: "bag", plural: "bags" },
            { singular: "tray", plural: "trays" },
            { singular: "packet", plural: "packets" },
          ];
          const c = pick(containers);
          const item = pick(items);
          const perContainer = pick([6, 7, 8, 9, 6, 7, 8, 9, 3, 4, 5, 12]);
          const numContainers = randInt(2, 9);
          return {
            question: `There are ${numContainers} ${c.plural} of ${item}s with ${perContainer} in each ${c.singular}. How many ${item}s are there altogether?`,
            answer: String(perContainer * numContainers),
          };
        },
        // Fraction of a group — a division fact wearing a party hat, same
        // shape as "A lamington tray has 12 lamingtons, you eat 1/4 — how many?"
        () => {
          const denom = pick([2, 3, 4, 5, 10]);
          const numer = Math.random() < 0.6 ? 1 : randInt(1, denom - 1);
          const n = denom * randInt(1, 6);
          const item = pick(items);
          const portion = (n / denom) * numer;
          const fracWord = numer === 1 ? `1/${denom}` : `${numer}/${denom}`;
          return Math.random() < 0.5
            ? { question: `${article(item)} ${item} tray has ${n} ${item}s. If you eat ${fracWord} of them, how many did you eat?`, answer: String(portion) }
            : { question: `${article(item)} ${item} tray has ${n} ${item}s. You eat ${fracWord} of them. How many are left?`, answer: String(n - portion) };
        },
        // Equal sharing (division)
        () => {
          const friends = randInt(2, 10);
          const each = randInt(2, 10);
          const item = pick(items);
          return {
            question: `${friends} friends share ${friends * each} ${item}s equally. How many ${item}s does each friend get?`,
            answer: String(each),
          };
        },
        // Arrays (multiplication, a different picture in your head)
        () => {
          const rows = randInt(2, 10);
          const perRow = pick([6, 7, 8, 9, 3, 4, 5, 10]);
          const place = pick(["The school hall has", "The bus has", "The cinema has", "The classroom has"]);
          return {
            question: `${place} ${rows} rows of chairs with ${perRow} chairs in each row. How many chairs are there in total?`,
            answer: String(rows * perRow),
          };
        },
        // Money (whole dollars only — no decimals or $ signs to type back)
        () => {
          const price = randInt(2, 9);
          const qty = randInt(2, 10);
          const item = pick(items);
          return {
            question: `${cap(item)}s cost $${price} each. How many dollars would ${qty} of them cost altogether?`,
            answer: String(price * qty),
          };
        },
        // Two-step: share evenly, then say what's left over
        () => {
          const friends = randInt(2, 9);
          const each = randInt(2, 9);
          const extra = randInt(0, each - 1);
          const item = pick(items);
          return {
            question: `You have ${friends * each + extra} ${item}s. You share them evenly between ${friends} friends, giving each as many as possible. How many ${item}s are left over?`,
            answer: String(extra),
          };
        },

        // ---- Addition & subtraction stories ----
        () => {
          const scenes = [
            { verb: "hopped", base: "hop", unit: "m", subject: "A kangaroo" },
            { verb: "flew", base: "fly", unit: "m", subject: "A cockatoo" },
            { verb: "swam", base: "swim", unit: "m", subject: "A platypus" },
            { verb: "ran", base: "run", unit: "m", subject: "A dingo" },
          ];
          const s = pick(scenes);
          const a = randInt(120, 480), b = randInt(120, 480);
          return {
            question: `${s.subject} ${s.verb} ${a}${s.unit}, then another ${b}${s.unit}. How far did it ${s.base} in total, in ${s.unit}?`,
            answer: String(a + b),
          };
        },
        () => {
          const scenes = [
            { start: "A school canteen started with", item: "icy poles", verb: "sold" },
            { start: "A market stall started with", item: "showbags", verb: "sold" },
            { start: "A car park had", item: "spaces free", verb: "filled" },
            { start: "A cockatoo counted", item: "seeds in the tree", verb: "ate" },
          ];
          const s = pick(scenes);
          const total = randInt(400, 900);
          const used = randInt(120, total - 100);
          return {
            question: `${s.start} ${total} ${s.item}. It ${s.verb} ${used}. How many are left?`,
            answer: String(total - used),
          };
        },

        // ---- Money ----
        () => {
          const priceOptionsCents = [150, 225, 275, 350, 425, 475, 550, 625, 650];
          const startDollars = pick([15, 20, 25, 30]);
          const numItems = pick([1, 2]);
          const purchased = [];
          for (let i = 0; i < numItems; i++) purchased.push(pick(priceOptionsCents));
          const spentCents = purchased.reduce((sum, c) => sum + c, 0);
          const changeCents = startDollars * 100 - spentCents; // always positive: max spend $13 < min start $15
          const fmtPrice = (cents) => (cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2));
          const place = pick(["the Canberra Zoo gift shop", "the school fete", "the museum shop", "the show bag stall"]);
          const itemsText = purchased.length === 2
            ? `a $${fmtPrice(purchased[0])} item and a $${fmtPrice(purchased[1])} item`
            : `a $${fmtPrice(purchased[0])} item`;
          return {
            question: `You have $${startDollars} and buy ${itemsText} at ${place}. How much change do you get, in dollars?`,
            answer: fmtPrice(changeCents),
          };
        },
        () => {
          const perWeek = pick([2, 3, 4, 5, 6, 8, 10]);
          const weeks = randInt(4, 12);
          const total = perWeek * weeks;
          const goal = pick(["a new bike helmet", "a video game", "a skateboard", "footy boots", "a Lego set"]);
          return {
            question: `You save $${perWeek} a week to buy ${goal}. How many weeks will it take to save $${total}?`,
            answer: String(weeks),
          };
        },

        // ---- Time (elapsed) — reuses the same 12-hour checker as
        // convert24Hour (timeCheck/answerMinutes), so "5:05pm" / "5:05 pm"
        // are both accepted. ----
        () => {
          const h12 = randInt(1, 12);
          const m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
          const period = pick(["am", "pm"]);
          let h24 = h12 % 12;
          if (period === "pm") h24 += 12;
          const startMinutes = h24 * 60 + m;
          const durHours = randInt(1, 3);
          const durMins = pick([0, 15, 20, 30, 45]);
          const duration = durHours * 60 + durMins;
          const finishMinutes = (startMinutes + duration) % 1440;
          const fH24 = Math.floor(finishMinutes / 60), fM = finishMinutes % 60;
          let fH12 = fH24 % 12; if (fH12 === 0) fH12 = 12;
          const fPeriod = fH24 < 12 ? "am" : "pm";
          const durationText = durMins === 0
            ? `${durHours} hour${durHours === 1 ? "" : "s"}`
            : `${durHours} hour${durHours === 1 ? "" : "s"} ${durMins} minutes`;
          const activity = pick(["A movie", "The school assembly", "Basketball training", "The school play"]);
          return {
            question: `${activity} starts at ${h12}:${String(m).padStart(2, "0")}${period} and runs for ${durationText}. What time does it finish?`,
            answer: `${fH12}:${String(fM).padStart(2, "0")} ${fPeriod}`,
            answerMinutes: finishMinutes,
            timeCheck: "12h",
          };
        },
        () => {
          const h12 = randInt(1, 11);
          const period = pick(["am", "pm"]);
          const startM = pick([0, 5, 10, 15, 20, 25, 30, 35, 40]);
          const elapsed = pick([10, 15, 20, 25, 30, 35, 40, 45]);
          let endM = startM + elapsed, endH = h12;
          if (endM >= 60) { endM -= 60; endH += 1; }
          return {
            question: `How many minutes are there between ${h12}:${String(startM).padStart(2, "0")}${period} and ${endH}:${String(endM).padStart(2, "0")}${period}?`,
            answer: String(elapsed),
          };
        },

        // ---- Patterns & Algebra ----
        () => {
          const start = randInt(2, 10);
          const diff = randInt(2, 5);
          const targetLevel = randInt(4, 8);
          const value = start + diff * (targetLevel - 1);
          const l1 = start, l2 = start + diff, l3 = start + diff * 2;
          return {
            question: `A parking garage adds ${diff} more cars every level: Level 1 has ${l1}, Level 2 has ${l2}, Level 3 has ${l3}... How many cars on Level ${targetLevel}?`,
            answer: String(value),
          };
        },
        () => {
          // A "between X and Y, digits add to Z" riddle. Fixing the tens
          // digit via the range pins the ones digit exactly (sum − tens),
          // so there's always exactly one possible answer.
          const tens = randInt(1, 8);
          const ones = randInt(0, 9);
          const sum = tens + ones;
          return {
            question: `I am a number between ${tens * 10} and ${tens * 10 + 9}. My digits add up to ${sum}. What number am I?`,
            answer: String(tens * 10 + ones),
          };
        },

        // ---- Measurement ----
        () => {
          const baseTenths = randInt(20, 60);   // 2.0m – 6.0m
          const extraTenths = randInt(5, 20);   // 0.5m – 2.0m
          const totalTenths = baseTenths + extraTenths;
          const fmt = (t) => (t % 10 === 0 ? String(t / 10) : (t / 10).toFixed(1));
          const animal = pick(["koala", "possum", "kookaburra"]);
          return {
            question: `A ${animal}'s tree is ${fmt(extraTenths)}m taller than a ${fmt(baseTenths)}m gum tree. How tall is the ${animal}'s tree, in metres?`,
            answer: fmt(totalTenths),
          };
        },
        () => {
          const length = randInt(40, 120);
          const times = randInt(1, 4);
          const total = length * 2 * times;
          return {
            question: `A school oval is ${length}m long. If you run there and back ${times} time${times === 1 ? "" : "s"}, how far do you travel in total, in metres?`,
            answer: String(total),
          };
        },

        // ---- Geometry ----
        () => {
          const shapes = [
            ["triangle", 3], ["square", 4], ["pentagon", 5], ["hexagon", 6],
            ["heptagon", 7], ["octagon", 8], ["nonagon", 9], ["decagon", 10],
          ];
          const [shape, sides] = pick(shapes);
          return {
            question: `How many sides does a${/^[aeiou]/i.test(shape) ? "n" : ""} ${shape} have?`,
            answer: String(sides),
          };
        },

        // ---- Data ----
        () => {
          const categorySets = [
            ["pizza", "sushi", "pasta"],
            ["cricket", "netball", "soccer"],
            ["dogs", "cats", "birds"],
            ["red", "blue", "green"],
          ];
          const [catA, catB, catC] = pick(categorySets);
          const a = randInt(4, 15), b = randInt(4, 15), c = randInt(4, 15);
          return {
            question: `In a class vote: ${a} kids chose ${catA}, ${b} chose ${catB} and ${c} chose ${catC}. How many kids voted in total?`,
            answer: String(a + b + c),
          };
        },

        // ---- Fractions ----
        () => {
          const denomPool = [2, 3, 4, 5, 6, 8, 10];
          const d1 = pick(denomPool);
          let d2;
          do { d2 = pick(denomPool); } while (d2 === d1);
          const foodItem = pick(["pizza", "cake", "lamington tray", "block of chocolate"]);
          return {
            question: `Which is bigger: 1/${d1} of a ${foodItem} or 1/${d2} of the same ${foodItem}?`,
            answer: `1/${Math.min(d1, d2)}`,
          };
        },
        () => {
          function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
          const simpleDenom = pick([2, 3, 4, 5]);
          let simpleNumer;
          do { simpleNumer = randInt(1, simpleDenom - 1); } while (gcd(simpleNumer, simpleDenom) !== 1);
          const factor = randInt(2, 4);
          return {
            question: `Write ${simpleNumer * factor}/${simpleDenom * factor} as a simpler fraction.`,
            answer: `${simpleNumer}/${simpleDenom}`,
          };
        },

        // ---- Number & place value (bigger numbers, AC9M4N01/N06) ----
        () => {
          const n = randInt(1000, 9949);
          const rounded = Math.round(n / 100) * 100;
          return { question: `Round ${formatThousands(n)} to the nearest hundred.`, answer: formatThousands(rounded) };
        },
        () => {
          const n = randInt(1000, 8999);
          return { question: `Write the number that is 1,000 more than ${formatThousands(n)}.`, answer: formatThousands(n + 1000) };
        },
        () => {
          const base = pick([100, 250, 500]);
          const n = base * randInt(Math.ceil(1000 / base), Math.floor(9800 / base));
          return { question: `What is double ${formatThousands(n)}?`, answer: formatThousands(n * 2) };
        },
        () => {
          const nums = new Set();
          while (nums.size < 4) nums.add(randInt(1000, 9999));
          const list = [...nums];
          return {
            question: `Which of these numbers is the largest: ${list.map(formatThousands).join(", ")}?`,
            answer: formatThousands(Math.max(...list)),
          };
        },
      ];

      return { ...pick(templates)(), context: "Word problem" };
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

    // Weights below are tuned from results history: skip counting by 3s/4s and
    // basic subtraction have been recurring misses, while 2s/5s/10s and simple
    // addition are solid — so those weak spots come up more often without
    // dropping the others entirely.
    "Year 2": {
      //"Skip count by 2s, 5s, 10s": { generator: "skipCount", args: { steps: [2, 5, 10] } },
      //"Skip count by 3s, 4s": { generator: "skipCount", args: { steps: [3, 4] }, weight: 1 },
      "Backwards skip count": { generator: "skipCount", args: { steps: [2, 3, 4, 5], direction: "back" } },
      "Simple addition (with number line)": { generator: "y2AddNumberLine" },
      "Simple subtraction (with number line)": { generator: "y2SubNumberLine", weight: 2 },
      //"Friends to 10": { generator: "friendsToTen" },
      "Place value to 9,999": { generator: "placeValueTo9999" },
      "Telling the time (clock)": { generator: "clockToQuarter" }
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

    // 2× and 11× are retired everywhere below — both already solid, and
    // `avoid` on timesTables keeps them from sneaking back in via the
    // *other* factor. Most multiplication practice is word problems now
    // (see y4WordProblem) rather than bare "7 × 8" facts; the bare-fact
    // topics stay in the mix at a low weight for quick recall drills.
    "Year 4": {
      "× facts (6s, 7s, 8s, 9s)":   { generator: "timesTables", args: { tables: [6, 7, 8, 9], avoid: [2, 11] } },
      "Mixed × tables (to 10×10)":  { generator: "timesTables", args: { tables: [3, 4, 5, 6, 7, 8, 9, 10], avoid: [2, 11] } },
      "Division facts":             { generator: "divisionFacts", args: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, weight: 2 },
      "× 12s (stretch)":            { generator: "timesTables", args: { tables: [12], maxMultiplier: 12, avoid: [2, 11] } },
      // Same × / ÷ facts, wrapped as mini stories — see y4WordProblem.
      "Word problems":              { generator: "y4WordProblem", weight: 6 },
      "Telling the time (any minute)": { generator: "clockAnyMinute" },
      "24-hour time":                { generator: "convert24Hour" },
      // Same generator Y2 uses — the "value of a digit" skill just needs
      // bigger numbers at Y4, which placeValueTo9999 already produces.
      "Place value to 9,999":        { generator: "placeValueTo9999" }
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
        { question: "What is the perimeter?", answer: "20", unit: "cm", shape: { type: "rectangle", w: 6, h: 4, unit: "cm" } },
        { question: "What is the perimeter?", answer: "20", unit: "cm", shape: { type: "rectangle", w: 5, h: 5, unit: "cm" } },
        { question: "What is the perimeter?", answer: "22", unit: "m",  shape: { type: "rectangle", w: 8, h: 3, unit: "m" } },
        { question: "What is the perimeter?", answer: "34", unit: "cm", shape: { type: "rectangle", w: 10, h: 7, unit: "cm" } },
        { question: "What is the perimeter?", answer: "30", unit: "cm", shape: { type: "rectangle", w: 9, h: 6, unit: "cm" } },
        { question: "What is the perimeter?", answer: "16", unit: "m",  shape: { type: "rectangle", w: 4, h: 4, unit: "m" } },
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
