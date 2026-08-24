# CLAUDE.md — context for working on nathaneadam.com

Read this before changing anything. It records decisions that were expensive to
reach, facts that were verified against primary sources, and a few traps in the
local setup.

Last updated: 24 August 2026 (Poppins; hamburger nav; visitor-first hero copy).

---

## What this is

A four-page static site. No framework, no build step, no dependencies. Plain HTML
plus one stylesheet. That is deliberate: Nathan publishes weekly and should never
be blocked by a toolchain that rotted.

```
index.html        Homepage — positioning, proof bar, story, newsletter signup
about.html        The long story, 1999 to now
credits.html      Production, engineering, publishing, curriculum, teaching
speaking.html     TEDx embed, topics, talk history, press, booking
css/site.css      Every style for every page
js/nav.js         Mobile menu toggle — the only script, loaded on all four pages
images/           See images/README.md
```

## Deployment

| | |
|---|---|
| Source of truth | `~/Library/CloudStorage/Dropbox/nathaneadam-site` |
| GitHub | `github.com/nathaneadam-del/nathaneadam-site` (public) |
| Host | Vercel, project `nathaneadam-site`, team slug `nathan-ea-dam` |
| Deploys | Automatically on push to `main`. ~1 minute. |
| Preview URL | `nathaneadam-site.vercel.app` |
| Live | `nathaneadam.com` → 308 → `www.nathaneadam.com` |

**Nathan pushes, not Claude.** Auth lives in his macOS keychain via GitHub
Desktop. Claude can commit locally; the push is his click.

### DNS — read before touching

DNS stays at **DreamHost**. Nameservers are deliberately *not* delegated to
Vercel. Only two records point at Vercel:

- apex `A` → `216.198.79.1`
- `www` `CNAME` → `05b8bf420d1ec53b.vercel-dns-017.com`

Everything else in that zone is Google Workspace and **must not move**: the
`aspmx.l.google.com` MX record plus `calendar`, `docs`, `mail`, `sites` and
`start` CNAMEs to `ghs.googlehosted.com`. If Vercel offers to take over the
nameservers, decline — moving the zone means recreating the MX by hand, and
missing it kills his email.

`nathaneadam.com` at DreamHost is set to **DNS Only** (hosting removed 23 Aug
2026). His old files still sit in `/home/adnstudios/nathaneadam` including a
`projects/` folder that is no longer served. A pre-migration zone snapshot is in
`DNS-BACKUP-before-vercel.txt`, gitignored on purpose.

---

## Local setup traps

**Dropbox and git fight over `.git`.** Committing from a Linux sandbox leaves
`.git/*.lock` and `tmp_obj_*` files behind because Dropbox blocks the unlink.
Leftover lock files make git refuse later operations. After any sandbox commit:

```bash
find .git \( -name "*.lock" -o -name "tmp_obj_*" \) -delete
```

Deleting inside this folder needs the Cowork delete grant first
(`allow_cowork_file_delete`). GitHub Desktop writes natively and never hits this.

**Attachments auto-copy into `images/`.** Files the user uploads in chat appear
in `images/` alongside processed versions, originals and all. A 3.7MB PNG nearly
went into git history this way. Always `rm -f images/*.png images/*.jpeg` and
check `git status` before committing.

**Never commit `DNS-BACKUP-*.txt`.** Gitignored. It's an infrastructure inventory
and the repo is public.

---

## Editorial rules

These exist because the numbers in Nathan's published bios contradict each other.
Hold the line.

- **Every claim traces to a source.** The talk list comes from his 2023 tenure and
  promotion CV. Press links were opened and verified. Nothing goes on the site
  that can't be pointed at.
- **Conservative numbers.** "50+ GRAMMY Camps" — his real count is 53 and rising.
  "25 years" of teaching, counted from Labette in 2001, not 26. Other published
  bios say 60+ and 100+ camps; those are wrong.
- **Awards attributed precisely.** The Telly for *Learn & Master Guitar* belongs
  to Legacy Learning Systems. The Acoustic Guitar Player's Choice Gold Award is
  on the box.
