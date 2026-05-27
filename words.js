// Word lists. Edit freely — just keep the shape:
// { word: "cat", sentence: "The cat sat on the mat.", emoji: "🐈" }
// Optional fields:
//   emoji      — picture shown above the word (leave off for abstract words)
//   homophone  — set to true for words that sound like another (e.g. there/their/they're).
//                The app will automatically play the sentence after saying the word.
//
// Levels and patterns follow the Australian Curriculum v9 (ACARA), NSW NESA
// English K–10 (2022) and Sound Waves scope and sequence. Australian English
// spellings are used throughout (colour, centre, mum, organise, travelled).
window.WORD_LISTS = {
  "Kindergarten": {
    "CVC words": [
      { word: "cat", sentence: "The cat sat on the mat.",        emoji: "🐈" },
      { word: "mum", sentence: "My mum read me a story.",        emoji: "👩" },
      { word: "dad", sentence: "Dad made my lunch.",             emoji: "👨" },
      { word: "dog", sentence: "My dog likes to run.",           emoji: "🐕" },
      { word: "sun", sentence: "The sun is bright today.",       emoji: "☀️" },
      { word: "hat", sentence: "She wore a red hat.",            emoji: "🎩" },
      { word: "pig", sentence: "The pig rolled in the mud.",     emoji: "🐷" },
      { word: "bed", sentence: "I jumped on my bed.",            emoji: "🛏️" },
      { word: "run", sentence: "We like to run fast.",           emoji: "🏃" },
      { word: "top", sentence: "The book is on top.",            emoji: "⬆️" },
      { word: "big", sentence: "That is a big truck.",           emoji: "🐘" },
      { word: "log", sentence: "A frog sat on a log.",           emoji: "🪵" },
      { word: "hop", sentence: "Watch the bunny hop.",           emoji: "🐰" },
      { word: "net", sentence: "We caught a fish in a net." }
    ],
    "Sight words": [
      { word: "the",  sentence: "The boy ran fast." },
      { word: "is",   sentence: "The sky is blue." },
      { word: "in",   sentence: "Put it in the box." },
      { word: "it",   sentence: "I can do it." },
      { word: "on",   sentence: "Sit on the chair." },
      { word: "am",   sentence: "I am five years old." },
      { word: "me",   sentence: "Come with me." },
      { word: "we",   sentence: "We are best friends." },
      { word: "see",  sentence: "I can see a bird.",             emoji: "👀" },
      { word: "can",  sentence: "Can you help me?" },
      { word: "and",  sentence: "I like cats and dogs." },
      { word: "to",   sentence: "Let's go to the park." },
      { word: "said", sentence: "She said hello.",               emoji: "💬" },
      { word: "you",  sentence: "You are my best friend." }
    ],
    "Common nouns": [
      { word: "bus", sentence: "The bus is yellow.",             emoji: "🚌" },
      { word: "fox", sentence: "The fox has a bushy tail.",      emoji: "🦊" },
      { word: "cup", sentence: "I drank from my cup.",           emoji: "☕" },
      { word: "hen", sentence: "The hen laid an egg.",           emoji: "🐔" },
      { word: "bag", sentence: "Put it in your bag.",            emoji: "🎒" },
      { word: "jam", sentence: "I like jam on toast.",           emoji: "🍓" },
      { word: "web", sentence: "A spider made a web.",           emoji: "🕸️" },
      { word: "fan", sentence: "The fan keeps me cool.",         emoji: "🌀" },
      { word: "lip", sentence: "I bit my lip." },
      { word: "mud", sentence: "The pig played in the mud." }
    ]
  },

  "Year 1": {
    "Digraphs (sh, ch, th, ng, ck)": [
      { word: "ship", sentence: "The ship sailed away.",         emoji: "🚢" },
      { word: "fish", sentence: "A fish swims in the pond.",     emoji: "🐟" },
      { word: "chop", sentence: "I helped chop the carrots.",    emoji: "🥕" },
      { word: "much", sentence: "Thank you very much." },
      { word: "then", sentence: "I'll see you then." },
      { word: "thin", sentence: "The ice was very thin." },
      { word: "when", sentence: "When can we eat?" },
      { word: "what", sentence: "What is your name?",            emoji: "❓" },
      { word: "sing", sentence: "Birds sing in the morning.",    emoji: "🎵" },
      { word: "ring", sentence: "She wore a gold ring.",         emoji: "💍" },
      { word: "duck", sentence: "The duck splashed in the pond.", emoji: "🦆" },
      { word: "sock", sentence: "I lost one sock.",              emoji: "🧦" }
    ],
    "Magic-e words": [
      { word: "make", sentence: "Let's make a sandcastle.",      emoji: "🏖️" },
      { word: "ride", sentence: "I love to ride my bike.",       emoji: "🚲" },
      { word: "home", sentence: "We went home for dinner.",      emoji: "🏠" },
      { word: "cute", sentence: "The puppy is so cute.",         emoji: "🐶" },
      { word: "bake", sentence: "We will bake a cake.",          emoji: "🎂" },
      { word: "kite", sentence: "Fly your kite in the wind.",    emoji: "🪁" },
      { word: "bone", sentence: "The dog buried his bone.",      emoji: "🦴" },
      { word: "tube", sentence: "Toothpaste comes in a tube." },
      { word: "late", sentence: "Don't be late for school." },
      { word: "time", sentence: "What time is it?",              emoji: "⏰" },
      { word: "hope", sentence: "I hope it doesn't rain." },
      { word: "mule", sentence: "The mule carried the load.",    emoji: "🫏" }
    ],
    "Consonant blends": [
      { word: "stop", sentence: "Stop at the red light.",        emoji: "🛑" },
      { word: "plan", sentence: "We made a plan together." },
      { word: "jump", sentence: "Frogs love to jump.",           emoji: "🐸" },
      { word: "hand", sentence: "Hold my hand.",                 emoji: "✋" },
      { word: "sand", sentence: "We built castles in the sand.", emoji: "🏖️" },
      { word: "frog", sentence: "A green frog hopped past.",     emoji: "🐸" },
      { word: "drum", sentence: "He played the drum loudly.",    emoji: "🥁" },
      { word: "swim", sentence: "Fish swim in the sea.",         emoji: "🏊" },
      { word: "milk", sentence: "I drink milk every day.",       emoji: "🥛" },
      { word: "lamp", sentence: "Turn on the lamp, please.",     emoji: "💡" },
      { word: "nest", sentence: "Birds built a nest in the tree.", emoji: "🪺" },
      { word: "flag", sentence: "The flag flew high.",           emoji: "🚩" }
    ]
  },

  "Year 2": {
    "Vowel teams (long vowels)": [
      { word: "rain",  sentence: "The rain made puddles.",       emoji: "🌧️" },
      { word: "train", sentence: "We took the train to the city.", emoji: "🚂" },
      { word: "boat",  sentence: "Our boat sailed on the lake.", emoji: "⛵" },
      { word: "road",  sentence: "The road was long and straight.", emoji: "🛣️" },
      { word: "light", sentence: "Turn off the light, please.",  emoji: "💡" },
      { word: "way",   sentence: "Show me the way home." },
      { word: "play",  sentence: "We can play in the garden.",   emoji: "🎮" },
      { word: "slow",  sentence: "Walk slow on the ice.",        emoji: "🐢" },
      { word: "snow",  sentence: "Snow covered the hills.",      emoji: "❄️" },
      { word: "sleep", sentence: "I need a good sleep.",         emoji: "😴" },
      { word: "tree",  sentence: "The bird sat in a tree.",      emoji: "🌳" },
      { word: "moon",  sentence: "The moon is full tonight.",    emoji: "🌕" }
    ],
    "R-controlled & diphthongs": [
      { word: "park",  sentence: "We rode bikes in the park.",   emoji: "🏞️" },
      { word: "fork",  sentence: "Use a fork to eat.",           emoji: "🍴" },
      { word: "bird",  sentence: "A bird flew past my window.",  emoji: "🐦" },
      { word: "girl",  sentence: "The girl waved hello.",        emoji: "👧" },
      { word: "chair", sentence: "Sit on the chair.",            emoji: "🪑" },
      { word: "near",  sentence: "The shop is near the school." },
      { word: "boy",   sentence: "The boy kicked the ball.",     emoji: "👦" },
      { word: "soil",  sentence: "Plants grow in the soil.",     emoji: "🌱" },
      { word: "cloud", sentence: "A grey cloud crossed the sky.", emoji: "☁️" },
      { word: "down",  sentence: "Climb down the ladder.",       emoji: "⬇️" },
      { word: "brown", sentence: "She has brown hair.",          emoji: "🟫" },
      { word: "joy",   sentence: "Her face was full of joy.",    emoji: "😊" }
    ],
    "Silent letters & tricky patterns": [
      { word: "knee",    sentence: "I scraped my knee on the path." },
      { word: "write",   sentence: "Write your name at the top.", emoji: "✍️" },
      { word: "lamb",    sentence: "A baby sheep is called a lamb.", emoji: "🐑" },
      { word: "match",   sentence: "These shoes are a match.",   emoji: "👟" },
      { word: "bridge",  sentence: "We crossed the bridge.",     emoji: "🌉" },
      { word: "hopping", sentence: "The bunny was hopping along.", emoji: "🐰" },
      { word: "baking",  sentence: "Grandma is baking biscuits.", emoji: "🍪" },
      { word: "crying",  sentence: "The baby was crying loudly.", emoji: "😢" },
      { word: "city",    sentence: "We visited the big city.",   emoji: "🏙️" },
      { word: "cage",    sentence: "The parrot is in its cage.", emoji: "🦜" },
      { word: "race",    sentence: "I won the running race.",    emoji: "🏃" },
      { word: "fence",   sentence: "The dog jumped the fence." }
    ]
  },

  "Year 3": {
    "Prefixes & suffixes": [
      { word: "unkind",    sentence: "It's unkind to tease others." },
      { word: "replay",    sentence: "Let's replay the goal.",   emoji: "🔁" },
      { word: "disagree",  sentence: "I disagree with that idea." },
      { word: "mistake",   sentence: "Everyone makes a mistake sometimes." },
      { word: "careful",   sentence: "Be careful crossing the road." },
      { word: "hopeless",  sentence: "The wet match was hopeless." },
      { word: "slowly",    sentence: "Walk slowly down the hill.", emoji: "🐢" },
      { word: "kindness",  sentence: "Her kindness made me smile.", emoji: "💖" },
      { word: "payment",   sentence: "We sent the payment yesterday.", emoji: "💰" },
      { word: "taller",    sentence: "My brother is taller than me." },
      { word: "smallest",  sentence: "I picked the smallest apple.", emoji: "🍎" },
      { word: "happiest",  sentence: "This is the happiest day.", emoji: "😄" }
    ],
    "Common words": [
      { word: "because", sentence: "I'm sleepy because it's late." },
      { word: "friend",  sentence: "She is my best friend.",     emoji: "👫" },
      { word: "before",  sentence: "Brush your teeth before bed." },
      { word: "again",   sentence: "Let's try again." },
      { word: "journey", sentence: "Our journey took two days." },
      { word: "hurry",   sentence: "Hurry or we'll miss the bus.", emoji: "🏃" },
      { word: "board",   sentence: "Write it on the board." },
      { word: "cheer",   sentence: "We cheer for our team.",     emoji: "📣" },
      { word: "around",  sentence: "We walked around the lake." },
      { word: "every",   sentence: "Every kid got a turn." },
      { word: "family",  sentence: "My family went to the beach.", emoji: "👨‍👩‍👧‍👦" },
      { word: "people",  sentence: "Lots of people came to the show.", emoji: "👥" }
    ],
    "Homophones": [
      { word: "their",   sentence: "Their car is blue.",                                homophone: true },
      { word: "there",   sentence: "Put it over there.",                                homophone: true },
      { word: "they're", sentence: "They're coming to my party.",                       homophone: true },
      { word: "hear",    sentence: "Did you hear that noise?",            emoji: "👂",  homophone: true },
      { word: "here",    sentence: "Come over here, please.",                           homophone: true },
      { word: "bear",    sentence: "A brown bear lives in the cave.",     emoji: "🐻",  homophone: true },
      { word: "bare",    sentence: "His feet were bare on the sand.",     emoji: "🦶",  homophone: true },
      { word: "pair",    sentence: "I bought a new pair of shoes.",       emoji: "👟",  homophone: true },
      { word: "pear",    sentence: "She ate a juicy green pear.",         emoji: "🍐",  homophone: true },
      { word: "knight",  sentence: "The knight rode a strong horse.",     emoji: "🐴",  homophone: true },
      { word: "night",   sentence: "Stars shine in the night sky.",       emoji: "🌙",  homophone: true },
      { word: "won",     sentence: "Our team won the game.",              emoji: "🏆",  homophone: true }
    ]
  },

  "Year 4": {
    "Plural rules": [
      { word: "babies",   sentence: "The babies are asleep.",       emoji: "👶" },
      { word: "leaves",   sentence: "Leaves fall in autumn.",       emoji: "🍂" },
      { word: "knives",   sentence: "Be careful with sharp knives.", emoji: "🔪" },
      { word: "foxes",    sentence: "Two foxes ran across the road.", emoji: "🦊" },
      { word: "dishes",   sentence: "I helped wash the dishes.",    emoji: "🍽️" },
      { word: "churches", sentence: "Old churches have tall towers.", emoji: "⛪" },
      { word: "ladies",   sentence: "The ladies sat in the garden." },
      { word: "parties",  sentence: "Birthday parties are fun.",    emoji: "🎉" },
      { word: "stories",  sentence: "Grandpa tells the best stories.", emoji: "📖" },
      { word: "halves",   sentence: "Cut the apple into halves.",   emoji: "🍎" },
      { word: "wolves",   sentence: "Wolves howl at the moon.",     emoji: "🐺" },
      { word: "shelves",  sentence: "Books fill the shelves.",      emoji: "📚" }
    ],
    "Australian spellings": [
      { word: "centre",     sentence: "Meet me at the shopping centre." },
      { word: "colour",     sentence: "Pick your favourite colour.",    emoji: "🎨" },
      { word: "favour",     sentence: "Could you do me a favour?" },
      { word: "harbour",    sentence: "Boats rest in the harbour.",     emoji: "⛵" },
      { word: "neighbour",  sentence: "My neighbour has a cat.",        emoji: "🏘️" },
      { word: "theatre",    sentence: "We saw a play at the theatre.",  emoji: "🎭" },
      { word: "metre",      sentence: "The rope is one metre long." },
      { word: "behaviour",  sentence: "Good behaviour is rewarded." },
      { word: "honour",     sentence: "It's an honour to meet you." },
      { word: "labour",     sentence: "Building the wall was hard labour." },
      { word: "humour",     sentence: "She has a great sense of humour.", emoji: "😄" },
      { word: "flavour",    sentence: "Strawberry is my favourite flavour.", emoji: "🍓" }
    ],
    "Word endings (-tion, -ous, soft c/g)": [
      { word: "attention", sentence: "Pay attention in class." },
      { word: "station",   sentence: "We waited at the station.",   emoji: "🚉" },
      { word: "action",    sentence: "Quick action saved the day." },
      { word: "division",  sentence: "We learned division in maths.", emoji: "➗" },
      { word: "decision",  sentence: "It was a tough decision." },
      { word: "famous",    sentence: "She is a famous singer.",     emoji: "🎤" },
      { word: "nervous",   sentence: "I felt nervous before the test.", emoji: "😰" },
      { word: "jealous",   sentence: "Don't be jealous of others." },
      { word: "gentle",    sentence: "Be gentle with the kitten.",  emoji: "🐱" },
      { word: "giant",     sentence: "The giant lived on a mountain.", emoji: "👹" },
      { word: "magic",     sentence: "The magic show was amazing.", emoji: "✨" },
      { word: "village",   sentence: "A tiny village in the hills.", emoji: "🏘️" }
    ]
  },

  "Year 5": {
    "Greek & Latin roots": [
      { word: "telephone",   sentence: "Answer the telephone, please.", emoji: "📞" },
      { word: "photograph",  sentence: "Take a photograph of the sunset.", emoji: "📷" },
      { word: "autograph",   sentence: "I got the player's autograph.", emoji: "✍️" },
      { word: "transport",   sentence: "Buses are a kind of transport.", emoji: "🚌" },
      { word: "biology",     sentence: "We studied frogs in biology.", emoji: "🐸" },
      { word: "microscope",  sentence: "Use the microscope to see tiny things.", emoji: "🔬" },
      { word: "telescope",   sentence: "Through the telescope we saw Mars.", emoji: "🔭" },
      { word: "geography",   sentence: "Geography is about countries and maps.", emoji: "🗺️" },
      { word: "paragraph",   sentence: "Start a new paragraph here." },
      { word: "dictionary",  sentence: "Look it up in the dictionary.", emoji: "📖" },
      { word: "aquarium",    sentence: "We visited the aquarium.",  emoji: "🐠" },
      { word: "popular",     sentence: "That song is very popular.", emoji: "🎵" }
    ],
    "Tricky letter patterns": [
      { word: "although",  sentence: "I went out, although it was raining." },
      { word: "enough",    sentence: "Have you had enough to eat?" },
      { word: "taught",    sentence: "My nan taught me to knit.",   emoji: "🧶" },
      { word: "character", sentence: "Each book has a hero character." },
      { word: "technique", sentence: "She uses a clever technique." },
      { word: "machine",   sentence: "The washing machine is broken.", emoji: "🧺" },
      { word: "chemist",   sentence: "Pick up the medicine from the chemist.", emoji: "💊" },
      { word: "chorus",    sentence: "Sing along to the chorus.",   emoji: "🎶" },
      { word: "plough",    sentence: "The farmer used a plough.",   emoji: "🚜" },
      { word: "daughter",  sentence: "His daughter plays football.", emoji: "⚽" },
      { word: "though",    sentence: "It looked easy, though it wasn't." },
      { word: "thought",   sentence: "I thought you were home." }
    ],
    "Suffix patterns (-able, -ible, -ous)": [
      { word: "valuable",     sentence: "This necklace is very valuable.", emoji: "💎" },
      { word: "sensible",     sentence: "Wear sensible shoes for hiking.", emoji: "🥾" },
      { word: "dangerous",    sentence: "Crossing without looking is dangerous.", emoji: "⚠️" },
      { word: "courageous",   sentence: "It was a courageous rescue." },
      { word: "government",   sentence: "The government made a new law.", emoji: "🏛️" },
      { word: "friendship",   sentence: "Our friendship is strong.", emoji: "🤝" },
      { word: "neighbourhood",sentence: "Kids play in our neighbourhood.", emoji: "🏘️" },
      { word: "freedom",      sentence: "Birds enjoy freedom in the sky.", emoji: "🕊️" },
      { word: "scientist",    sentence: "A scientist studies nature.", emoji: "🔬" },
      { word: "electrician",  sentence: "The electrician fixed the wires.", emoji: "💡" },
      { word: "musician",     sentence: "A musician practises every day.", emoji: "🎵" },
      { word: "magician",     sentence: "The magician pulled a rabbit from a hat.", emoji: "🎩" }
    ]
  },

  "Year 6": {
    "Greek & Latin roots": [
      { word: "audible",        sentence: "Her whisper was barely audible.", emoji: "👂" },
      { word: "visible",        sentence: "Stars become visible at night.", emoji: "⭐" },
      { word: "describe",       sentence: "Describe what you saw at the show." },
      { word: "structure",      sentence: "The bridge has a strong structure.", emoji: "🌉" },
      { word: "spectator",      sentence: "Each spectator cheered loudly." },
      { word: "hydration",      sentence: "Drink water for good hydration.", emoji: "💧" },
      { word: "thermometer",    sentence: "Check the thermometer for the temperature.", emoji: "🌡️" },
      { word: "chronological",  sentence: "Put the events in chronological order.", emoji: "⏳" },
      { word: "autobiography",  sentence: "She wrote her autobiography.", emoji: "📖" },
      { word: "biography",      sentence: "A biography tells a person's life story." },
      { word: "democracy",      sentence: "Australia is a democracy.",  emoji: "🗳️" },
      { word: "philosophy",     sentence: "Philosophy asks big questions." }
    ],
    "Word endings (-ance, -ence, -cian)": [
      { word: "possession",  sentence: "She kept her grandma's possession safe." },
      { word: "ambulance",   sentence: "The ambulance arrived quickly.", emoji: "🚑" },
      { word: "audience",    sentence: "The audience clapped loudly.", emoji: "👏" },
      { word: "important",   sentence: "It's important to be honest." },
      { word: "different",   sentence: "Everyone is different and special." },
      { word: "independent", sentence: "She is independent and brave." },
      { word: "confidence",  sentence: "He spoke with great confidence." },
      { word: "intelligence",sentence: "Dolphins show high intelligence.", emoji: "🐬" },
      { word: "experience",  sentence: "Camping was a new experience.", emoji: "⛺" },
      { word: "patience",    sentence: "Fishing takes patience.",      emoji: "🎣" },
      { word: "existence",   sentence: "We are grateful for our existence." },
      { word: "difference",  sentence: "Spot the difference in the picture." }
    ],
    "Australian spellings": [
      { word: "organise",   sentence: "Let's organise our notes." },
      { word: "recognise",  sentence: "Do you recognise this song?", emoji: "🎵" },
      { word: "realise",    sentence: "I didn't realise it was so late." },
      { word: "criticise",  sentence: "Try not to criticise without thinking." },
      { word: "travelled",  sentence: "We travelled across Australia.", emoji: "🚗" },
      { word: "cancelled",  sentence: "The picnic was cancelled due to rain." },
      { word: "modelled",   sentence: "She modelled the new uniform." },
      { word: "jewellery",  sentence: "Mum keeps her jewellery in a box.", emoji: "💍" },
      { word: "programme",  sentence: "Watch your favourite TV programme.", emoji: "📺" },
      { word: "manoeuvre",  sentence: "The pilot did a tricky manoeuvre.", emoji: "✈️" },
      { word: "favourite",  sentence: "Blue is my favourite colour." },
      { word: "believe",    sentence: "I believe in you." }
    ]
  }
};
