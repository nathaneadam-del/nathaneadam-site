# Funnel plan — turning the site toward the diagnostic

Drafted 1 September 2026. Nothing below is built yet. Approve, strike, or edit,
then the changes get made in one pass.

## The shape

Graham Cochrane's site does four things well, and only four matter here:

1. One primary ask, repeated on every page, in the same words. His is "Work
   with Graham". Ours becomes **the diagnostic**.
2. The free thing is a *thing*, not "join my list". His is a five-day
   challenge. Ours is a two-minute read on which half of your work is at
   risk. People take a tool; they don't take a newsletter.
3. The email is captured *inside* the free thing, not beside it.
4. Every page ends by pointing at the ask. Nobody hits a footer and stops.

The funnel, in order:

```
LinkedIn post / former student / Google
        → tools/career-pivot.html   (ten questions, free half of the read)
        → email gate                (beehiiv form #2, hard gate)
        → career-pivot-result.html  (the useful half)
        → welcome email             (beehiiv automation, not built yet)
        → weekly email              (the relationship)
        → coaching / course         (someday. Not mentioned on the site until real.)
```

What we do **not** copy from Graham: the offer grid (nothing for sale),
"only available here", countdown timers. The professor position is the
asset. The moment the site looks like a coaching launch it loses the thing
that makes people trust the diagnostic.

**Testimonials are back in.** CLAUDE.md rejected them on 23 Aug because
there was nothing sourced. Nathan has hundreds of real student quotes, which
is a different thing entirely: they are proof of the one claim the
diagnostic rests on, that he can teach this. Rules: real name, or first name
plus year with permission; nothing anonymous; the source recorded in
CLAUDE.md. Placement: three or four on `index.html` under the proof bar, a
longer run on `about.html`, one at the gate in `content.js`. Pick for
specificity (what changed for them), not for praise.

**The CTA label everywhere is "Take the AI Career Diagnostic".** Not
"Take the diagnostic". Nathan's call.

## The one non-code change that matters most

**Flip the gate from soft to real.** Right now every visitor can click "no
thanks, show me anyway" and the diagnostic captures nobody. The mechanism is
already written; it needs a **second beehiiv subscribe form** with its
post-subscribe redirect set to
`https://www.nathaneadam.com/tools/career-pivot-result.html`, then its UUID
pasted into `GATE.formUuid` and `GATE.mode` set to `"beehiiv"`.

A second form has a bonus: beehiiv reports subscribers per form, so you can
see how many people came in through the diagnostic versus the homepage. That
is the only measurement this site has, and it costs nothing.

If a Launch-plan form turns out not to support a redirect, say so and the
soft gate stays. Do not ship the real mode without the redirect.

## The five "nothing to sell" lines

Each rewrite has to be true today and still true the day a course exists.
The trick is to keep the *point* (hard to bribe, no hype) and drop the
*promise* (never selling).

| Where | Now | Proposed |
|---|---|---|
| `index.html` story | "…who cracked the code last Tuesday and has a course to sell you." | "…who cracked the code last Tuesday." (the sentence loses nothing) |
| `index.html` card 3 | "I have tenure and nothing to sell you, which makes me harder to bribe…" | "I have tenure, so none of this has to pay the bills by Friday." |
| `tools.html` lede | "Nothing here is a lead magnet with a course bolted to the back of it." | "The first half of every result is free. The rest comes with the weekly email." |