- **No unlinked press claims.** If there's no findable article, it stays off.
- **Photo credits.** Tiffany L. shot the GRAMMY Camp photos and is credited in the
  captions. Permission granted verbally; watermarks were cropped.

## Verified facts — don't re-research these

- **MEIEA 2026**, Denver, March 19–21. *The Assessment Pivot: Using Generative AI
  to Restore Academic Integrity.* Published in the Summit Proceedings —
  `meiea.org/resources/Proceedings/2026/MEIEA%20Summit%202026%20Adam.pdf`
- **MEIEA 2023**, Las Vegas, 23 March. A paper on audio faculty teaching through
  COVID, plus a roundtable, *The Computers Took Over at Midnight*.
- **MEIEA 2010** — he has presented there for sixteen years.
- **Utility Analytics Summit**, Nashville, 9 April 2024, 4:15–5:30pm. *Keynote,*
  General Session 1: *AI in Music: Revolution or Replacement?*
- **NewsChannel 5**, 18 April 2023, reported by Hannah McDonald. He was the
  story's expert.
- **WPLN** *This Is Nashville*, 25 May 2023. Billed first among five guests.
- **AES is a publication, not a talk** — *AES Journal Conference Summary*, 2016.
  His Belmont bio implies he presented at AES. Nothing supports that.
- **Career timeline**: BBA 1999 and MBA 2000 (Pittsburg State) → Labette
  Community College, chair of commercial music, 2001–2003 → MTSU 2003–2010 →
  Belmont 2010–present. He did *not* move to Nashville in 2000.
- **Peter Pan** was the Mansion Theater production in Branson, Missouri.
  `youtube.com/watch?v=K1PBskGJVl0`
- **TEDxNashville board member**, and he produced multicam shoots for other
  people's talks.
- **GRAMMY Foundation curriculum author** — *GRAMMY Career Pathways* (2018) and
  *GRAMMY Camp: Weekends* (2016).

---

## CSS conventions

One stylesheet, four pages. A change to a token hits every page — check more than
one after editing.

Design tokens live on `:root`: `--ink`, `--ink-soft`, `--paper`, `--paper-2`,
`--line`, `--deep` (navy), `--accent` (rust), `--cta` (orange), `--sky`.

**Typography — Poppins, changed from Georgia on 24 Aug 2026.** Nathan asked for a
sans to match grahamcochrane.com. Headings and display type use
`var(--font-display)`; body uses `var(--font-body)`. Never hardcode a font family
— every one of the eleven old `Georgia,serif` declarations now points at a token,
so the whole site changes from one line.

This is the site's **only external dependency**, loaded from Google Fonts in all
four `<head>`s with `display=swap` and preconnects. The no-build-step rule still
holds. The fallback stack after Poppins is the system sans, deliberately — if
Google is unreachable the site degrades to a different sans, never back to a
serif, so nothing about the layout shifts. Removing the dependency means deleting
three `<link>` tags and dropping `"Poppins",` from one token.

Heading tracking is `-0.02em`, tighter than Georgia's `-0.01em`, because Poppins
is a wide geometric face and falls apart at display sizes without it.

Layout classes, in the order they were added:

| Class | Use |
|---|---|
| `.wrap` / `.wrap-wide` | Page gutters, 1060px max. Every left edge lines up. |
| `.pagehead` | Interior-page header, replaces the homepage hero |
| `.proof` | The horizontal stat bar |
| `figure.plate` | One photo with caption, inline in prose, 760px max |
| `.plate-pair` | Two photos side by side, stacks under 640px |
| `.credits li.with-shot` | Thumbnail beside a credit entry, stacks under 640px |
| `.band` | Big photo, uncropped, aligned to the text column. Used once, on `credits.html` |
| `.credit` | Photographer credit inside a caption |
| `.topics` | Two-column grid on the speaking page |

**Pair images must share an aspect ratio** or the columns run ragged. That's why
`early-guitar.jpg` and `console.jpg` are both square, and the Walnut House pair
are both 4:3.

