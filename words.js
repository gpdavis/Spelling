// Word lists. Edit freely — just keep the shape:
// { word: "cat", sentence: "The cat sat on the mat.", emoji: "🐈" }
// The "emoji" field is optional — leave it off for abstract words.
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
      { word: "friend",   sentence: "My best friend came over.",  emoji: "👫" },
      { word: "school",   sentence: "We learn at school.",        emoji: "🏫" },
      { word: "water",    sentence: "I drank a glass of water.",  emoji: "💧" },
      { word: "every",    sentence: "I read every night." },
      { word: "again",    sentence: "Can we play that again?" },
      { word: "their",    sentence: "The kids found their hats." },
      { word: "would",    sentence: "I would like a snack." },
      { word: "could",    sentence: "Could you pass the salt?" },
      { word: "should",   sentence: "We should be quiet here." },
      { word: "where",    sentence: "Where did you go?" }
    ],
    "Word endings": [
      { word: "jumping",  sentence: "The kids were jumping on the trampoline.", emoji: "🤸" },
      { word: "ending",   sentence: "I love the ending of that story." },
      { word: "splash",   sentence: "The duck made a big splash.",              emoji: "💦" },
      { word: "after",    sentence: "We had cake after dinner.",                emoji: "🍰" },
      { word: "before",   sentence: "Wash your hands before lunch.",            emoji: "🧼" },
      { word: "because",  sentence: "I'm happy because it's my birthday.",      emoji: "🎂" }
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
      { word: "through",   sentence: "We walked through the forest.",   emoji: "🌲" },
      { word: "thought",   sentence: "I thought I heard a noise.",      emoji: "💭" },
      { word: "enough",    sentence: "We have enough food for everyone." },
      { word: "library",   sentence: "I borrowed three books from the library.", emoji: "📚" },
      { word: "decided",   sentence: "We decided to go swimming.",      emoji: "🏊" },
      { word: "suddenly",  sentence: "Suddenly, the lights went out.",  emoji: "⚡" },
      { word: "perhaps",   sentence: "Perhaps we can try again tomorrow." },
      { word: "weather",   sentence: "The weather is sunny today.",     emoji: "🌤️" },
      { word: "favourite", sentence: "Chocolate is my favourite flavour.", emoji: "🍫" },
      { word: "important", sentence: "It's important to be kind.",      emoji: "❗" }
    ],
    "Often confused": [
      { word: "there",   sentence: "Put the box over there." },
      { word: "their",   sentence: "The kids took their lunches." },
      { word: "they're", sentence: "They're going to the beach.",       emoji: "🏖️" },
      { word: "your",    sentence: "Is this your hat?",                 emoji: "🎩" },
      { word: "you're",  sentence: "You're my best friend." },
      { word: "its",     sentence: "The dog wagged its tail.",          emoji: "🐕" },
      { word: "it's",    sentence: "It's a beautiful day.",             emoji: "☀️" }
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
      { word: "queue",         sentence: "We waited in a long queue.",        emoji: "🚶‍♂️🚶‍♀️" },
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
