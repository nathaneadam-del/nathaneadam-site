/* ============================================================
   Career pivot diagnostic — logic only. No copy in this file.
   Every word the visitor reads lives in content.js.

   Runs on two pages:
     career-pivot.html         #pivot-app     the questions + free read
     career-pivot-result.html  #pivot-result  the full read, after subscribe

   No framework, no build step, no dependencies. Same rule as the rest
   of the site: Nathan should never be blocked by a toolchain that rotted.

   PROGRESSIVE ENHANCEMENT: if this script fails to load, both pages
   still render their <noscript> explanation and the nav still works.
   Nothing here is allowed to leave a blank page behind.
   ============================================================ */
(function () {
  "use strict";

  var C = window.PIVOT_CONTENT;
  if (!C) return;

  /* ------------------------------------------------------------
     THE GATE — read this before changing it.

     mode 'soft'    the subscribe form shows, and underneath it a plain
                    "no thanks, show me anyway" link. Honest, works today,
                    needs nothing from beehiiv.

     mode 'beehiiv' the real gate. Requires a SECOND beehiiv subscribe
                    form, separate from the homepage one, with its
                    post-subscribe redirect pointed at RESULT_URL.

     WHY A SECOND FORM: the redirect is a property of the form, not of
     the link. Reusing the homepage form's UUID would send homepage
     subscribers to this tool's results page too, which would be
     nonsense. Make a new form in beehiiv (Subscribers -> Subscribe
     forms), set its redirect, and paste its UUID below.

     Until that UUID exists, leave this on 'soft'. Shipping mode
     'beehiiv' without the redirect configured would dead-end every
     person who subscribes, which is worse than no gate at all.
     ------------------------------------------------------------ */
  var GATE = {
    mode: "soft",
    formUuid: "",
    hostedFormBase: "https://subscribe-forms.beehiiv.com/"
  };

  var STORAGE_KEY = "nea_pivot_v1";
  var RESULT_URL = "career-pivot-result.html";
  var QUIZ_URL = "career-pivot.html";

  /* ---------- storage, defensively ----------
     Private windows and locked-down browsers throw on access rather than
     returning null, so every touch is wrapped. A visitor with storage
     disabled still gets the free read; they just can't cross the gate. */
  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) { return false; }
  }
  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* ---------- tiny helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function paras(target, list, cls) {
    for (var i = 0; i < list.length; i++) target.appendChild(el("p", cls || null, list[i]));
  }
  function ctaRow(node) {
    var row = el("div", "cta-row");
    row.appendChild(node);
    return row;
  }
  function craftFor(value) {
    for (var i = 0; i < C.crafts.length; i++) {
      if (C.crafts[i].value === value) return C.crafts[i];
    }
    return C.crafts[C.crafts.length - 1];
  }

  /* ---------- the read ----------
     Six scored questions on track A. "middle" answers count for neither
     side on purpose, so a fence-sitter lands in the middle read, which
     is where a fence-sitter belongs. Track B is deliberately unscored:
     the diagnosis is the same for everyone there and only the 90-day
     move changes. */
  function computeRead(state) {
    if (state.track === "B") return C.reads.B;

    var exposed = 0, durable = 0, qs = C.trackA, i, q, a;
    for (i = 0; i < qs.length; i++) {
      q = qs[i];
      if (!q.options) continue;
      a = state.answers[q.id];
      if (!a) continue;
      if (a.score === "exposed") exposed++;
      else if (a.score === "durable") durable++;
    }
    if (exposed - durable >= 2 && exposed >= 3) return C.reads.A_exposed;
    if (durable - exposed >= 2 && durable >= 3) return C.reads.A_durable;
    return C.reads.A_middle;
  }

  function ninetyDayFor(state) {
    var key = (state.answers.ai && state.answers.ai.value) || "none";
    var list = C.ninetyDays[key] || C.ninetyDays.none;
    var example = craftFor(state.answers.craft && state.answers.craft.value).example;
    var out = [];
    for (var i = 0; i < list.length; i++) {
      out.push(list[i].replace("{{example}}", example));
    }
    return out;
  }

  /* ============================================================
     THE QUIZ PAGE
     ============================================================ */
  function runQuiz(root) {
    var state = { track: null, answers: {}, ts: Date.now() };
    var step = -1;            /* -1 is the intro screen */
    var questions = [];       /* filled once the track is chosen */

    function questionsFor(track) {
      var base = track === "B" ? C.trackB : C.trackA;
      return base.map(function (q) {
        if (!q.useCrafts) return q;
        return { id: q.id, text: q.text, options: C.crafts.map(function (c) {
          return { label: c.label, value: c.value };
        })};
      });
    }

    function total() { return questions.length + 1; }   /* +1 for the branch */

    function render() {
      root.innerHTML = "";
      if (step === -1) return renderIntro();
      if (step === 0) return renderQuestion(C.branch, 0);
      if (step <= questions.length) return renderQuestion(questions[step - 1], step);
      return renderResult();
    }

    function renderIntro() {
      var box = el("div", "q-card q-intro");
      box.appendChild(el("div", "eyebrow", C.intro.eyebrow));
      box.appendChild(el("h1", null, C.intro.title));
      box.appendChild(el("p", "lede", C.intro.lede));
      paras(box, C.intro.body);
      var go = el("button", "btn btn-cta q-start", C.intro.startLabel);
      go.type = "button";
      go.addEventListener("click", function () { step = 0; render(); });
      box.appendChild(ctaRow(go));
      root.appendChild(box);
    }

    function renderQuestion(q, index) {
      var box = el("div", "q-card");

      var bar = el("div", "q-progress");
      var fill = el("span");
      fill.style.width = Math.round((index / total()) * 100) + "%";
      bar.appendChild(fill);
      box.appendChild(bar);
      box.appendChild(el("p", "q-count", "Question " + (index + 1) + " of " + total()));

      box.appendChild(el("h2", "q-text", q.text));

      var list = el("div", "q-options");
      q.options.forEach(function (opt) {
        var b = el("button", "q-option", opt.label);
        b.type = "button";
        b.addEventListener("click", function () {
          if (index === 0) {
            state.track = opt.value;
            questions = questionsFor(opt.value);
          } else {
            state.answers[q.id] = {
              label: opt.label,
              value: opt.value || null,
              score: opt.score || null
            };
          }
          step++;
          save(state);
          render();
          root.focus();
        });
        list.appendChild(b);
      });
      box.appendChild(list);

      if (index > 0) {
        var back = el("button", "q-back", "&larr; Back");
        back.type = "button";
        back.addEventListener("click", function () { step--; render(); });
        box.appendChild(back);
      }
      root.appendChild(box);
    }

    function renderResult() {
      save(state);
      var read = computeRead(state);
      var box = el("div", "q-card q-result");

      box.appendChild(el("div", "eyebrow", "Here&rsquo;s my read"));
      box.appendChild(el("h1", null, read.label));
      paras(box, read.free);

      /* ---- the gate ---- */
      var gate = el("div", "q-gate");
      gate.appendChild(el("h2", null, C.gate.heading));
      gate.appendChild(el("p", null, C.gate.body));

      if (GATE.mode === "beehiiv" && GATE.formUuid) {
        var a = el("a", "btn btn-cta", C.gate.buttonLabel);
        a.href = GATE.hostedFormBase + GATE.formUuid;
        gate.appendChild(ctaRow(a));
        gate.appendChild(el("p", "q-foot", C.gate.footnote));
      } else {
        /* Soft gate. The skip link below is deliberate and visible: a gate we
           cannot actually enforce must not pretend otherwise.

           This is beehiiv's own loader, embedded exactly as index.html does it
           (same form UUID, same .beehiiv-form wrapper reserving 52px). Do not
           swap it for a hand-rolled iframe — the loader is the supported path
           and it is what the styling in beehiiv's builder was matched against.

           ONE GOOD SIDE EFFECT worth keeping: the loader pulls Google Tag
           Manager and sets a bhv_attribution cookie, which is the site's only
           third-party tracking. Because this script only runs when somebody
           reaches the end of the diagnostic, a visitor who reads the intro and
           leaves is never tracked at all. The homepage cannot say that. */
        var wrapEl = el("div", "beehiiv-form");
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
        s.setAttribute("data-beehiiv-form", "11848ad5-53ac-456d-8cec-428670527667");
        wrapEl.appendChild(s);
        gate.appendChild(wrapEl);
        gate.appendChild(el("p", "q-foot", C.gate.footnote));

        var skip = el("button", "q-skip", "No thanks, show me the rest anyway");
        skip.type = "button";
        skip.addEventListener("click", function () { window.location.href = RESULT_URL; });
        gate.appendChild(skip);
      }
      box.appendChild(gate);
      root.appendChild(box);
    }

    render();
  }

  /* ============================================================
     THE RESULT PAGE
     ============================================================ */
  function runResult(root) {
    var state = load();

    if (!state || !state.track) {
      var miss = el("div", "q-card");
      miss.appendChild(el("h1", null, "Nothing to show yet"));
      miss.appendChild(el("p", null, "I don&rsquo;t have your answers. They&rsquo;re kept in your own browser and never sent anywhere, so if you switched devices or cleared your history they&rsquo;re gone. It&rsquo;s two minutes to do again."));
      var a = el("a", "btn btn-cta", "Take the diagnostic");
      a.href = QUIZ_URL;
      miss.appendChild(el("div", "cta-row").appendChild(a).parentNode);
      root.appendChild(miss);
      return;
    }

    var read = computeRead(state);
    var box = el("div", "q-card q-result");

    box.appendChild(el("div", "eyebrow", "Here&rsquo;s my read"));
    box.appendChild(el("h1", null, read.label));
    paras(box, read.free);
    paras(box, read.gated);

    box.appendChild(el("h2", "q-h", C.ninetyDays.heading));
    paras(box, ninetyDayFor(state));

    box.appendChild(el("h2", "q-h", C.skip.heading));
    var ul = el("ul", "q-list");
    C.skip.items.forEach(function (item) { ul.appendChild(el("li", null, item)); });
    box.appendChild(ul);

    var cav = el("div", "q-caveat");
    cav.appendChild(el("h2", null, C.caveat.heading));
    paras(cav, C.caveat.body);
    box.appendChild(cav);

    var again = el("a", "btn btn-ghost", "Take it again");
    again.href = QUIZ_URL;
    var row = el("div", "cta-row");
    row.appendChild(again);
    box.appendChild(row);

    root.appendChild(box);
  }

  /* ---------- boot ---------- */
  var quiz = document.getElementById("pivot-app");
  var result = document.getElementById("pivot-result");
  if (quiz) runQuiz(quiz);
  if (result) runResult(result);
})();
