# nathaneadam.com

Static site. One stylesheet, one small script, no build step.
Edit a file, commit, push — Vercel deploys within about a minute.

```
index.html        Homepage
about.html        The long story
credits.html      Production, engineering, publishing, curriculum, teaching
speaking.html     TEDx talk, topics, talk history, press, booking
projects.html     Card index of the project write-ups
404.html          Branded not-found page
projects/         Fourteen write-ups, one per substantive credit. These sit one
                  folder down, so their links use ../
css/site.css      Every style for every page
js/nav.js         Mobile menu toggle — the only script on the site
images/           Photos — see images/README.md
press-archive/    Local copies of articles the site links to. Private, never
                  published — see its README
CLAUDE.md         Full project context, decisions, and open items
```

Loaded from outside: the Poppins webfont from Google Fonts, and the video
embeds on the TEDx project page. If Google is ever unreachable the pages fall
back to the system sans and the layout is unaffected.

## How to change something

Open the file, edit it, save. In GitHub Desktop: write a short summary, click
**Commit to main**, then **Push origin**. That's the whole workflow.

There's no framework here on purpose. Any text editor works. Nothing to install,
nothing to keep updated, nothing that breaks in eighteen months when a dependency
goes stale.

## Five things that are easy to get wrong

**One stylesheet, every page.** `css/site.css` is shared. Changing a colour or a
base style hits every page at once — that's the point, but check more than one
page afterwards.

**Pages in `projects/` need `../` in their links.** They're one folder down, so
their stylesheet, script and nav links start `../`. Copying a top-level page as a
starting point and forgetting to fix those gives an unstyled page with dead
navigation — it looks badly broken, and the cause isn't obvious.

**Photo pairs need matching shapes.** Two images side by side (`.plate-pair`) run
ragged if one is portrait and the other landscape. Crop both to the same aspect
ratio first, or give the odd one out its own `figure.plate`. There's a script in
`images/README.md` that checks every pair on the site in one go — worth running
after adding photos, since a ragged pair isn't always obvious on a wide screen.

**The mobile nav.** Below 760px it collapses behind a hamburger button, run by
`js/nav.js`. It used to be hidden with nothing in its place, which left phones
with no navigation at all — so the collapsed state only applies once the script
has run. If the script fails the menu simply stays visible. Don't rewrite that as
a plain `display:none`.

**Always look at a phone.** Every layout bug this site has shipped was a
small-screen bug that looked fine on a laptop: a portrait cropped through the
subject's forehead, a hero that never stacked, a group photo squeezed into a
letterbox. Resize the browser to about 390px wide before you commit.

## Where everything lives

- **Repo** — `github.com/nathaneadam/nathaneadam-site` (moved here 26 Aug 2026
  from the `nathaneadam-del` account)
- **Host** — Vercel, deploys automatically from `main`
- **Domain** — DNS stays at DreamHost; only the apex `A` record and `www` CNAME
  point at Vercel, so the Google Workspace email records are never touched

**If a push doesn't show up on the live site**, check Vercel → Settings → Git
before looking at anything in the code. Moving the repo between GitHub accounts
broke the deploy webhook once, and it broke *silently* — pushes succeeded,
nothing errored, and the Deployments list simply stopped growing. The giveaway is
a stale site with **no failed build**: a build that fails leaves a red entry, so
an empty list means Vercel never heard about the push. CLAUDE.md has the full
diagnosis and the fix that actually worked.

## The editorial rules this site follows

Written down because they were expensive to work out.

- Every claim traces to a source. The talk list comes from the 2023 tenure and
  promotion CV; press links were opened and checked.
- Conservative numbers. "50+ GRAMMY Camps" (real count 53), "25 years" of teaching
  from 2001. Bios elsewhere say 60+ and 100+ — those are wrong and should be
  corrected at the source.
- Awards attributed precisely — **both halves**. The Telly for *Learn & Master
  Guitar* was for educational video production. Nathan produced the entire
  series; Legacy Learning Systems submitted the entry and therefore holds the
  award. State both. Either one alone misleads, and an earlier version of this
  file gave only Legacy's half, which undersold him.
- No unlinked press claims. Every press source on the site now carries an
  "Archived copy" link as well as a live one.
- Photographers credited by name.
- Never invent a plausible-sounding detail. Two got caught on 31 Aug that
  nobody had ever checked: a "mortgage" (his house is paid off) and "three
  decades" of teaching (it is 25 years, and the site's own proof bar said so).

Open questions are marked `TODO (Nathan)` in the HTML. `CLAUDE.md` has the full
list plus what's worth fixing on the Belmont faculty page and in the bio sent to
conferences.

## Writing anything in Nathan's voice

There is a saved skill called **`my-writing-style`**, built from the
*Multi-Platinum Pro Tools* manuscript and four years of his sent email. Load it
before drafting copy, a newsletter issue, a post or an email.

**Do not use this site's copy as a style reference.** Much of it was AI-drafted
before the 31 Aug voice pass, and even the rewritten copy is downstream of the
profile rather than a source for it. The book and his email are the sources.
