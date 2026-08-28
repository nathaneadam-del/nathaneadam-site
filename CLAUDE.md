# CLAUDE.md — context for working on nathaneadam.com

Read this before changing anything. It records decisions that were expensive to
reach, facts that were verified against primary sources, and a few traps in the
local setup.

Last updated: 27 August 2026 (projects section — four write-ups, embedded TEDx
talk grid, card index; a twenty-image photo batch placed across the site;
Wayback archive links; the repo move that silently broke Vercel and how it was
actually fixed).

---

## What this is

A four-page static site. No framework, no build step. Plain HTML, one stylesheet,
and one small script for the mobile menu. That is deliberate: Nathan publishes
weekly and should never be blocked by a toolchain that rotted.

The Poppins webfont (Google Fonts) and the TED embed are the only outside
fetches; see the file list below. Everything else is local.

```
index.html        Homepage — positioning, proof bar, story, newsletter signup
about.html        The long story, 1999 to now
credits.html      Production, engineering, publishing, curriculum, teaching
speaking.html     TEDx embed, topics, talk history, press, booking
projects.html     Index of the long-form project write-ups
404.html          Branded not-found page. Vercel serves it automatically.
projects/         One page per project. Same template as the top-level pages
                  but with ../ asset paths — see CSS conventions below.
  cost-of-valor.html
  tedx-nashville.html      ~30 embedded talks in a grid
  grammy-camp.html
  ma-media-entertainment.html
css/site.css      Every style for every page
js/nav.js         Mobile menu toggle — the only script, loaded on every page
sitemap.xml       Eight URLs, hand-maintained. New page means a new entry here.
robots.txt        Allows everything, points at the sitemap
images/           See images/README.md
press-archive/    Local text captures of articles the site links to. Gitignored
                  and never published — third-party copyright. See its README.
```

**Pages in `projects/` are one directory down**, so their `<link>`, `<script>`
and nav hrefs use `../`. Copying a top-level page as a starting point without
fixing those gives an unstyled page with dead navigation. The `404.html`
root-relative convention is a separate case — see **CSS conventions**.

**The only external things the browser fetches** are the Poppins webfont from
Google Fonts (every page), the TED embed on `speaking.html`, and — added
27 Aug 2026 — roughly thirty video embeds on `projects/tedx-nashville.html`
(29 YouTube, 3 TED). The `og:image` files are local. Nothing else phones home —
no analytics, no tag manager, no CDN scripts.

**The video embeds are the one place that policy bends, deliberately.** Two
things keep them from costing what they normally would:

- `youtube-nocookie.com`, not `youtube.com`, so nothing is set until a visitor
  actually presses play.
- `loading="lazy"` on every frame. Thirty eager iframes would fire thirty
  third-party requests before first paint. Removing it would be the single
  worst thing anyone could do to that page's load time.

If a privacy or performance review ever wants them gone, the replacement is a
click-to-load facade: a local thumbnail that swaps itself for the iframe. That
costs 30 more image files and some JS, which is why it wasn't done first.

## Deployment

| | |
|---|---|
| Source of truth | `~/Library/CloudStorage/Dropbox/nathaneadam-site` |
| GitHub | `github.com/nathaneadam/nathaneadam-site` (public) — **moved 26 Aug 2026** from `nathaneadam-del` |
| Host | Vercel, project `nathaneadam-site`, team slug `nathan-ea-dam` |
| Deploys | Automatically on push to `main`. ~1 minute. |
| Preview URL | `nathaneadam-site.vercel.app` |
| Live | `nathaneadam.com` → 308 → `www.nathaneadam.com` |

**Nathan pushes, not Claude.** Auth lives in his macOS keychain via GitHub
Desktop. Claude can commit locally; the push is his click.

### The repo move broke Vercel — 27 Aug 2026