Nathan's correction, 1 Sep: no clever turn after the plain fact. State it and
stop. (Struck: "harder to bribe than most people writing about it", "I'd
rather say it out loud than hide it in a footnote".)
| `tools.html` meta description | "…none of them try to sell you a course." | "…they run in your browser, and the full read comes with the weekly email." |
| `index.html` newsletter section | "No hype, no income screenshots, no promises to 10x your life." | Keep. Still true, still will be. |

"I don't sell or share your address" stays everywhere. That one is a
privacy statement, not a business one.

## Page by page

### Nav and footer, all 23 files

The nav button changes from **Get the weekly email** to **Take the AI Career
Diagnostic**, pointing at
`tools/career-pivot.html`. The email stays reachable from the footer, the
homepage section, and the gate itself. One ask in the nav, same words on
every page, per Graham.

### `index.html`

- Hero headline unchanged. Lede gains the ask: *"For experienced
  professionals who suspect the AI wave already came and went without them.
  It didn't. Start with ten questions about how you actually get paid and
  I'll tell you which half of your work is exposed and which half isn't.
  About two minutes."*
- Buttons: orange **Take the two-minute diagnostic**, ghost **Get the weekly
  email**. The orange one moves; it was the email.
- New section between the story and "What you'll find here", styled like
  the existing cards, not a new component: a single block for the
  diagnostic with a one-line description and the same orange button.
  This is the Graham "lead magnet block" without the tablet mockup.
- Card 3 rewrite, above.
- Newsletter section keeps its form, gains one line: *"Already took the
  diagnostic? This is where the rest of it lives."*

### `tools.html`

- Lede and meta rewrite, above.
- The diagnostic card gets an actual button, not just a linked heading.
- "More coming" stays. It promises the assignment helper; either build it
  or leave the paragraph, but don't add anything else there.

### `tools/content.js` (every word of the diagnostic)

- Intro lede *"No email needed to start"* stays. It's true and it's a
  reason to start.
- Gate button: "Show me the rest" → **"Send me the full read"**. It says what
  happens.
- Gate body: tighten so the value is listed before the ask, which it
  already mostly does.
- Result page gets a closing block: *"The welcome email asks one question:
  what's your craft? Reply to it. I read every one, and it's how I decide
  what to write about next."* This is the cheapest customer research a
  future course could have, and it makes the first email a conversation.
- The caveat stays, verbatim. It's what makes the rest believable.

### `about.html`, `credits.html`, `projects.html`, all 14 project pages

Add one shared callout before each footer, one class, one CSS rule scoped
to `.tool-callout` so it can't reach anything else:

> **Wondering which half of your own work is at risk?**
> Ten questions, about two minutes, and my honest read. No score, because a
> score would be a number I made up.
> [Take the diagnostic]

Existing end-of-page button rows (Full credits / Speaking & press) stay
underneath it. The callout is the ask; those are navigation.

### `speaking.html`

Different visitor, different ask. Booking stays primary. Gets the callout
above the footer like everything else and nothing more.

### `404.html`

Primary button → the diagnostic. Somebody who typed a dead URL from the old
site is exactly a former student.

### Share card

You'll post `tools/career-pivot.html` to former students and colleagues, so
that URL is the one people will actually see on LinkedIn. It needs its own
1200×630 `og:image` with the question on it, not the generic card. One image
file, four meta tags.

## Not on the site, but it's the rest of the funnel

- **The welcome email.** beehiiv sends one automatically. Right now it's
  presumably the default. It should be in your voice, deliver the "here's
  the rest" promise, and ask the one question. I can draft it.
- **The LinkedIn post** announcing the diagnostic to former students. I can
  draft that too.
- **Coaching and courses stay off the site** until there is something to
  buy. The editorial rules apply to offers as much as to camp counts: no
  claim before it's real. When it is real, it gets its own page and the
  "What you'll find here" cards become the offer grid Graham has.

## Sequence

1. You: create beehiiv form #2 with the redirect, send me the UUID.
2. Me: all copy changes above, the callout, the share card, gate flip,
   CLAUDE.md updated, one commit.
3. You: push, then look at the homepage and the diagnostic on your phone.
   (The phone check on the diagnostic is still owed from the last session.)
4. Me: welcome email and LinkedIn post drafts.

Step 2 can go first if the form takes a while; the gate flip is one line
whenever the UUID arrives.
