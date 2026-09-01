/* ============================================================
   Career pivot diagnostic — ALL THE WORDS LIVE HERE.
   nathaneadam.com/tools/career-pivot.html

   THIS FILE IS THE ONE TO EDIT WHEN YOU WANT TO CHANGE THE TEXT.
   Nothing in here is logic. Change a sentence, save, push. There is
   no build step, so the change is live on the next deploy.

   Two rules that are load-bearing, from CLAUDE.md:

   1. NO INVENTED NUMBERS. This tool does not score anybody, does not
      produce a percentage, and does not claim research it doesn't have.
      Every read is framed as Nathan's opinion, because that is what it
      is, and that is defensible. A statistic would not be.
   2. Basic HTML is allowed in these strings (<strong>, <em>, <a>).
      It is written by Nathan and rendered as-is. Visitor answers are
      NEVER put into HTML, so there is no injection surface here.

   Design doc with the reasoning: tools/DIAGNOSTIC-DESIGN.md
   ============================================================ */

window.PIVOT_CONTENT = {

  /* ---------- the opening screen ---------- */
  intro: {
    eyebrow: "A short diagnostic &middot; about 2 minutes",
    title: "Which half of your work is actually at risk?",
    lede: "Ten questions. No email needed to start, and no score at the end, because a score would be a number I made up.",
    body: [
      "I watched this happen once already. The million-dollar console didn&rsquo;t lose to a better console. It lost sessions to a $2,500 computer running Pro Tools LE, and the engineers who came through that fine were not the ones with the fastest hands.",
      "So this asks about your work the way I&rsquo;d ask about it if we were sitting down together, and then tells you what I think. Nothing more scientific than that."
    ],
    startLabel: "Start"
  },

  /* ---------- question 1, the branch ---------- */
  branch: {
    id: "track",
    text: "Where are you right now?",
    options: [
      { label: "I&rsquo;ve been working in my field for a while", value: "A" },
      { label: "I&rsquo;m early on. Studying, or a few years in", value: "B" }
    ]
  },

  /* ---------- the craft list, shared by both tracks ----------
     `example` is used in the 90-day move: the unglamorous task in that
     craft that nobody would show a client. Naming the actual thing is
     the whole point, so keep these specific. */
  crafts: [
    { value: "audio",    label: "Audio and music",     example: "the comping, the track naming, the noise cleanup, the transcript" },
    { value: "video",    label: "Video and film",      example: "the log-and-transfer, the string-out, the subtitle pass" },
    { value: "photo",    label: "Photography",         example: "the culling, the first-pass retouch, the keywording" },
    { value: "design",   label: "Design and visual",   example: "the resizes, the deck cleanup, the asset export" },
    { value: "writing",  label: "Writing",             example: "the transcript, the outline, the draft you were going to rewrite anyway" },
    { value: "teaching", label: "Teaching and training", example: "the slide rebuild, the rubric draft, the discussion prompts" },
    { value: "other",    label: "Something else",      example: "the admin, the first pass, the part you resent" }
  ],

  /* ============================================================
     TRACK A — mid-career
     `score` drives the read. Questions without a score don't.
     ============================================================ */
  trackA: [
    { id: "craft", text: "What&rsquo;s the core of your work?", useCrafts: true },

    { id: "good", text: "On a typical paid job, who decides what &ldquo;good&rdquo; means?", options: [
      { label: "The client, and they&rsquo;re specific about it", score: "exposed" },
      { label: "We work it out together", score: "middle" },
      { label: "Me. That&rsquo;s what they&rsquo;re paying for", score: "durable" }
    ]},

    { id: "source", text: "Think about your last ten jobs. Where did they come from?", options: [
      { label: "A platform, a marketplace, or a job board", score: "exposed" },
      { label: "A mix of both", score: "middle" },
      { label: "People who already knew me, or who were sent by people who knew me", score: "durable" }
    ]},

    { id: "spec", text: "Could a smart client describe what they want, in words, well enough that a stranger could have a decent go at it?", options: [
      { label: "Yes, pretty much", score: "exposed" },
      { label: "Roughly, but they&rsquo;d get it wrong in ways that matter", score: "middle" },
      { label: "No. Half my job is working out what they actually want", score: "durable" }
    ]},

    { id: "paid", text: "What are you actually paid for?", options: [
      { label: "The deliverable. So many files, so many minutes, so many pages", score: "exposed" },
      { label: "My time", score: "middle" },
      { label: "The outcome, or for being the one responsible when it goes wrong", score: "durable" }
    ]},

    { id: "volume", text: "If you could produce three times as much work in a week, what happens to what you earn?", options: [
      { label: "It&rsquo;d roughly triple", score: "exposed" },
      { label: "It&rsquo;d go up somewhat", score: "middle" },
      { label: "Not much. My rate was never about volume", score: "durable" }
    ]},

    { id: "room", text: "How much of a job is you being in the room, or being personally on the hook?", options: [
      { label: "Almost none. I could do all of it from anywhere, and I usually do", score: "exposed" },
      { label: "Some of it", score: "middle" },
      { label: "A lot of it", score: "durable" }
    ]},

    { id: "ai", text: "Have you used AI tools on work you actually got paid for?", options: [
      { label: "No, not yet", value: "none" },
      { label: "Tried it. Didn&rsquo;t stick", value: "tried" },
      { label: "Yes. It&rsquo;s part of how I work now", value: "using" }
    ]},

    { id: "teach", text: "Does anybody learn your craft from you? Students, juniors, a channel, a client you&rsquo;ve trained up?", options: [
      { label: "No", value: "none" },
      { label: "Informally, now and then", value: "some" },
      { label: "Yes, regularly", value: "yes" }
    ]}
  ],

  /* ============================================================
     TRACK B — early career
     Deliberately unscored. The read is the same for everyone on this
     track, because the diagnosis IS the same. Only the 90-day move
     changes, and that comes off the AI question.
     ============================================================ */
  trackB: [
    { id: "craft", text: "What are you training in, or aiming at?", useCrafts: true },

    { id: "pull", text: "What pulled you into it?", options: [
      { label: "I&rsquo;m good at the technical side of it" },
      { label: "I like deciding what&rsquo;s good and what isn&rsquo;t" },
      { label: "I like working with people on their stuff" }
    ]},

    { id: "judge", text: "When you finish something, how do you know if it&rsquo;s any good?", options: [
      { label: "It meets the brief and it&rsquo;s technically clean" },
      { label: "I hold it up against work I admire" },
      { label: "Somebody I trust tells me" }
    ]},

    { id: "learning", text: "Right now, is most of your learning about the tools, or about the judgment?", options: [
      { label: "Mostly learning the software" },
      { label: "A mix" },
      { label: "Mostly learning to hear or see the difference" }
    ]},

    { id: "shipped", text: "Have you made anything for a real person yet? Paid or not.", options: [
      { label: "Not yet" },
      { label: "One or two things" },
      { label: "Regularly" }
    ]},

    { id: "vouch", text: "Is there anyone who&rsquo;d vouch for you by name?", options: [
      { label: "Not really" },
      { label: "One or two people" },
      { label: "Several" }
    ]},

    { id: "ai", text: "AI tools?", options: [
      { label: "Steering clear", value: "none" },
      { label: "Messing about with them", value: "tried" },
      { label: "Already using them in my work", value: "using" }
    ]},

    { id: "worry", text: "Two years from now, which would bother you more?", options: [
      { label: "Being slower than everyone else" },
      { label: "Not knowing whether my work is any good" },
      { label: "Nobody knowing who I am" }
    ]}
  ],

  /* ============================================================
     THE READS
     `free` shows to everybody. `gated` is behind the subscribe.
     ============================================================ */
  reads: {

    A_exposed: {
      label: "You&rsquo;re being paid to execute",
      free: [
        "Right now you&rsquo;re being paid for the doing, not the deciding.",
        "Your jobs come in with the answer already attached. Somebody else has decided what the thing should be, and you&rsquo;re the person who makes it exist, on time, to spec, without mistakes. You are probably very good at this. That is not the problem."
      ],
      gated: [
        "The problem is that &ldquo;on time, to spec, without mistakes&rdquo; is the exact description of what machines got good at this decade. Not the taste. The execution.",
        "Here&rsquo;s what I&rsquo;d want you to notice though, because the way this normally gets written up is basically a doom letter, and that isn&rsquo;t the honest version. You already have the thing that survives this. You know what good is. You can listen to two versions and tell me which one is right, and probably tell me why. That took years and you can&rsquo;t download it.",
        "It&rsquo;s just that nobody is currently paying you for it, and you have never asked them to.",
        "The gap between what you know and what you&rsquo;re paid for is the whole of your risk. It is also the whole of your opportunity. Same gap."
      ]
    },

    A_middle: {
      label: "Your work is a bundle, and half of it just got cheaper",
      free: [
        "You&rsquo;re in the middle, and the middle is where the ground is moving.",
        "Most people land here, so don&rsquo;t read that as a soft landing. It&rsquo;s just where a working craft career actually sits right now."
      ],
      gated: [
        "You sell one price for one project. Inside that price there are two different jobs. There&rsquo;s deciding what the thing should be, what stays, what goes, what&rsquo;s actually wrong with it. And there&rsquo;s sitting there and doing it.",
        "For a long time those were welded together, and for a good reason. The only way to get the judgment was to put in the hours doing the execution. The only person who could execute at a decent level was somebody who had already earned the judgment. So we priced them as one thing, because they arrived as one thing.",
        "That weld is coming apart. And here&rsquo;s the part that gets people, because it doesn&rsquo;t announce itself. Nobody sends you an email saying the execution half of your bundle is worth less now. What happens is your rate quietly stops moving, a job you&rsquo;d have got two years ago goes somewhere else, and a client asks a question about your quote that they&rsquo;d never have asked before.",
        "It reads like a slow patch. It isn&rsquo;t.",
        "If you price the bundle as one thing, you&rsquo;ll get benchmarked on the half that got cheap."
      ]
    },

    A_durable: {
      label: "You&rsquo;re already selling judgment, and that&rsquo;s not the same as being safe",
      free: [
        "You&rsquo;re mostly being paid to decide, not to do. Clients come to you by name, they can&rsquo;t fully specify what they want, and you&rsquo;re the one on the hook when it goes sideways.",
        "That&rsquo;s the durable end of this. It is not the safe end, and those are different things."
      ],
      gated: [
        "I&rsquo;ll be straight about the temptation here. Everything you just told me points the good way, and the easy thing for me to do is tell you you&rsquo;re fine and let you get on with your day. You&rsquo;re not exactly fine. You&rsquo;re facing a different problem than the one everybody&rsquo;s writing about.",
        "Your risk isn&rsquo;t that a machine does your job. Your risk is somebody who sells the same judgment you do, with faster and cheaper execution running underneath it, and who therefore gets to say yes to three times as much work as you do. Same taste. Better throughput.",
        "They&rsquo;ll take the jobs you were going to take. Not because they&rsquo;re better than you, but because they answered first and quoted lower and it still cleared their bar.",
        "Judgment is the moat. Nobody said the moat came with speed attached."
      ]
    },

    B: {
      label: "The bottom rung is being sawn off, and that&rsquo;s not the bad news you think",
      free: [
        "I&rsquo;m going to tell you the thing people your age keep getting told sideways.",
        "The bottom rung is being sawn off. The job that used to exist so somebody could learn on it, the assisting, the log-and-transfer, the first pass that a senior person then fixed, that job is going away. And it&rsquo;s going away fastest in exactly the fields people go to school for."
      ],
      gated: [
        "Everyone hears that as &ldquo;you&rsquo;re doomed.&rdquo; It isn&rsquo;t what it means. Read it again. The rung that&rsquo;s disappearing is the <em>learning</em> rung. Not the career. The apprenticeship.",
        "That matters because of how the old deal worked. You did four years of unglamorous execution and the judgment arrived as a byproduct. Nobody handed it to you, you absorbed it, mostly by watching somebody senior reject things, and occasionally by being the one who got it wrong. It was slow, it was badly paid, and it worked.",
        "Now the unglamorous execution is cheap, so nobody&rsquo;s paying you to sit through it. Which means the judgment does not arrive by itself any more. You have to go and get it on purpose.",
        "That&rsquo;s the whole thing. That&rsquo;s the actual difference between your generation and mine, and almost nobody says it plainly.",
        "The good news, and it is genuinely good, is that the reps got cheaper for you too. I had to book a room to hear what a bad decision sounded like. You don&rsquo;t. You can make forty versions of something this week and develop an opinion about which one is right, which is the thing that used to take four years of somebody else&rsquo;s payroll.",
        "Nobody will make you do it. That&rsquo;s the catch. It&rsquo;s the first generation where taste has to be deliberate."
      ]
    }
  },

  /* ---------- the 90-day move. Driven by the AI question. ---------- */
  ninetyDays: {
    heading: "What I&rsquo;d do in the next 90 days",
    none: [
      "Pick the one task you&rsquo;d never show a client. In your case that&rsquo;s probably {{example}}. The thing you resent. Do that with AI for thirty days and nothing else.",
      "Not the part you care about. I&rsquo;m being deliberate about that. Almost everyone tries this on the work they&rsquo;re proud of, hates the result, decides the tools are rubbish, and stops. Which is a shame, because they were right about the result and wrong about the conclusion."
    ],
    tried: [
      "It didn&rsquo;t stick because you tried it on the part you care about. That&rsquo;s not a character flaw, it&rsquo;s the obvious place to start. It&rsquo;s just the wrong one.",
      "Move it to the part you don&rsquo;t care about, which for you is probably {{example}}, and leave it there for a month."
    ],
    using: [
      "Then your next move isn&rsquo;t a tool. It&rsquo;s your invoice.",
      "Your hours just got shorter. If you&rsquo;re still billing by the hour or by the deliverable, you&rsquo;re about to hand the entire gain to your clients and then wonder why a good year felt like a flat one.",
      "Price one job on the outcome this quarter. One. See what happens.",
      "I know that&rsquo;s the least fun advice on this page. :)"
    ]
  },

  /* ---------- shown to everybody, same words ---------- */
  skip: {
    heading: "What I wouldn&rsquo;t bother with",
    items: [
      "<strong>Learning &ldquo;prompt engineering&rdquo; as a skill.</strong> It&rsquo;s a phrasebook for a language that&rsquo;s being redesigned every few months. Learn the craft judgment instead. That transfers, and it has for thirty years.",
      "<strong>Rebranding yourself as an AI anything.</strong> The people doing this in 2026 are going to look how &ldquo;social media guru&rdquo; looks now.",
      "<strong>Trying every new tool.</strong> There&rsquo;s a new one every week. You&rsquo;ll spend the whole year evaluating and none of it making.",
      "<strong>Waiting for it to settle.</strong> It isn&rsquo;t going to, and that&rsquo;s fine. It didn&rsquo;t settle after Pro Tools either. Everybody who waited for that just missed the part where the work was easy to get."
    ]
  },

  /* ---------- the caveat. Do not remove this. ---------- */
  caveat: {
    heading: "One thing before you take any of that too seriously",
    body: [
      "This is my read. It isn&rsquo;t a study, there&rsquo;s no data set behind it, and I didn&rsquo;t run a survey. It&rsquo;s what twenty-five years of teaching this and a front-row seat at the last technology change makes me think, which is worth something and isn&rsquo;t worth everything.",
      "I&rsquo;ve been wrong about this before, by the way. I was quietly pleased to be moving on from shipping a DVD with a book, so I put the material on a companion website instead. The website is long gone. The DVD still works in every copy that ever sold.",
      "So take the read, argue with it, keep the bit that fits."
    ]
  },

  /* ---------- the gate ---------- */
  gate: {
    heading: "The rest of it",
    body: "There&rsquo;s more to this one, and it&rsquo;s the useful half: what&rsquo;s actually durable in your work and why, the one move I&rsquo;d make in the next 90 days, and the list of things I&rsquo;d ignore completely. It comes with the weekly email, which is where I write about this properly.",
    buttonLabel: "Show me the rest",
    footnote: "One email a week. Unsubscribe whenever, no hard feelings."
  }
};