The repo was moved from the `nathaneadam-del` account to `nathaneadam`. GitHub
redirects the old URL, so **git kept working and hid the problem**: pushes
succeeded, `git ls-remote` against either URL returned the same commits, and
nothing in the terminal suggested anything was wrong.

Vercel broke silently. Its project was still linked to
`nathaneadam-del/nathaneadam-site`, and Settings → Git showed
**"Error: Project Link not found."** The webhook stopped firing, so pushes
produced **no deployment at all** — not a failed one. The Deployments list
simply stopped at `7e2a099` (24 Aug) while three later commits sat on `main`.

**How to recognise this again.** The tell is a stale live site with *no*
corresponding failed build. If a deploy had broken, there would be a red entry
in Deployments. An empty list past a certain date means Vercel never heard about
the push at all — look at Settings → Git before debugging anything in the code.
Checking production against the `nathaneadam-site.vercel.app` preview is the
fast confirmation: if both serve identical stale content, it is not DNS, not
caching and not the domain.

**What actually fixed it — and what didn't.** Two separate faults were stacked,
which is why the first two attempts failed.

1. **GitHub side.** The Vercel GitHub App *was* installed on `nathaneadam`, but
   its Repository access was **"Only select repositories"** with just
   `showrunner-review` ticked. Vercel could not see `nathaneadam-site` at all.
   The trap: that option's fine print says *"Also includes public repositories
   (read-only)"*, and this repo **is** public — so it looks like it should be
   covered. Read-only is not enough. Vercel needs write access to register the
   deploy webhook. Fixed at `github.com/settings/installations` by switching to
   **All repositories**.

2. **Vercel side. `Reconnect` did not work.** It cleared the red error and
   displayed the right repo, but the card still read *"Connected Aug 23"* — it
   had restored a stale link record without registering a webhook. Pushes still
   produced nothing. What worked was **Disconnect, then connect fresh**:
   Settings → Git → Disconnect → GitHub → pick `nathaneadam/nathaneadam-site`.
   Deployment history, domains and DNS all survive; only the Git link is rebuilt.

**Connecting the repo does not deploy anything.** Vercel waits for the next
push. After reconnecting, the site stayed stale until a new commit went up —
which looks exactly like the connection still being broken. Make a commit and
push it before concluding anything is wrong.

Both steps are account-permission changes, so they are Nathan's clicks, like the
push.

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

### Zone as actually observed, 24 Aug 2026

Queried against public resolvers rather than read off the DreamHost panel, so
this is what the world sees:

| Record | Value | Verdict |
|---|---|---|
| NS | `ns1/2/3.dreamhost.com` | As intended — not delegated to Vercel |
| A (apex) | `216.198.79.1` | Matches |
| `www` CNAME | `05b8bf420d1ec53b.vercel-dns-017.com` | Matches |
| MX | `0 aspmx.l.google.com` | **Mail survived the migration** |
| `mail` CNAME | `ghs.googlehosted.com` | Present |
| `calendar`, `docs`, `sites`, `start` | NXDOMAIN | **Gone.** Vanity redirects only; low impact, but the zone lost them |
| SPF (TXT at apex) | none | **Missing** |
| DKIM (`google._domainkey`) | none | **Missing** |
| DMARC (`_dmarc`) | none | **Missing** |

**The good news: `nathan@nathaneadam.com` receives mail.** The MX points at
Google Workspace and `aspmx.l.google.com` resolves. The thing most at risk during
the Vercel move came through. That said, it's a *lone* MX at priority 0 — Google's
own setup is either five records or the modern single `smtp.google.com` at
priority 1. One record works but has no failover.

**The bad news: the domain cannot authenticate outbound mail.** No SPF, no DKIM,
no DMARC. Since February 2024 Gmail and Yahoo require all three from bulk senders,
and even one-to-one mail from an unauthenticated domain gets filtered hard. This
matters right now for two reasons: the speaking page's booking CTA sends replies
from this address, and the whole launch plan is a weekly newsletter. **Sending a
newsletter from this domain as it stands is the most likely single cause of it
landing in spam.** Fixing it is three DNS records at DreamHost plus turning DKIM
on in the Workspace admin console — no code, and unrelated to Vercel.

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

