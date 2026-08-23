# nathaneadam.com

Static site. Four HTML pages, one stylesheet, no build step, no dependencies.
Edit a file, commit, push — Vercel deploys automatically.

```
index.html        Homepage
about.html        The long story
credits.html      Production, engineering, publishing, teaching
speaking.html     TEDx embed, topics, talk history, press, booking
css/site.css      Every style for every page
images/           Photo slots — see images/README.md
```

## How to change something

Open the file, edit it, save. In GitHub Desktop: write a short summary, click
**Commit to main**, then **Push origin**. Vercel builds within a minute.

There is no framework here on purpose. Any text editor works. Nothing to install,
nothing to keep updated, nothing that breaks in eighteen months when a dependency
goes stale.

## Two things that are easy to get wrong

**One stylesheet, four pages.** `css/site.css` is shared. A change to a color token or
a base style hits every page at once — which is the point, but check more than one page
after editing it.

**The photo placeholders are load-bearing.** Each `<img>` sits on top of a dashed
placeholder describing the photo that belongs there. The image uses
`onerror="this.remove()"`, so a missing file reveals the placeholder instead of a broken
icon. Don't delete the `.ph` divs to "clean up" — they're how you and I both remember
what's still missing.

## Editorial rules this site follows

Written down because they were expensive to work out:

- **Every claim traces to a source.** The talk list comes from the 2023 tenure &
  promotion CV. Press links were verified live. Nothing goes on the site that can't be
  pointed at.
- **Conservative numbers.** "50+ GRAMMY Camps" not 60, because the real count is 53 and
  climbing. "25 years" of teaching, counted from Labette in 2001. Published bios
  elsewhere say 60+ and 100+; those are wrong and should be corrected at the source.
- **Awards are attributed precisely.** The Telly for *Learn & Master Guitar* belongs to
  Legacy Learning Systems, not to Nathan personally. (The 2023 CV says otherwise under
  Industry Qualifications — that conflict is unresolved.)
- **No unlinked press claims.** The *Nashville Ledger* mention is in the Belmont bio but
  has no findable article, so it's off the site until it has a link.

Open TODOs are marked `TODO (Nathan)` in the HTML. Search for that string.

## Known inconsistencies elsewhere

The Belmont faculty page is the upstream source most other bios copy from, and it
currently says "over 60 GRAMMY Camps", implies a presentation at AES (it was a 2016
*Journal* publication, not a talk), and cites the *Nashville Ledger*. Worth one email to
whoever maintains it.

## Deployment

GitHub → Vercel, automatic on push to `main`.

DNS stays at DreamHost. Only the apex `A` record and the `www` CNAME point at Vercel —
nameservers are deliberately **not** delegated, because the Google Workspace `MX` record
lives in the DreamHost zone and moving it risks the email.
