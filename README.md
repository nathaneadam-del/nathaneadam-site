# nathaneadam.com

Static site. Four pages, one stylesheet, one small script, no build step.
Edit a file, commit, push — Vercel deploys within about a minute.

```
index.html        Homepage
about.html        The long story
credits.html      Production, engineering, publishing, curriculum, teaching
speaking.html     TEDx talk, topics, talk history, press, booking
css/site.css      Every style for every page
js/nav.js         Mobile menu toggle — the only script on the site
images/           Photos — see images/README.md
CLAUDE.md         Full project context, decisions, and open items
```

The one thing loaded from outside is the Poppins webfont, from Google Fonts.
If Google is ever unreachable the pages fall back to the system sans and the
layout is unaffected.

## How to change something

Open the file, edit it, save. In GitHub Desktop: write a short summary, click
**Commit to main**, then **Push origin**. That's the whole workflow.

There's no framework here on purpose. Any text editor works. Nothing to install,
nothing to keep updated, nothing that breaks in eighteen months when a dependency
goes stale.

## Four things that are easy to get wrong

**One stylesheet, four pages.** `css/site.css` is shared. Changing a colour or a
base style hits every page at once — that's the point, but check more than one
page afterwards.

**Photo pairs need matching shapes.** Two images side by side (`.plate-pair`) run
ragged if one is portrait and the other landscape. Crop both to the same aspect
ratio first.

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

- **Repo** — `github.com/nathaneadam-del/nathaneadam-site`
- **Host** — Vercel, deploys automatically from `main`
- **Domain** — DNS stays at DreamHost; only the apex `A` record and `www` CNAME
  point at Vercel, so the Google Workspace email records are never touched

## The editorial rules this site follows

Written down because they were expensive to work out.

- Every claim traces to a source. The talk list comes from the 2023 tenure and
  promotion CV; press links were opened and checked.
- Conservative numbers. "50+ GRAMMY Camps" (real count 53), "25 years" of teaching
  from 2001. Bios elsewhere say 60+ and 100+ — those are wrong and should be
  corrected at the source.
- Awards attributed precisely. The Telly for *Learn & Master Guitar* belongs to
  Legacy Learning Systems.
- No unlinked press claims.
- Photographers credited by name.

Open questions are marked `TODO (Nathan)` in the HTML. `CLAUDE.md` has the full
list plus what's worth fixing on the Belmont faculty page and in the bio sent to
conferences.