## Findability and sharing — added 24 Aug 2026

A visitor-perspective review found that the design was finished but the plumbing
around it wasn't. Four things were fixed. Each is easy to undo by accident.

**`og:image` — the site had none.** All four pages declared
`twitter:card = summary_large_image` and supplied no image, so every link shared
to LinkedIn, X, Slack or iMessage rendered as a grey box. Two 1200×630 cards now
live in `images/` (see `images/README.md`). **The URL must be absolute.** A
relative path is silently ignored by every platform, which is how this went
unnoticed. Any new page needs the `og:image`, `og:image:width`, `og:image:height`
and `twitter:image` block copied across.

**Zero layout shift, and it must stay zero.** No `<img>` had `width`/`height`
attributes, so nothing reserved space and pages grew as images loaded — the
homepage by 507px, credits by 279, speaking by 225. Text slid out from under the
reader mid-scroll. All 24 images now carry their intrinsic dimensions and every
page measures **0px**. This is the easiest thing on the site to regress: one
`<img>` added without the attributes brings it back. The check:

```js
// with the page loaded
const before = document.body.scrollHeight;
[...document.images].forEach(i => i.loading = 'eager');
// wait ~1s, then
document.body.scrollHeight - before;   // must be 0
```

**Structured data.** `index.html` carries a JSON-LD `Person` block. Most of this
site's traffic will be people searching Nathan's name, and this is what Google
reads to build a knowledge panel. **The editorial rules below apply to it as much
as to visible copy** — every field traces to a source. Deliberately absent: the
doctorate's institution (not documented anywhere pointable) and any camp or
student count (those belong in prose, where they can be qualified). Don't put a
claim in the schema that isn't already on the page.

**External links open in a new tab.** All 15 of them (`target="_blank"
rel="noopener"`). They used to navigate away in the same tab, which meant a
visitor reading the proof section clicked one press link and the visit ended.
Internal links and `mailto:` are deliberately left alone.

**A note on the press links.** The Jamie Dunham interview, linked twice from
`speaking.html`, describes Nathan as an *assistant* professor with *"more than
100 Grammy camps"* — both of the numbers the editorial rules below exist to
correct. Nothing to fix in the markup; it needs fixing at the source. Same for
the Belmont faculty page. Worth re-reading a press link before adding it.

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
  people's talks. The full list of talks he produced and edited is on
  `projects/tedx-nashville.html` — 34 speakers, 32 with verified links.
- **GRAMMY Foundation curriculum author** — *GRAMMY Career Pathways* (2018) and
  *GRAMMY Camp: Weekends* (2016).
- **The TEDx talk was 13 November 2017.** "Society of Fellows" and "Salon" are
  **both correct and not a contradiction** — confirmed by Nathan. The Society of
  Fellows was the event; "Salon" was TEDxNashville's name at the time for the
  smaller event format. The 2017 Belmont News piece uses the former, the site
  uses the latter. Don't try to reconcile these again.
- **His titles have changed, and old ones are not errors.** Assistant Professor
  of Audio Engineering Technology (2017, per Belmont News) → Professor of
  Emerging Media (2023, per WPLN) → Associate Professor of Media Production
  (current, used on the site). All three were accurate when published. This is
  separate from the genuinely wrong titles in circulation — see the editorial
  rules above; the problem ones are *"assistant professor of cinema, television
  and emerging media"* (Jamie Dunham) and the Belmont faculty page's claims.
- **GRAMMY Camp Weekends 2017** ran in San Antonio, San Diego and Los Angeles,
  with Best Buy Teen Tech Centers and the Boys and Girls Club, 80+ students
  across three tracks. Source: the 2017 Belmont News piece. Not yet on the site.

---

## CSS conventions

