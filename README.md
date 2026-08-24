# nathaneadam.com

Static site. Four pages, one stylesheet, no build step, no dependencies.
Edit a file, commit, push — Vercel deploys within about a minute.

```
index.html        Homepage
about.html        The long story
credits.html      Production, engineering, publishing, curriculum, teaching
speaking.html     TEDx talk, topics, talk history, press, booking
css/site.css      Every style for every page
images/           Photos — see images/README.md
CLAUDE.md         Full project context, decisions, and open items
```

## How to change something

Open the file, edit it, save. In GitHub Desktop: write a short summary, click
**Commit to main**, then **Push origin**. That's the whole workflow.

There's no framework here on purpose. Any text editor works. Nothing to install,
nothing to keep updated, nothing that breaks in eighteen months when a dependency
goes stale.

## Three things that are easy to get wrong

**One stylesheet, four pages.** `css/site.css` is shared. Changing a colour or a
base style hits every page at once — that's the point, but check more than one
page afterwards.

**Photo pairs need matching shapes.** Two images side by side (`.plate-pair`) run
ragged if one is portrait and the other landscape. Crop both to the same aspect
ratio first.

**The mobile nav.** It wraps under your name on narrow screens rather than hiding.
It used to be hidden entirely, which meant phones had no navigation at all. Don't
let that come back.

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
