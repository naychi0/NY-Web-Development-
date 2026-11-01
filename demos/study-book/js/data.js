/* Study Book content. **word** = underlined in exercises. */
window.BOOK = {
  parts: [
    { id: "A", name: "Part A – Vocabulary" },
    { id: "B", name: "Part B – Grammar" },
    { id: "C", name: "Part C – Past Exam Papers" }
  ],
  sections: [
    { n: 1, part: "A", title: "Common Abbreviations",
      lead: "Twenty-one abbreviations you are expected to know. Use the flashcards to test yourself.",
      blocks: [{ type: "abbr", items: [
        ["A.D.", "in the year of our Lord; after the birth of Christ"], ["a.m.", "before noon"], ["Ave", "avenue"], ["B.C.", "before Christ"],
        ["cf.", "compare"], ["e.g.", "for example"], ["etc.", "and other things; and so on"], ["G.M.T", "Greenwich Mean Time"],
        ["G.P", "general practitioner"], ["G.P.O", "General Post Office"], ["i.e.", "that is"], ["I.Q", "Intelligence Quotient"],
        ["M.C", "Master of Ceremonies"], ["misc.", "miscellaneous"], ["p.m.", "after noon"], ["P.O.W.", "Prisoner of War"],
        ["R.I.P", "May she (he/they) be at rest"], ["R.S.V.P", "Please reply"], ["P.T.O", "Please turn over"], ["v.p.p", "Value Payable Post"], ["P.S.", "postscript"]
      ] }] },
    { n: 2, part: "A", title: "Dictionary Work: Vocabulary",
      lead: "Learn the verbs below, then rewrite the sentences with the correct form of each word.",
      blocks: [
        { type: "cols", cols: [{ h: "Talking verbs", items: ["exclaim", "mutter", "shout", "explain", "plead"] }, { h: "Walking verbs", items: ["march", "limp", "prowl", "plod", "toddle"] }] }
      ],
      exercise: { title: "Exercise 2", instruction: "Rewrite the sentences with the correct form of the words above (exclaim, explain, mutter, plead, prowl, shout, march, limp, toddle, plod).",
        items: ["Cassie found it necessary to ________ her blackened eye.", "He came running inside, ________ about being chased by a bear.", "The police ________ a gang of youths out of the building.", "She looked in the mirror, ________ in dismay at her appearance.", "\"I knew he was a troublemaker,\" Rebecca ________.", "My nephew is still in the crawling or perhaps ________ stage."] } },
    { n: 3, part: "A", title: "Similes",
      lead: "Each simile is followed by clue words that show when it is used.",
      blocks: [{ type: "defs", items: [
        ["as agile as a cat / monkey", "moving quickly/fast, ballet, alert/active, climb/jump, acrobats, gymnast"],
        ["as alike as two peas", "twin, the two of …, the same"],
        ["as bashful as a schoolgirl", "(shy) sprinter, introduce, tease, praise for her beauty, compliment"],
        ["as beautiful as the sunset / rainbow", "(beautiful) view, painting, wedding gown, picture, parlour, bouquet, decorate"],
        ["as blind as a bat / ignorance", "unable to (could not) see because of age, glasses/spectacles/contact lenses, parents' love, fault"],
        ["as clean as a new pin / a Dutch oven", "(clean) housewife keeps the room clean, sweep, neat and tidy, cleaned kitchen"],
        ["as clear as crystal / daylight", "water, stream, waterfall, the easy problem/sum/instruction"],
        ["as deaf as a beetle", "unable to (could not) hear because of age, little knowledge, news/surrounding/environment, stubborn"],
        ["as docile as a lamb", "obey, timid, gentle, pretend, rude/aggressive but …, give up drinking/smoking"],
        ["as dull as ditchwater / lead", "(boring) talk, speak, story, discuss, lecture, meeting, monotone, conference; not interesting, sleepy"],
        ["as eager as a bridegroom", "ambitious, bought a new (…), to do everything, to show their abilities, to know the winner/result"],
        ["as fidgety as an old maid", "exam, test, interview (nervous, excited, afraid)"],
        ["as fit as a fiddle", "(healthy) old-aged but healthy, health/medical care, fit, exercise"],
        ["as flat as a pancake", "plain field, smooth land, no hills or mountains, no slope"]
      ] }],
      exercise: { title: "Exercise 3", instruction: "Fill the blanks with suitable similes.",
        items: ["I want the language in these legal contracts to be as … as … so that there is no confusion.", "I expected Danny's student apartment to be a total mess, but it was as … as ….", "These flowers will make a goldsmith cry because they are as … as ….", "The gymnast was as … as …, performing acrobatic stunts on the balance beam.", "The exam is approaching. Zaw Zaw is now as … as …."] } },
    { n: 4, part: "A", title: "Idiomatic Expressions",
      lead: "Twenty-five common idioms and their meanings.",
      blocks: [{ type: "defs", items: [
        ["to call up", "to telephone"], ["tired out", "extremely tired"], ["to take one's time", "to work or go leisurely, not to hurry"], ["to talk over", "to discuss, consider"], ["to call off", "to cancel"],
        ["to count on", "to depend upon/on"], ["once in a while", "occasionally"], ["to be out of the question", "to be impossible"], ["to get through", "to finish"], ["to take something for granted", "to accept as true without investigation"],
        ["to take advantage of", "to use an opportunity; also to impose upon or to profit at the expense of another person"], ["to run out of", "to exhaust the supply of"], ["to make the best of", "to accept a bad situation cheerfully and do the best that one can"],
        ["to keep up with", "to maintain the speed; to be the same"], ["to go around", "to be sufficient for everyone"], ["to show off", "to display to excess one's ability or possessions"], ["to bring up", "to rear, raise from childhood"],
        ["to hold good", "to remain valid, continue to be good"], ["to take by surprise", "to surprise"], ["to take a chance", "to have the possibility"], ["to serve one right", "to receive one's just punishment"],
        ["to meet half-way", "to compromise"], ["to stick to", "to adhere, to preserve, be constant"], ["to beat about the bush", "to be indirect in approaching something"], ["to waste one's breath", "to lose time talking in an effort to convince someone of nothing"]
      ] }],
      exercise: { title: "Exercise 4", instruction: "Rewrite, substituting each underlined word with a suitable idiomatic expression.",
        items: ["I **telephoned** the office yesterday to ask about my application status.", "The success of the project will **depend on** how well the team communicates.", "The meeting was **cancelled** because several participants were unable to attend.", "The company **adhered** to the safety regulations during the construction process.", "Visitors **have the possibility** of booking tickets online in advance.", "She felt **extremely tired** after working late for several nights in a row."] } },
    { n: 5, part: "B", title: "Would Rather",
      lead: "Use would rather to replace like to / prefer / rather than / to / instead of in a given sentence.",
      blocks: [{ type: "rules", items: [
        "<b>Noun to Noun:</b> Sub + would rather + V1 + Noun + than + Noun",
        "<b>Noun to Noun (different verbs):</b> Sub + would rather + V1 + Noun + than + V1 + Noun",
        "<b>Noun to V-ing:</b> Sub + would rather + V1 + Noun + than + V1",
        "<b>V-ing to Noun:</b> Sub + would rather + V1 + than + V1 + Noun",
        "<b>V-ing to V-ing:</b> Sub + would rather + V1 + than + V1"
      ] }, { type: "examples", items: ["They preferred the red dress to the blue one. → They would rather have/wear/buy/like the red dress than the blue one.", "Sophie prefers wine to sweets. → Sophie would rather drink wine than eat sweets.", "She prefers shopping to staying at home. → She would rather go shopping than stay at home.", "Daw Mya prefers reading novels to watching movies. → Daw Mya would rather read novels than watch movies."] }],
      exercise: { title: "Exercise 5", instruction: "Rewrite the following using 'would rather'.",
        items: ["Do you prefer travelling by train rather than flying?", "They like to watch movies at home instead of going to the cinema on weekends.", "He prefers working in a small team rather than working alone on large projects.", "She prefers reading a book rather than scrolling on her phone before sleeping.", "He prefers a vegetarian diet to a meat-based diet.", "She prefers Venice to Rome."] } },
    { n: 6, part: "B", title: "Had Better",
      lead: "Structure: Sub + had better + V1 (+ noun). The cue word may be a verb, or a noun/adjective that you turn into a verb phrase.",
      blocks: [{ type: "examples", items: ["U Kyaw is tired. → U Kyaw had better go to bed."] }],
      exercise: { title: "Exercise 6", instruction: "Rewrite the following, telling what the person mentioned 'had better' do in the situation.",
        items: ["The weather is very hot today. (an umbrella)", "The buses are crowded and slow. (a taxi)", "You are feeling giddy now. (medicine)", "You are late for class. (hurry)", "She has run out of cooking oil. (borrow)", "He has an important interview tomorrow. (prepare)"] } },
    { n: 7, part: "B", title: "Modal Auxiliaries",
      lead: "Replace the underlined words with the suitable modal.",
      blocks: [{ type: "defs", items: [
        ["may", "It is possible that / I guess / Perhaps"], ["might", "It was possible that / I guessed"], ["can (not)", "is (not) able to / is (not) permitted to / (doesn't) have the ability to / has permission to"],
        ["could", "was (not) able to"], ["will", "is going to / promise to"], ["would", "was going to / promised to"], ["should", "it is advisable for / ought to / obligated to"], ["must", "it is necessary for"]
      ] }, { type: "note", html: "When the modal replaces <em>it is advisable for us to / necessary for us to</em>, drop the “for … to” (e.g. <em>It is advisable for us to prioritize customer satisfaction</em> → <em>We should prioritize customer satisfaction</em>). Question form: <em>Is Zaw Zaw able to swim?</em> → <em>Can Zaw Zaw swim?</em>" }],
      exercise: { title: "Exercise 7", instruction: "Rewrite, replacing the underlined words with the suitable modal auxiliaries.",
        items: ["**Perhaps** the children are hungry now.", "Ohnmar **is allowed to** go to the pool party with her cousins.", "She **had the ability to** explain things clearly and concisely.", "He **promises to** buy his girlfriend a diamond ring for her birthday.", "I **guess** she will go to Japan tomorrow.", "**It is advisable to** carry an umbrella during the rainy season.", "**It is necessary for** all students to attend classes regularly."] } },
    { n: 8, part: "B", title: "Tenses",
      lead: "A quick reference of the tense forms and the clue words that go with them.",
      blocks: [
        { type: "defs", items: [["Conditionals", "If V1, … will V1 · If V2, … would V1 · If had V3, … would have V3"]] },
        { type: "defs", items: [
          ["Present Simple", "V1 / V-s/es; do not V1 / does not V1; do/does + S + V1 …? — always, usually, often, sometimes, every, daily, regularly, frequently, once, twice, whenever"],
          ["Past Simple", "V2; did not V1; did + S + V1 …? — yesterday, ago, last, when he was a child, this morning, in 2014"],
          ["Present Continuous", "am/is/are + V-ing — today, now, at present, at the moment, Look! Listen! still"],
          ["Past Continuous", "was/were + V-ing; While S + was/were V-ing, S + V2; When S + V2, S + was/were + V-ing"],
          ["Present Perfect", "has/have + V3 — yet, ever, never, just, already, since, for, recently, this week, this month"],
          ["Past Perfect", "had + V3 — already, just, after"],
          ["Present Perfect Continuous", "has/have been + V-ing — for, since, the whole ___, all ___, How long ___?"],
          ["Future", "will + V1 — tomorrow, next, coming, soon · going to + V1 (intention) · am/is/are + V-ing (definite arrangement) · V1 / V-s/es (schedules and timetable) · will / going to (prediction) — probably, possibly, perhaps, may be, definitely, probability"]
        ] }],
      exercise: { title: "Exercise 8", instruction: "Rewrite using the verbs in brackets in the correct tenses.",
        items: ["While I (do) the language course, I (meet) lots of young people from all over the world.", "If I (pass) my exam successfully, I (start) an apprenticeship next year.", "Our teacher usually (brainstorm) us before he (start) a new lesson.", "When I (be) a kid, I (love) to read short stories.", "We (buy) a tourist guide to Yangon before we (leave).", "I (read) the contract carefully when the unexpected phone call interrupted me."] } },
    { n: 9, part: "B", title: "Have + Object + Past Participle",
      lead: "Structure: Subject + have/has/had + object + past participle.",
      blocks: [{ type: "rules", items: [
        "Write the <b>subject</b>.",
        "After the subject, change the <b>1st verb</b>: present → have/has · past → had · has/have/had + V3 → has/have/had + had · modal + V1 → modal + have · am/is/are/was/were + V-ing → am/is/are/was/were + having.",
        "Write the <b>second object</b> (the thing that receives the action).",
        "After the second object, change the <b>second verb to V3</b> (drop “to”).",
        "Write the remainder of the sentence."
      ] }, { type: "examples", items: ["The teacher has asked the students to learn the poem by heart. → The teacher has had the poem learned by heart."] }],
      exercise: { title: "Exercise 9", instruction: "Rewrite using a 'Have + Object + Past Participle' construction, omitting the person who does the action.",
        items: ["My sister is asking her lawyer to vet the contract.", "Tom asked the technician to reinstall the Windows system files.", "She has asked the dentist to repair her tooth with a crown.", "He asked the reflexologist to massage his feet yesterday.", "My father will call the plumber to mend the pipes.", "Ma Mu always asks her friends to copy the notes."] } },
    { n: 10, part: "B", title: "Have + Object + Past Participle + by Noun",
      lead: "Same steps as Section 9, but the doer of the action (the first object) is kept at the end after “by” (time/place phrases, if any, come last).",
      blocks: [{ type: "examples", items: ["The teacher has asked the students to learn the poem by heart. → The teacher has had the poem learned by heart by the students."] }],
      exercise: { title: "Exercise 10", instruction: "Rewrite so that the actor is mentioned at the end of the sentence.",
        items: ["My sister is asking her colleagues to proofread her dissertation.", "My friend asked the staff to save our photographs in the gallery.", "She has asked the company to increase her salary.", "She asked the man to repair the broken pipes in her bathroom.", "My cousin will ask the typist to send her file to the manager.", "My uncle asked the maid to iron all his trousers neatly."] } },
    { n: 11, part: "B", title: "Wish",
      lead: "Step 1: replace the opening clause. Step 2: change the verb in the “that” clause.",
      blocks: [
        { type: "rules", items: ["I'm sorry that / It's a shame that / It's a pity that → <b>I wish …</b>", "He's / She's sorry that → <b>He wishes / She wishes …</b>", "He was / She was sorry that → <b>He wished / She wished …</b>", "They are sorry that → <b>They wish …</b> · They were sorry that → <b>They wished …</b>", "Sub + will be sorry that → <b>Sub + will wish …</b>", "Are you sorry that → <b>Do you wish …?</b> · Were you sorry that → <b>Did you wish …?</b>", "Aren't you sorry that → <b>Don't you wish …?</b> · Isn't he/she sorry that → <b>Doesn't he/she wish …?</b>"] },
        { type: "rules", items: ["If there is <b>no “not”</b> in the clause, the verb becomes the past form and the clause becomes negative; if there <b>is a “not”</b>, the clause becomes positive.", "V1 → V2 (negative: did not V1) · is/are + V-ing → were + V-ing (negative: were not V-ing) · has/have + V3 → had + V3 (negative: had not V3)", "has/have been + V-ing → had been + V-ing · V2 → had + V3 · was/were + V-ing → had been + V-ing", "After <em>wish</em>, use <b>were</b> (not <em>was</em>): <em>Nyi Nyi is sorry that he is not a doctor. → Nyi Nyi wishes he were a doctor.</em>", "Imperatives and requests: Please V1 / V1 / Be ready to V1 → <b>I wish you would V1 …</b> · Don't V1 → <b>I wish you would not V1 …</b>"] }],
      exercise: { title: "Exercise 11", instruction: "Rewrite the sentences, beginning with I wish, He wishes, She wishes … etc.",
        items: ["I am sorry that I don't have her mobile phone number.", "It's a pity that I didn't know he was coming.", "I'm sorry that I said that. She's now upset.", "Don't come through the kitchen with your dirty boots on.", "Please stop making so much noise.", "She is sorry that she can't go abroad for her further studies."] } },
    { n: 12, part: "B", title: "Deduction (must)",
      lead: "First decide whether the sentence is present or past, and active or passive. Then use the cue word.",
      blocks: [{ type: "rules", items: [
        "<b>Present, active:</b> Sub (pronoun) + must + V1 — <em>Jane walks to work every day. (live) → He must live near his workplace.</em>",
        "<b>Present, passive:</b> Sub (pronoun) + must + be + V3 — <em>The house is empty. (out) → It must be moved out.</em>",
        "<b>Past, active:</b> Sub (pronoun) + must + have + V3 — <em>Jane walked to work every day. (live) → He must have lived near his workplace.</em>",
        "<b>Past, passive:</b> Sub (pronoun) + must + have + been + V3 — <em>The house was empty. (out) → It must have been moved out.</em>",
        "Cue word is a <b>verb</b> → use it as given. A <b>noun</b> → turn it into a verb phrase. An <b>adjective</b> → use <em>be</em> + adjective."
      ] }],
      exercise: { title: "Exercise 12", instruction: "Write what you deduce from the following statements. Use the cue word.",
        items: ["The baby is crying a lot. (hungry)", "She didn't answer my call yesterday. (busy)", "We can see nobody inside. (out)", "I can't find my wallet now. (drop)", "She is yawning too much. (late)", "Zaw Zaw seemed very tired. (bed)"] } },
    { n: 13, part: "B", title: "Third Person Singular",
      lead: "Change plural subjects, verbs and objects to the singular.",
      blocks: [{ type: "rules", items: [
        "We / You / They → <b>He / She / It</b>",
        "Our / Your / Their → <b>His / Her / Its</b>",
        "Ourselves / Yourselves / Themselves → <b>Himself / Herself / Itself</b>",
        "Change plural nouns (e.g. <em>eyes, wings, antlers</em>) to singular and adjust the verb: <em>are → is, do → does, have → has</em>.",
        "<em>Computers are powerful machines. → A computer is a powerful machine.</em>",
        "If there is no article, add one (<em>a / an</em>) where the singular noun needs it."
      ] }],
      exercise: { title: "Exercise 13", instruction: "Rewrite the following sentences in the Third Person Singular.",
        items: ["Igloos are circular snow houses used by Eskimos.", "Leopards are as ferocious as tigers.", "Do polar bears live longer than brown bears?", "Kangaroos are jumping animals.", "Do cars have airbags?", "Women live longer than men."] } },
    { n: 14, part: "B", title: "Negative",
      lead: "Change the verb of the given sentence to the negative.",
      blocks: [{ type: "rules", items: [
        "V1 → Sub + do + not + V1 …", "V-s/es → Sub + does + not + V1 …", "V2 / had → Sub + did + not + V1 / have …",
        "has/have/had + V3 → Sub + has/have/had + not + V3 …", "am/is/are/was/were + V-ing → Sub + am/is/are/was/were + not + V-ing …", "modal + V1 → Sub + modal + not + V1 …",
        "<em>Daw Htar Htar lent some money to my brother. → Daw Htar Htar did not lend any money to my brother.</em> (some → any, where needed)"
      ] }],
      exercise: { title: "Exercise 14", instruction: "Rewrite the following sentences in the Negative.",
        items: ["My cousin ought to see a dentist.", "Do you like watching volleyball?", "My brother enjoys eating pork meatballs.", "My uncle caught a pike yesterday.", "They have been to Indawgyi Lake before.", "He should have bought this mansion in the valley."] } },
    { n: 15, part: "B", title: "Interrogative (Question)",
      lead: "Change the verb of the given sentence to make a question.",
      blocks: [{ type: "rules", items: [
        "V1 → Do + Sub + V1 … ?", "V-s/es → Does + Sub + V1 … ?", "V2 / had → Did + Sub + V1 / have … ?", "has/have/had + V3 → Has/Have/Had + Sub + V3 … ?",
        "am/is/are/was/were + V-ing → Am/Is/Are/Was/Were + Sub + V-ing … ?", "modal + V1 → Modal + Sub + V1 … ?",
        "Change <b>some / no</b> → <b>any</b>; <b>my</b> → <b>your</b>; <b>I</b> → <b>you</b>.",
        "<em>Daw Htar Htar lent some money to my brother. → Did Daw Htar Htar lend any money to your brother?</em>"
      ] }],
      exercise: { title: "Exercise 15", instruction: "Rewrite the following sentences in the Interrogative.",
        items: ["Ko Ko wept bitterly when he did not win the lottery.", "Moh Moh suddenly withdrew from the competition.", "I can lose weight if I run daily.", "She has never been to Laos before.", "A small path leads through the woods.", "I am feeling better."] } },
    { n: 16, part: "B", title: "Antonyms and Synonyms",
      lead: "Opposites (antonyms) and words with similar meanings (synonyms).",
      blocks: [
        { type: "cols", cols: [{ h: "Antonyms – verbs", items: ["stay ↔ leave", "come ↔ go", "borrow ↔ lend", "whispered ↔ yelled", "agree ↔ disagree"] }, { h: "Antonyms – adjectives", items: ["many ↔ few", "famous ↔ unknown", "glad ↔ sorry", "other ↔ same"] }, { h: "Antonyms – expressions", items: ["ask permission ↔ order", "give permission ↔ refuse"] }] },
        { type: "cols", cols: [{ h: "Synonyms – nouns", items: ["town = village", "salary = pay", "cash = money", "rider = horseman", "bandit = robber"] }, { h: "Synonyms – verbs", items: ["reply = answer", "loan = lend", "galloped = ran", "dine = eat", "invite = ask"] }, { h: "Synonyms – adjectives & expressions", items: ["last = final", "trembling = shaking", "friendly = favourable", "prepare (food) = cook", "raise (one's) hand = salute", "return = go back"] }] }],
      exercise: { title: "Exercise 16", instruction: "Rewrite with antonyms or synonyms of the underlined words.",
        items: ["John and Irma decided to **stay** in Mexico for five years. Later, they decided to ________.", "He **whispered** the secret. She ________ it.", "I **agree** with the first point, but I must ________ with the second.", "The author was **famous** in her own country but remained ________ abroad.", "Do you need to **borrow** a pencil, or can you ________ me one?", "Many Americans thought Pancho Villa was a **bandit**."] } },
    { n: 17, part: "B", title: "Adjective Forms",
      lead: "Turn nouns and verbs into adjectives with -ed / -en or -ful.",
      blocks: [
        { type: "pills", h: "Noun / verb + ed / en → adjective", items: ["group → grouped", "lock → locked", "injure → injured", "disturb → disturbed", "experience → experienced", "ruin → ruined", "expect → expected", "weave → woven", "freeze → frozen", "fry → fried", "displease → displeased", "burn → burned / burnt", "hide → hidden", "give → given", "break → broken", "beard → bearded", "write → written"] },
        { type: "pills", h: "Noun / verb + ful → adjective", items: ["help → helpful", "doubt → doubtful", "success → successful", "disgrace → disgraceful", "forget → forgetful", "thought → thoughtful", "power → powerful", "play → playful", "thank → thankful", "rest → restful", "wonder → wonderful", "skill → skilful"] }],
      exercise: { title: "Exercise 17", instruction: "Fill each blank with the adjective form of the underlined word.",
        items: ["They **lock** the door. He cannot open the ________ door.", "The thin man wanted to **injure** several people. The ________ people went to the doctor.", "Thank you for your **help**. You were very ________.", "I did not take the job without **doubts**. I was ________ about taking the job.", "The paper was a big **success**. It was very ________.", "He always seemed to **forget** things. He was a very ________ person."] } }
  ],
  papers: [
    { id: "A", title: "Paper A – Third Year (B.Sc.), All Specializations", meta: "Final Examination, October 2025 · Time allowed: 3 hours", questions: [
      "Q1. Reading passage on the Taj Mahal: (a) what the underlined words refer to (5 marks); (b) matching words with meanings, with two extras (5); (c) answer in complete sentences (5).",
      "Q2. (a) Rewrite in the Negative (5); (b) rewrite using ‘would rather’ (5).",
      "Q3. (a) Replace underlined words with modal auxiliaries (5); (b) rewrite using ‘Have + Object + Past Participle’ (10).",
      "Q4. (a) Use the verbs in brackets in the correct tenses (5); (b) rewrite beginning with ‘I wish / He wishes / She wishes …’ (5); (c) fill blanks with the correct form of exclaim, explain, plead, mutter, shout, march, limp, toddle, prowl, plod (5).",
      "Q5. (a) Fill the blanks with suitable similes (5); (b) write the meaning of abbreviations such as v.p.p., misc, etc., P.O.W., G.P.O. (5).",
      "Q6. Essay (15 marks): The pros and cons of renewable energy sources, or The importance of resilience in achieving success."
    ] },
    { id: "B", title: "Paper B – Third Year (B.A.), All Specializations", meta: "Final Examination, October 2025", questions: [
      "Q1. Reading passage on digital currency: (a) reference words, (b) matching Column I with Column II, (c) answer in complete sentences.",
      "Q2. (a) Rewrite in the Third Person Singular; (b) rewrite in the Negative.",
      "Q3. (a) Write what you deduce (use the cue word); (b) rewrite using ‘Have + Object + Past Participle’.",
      "Q4. (a) Verbs in the correct tenses; (b) rewrite beginning with ‘I wish …’; (c) replace underlined words with idiomatic expressions.",
      "Q5. (a) Fill the blanks with suitable similes; (b) write the meaning of I.Q., G.M.T., R.I.P., P.S., Ave.",
      "Q6. Essay on ONE: One important possession in my life, or Beauty is in the eye of the beholder."
    ] },
    { id: "C", title: "Paper C – Third Year (B.A.), All Specializations", meta: "Final Examination, November 2025", questions: [
      "Q1. Reading passage on sea ice: (a) reference words, (b) matching, (c) answer in complete sentences.",
      "Q2. (a) Rewrite in the Negative; (b) rewrite using ‘would rather’.",
      "Q3. (a) Deduction with cue words; (b) rewrite using ‘Have + Object + Past Participle’, omitting the underlined words.",
      "Q4. (a) Correct tenses; (b) rewrite beginning with ‘I wish …’; (c) correct form of exclaim, explain, plead, mutter, shout, march, limp, toddle, prowl, plod.",
      "Q5. (a) Fill the blanks with suitable similes; (b) write the meaning of P.S., a.m., M.C., i.e., e.g.",
      "Q6. Essay on ONE: The early bird catches the worm, or Don't put all your eggs in one basket."
    ], note: "Reading passages are not reproduced here – attach the original passage for each paper." }
  ]
};