One stylesheet, ten pages: six at the top level (`index`, `about`, `credits`,
`speaking`, `projects`, `404`) and four in `projects/`. A change to a token hits
every one of them — check more than one after editing, and check a project page
as well as a top-level page, since those resolve their assets differently.

**`404.html` links with root-relative paths** (`/css/site.css`, `/js/nav.js`,
`/about.html`) while the other four use relative ones. That's deliberate and must
stay: the 404 renders at whatever path the visitor typed, so a visitor landing on
`/projects/old/thing` would resolve `css/site.css` against `/projects/old/` and
get an unstyled page. The old DreamHost site had a `projects/` folder, so this is
a real path people will hit.

Design tokens live on `:root`: `--ink`, `--ink-soft`, `--paper`, `--paper-2`,
`--line`, `--deep` (navy), `--accent` (rust), `--cta` (orange), `--sky`.

**Typography — Poppins, changed from Georgia on 24 Aug 2026.** Nathan asked for a
sans to match grahamcochrane.com. Headings and display type use
`var(--font-display)`; body uses `var(--font-body)`. Never hardcode a font family
— every one of the eleven old `Georgia,serif` declarations now points at a token,
so the whole site changes from one line.

It is loaded from Google Fonts in all **five** `<head>`s with `display=swap` and
preconnects. The no-build-step rule still holds. The fallback stack after Poppins
is the system sans, deliberately — if Google is unreachable the site degrades to
a different sans, never back to a serif, so nothing about the layout shifts.
Removing the dependency means deleting three `<link>` tags per page and dropping
`"Poppins",` from one token.

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
| `.topbar--dark` | Navy header. Homepage only |
| `.navtoggle` | Hamburger button. Hidden above 760px |
| `.herowrap` | Full-width navy band around the homepage hero |
| `.hero-figure` | Portrait plus the credential line beneath it |
| `.herocred` | Name and title under the portrait |
| `.logostrip` | "Featured in and on stage at" wordmarks |
| `.btn-cta` | The single orange call to action |
| `.notfound-links` | The page list on `404.html`. Used nowhere else. |
| `.videogrid` | Grid of embedded talks. Each cell reuses `.video`, which fixes 16:9 — that is what keeps layout shift at zero with ~30 iframes. Never swap it for a fixed height. |
| `.projectgrid` / `.projectcard` | Card grid on `projects.html`. Thumbnails crop to 3:2 with `object-fit:cover`, so unlike `.band` a wide crop here is intended — but pick images without faces at the frame edges. |

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

Built, over 23–24 Aug:

- Dark navy top bar on the homepage only (`.topbar--dark`)
- Full-width navy hero band (`.herowrap`), portrait right on desktop and centred
  on phones. The portrait originally bled off the bottom edge behind a mask; that
  was dropped on 24 Aug when the credential line moved underneath it.
- One loud orange CTA, `#ef8c1f` with near-black text → the newsletter anchor
- A typographic "Featured in and on stage at" strip (`.logostrip`)
- Poppins throughout, replacing Georgia
- A hamburger menu below 760px (`js/nav.js`)
- Visitor-first hero copy, with the name and title under the photo

Deliberately **not** built, and the reasoning still holds if it comes up again:
testimonial cards and the three-card offer grid. Those are sales-funnel furniture
that implies products for sale. The professor position is the asset; don't dress
it as a coaching launch.

All new CSS is appended at the end of `site.css` under its own banner and scoped
to `.topbar--dark` / `.herowrap` / `.logostrip`, so interior pages are untouched.
The exceptions are deliberate and shared: the font tokens, the `.pagehead` gutter
fix and the hamburger, all of which apply site-wide.
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

**The newsletter form is the last thing standing between this site and a
launch.** The hero button, the nav link and the whole bottom section all funnel
to `#join`, and that form still posts to `action="#"`. Worse than saving nothing:
submitting it returns *"Preview mode — the form is not connected yet. Your
address was not saved."* — on the live site, to a real visitor who just acted on
the one thing the page asks for. Verified by submitting it against production on
24 Aug 2026. See open item 4 below; it needs the beehiiv endpoint from Nathan and
nothing else. Everything else found in that review has been fixed.