**`.band` is no longer full-bleed** (changed 24 Aug 2026). It used to be `width:100%`
at a fixed 220–420px height with `object-fit:cover`, which on a wide monitor turned
`students-studio.jpg` (1600×1066, 3:2) into a ~4.6:1 letterbox — two thirds of the
height gone, heads cut off at both the top and the bottom of the frame. That photo
has faces at the very top *and* the very bottom, so no wide crop of it works. It now
shows the whole frame at `max-width:1008px`.

**1008px is not arbitrary**: it is the 1060px `.wrap` minus its two 26px gutters, so
the image's edges land exactly on the text column's edges. If the wrap width or
gutter ever changes, this number has to change with it.

### The padding-shorthand trap

`.pagehead` is always written `class="pagehead wrap"`. `.wrap` supplies the gutter as
`padding:0 26px`, and `.pagehead` used to say `padding:64px 0 44px` — same
specificity, later in the file, so its shorthand silently reset left/right to 0. The
header text on all three interior pages sat 26px left of every other left edge. Fixed
24 Aug 2026 by switching to `padding-top`/`padding-bottom` longhands.

**Any rule that also carries `.wrap` must use padding longhands.** A `padding`
shorthand will eat the gutter and break the alignment the whole site is built on.
Verified after the fix: eyebrow, h1, lede, proof bar, band image and credit headings
all report the same `getBoundingClientRect().left`.

### Responsive

Breakpoints at 820px (hero), 760px (nav), 700px (type and spacing), 640px (photo
pairs and credit rows), 560px, 420px.

**The nav is the thing to not break.** It was originally `display:none` under
760px, which left phones with no navigation at all.

It is now a **hamburger** below 760px (added 24 Aug 2026, to match
grahamcochrane.com), and the header stops being sticky on small screens. The
collapse is deliberately gated on `.js-nav`, a class `js/nav.js` puts on `<html>`:

- Script runs → `.js-nav` exists → nav collapses behind the button.
- Script fails or is blocked → no `.js-nav` → the nav just stays visible and
  wraps, exactly as before.

**Never write the collapsed state as an unconditional `display:none`.** That is
the original bug, and the gate is what stops it recurring. Verified at 390px:
button toggles, `aria-expanded` flips, icon morphs to an X, all four links reachable.

`nav.js` also closes the menu when a link is tapped, so the `#join` anchor doesn't
scroll away underneath an open menu.

Images use `srcset`/`sizes` with `-sm` variants at 700px wide, generated with
Pillow at quality 80. Phone page weight is roughly half desktop. Skip the variant
when the full file is already under ~780px — pointless bytes.

---

## Open items

**Design direction — decided and built, 23 Aug 2026.** Nathan asked to restyle
toward grahamcochrane.com. He chose the middle path over a full clone.

Built:

- Dark navy top bar on the homepage only (`.topbar--dark`)
- Full-bleed navy hero, portrait bottom-aligned and mask-faded to fake a cutout
- One loud orange CTA, `#ef8c1f` with near-black text → the newsletter anchor
- A typographic "Featured in and on stage at" strip (`.logostrip`)

Deliberately **not** built, and the reasoning still holds if it comes up again:
testimonial cards and the three-card offer grid. Those are sales-funnel furniture
that implies products for sale. The professor position is the asset; don't dress
it as a coaching launch.

All new CSS is appended at the end of `site.css` under its own banner and scoped
to `.topbar--dark` / `.herowrap` / `.logostrip`, so interior pages are untouched.
The `--cta`, `--cta-hover` and `--sky` tokens are new on `:root`.

Two constraints not to undo:

1. **The CTA button uses dark text (`#1b1206`), not white.** White on that orange
   is ~2.9:1 and fails contrast. This was checked.
2. **The hero bleed reverts below 820px.** A bottom-aligned photo in a stacked
   single column leaves a gap, and the mask is turned off there.

**The specificity trap in `.herowrap` — read before touching the hero.** The base
stacking rule is plain `.hero-grid` (specificity 0,1,0) inside `@media(max-width:820px)`.
Every homepage override is `.herowrap .hero-grid` (0,2,0), which **wins regardless of
the media query**. The first version of this restyle set the desktop two-column grid
without restating `grid-template-columns:1fr` in the mobile block, so phones kept a
two-column hero: the headline broke to five words-per-line and the portrait was
crushed into a side column. Shipped live before it was caught. Every `.herowrap`
override needs its mobile counterpart restated explicitly.

