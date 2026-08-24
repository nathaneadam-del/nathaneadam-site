# images/

All four original placeholder slots are filled. The dashed-placeholder system
that used to live here has been removed — every `<img>` now points at a real file.

## What's here

**Portraits and teaching**

| File | Where | Notes |
|---|---|---|
| `portrait.jpg` | Homepage hero | 2023 TEDx Nashville headshot, 1000×1249 (4:5). Shown **whole** — see the hero warning below |
| `teaching.jpg` | Homepage | Teaching at a board in a darkened studio |
| `early-guitar.jpg` | About | Teenage Nathan with an electric guitar. Square. |
| `console.jpg` | About | Younger, at a large analog desk. Square, pairs with the above. |
| `grammy-camp.jpg` | About | Students around a console |
| `grammy-console.jpg` | About | Eight people at one desk. **Photo: Tiffany L.** |
| `grammy-camp-group.jpg` | Credits | Full GRAMMY Camp Nashville class |
| `grammy-speaking.jpg` | Speaking | With a mic at a GRAMMY Foundation backdrop. **Photo: Tiffany L.** |
| `students-studio.jpg` | Credits band | 1600×1066 (3:2). Shown whole — faces run from the very top of the frame to the very bottom |

**Work and credits**

| File | Where |
|---|---|
| `presleys.jpg` | Presleys' Country Jubilee broadcast still |
| `norville.jpg` | MSNBC "Singing or Synching?" segment |
| `learn-master.jpg` | Gibson's Learn & Master Guitar boxed set |
| `book-multi-platinum.jpg` | Multi-Platinum Pro Tools |
| `book-mixers-toolkit.jpg` | Pro Tools 9: The Mixer's Toolkit |
| `multi-platinum.jpg` | Multi-Platinum.com course library |
| `grammy-pathways.jpg` | GRAMMY Career Pathways dashboard |
| `landr-course.jpg` | LANDR course page |
| `peter-pan.jpg` | Cathy Rigby is Peter Pan playbill |
| `nc5-ai.jpg` | Frame from the NewsChannel 5 story |

**Speaking and venue**

| File | Where |
|---|---|
| `tedx-stage.jpg` | Onstage in the VR headset |
| `tedx-letters.jpg` | The red TEDx letters |
| `walnut-house.jpg`, `walnut-house-2.jpg` | The Walnut House, both 4:3 |

**Social cards** — these two are never shown on the site. They exist only for
`og:image`, and they are the first thing anyone sees when the site is shared.

| File | Where |
|---|---|
| `og-card.jpg` | Homepage. Carries the hero headline. |
| `og-card-profile.jpg` | About, Credits, Speaking, and the `Person` schema. Name and title, no campaign copy, so it doesn't go stale. |

Both are 1200×630 — the size LinkedIn, X, Slack and iMessage all crop from.
They're generated, not photographed: `portrait.jpg` flush right, a navy gradient
over its left edge, Poppins text on `--deep`. The script that built them is in
the 24 Aug 2026 commit message. Two things to know before regenerating:

- **PIL has no Poppins SemiBold.** The site's headings are weight 600; the only
  weights installed are Regular, Medium and Bold. The cards use Bold, which is
  slightly heavier than the site — correct for a card viewed as a thumbnail.
- **`og:image` must be an absolute URL** in the markup. A relative path silently
  produces a blank card on every platform, which is the bug these fixed.

Regenerate only if the hero headline changes. Keep the filenames — platforms
cache aggressively by URL, and a new name means every previously shared link
keeps the old card.

## Conventions

**`-sm` variants** are 700px wide, quality 80, referenced via `srcset`. Generate
one whenever a new image is wider than about 780px:

```python
from PIL import Image
im = Image.open('images/NAME.jpg').convert('RGB')
sm = im.resize((700, int(im.height*700/im.width)), Image.LANCZOS)
sm.save('images/NAME-sm.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
```

Then add to the markup:

```html
<img src="images/NAME.jpg"
     srcset="images/NAME-sm.jpg 700w, images/NAME.jpg 1400w"
     sizes="(max-width:640px) 92vw, 390px"
     alt="…" loading="lazy">
```

**The hero photo — check it on a phone.** This is the one that keeps biting.
`portrait.jpg` is 4:5, and the base `.hero-shot` rule sets a fixed
`aspect-ratio` with `object-fit:cover`. Any photo dropped in there gets cropped
to that box silently — for a while the live site cut the top of Nathan's head off
on every phone, and nothing about the desktop view hinted at it. The homepage now
overrides the box to show the image whole, but a *new* photo can still land back
in the cropped path. Resize the browser to ~390px and look before committing.

**Rules of thumb**

- `.band` is no longer full-bleed. It shows the whole frame, capped at 1008px so
  its edges line up with the text column. A wide crop of a group photo cuts
  somebody's head off; that's exactly what it used to do.
- Images in a `.plate-pair` must share an aspect ratio.
- **Every `<img>` needs `width` and `height` attributes** giving the *intrinsic*
  pixel size of the file in `src` — not the display size. `img{height:auto}` in
  site.css means the CSS still controls how big it renders; the attributes only
  tell the browser the aspect ratio so it can reserve the space before the file
  arrives. Without them the homepage grew 507px as images loaded and text slid
  out from under the reader. All four pages now measure a 0px shift; adding an
  image without these attributes puts that back.
- **`sizes` must match the real box width**, or the browser picks the wrong
  source file. The hero declared `400px` for a box that measures `460px`, and
  the credits band declared `100vw` for a box capped at `1008px`. Measure with
  `getBoundingClientRect().width` rather than guessing from the CSS.
- Every image needs real `alt` text. All of them currently have it.
- JPEG only. If you have a PNG photo, convert rather than renaming the `src`.
- Credit the photographer in the caption using `<span class="credit">`.

**Watch out:** files you attach in chat get copied into this folder
automatically, originals and all. Delete strays before committing — a 3.7MB PNG
nearly ended up in git history permanently.

## Rights

The Tiffany L. photographs are used with her permission; watermarks were cropped
and she's credited on-page. The Peter Pan playbill is the production's
promotional artwork — standard practice for illustrating a credit, but it isn't
Nathan's image. A still from the performance video would be safer if that ever
matters.