**The projects section — built 27 Aug 2026.** Four write-ups under `projects/`
plus a card index at `projects.html`, added to the nav and footer of all six
pages and to `sitemap.xml` (now nine URLs).

The reasoning, since it will come up again: Nathan asked whether he needed a
blog CMS for SEO. He doesn't. Static HTML is what Google prefers to crawl, the
publishing cadence is project-driven rather than daily, and a CMS would mean a
database and an admin panel on a site deliberately built with no build step. New
project means a new file from the same template — cheaper than maintaining a CMS.

One decision worth keeping: the TEDx page is a **single** page listing all 34
speakers, not 34 thin pages. Better internal linking, and it surfaces on searches
pairing Nathan's name with any of those speakers.

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
6. `projects/cost-of-valor.html` — the two trailers currently link to **LinkedIn
   posts on Gary Garrison's account**. Nathan plans to post the films to his own
   YouTube channel and brand. When that happens, swap the links: LinkedIn post
   URLs are fragile, tied to someone else's account, and the Wayback Machine
   handles them poorly. This is the single most at-risk link on the new pages.
7. **Three press URLs have no Wayback snapshot** and need submitting by hand at
   `web.archive.org/save` — the save endpoint is blocked from the Cowork
   sandbox, so this can't be automated from here. In priority order:
   NewsChannel 5 (unarchived, on a local TV CMS, and the proof bar leans on it),
   the MEIEA 2026 proceedings PDF, and the Belmont M.A. program page. A TODO in
   `speaking.html` marks where the NewsChannel 5 archive link goes. The other six
   sources are archived and already carry "Archived copy" links; the full table
   is in `press-archive/README.md`.
8. `projects.html` — the **Cost of Valor card uses `nc5-ai.jpg`**, which is a
   frame from the NewsChannel 5 story, not from the film. It's a stand-in because
   that project has no photography of its own. Replace it with a still from one
   of the trailers when they go up on Nathan's channel (see item 6). This is the
   only image on the site that doesn't depict what its caption implies, which is
   why it's flagged rather than left to be discovered.
9. `projects/grammy-camp.html` — the **2017 GRAMMY Camp Weekends** detail (San
   Antonio, San Diego, Los Angeles; Best Buy Teen Tech Centers and the Boys and
   Girls Club; 80+ students) is now used here and sourced to the 2017 Belmont
   News piece. If that page ever disappears, the archived copy is linked on the
   page and the full text is in `press-archive/belmont-news-tedx-2017.md`.

**Not on the site, but Nathan should fix at the source:**

- **His Belmont faculty page** is what other bios copy from. It says "over 60
  GRAMMY Camps", implies an AES presentation, and cites the *Nashville Ledger*.
- **The Jamie Dunham / Brand Wise interview**, which `speaking.html` links to
  twice as press, carries the worst version: *"assistant professor of cinema,
  television and emerging media"* and *"more than 100 Grammy camps."* Both wrong,
  both propagated from the conference bio. Worth asking her to correct it — the
  site's own proof section currently routes people to it.
- **Email authentication — the most urgent thing on this list.** Checked 24 Aug
  2026: inbound mail to `nathan@nathaneadam.com` works (the MX survived), but the
  domain has **no SPF, no DKIM and no DMARC**. See the zone table under
  **Deployment**. Nothing sent from this address is authenticated, which is a
  problem for the booking CTA and a serious one for a newsletter. Three DNS
  records plus a toggle in the Workspace admin console.
- **The bio he sends conferences** says "over 100 GRAMMY Camps" and *Assistant*
  Professor. That's where the inflated number came from.
- **A Resolve title card** reads "The **Asessment** Pivot" — one S short. Kept off
  the site until fixed.
