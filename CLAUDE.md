# CLAUDE.md — context for working on nathaneadam.com

Read this before changing anything. It records decisions that were expensive to
reach, facts that were verified against primary sources, and a few traps in the
local setup.

Last updated: 23 August 2026.

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
`--line`, `--deep` (navy), `--accent` (rust). Georgia for headings, system sans
for body.

Layout classes, in the order they were added:

| Class | Use |
|---|---|
| `.wrap` / `.wrap-wide` | Page gutters, 1060px max. Every left edge lines up. |
| `.pagehead` | Interior-page header, replaces the homepage hero |
| `.proof` | The horizontal stat bar |
| `figure.plate` | One photo with caption, inline in prose, 760px max |
| `.plate-pair` | Two photos side by side, stacks under 640px |
| `.credits li.with-shot` | Thumbnail beside a credit entry, stacks under 640px |
| `.band` | Full-width photo strip; `object-position: center 28%` so faces aren't cropped |
| `.credit` | Photographer credit inside a caption |
| `.topics` | Two-column grid on the speaking page |

**Pair images must share an aspect ratio** or the columns run ragged. That's why
`early-guitar.jpg` and `console.jpg` are both square, and the Walnut House pair
are both 4:3.

**Only use `.band` for images at least ~1400px wide.** A 720px source stretched
full-bleed looks like mush. The GRAMMY speaking shot is a `.plate` for this reason.

### Responsive

Breakpoints at 820px (hero), 760px (nav), 700px (type and spacing), 640px (photo
pairs and credit rows), 560px, 420px.

**The nav is the thing to not break.** It was originally `display:none` under
760px, which left phones with no navigation at all. It now wraps under the brand
and the header stops being sticky on small screens. Don't reintroduce a hidden nav
without a working replacement.

Images use `srcset`/`sizes` with `-sm` variants at 700px wide, generated with
Pillow at quality 80. Phone page weight is roughly half desktop. Skip the variant
when the full file is already under ~780px — pointless bytes.

---

## Open items

**Design direction — unanswered.** On 23 Aug Nathan asked to restyle the site to
look "a lot more like" grahamcochrane.com: a dark hero with a large cutout
portrait, an orange CTA button, a "Featured In" logo strip, testimonial cards, and
a three-card offer grid. That request was never answered and no work was done on
it. It is a real decision, not a small styling job — that template is built to
sell coaching packages, and the current site's restraint is doing deliberate work
for a "calm, credentialed professor" position. Worth talking through before
building. A middle path exists: borrow the "Featured In" strip (TEDx, NewsChannel
5, WPLN, GRAMMY, MEIEA are all real and earned) and a stronger single CTA, without
the sales-funnel furniture.

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
