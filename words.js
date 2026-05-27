// Word lists. Edit freely — just keep the shape:
// { word: "cat", sentence: "The cat sat on the mat.", emoji: "🐈" }
// Optional fields:
//   emoji      — picture shown above the word (leave off for abstract words)
//   homophone  — set to true for words that sound like another (e.g. there/their/they're).
//                The app will automatically play the sentence after saying the word.
window.WORD_LISTS = {
  "Kindergarten": {
    "CVC words": [
      { word: "cat", sentence: "The cat sat on the mat.",        emoji: "🐈" },
      { word: "dog", sentence: "My dog likes to run.",            emoji: "🐕" },
      { word: "sun", sentence: "The sun is bright today.",        emoji: "☀️" },
      { word: "hat", sentence: "She wore a red hat.",             emoji: "🎩" },
      { word: "pig", sentence: "The pig rolled in the mud.",      emoji: "🐷" },
      { word: "bed", sentence: "I jumped on my bed.",             emoji: "🛏️" },
      { word: "big", sentence: "That is a big truck.",            emoji: "🐘" },
      { word: "top", sentence: "The book is on top.",             emoji: "⬆️" },
      { word: "mum", sentence: "My mum read me a story.",         emoji: "👩" },
      { word: "run", sentence: "We like to run fast.",            emoji: "🏃" }
    ],
    "Sight words": [
      { word: "the", sentence: "The boy ran fast." },
      { word: "is",  sentence: "The sky is blue." },
      { word: "in",  sentence: "Put it in the box." },
      { word: "it",  sentence: "I can do it." },
      { word: "on",  sentence: "Sit on the chair." },
      { word: "am",  sentence: "I am five years old." },
      { word: "me",  sentence: "Come with me." },
      { word: "we",  sentence: "We are best friends." },
      { word: "see", sentence: "I can see a bird.",               emoji: "👀" },
      { word: "can", sentence: "Can you help me?" }
    ]
  },

  "Year 1": {
    "Common words": [
      { word: "that",  sentence: "I want that one." },
      { word: "with",  sentence: "Come with me." },
      { word: "this",  sentence: "This is my book." },
      { word: "then",  sentence: "Eat dinner, then brush your teeth." },
      { word: "like",  sentence: "I like ice cream.",             emoji: "❤️" },
      { word: "look",  sentence: "Look at the rainbow.",          emoji: "👀" },
      { word: "play",  sentence: "Let's play outside.",           emoji: "🎮" },
      { word: "said",  sentence: "She said hello.",               emoji: "💬" },
      { word: "was",   sentence: "He was very tired." },
      { word: "went",  sentence: "We went to the park." }
    ],
    "Digraphs (sh, ch, th)": [
      { word: "ship",  sentence: "The ship sailed away.",         emoji: "🚢" },
      { word: "fish",  sentence: "A fish swims in the pond.",     emoji: "🐟" },
      { word: "chat",  sentence: "We had a long chat.",           emoji: "💬" },
      { word: "much",  sentence: "Thank you very much." },
      { word: "then",  sentence: "I'll see you then." },
      { word: "thin",  sentence: "The ice was very thin." },
      { word: "when",  sentence: "When can we eat?" },
      { word: "what",  sentence: "What is your name?",            emoji: "❓" }
    ]
  },

  "Year 2": {
    "Common words": [
      { word: "friend",   sentence: "My best friend came over.",     emoji: "👫" },
      { word: "school",   sentence: "We learn at school.",           emoji: "🏫" },
      { word: "water",    sentence: "I drank a glass of water.",     emoji: "💧" },
      { word: "every",    sentence: "I read every night." },
      { word: "again",    sentence: "Can we play that again?" },
      { word: "their",    sentence: "The kids found their hats.",   homophone: true },
      { word: "would",    sentence: "I would like a snack." },
      { word: "could",    sentence: "Could you pass the salt?" },
      { word: "should",   sentence: "We should be quiet here." },
      { word: "where",    sentence: "Where did you go?" },
      { word: "about",    sentence: "I read a book about dinosaurs.", emoji: "🦖" },
      { word: "around",   sentence: "We walked around the lake." },
      { word: "between",  sentence: "I sat between my two friends." },
      { word: "together", sentence: "We can do it together.",        emoji: "🤝" },
      { word: "today",    sentence: "Today is my birthday.",         emoji: "🎂" }
    ],
    "Word endings": [
      { word: "jumping",  sentence: "The kids were jumping on the trampoline.", emoji: "🤸" },
      { word: "ending",   sentence: "I love the ending of that story." },
      { word: "splash",   sentence: "The duck made a big splash.",   emoji: "💦" },
      { word: "after",    sentence: "We had cake after dinner.",     emoji: "🍰" },
      { word: "before",   sentence: "Wash your hands before lunch.", emoji: "🧼" },
      { word: "because",  sentence: "I'm happy because it's my birthday.", emoji: "🎂" },
      { word: "smiled",   sentence: "She smiled at the baby.",       emoji: "😊" },
      { word: "playing",  sentence: "The kids are playing tag.",     emoji: "🎮" },
      { word: "watched",  sentence: "We watched a movie last night.", emoji: "📺" },
      { word: "hopped",   sentence: "The bunny hopped through the garden.", emoji: "🐰" },
      { word: "clapped",  sentence: "The audience clapped loudly.",  emoji: "👏" }
    ],
    "Blends (bl, cl, fl, sm, sn, sp, st, sw, tr)": [
      { word: "black",   sentence: "The cat is black.",              emoji: "🐈‍⬛" },
      { word: "clock",   sentence: "The clock is on the wall.",      emoji: "🕐" },
      { word: "flag",    sentence: "The flag waved in the wind.",    emoji: "🚩" },
      { word: "grass",   sentence: "The grass is green.",            emoji: "🌱" },
      { word: "smile",   sentence: "Her smile is so bright.",        emoji: "😊" },
      { word: "snake",   sentence: "The snake slithered through the grass.", emoji: "🐍" },
      { word: "spider",  sentence: "A spider spun a web.",           emoji: "🕷️" },
      { word: "stop",    sentence: "We had to stop at the red light.", emoji: "🛑" },
      { word: "swim",    sentence: "Fish swim in the sea.",          emoji: "🏊" },
      { word: "truck",   sentence: "A big truck drove past.",        emoji: "🚚" }
    ],
    "Magic e (silent e)": [
      { word: "cake",    sentence: "We made a cake for her birthday.", emoji: "🍰" },
      { word: "bike",    sentence: "I ride my bike to school.",      emoji: "🚲" },
      { word: "rope",    sentence: "She jumped over the rope.",      emoji: "🪢" },
      { word: "cube",    sentence: "An ice cube melted in the sun.", emoji: "🧊" },
      { word: "time",    sentence: "What time is it?",               emoji: "⏰" },
      { word: "home",    sentence: "Let's go home.",                 emoji: "🏠" },
      { word: "name",    sentence: "What is your name?" },
      { word: "plane",   sentence: "The plane landed safely.",       emoji: "✈️" },
      { word: "whale",   sentence: "A blue whale swam by.",          emoji: "🐋" },
      { word: "bone",    sentence: "The dog buried a bone.",         emoji: "🦴" }
    ]
  },

  "Year 3": {
    "Common words": [
      { word: "people",   sentence: "Many people came to the show.",    emoji: "👥" },
      { word: "almost",   sentence: "We're almost there." },
      { word: "family",   sentence: "Our family went camping.",         emoji: "👨‍👩‍👧" },
      { word: "always",   sentence: "She always smiles.",               emoji: "😊" },
      { word: "money",    sentence: "I saved my money in a jar.",       emoji: "💰" },
      { word: "animal",   sentence: "A dog is my favourite animal.",    emoji: "🐾" },
      { word: "picture",  sentence: "I drew a picture of my house.",    emoji: "🖼️" },
      { word: "special",  sentence: "Today is a special day.",          emoji: "⭐" },
      { word: "morning",  sentence: "We eat breakfast in the morning.", emoji: "🌅" },
      { word: "another",  sentence: "Can I have another biscuit?",      emoji: "🍪" }
    ],
    "Tricky endings": [
      { word: "stopped",  sentence: "The car stopped at the lights.",   emoji: "🛑" },
      { word: "running",  sentence: "The dog is running fast.",         emoji: "🏃" },
      { word: "biggest",  sentence: "That's the biggest pumpkin I've seen.", emoji: "🎃" },
      { word: "happily",  sentence: "The kids played happily.",         emoji: "😄" },
      { word: "carries",  sentence: "He carries his bag to school.",    emoji: "🎒" },
      { word: "watches",  sentence: "She watches the birds.",           emoji: "🐦" },
      { word: "brushes",  sentence: "He brushes his teeth twice a day.", emoji: "🪥" },
      { word: "babies",   sentence: "The babies were sleeping.",        emoji: "👶" }
    ]
  },

  "Year 4": {
    "Common words": [
      { word: "through",     sentence: "We walked through the forest.",       emoji: "🌲", homophone: true },
      { word: "thought",     sentence: "I thought I heard a noise.",          emoji: "💭" },
      { word: "enough",      sentence: "We have enough food for everyone." },
      { word: "library",     sentence: "I borrowed three books from the library.", emoji: "📚" },
      { word: "decided",     sentence: "We decided to go swimming.",          emoji: "🏊" },
      { word: "suddenly",    sentence: "Suddenly, the lights went out.",      emoji: "⚡" },
      { word: "perhaps",     sentence: "Perhaps we can try again tomorrow." },
      { word: "weather",     sentence: "The weather is sunny today.",         emoji: "🌤️",  homophone: true},
      { word: "favourite",   sentence: "Chocolate is my favourite flavour.",  emoji: "🍫" },
      { word: "important",   sentence: "It's important to be kind.",          emoji: "❗" },
      { word: "answer",      sentence: "I knew the answer straight away." },
      { word: "question",    sentence: "Can I ask a question?",               emoji: "❓" },
      { word: "remember",    sentence: "I will remember to feed the cat.",    emoji: "🧠" },
      { word: "everyone",    sentence: "Everyone is invited to the party.",   emoji: "🎉" },
      { word: "interesting", sentence: "That book was very interesting.",     emoji: "📖" }
    ],
    "Often confused": [
      { word: "there",   sentence: "Put the box over there.",            homophone: true },
      { word: "their",   sentence: "The kids took their lunches.",       homophone: true },
      { word: "they're", sentence: "They're going to the beach.",        emoji: "🏖️", homophone: true },
      { word: "your",    sentence: "Is this your hat?",                  emoji: "🎩", homophone: true },
      { word: "you're",  sentence: "You're my best friend.",             homophone: true },
      { word: "its",     sentence: "The dog wagged its tail.",           emoji: "🐕", homophone: true },
      { word: "it's",    sentence: "It's a beautiful day.",              emoji: "☀️", homophone: true }
    ],
    "Homophones": [
      { word: "to",     sentence: "Please give the book to me.",         homophone: true },
      { word: "too",    sentence: "It's too hot today.",                 emoji: "🥵", homophone: true },
      { word: "two",    sentence: "I have two pet cats.",                emoji: "✌️", homophone: true },
      { word: "here",   sentence: "Come here, please.",                  emoji: "📍", homophone: true },
      { word: "hear",   sentence: "Can you hear the music?",             emoji: "👂", homophone: true },
      { word: "know",   sentence: "I know the answer.",                  homophone: true },
      { word: "no",     sentence: "There are no biscuits left.",         emoji: "❌", homophone: true },
      { word: "blue",   sentence: "The sky is blue today.",              emoji: "🔵", homophone: true },
      { word: "blew",   sentence: "The wind blew the leaves away.",      emoji: "💨", homophone: true },
      { word: "week",   sentence: "We have one more week of school.",    emoji: "📅", homophone: true }
    ],
    "Prefixes (un-, re-, dis-, pre-)": [
      { word: "unhappy",   sentence: "She felt unhappy after losing.",    emoji: "😢" },
      { word: "unkind",    sentence: "It is unkind to say mean things." },
      { word: "redo",      sentence: "I had to redo my homework.",        emoji: "↩️" },
      { word: "replay",    sentence: "Let's replay the last level.",      emoji: "🔁" },
      { word: "return",    sentence: "I will return the book to the library.", emoji: "📚" },
      { word: "dislike",   sentence: "I dislike olives.",                 emoji: "👎" },
      { word: "disagree",  sentence: "We sometimes disagree about TV shows." },
      { word: "preview",   sentence: "We watched a preview of the movie.", emoji: "👁️" },
      { word: "prepare",   sentence: "Help me prepare dinner.",           emoji: "👨‍🍳" },
      { word: "mistake",   sentence: "Everyone makes a mistake sometimes.", emoji: "❌" }
    ],
    "Suffixes (-tion, -ness, -ful, -less, -ment)": [
      { word: "action",     sentence: "The action in the movie was exciting." },
      { word: "station",    sentence: "We waited at the train station.",  emoji: "🚉" },
      { word: "attention",  sentence: "Please pay attention in class." },
      { word: "kindness",   sentence: "Show kindness to your friends.",   emoji: "💗" },
      { word: "happiness",  sentence: "Puppies bring me happiness.",      emoji: "😄" },
      { word: "helpful",    sentence: "Be helpful around the house.",     emoji: "🤝" },
      { word: "careful",    sentence: "Please be careful crossing the road." },
      { word: "careless",   sentence: "Don't be careless with your toys." },
      { word: "excitement", sentence: "The excitement before the trip was huge.", emoji: "🎉" },
      { word: "movement",   sentence: "I saw a small movement in the bushes." }
    ],
    "Silent letters": [
      { word: "knight",  sentence: "The brave knight rode a horse.",    emoji: "🛡️", homophone: true },
      { word: "knee",    sentence: "I scraped my knee on the path.",    emoji: "🦵" },
      { word: "knot",    sentence: "Can you tie a knot in this rope?",  homophone: true },
      { word: "write",   sentence: "I will write a letter to grandma.", emoji: "✍️", homophone: true },
      { word: "thumb",   sentence: "Be careful not to hit your thumb.", emoji: "👍" },
      { word: "climb",   sentence: "We can climb the tree in the park.", emoji: "🧗" },
      { word: "lamb",    sentence: "The lamb followed its mother.",     emoji: "🐑" },
      { word: "listen",  sentence: "Please listen carefully.",          emoji: "👂" }
    ]
  },

  "Year 5": {
    "Longer words": [
      { word: "different",  sentence: "Every snowflake is different.",  emoji: "❄️" },
      { word: "beautiful",  sentence: "That is a beautiful painting.",  emoji: "🌸" },
      { word: "knowledge",  sentence: "Reading builds your knowledge.", emoji: "📖" },
      { word: "neighbour",  sentence: "Our neighbour has a friendly dog.", emoji: "🏘️" },
      { word: "probably",   sentence: "It will probably rain tomorrow.", emoji: "🌧️" },
      { word: "vacation",   sentence: "Our vacation was so much fun.",   emoji: "🏖️" },
      { word: "adventure",  sentence: "Camping is a great adventure.",   emoji: "🗺️" },
      { word: "separate",   sentence: "Please separate the laundry by colour.", emoji: "🧺" },
      { word: "tomorrow",   sentence: "We can finish it tomorrow.",      emoji: "📅" },
      { word: "available",  sentence: "Tickets are still available.",    emoji: "🎟️" }
    ],
    "Often misspelled": [
      { word: "received",   sentence: "I received a letter in the mail.", emoji: "✉️" },
      { word: "believe",    sentence: "I believe you can do it." },
      { word: "weird",      sentence: "That sound was really weird.",    emoji: "👻" },
      { word: "necessary",  sentence: "A pencil is necessary for class.", emoji: "✏️" },
      { word: "definitely", sentence: "I will definitely come to your party.", emoji: "🎉" },
      { word: "embarrass",  sentence: "Don't embarrass me in front of my friends.", emoji: "😳" }
    ]
  },

  "Year 6": {
    "Advanced words": [
      { word: "rhythm",        sentence: "The drummer kept a steady rhythm.", emoji: "🥁" },
      { word: "conscience",    sentence: "Her conscience told her to apologise." },
      { word: "accommodate",   sentence: "The hotel can accommodate fifty guests.", emoji: "🏨" },
      { word: "government",    sentence: "The government made a new law.",    emoji: "🏛️" },
      { word: "occurrence",    sentence: "Snow is a rare occurrence here.",   emoji: "❄️" },
      { word: "privilege",     sentence: "It's a privilege to meet you." },
      { word: "recommend",     sentence: "I recommend the chocolate cake.",   emoji: "👍" },
      { word: "restaurant",    sentence: "We ate at a new restaurant.",       emoji: "🍽️" },
      { word: "mischievous",   sentence: "The mischievous puppy chewed my shoe.", emoji: "😈" },
      { word: "conscientious", sentence: "She is a conscientious student.",   emoji: "🎓" }
    ],
    "Tricky spellings": [
      { word: "queue",         sentence: "We waited in a long queue.",        emoji: "🚶‍♂️🚶‍♀️", homophone: true },
      { word: "vacuum",        sentence: "I need to vacuum the carpet.",      emoji: "🧹" },
      { word: "rhyme",         sentence: "Can you think of a word that rhymes with cat?", emoji: "🎵" },
      { word: "lieutenant",    sentence: "The lieutenant gave the order.",    emoji: "🎖️" },
      { word: "ancient",       sentence: "We studied ancient Egypt at school.", emoji: "🏛️" },
      { word: "guarantee",     sentence: "I guarantee you'll love this book.", emoji: "📕" },
      { word: "exaggerate",    sentence: "Don't exaggerate — it wasn't that bad." },
      { word: "parliament",    sentence: "The new law passed through parliament.", emoji: "🏛️" }
    ]
  }
};