- **His DreamHost SFTP password sits in plaintext** in the file-manager URL.
  Should be rotated, especially with recording-in-public planned.
- ~~**GitHub attribution.**~~ **Done, 26 Aug 2026.** The repo now lives at
  `github.com/nathaneadam/nathaneadam-site`. The side effect was breaking
  Vercel's Git link — see "The repo move broke Vercel" under **Deployment**.

## State as of 27 August 2026 — read this first in a new session

Where things actually stand, so the next session doesn't have to reconstruct it.

**Deployment is working again.** It was broken for most of 27 Aug — see "The repo
move broke Vercel" under **Deployment** for the full diagnosis. Both faults are
fixed. Pushes deploy normally.

**Live and verified:** all six top-level pages plus four project pages, the
Projects link in every nav and footer, nine sitemap URLs, and "Archived copy"
links on the six press sources that have Wayback snapshots.

**The photography is no longer thin.** Twenty images were added and placed on
27 Aug — see "Photography" below. Every `<img>` on every page carries width and
height, every `.plate-pair` was checked for matching aspect ratios, and the
declared dimensions were verified against the actual files. If you add images,
re-run those three checks; a ragged pair and a missing dimension both shipped
briefly during that batch and were caught by checking rather than by looking.

**The homepage story photo changed** on 27 Aug at Nathan's request — from
`teaching.jpg` to the Nate Bargatze shot. Worth knowing that the surrounding
copy argues "I taught people through the last technology shift," which the old
photo illustrated literally and the new one does not. `teaching.jpg` is still in
the folder if that ever wants reverting, and `vision-pro.jpg` (now on About)
would also carry that argument.

**Waiting on Nathan, in rough priority order:**

1. **Email authentication** — no SPF, no DKIM, no DMARC. Unchanged and still the
   most consequential item here, because the whole launch plan is a newsletter.
2. **The beehiiv endpoint** — `index.html` still posts to `action="#"` and tells
   real visitors their address wasn't saved. The last thing between this site and
   a launch.
3. **Three Wayback submissions** — NewsChannel 5 first; it's unarchived and the
   proof bar leans on it.
4. **The two bio corrections** — `BIO-CORRECTIONS.md` has the drafted emails.
5. **Cost of Valor trailers on his own channel**, which then fixes both the
   fragile LinkedIn links and the stand-in card image.

**Good next moves if he asks what's worth doing:** more project write-ups follow
the established template cheaply (Peter Pan, Multi-Platinum.com, and the two Pro
Tools books all have photography already). The GRAMMY Camp page is the model —
specific, sourced, and it uses detail that had been sitting unused in this file.

---

## Photography — status after the 27 Aug batch

Nathan supplied twenty images on 27 Aug. They were placed by what each actually
evidences rather than collected into a gallery; the full table of what went
where is in `images/README.md`.

**Gaps that closed:**

- ***Live from Virtual Reality*** had no image at all. It now has one, and it's
  the only picture of that credit in existence as far as this repo knows.
- **The COVID teaching** — the video-call grid shot is the work the dissertation
  studied. It earned its own section on the GRAMMY Camp page ("When it went
  online") rather than sitting as a caption, because the research is the reason
  that period matters.
- **Vince Gill** is named first on the credits roster and is now pictured
  directly beneath it.
- **Donald Miller** appears on the TEDx project page, where his talk is already
  embedded in the grid — the photo and the video reinforce each other.

**Still text-only, which is fine:** the AES Journal piece, and the dissertation
itself as a document (as opposed to the teaching it studied).

**Two frames deliberately unused**, held as alternates: `live-from-vr-2.jpg` and
`tedx-talk-close.jpg`.

**The one image that lies:** `nc5-ai.jpg` doubles as the Cost of Valor card on
`projects.html` and is a frame from the NewsChannel 5 story, not the film. See
open item 8 and the warning in `images/README.md`. Everything else on the site
depicts what it claims to.