The phone hero is a centred stack, matching the reference: headline, lede capped at
`34ch`, full-width CTA, then the portrait whole at `min(100%,300px)`.

**The credential line moved under the portrait** (24 Aug 2026). It used to be an
`.eyebrow` above the headline — "DR. NATHAN ADAM · ASSOCIATE PROFESSOR OF MEDIA
PRODUCTION, BELMONT UNIVERSITY" — which meant the first thing a visitor read was
Nathan's job title. It is now `.herocred`, sitting beneath the photo in both
layouts, so the headline leads. Nathan asked for this explicitly; don't move it back.

The portrait also stopped bleeding off the bottom edge, because the credit line now
occupies that space. The bottom mask is gone with it — it never worked well anyway,
since `portrait.jpg` has a white TEDx backdrop that faded to white, not to navy.

**Homepage copy is visitor-first, not bio-first.** Rewritten 24 Aug 2026 on the same
instruction. The headline addresses the reader's fear ("It's not too late to reinvent
your career with AI"), and the lede names who the site is for before it says anything
about Nathan. The old lede opened "I spent 25 years…". If the copy gets revised, keep
the second person in the headline — that is the whole point of the change.

**Mobile hero crop — fixed 24 Aug 2026, don't reintroduce.** The base `.hero-shot`
rule forces `aspect-ratio:3/2` below 820px. `portrait.jpg` is 1000×1249 (4:5), so
`object-fit:cover` discarded about 47% of its height and cut the top of his head
off on every phone. This was live for a while. The `.herowrap` override now sets
`aspect-ratio:auto` with `object-fit:contain` and caps the box at 300px wide, so
the photo is shown whole and centred. **Any new photo dropped into the hero must
be checked on a phone** — a fixed aspect-ratio plus `cover` will silently crop
whatever you give it.

The strip is text wordmarks, not logo files — no trademark assets, and every name
is a verified appearance. Adding a name means adding a source.

**Newsletter CTA now carries the homepage.** The hero button points at `#join`,
which makes open item 4 below more urgent than it was — the primary call to
action currently lands on a form that saves nothing.

**`TODO (Nathan)` markers in the HTML** — search for that string:

1. `credits.html` — the Telly conflict. He says Legacy Learning holds it; his 2023
   CV claims it personally under Industry Qualifications. The CV and the site
   disagree and one is wrong.
2. `credits.html` — LANDR course title. Live page says *Getting Started with Pro
   Tools*; his CV says *Producing Electronic Music in Pro Tools*. Possibly two
   courses.
3. `speaking.html` — the *Nashville Ledger* mention is in his Belmont bio, absent
   from his CV, and no article was findable. Off the site until it has a link.
4. `index.html` — newsletter form posts to `action="#"`. Needs the beehiiv
   endpoint. The JS handler is a placeholder that saves nothing.
5. `index.html` — YouTube link held back until episode 1. The handle
   `@nathaneadam` was **not** claimed as of August 2026; an unrelated account sits
   at `@nathanadam1156`.

**Not on the site, but Nathan should fix at the source:**

- **His Belmont faculty page** is what other bios copy from. It says "over 60
  GRAMMY Camps", implies an AES presentation, and cites the *Nashville Ledger*.
- **The bio he sends conferences** says "over 100 GRAMMY Camps" and *Assistant*
  Professor. That's where the inflated number came from.
- **A Resolve title card** reads "The **Asessment** Pivot" — one S short. Kept off
  the site until fixed.
- **His DreamHost SFTP password sits in plaintext** in the file-manager URL.
  Should be rotated, especially with recording-in-public planned.
- **GitHub attribution.** `nathaneadam@gmail.com` is verified on
  `nathaneadam-del`, so commits credit that account even though the nicer username
  `nathaneadam` (created 2023) also exists. He chose to defer this. Fixing it
  means moving the email between accounts.

## Still missing photography

No images for: the dissertation, the AES Journal piece, *Live from Virtual
Reality*. Those entries stand on text, which is fine.
