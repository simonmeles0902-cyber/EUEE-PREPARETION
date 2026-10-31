// ================= Helpers =================
function $(id) { return document.getElementById(id); }

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function unique(list) { return Array.from(new Set(list)); }

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Save and load data in the browser (it stays after you close the page)
function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function pad(n) { return String(n).padStart(2, "0"); }
function formatTime(totalSeconds) { return pad(Math.floor(totalSeconds / 60)) + ":" + pad(totalSeconds % 60); }
function clockText(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function percent(correct, total) { return total ? Math.round((correct / total) * 100) : 0; }

function fillSelect(select, options) {
  select.innerHTML = "";
  options.forEach(function (o) {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.label;
    select.appendChild(opt);
  });
}

// ================= Question data =================
// Fill in defaults for any question that has no topic, explanation or source
const DEFAULT_SOURCE = "Original practice question";
questions.forEach(function (q) {
  q.t = q.t || "General";
  q.e = q.e || "";
  q.src = q.src || DEFAULT_SOURCE;
});
questions.sort(function (a, b) { return a.s.localeCompare(b.s) || a.src.localeCompare(b.src) || a.q.localeCompare(b.q); });
const subjects = unique(questions.map(function (q) { return q.s; }));

// ================= Tabs =================
const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

function showPage(name) {
  const target = Array.from(pages).find(function (p) { return p.id === name; });
  if (!target) return;
  pages.forEach(function (p) { p.hidden = p !== target; });
  tabs.forEach(function (t) {
    const active = t.dataset.page === name;
    t.classList.toggle("active", active);
    t.setAttribute("aria-current", active ? "page" : "false");
  });
  if (name === "home") renderHome();
  if (name === "notes") renderNotes();
  if (name === "library") { renderReferences(); renderTosBlueprints(); }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach(function (t) {
  t.addEventListener("click", function () { showPage(t.dataset.page); });
});
document.querySelectorAll("[data-page]:not(.tab)").forEach(function (button) {
  button.addEventListener("click", function () { showPage(button.dataset.page); });
});
// ================= Progress (Home) =================
// topicStats: { "Physics|Electricity": { correct: 3, total: 5 } }
// history:    [{ date, mode, label, score, total }]
const WEAK_BELOW = 60;   // percent: below this a topic is marked "Revisit"
const MIN_ANSWERS = 2;   // answers needed before a topic can be marked "Revisit"

function recordResult(q, isCorrect) {
  const stats = load("topicStats", {});
  const key = q.s + "|" + q.t;
  const entry = stats[key] || { correct: 0, total: 0 };
  entry.total++;
  if (isCorrect) entry.correct++;
  stats[key] = entry;
  save("topicStats", stats);
}

function makeBar(label, rightText, pct) {
  const row = el("div", "bar-row");
  const top = el("div", "bar-label");
  const left = el("span", "", label);
  top.appendChild(left);
  top.appendChild(el("span", "", rightText));
  const bar = el("div", "bar");
  const fill = el("div", "bar-fill");
  fill.style.setProperty("--target-width", pct + "%");
  fill.style.width = pct + "%";
  if (pct < WEAK_BELOW) fill.classList.add("low");
  bar.appendChild(fill);
  row.appendChild(top);
  row.appendChild(bar);
  return { row: row, labelEl: left };
}

function renderHome() {
  if ($("question-count")) $("question-count").textContent = questions.length.toLocaleString();
  const history = load("history", []);
  const stats = load("topicStats", {});

  // Top boxes
  const pcts = history.map(function (h) { return percent(h.score, h.total); });
  const best = pcts.length ? Math.max.apply(null, pcts) : 0;
  const avg = pcts.length
    ? Math.round(pcts.reduce(function (a, b) { return a + b; }, 0) / pcts.length)
    : 0;
  $("stat-quizzes").textContent = history.length;
  $("stat-best").textContent = best + "%";
  $("stat-avg").textContent = avg + "%";

  // Accuracy by subject (adds up all the topics of a subject)
  const bySubject = {};
  Object.keys(stats).forEach(function (key) {
    const subject = key.split("|")[0];
    const s = bySubject[subject] || { correct: 0, total: 0 };
    s.correct += stats[key].correct;
    s.total += stats[key].total;
    bySubject[subject] = s;
  });
  const bars = $("subject-bars");
  bars.innerHTML = "";
  subjects.forEach(function (name) {
    const s = bySubject[name] || { correct: 0, total: 0 };
    const pct = percent(s.correct, s.total);
    const text = s.total ? pct + "% (" + s.correct + "/" + s.total + ")" : "no answers yet";
    bars.appendChild(makeBar(name, text, pct).row);
  });

  // Accuracy by topic, weakest first
  const topicBox = $("topic-list");
  topicBox.innerHTML = "";
  const rows = Object.keys(stats)
    .filter(function (k) { return stats[k].total > 0; })
    .map(function (k) {
      const parts = k.split("|");
      return {
        subject: parts[0],
        topic: parts[1],
        correct: stats[k].correct,
        total: stats[k].total,
        pct: percent(stats[k].correct, stats[k].total)
      };
    })
    .sort(function (a, b) { return a.pct - b.pct || b.total - a.total; });

  if (!rows.length) {
    topicBox.appendChild(el("p", "hint", "Answer some quiz questions to see your topics here."));
  }
  rows.forEach(function (r) {
    const bar = makeBar(r.subject + " › " + r.topic, r.pct + "% (" + r.correct + "/" + r.total + ")", r.pct);
    if (r.total >= MIN_ANSWERS && r.pct < WEAK_BELOW) {
      bar.labelEl.appendChild(el("span", "badge", "Revisit"));
    }
    topicBox.appendChild(bar.row);
  });

  // Recent results (last 5)
  const recent = $("recent-list");
  recent.innerHTML = "";
  if (!history.length) {
    recent.appendChild(el("p", "hint", "No quizzes yet. Start one from the Quiz tab."));
  }
  history.slice(-5).reverse().forEach(function (h) {
    const row = el("div", "recent-row");
    const left = el("div");
    left.appendChild(document.createTextNode(h.label || h.subject || "Quiz"));
    const when = new Date(h.date).toLocaleDateString() + " · " + (h.mode === "exam" ? "Timed exam" : "Practice");
    left.appendChild(el("small", "", when));
    row.appendChild(left);
    row.appendChild(el("b", "", h.score + "/" + h.total + " (" + percent(h.score, h.total) + "%)"));
    recent.appendChild(row);
  });
}

$("reset-data").addEventListener("click", function () {
  if (confirm("Delete all your quiz progress? Your notes are kept.")) {
    save("history", []);
    save("topicStats", {});
    renderHome();
  }
});

// "Review your weakest topics": a practice quiz from the 3 weakest topics
$("weak-btn").addEventListener("click", function () {
  const stats = load("topicStats", {});
  const msg = $("weak-msg");
  const weak = Object.keys(stats)
    .filter(function (k) { return stats[k].total > 0 && stats[k].correct < stats[k].total; })
    .sort(function (a, b) {
      return percent(stats[a].correct, stats[a].total) - percent(stats[b].correct, stats[b].total);
    })
    .slice(0, 3);

  if (!weak.length) {
    msg.textContent = Object.keys(stats).length
      ? "No weak topics right now. Great work!"
      : "Answer some quiz questions first, then I can find your weakest topics.";
    return;
  }
  msg.textContent = "";
  const pool = questions.filter(function (q) { return weak.indexOf(q.s + "|" + q.t) !== -1; });
  showPage("quiz");
  startSession(pool, "practice", "Weakest topics", 10, 0);
});

// ================= Quiz setup =================
const setupBox = $("quiz-setup");
const runBox = $("quiz-run");
const endBox = $("quiz-end");
const subjectSelect = $("subject-select");
const topicSelect = $("topic-select");
const sourceSelect = $("source-select");
const countSelect = $("count-select");
const minutesRow = $("minutes-row");
const minutesInput = $("minutes-input");
const poolInfo = $("pool-info");
const startBtn = $("start-btn");

function currentMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function getPool() {
  return questions.filter(function (q) {
    return (subjectSelect.value === "All" || q.s === subjectSelect.value) &&
           (topicSelect.value === "All" || q.t === topicSelect.value) &&
           (sourceSelect.value === "All" || q.src === sourceSelect.value);
  });
}

function wantedCount(pool) {
  return countSelect.value === "all" ? pool.length : Math.min(parseInt(countSelect.value, 10), pool.length);
}

function blueprintForQuestion(q) {
  const isAptitude = /sat|aptitude/i.test(q.src || "");
  const expected = isAptitude ? "Aptitude / SAT" : q.s;
  return tosBlueprints.find(function (b) { return b.subject === expected; }) || null;
}
function getQuestionTosUnit(q) {
  const blueprint = blueprintForQuestion(q);
  if (!blueprint) return null;
  const haystack = (q.q + " " + q.t).toLowerCase();
  let match = null, bestScore = 0;
  blueprint.units.forEach(function (unit) {
    let score = 0;
    unit.keywords.forEach(function (keyword) { if (haystack.indexOf(keyword.toLowerCase()) !== -1) score += keyword.length > 8 ? 2 : 1; });
    if (score > bestScore) { match = { blueprint: blueprint, unit: unit }; bestScore = score; }
  });
  return match;
}
function weightedPick(pool, count, blueprint) {
  if (count >= pool.length) return shuffle(pool);
  const buckets = {};
  blueprint.units.forEach(function (unit) { buckets[unit.name] = []; });
  const unmatched = [];
  pool.forEach(function (q) {
    const match = getQuestionTosUnit(q);
    if (match && match.blueprint.subject === blueprint.subject) buckets[match.unit.name].push(q);
    else unmatched.push(q);
  });
  const available = blueprint.units.filter(function (unit) { return buckets[unit.name].length > 0; });
  if (!available.length) return shuffle(pool).slice(0, count);
  const weightSum = available.reduce(function (sum, unit) { return sum + unit.weight; }, 0);
  const allocations = available.map(function (unit) {
    const raw = count * unit.weight / weightSum;
    return { unit: unit, take: Math.floor(raw), fraction: raw - Math.floor(raw) };
  });
  let assigned = allocations.reduce(function (sum, item) { return sum + item.take; }, 0);
  allocations.slice().sort(function (a,b) { return b.fraction - a.fraction; }).forEach(function (item) { if (assigned < count) { item.take++; assigned++; } });
  const chosen = [], remaining = unmatched.slice();
  allocations.forEach(function (item) {
    const options = shuffle(buckets[item.unit.name]);
    const n = Math.min(item.take, options.length);
    chosen.push.apply(chosen, options.slice(0,n));
    remaining.push.apply(remaining, options.slice(n));
  });
  if (chosen.length < count) chosen.push.apply(chosen, shuffle(remaining).slice(0, count - chosen.length));
  return shuffle(chosen).slice(0,count);
}
function sampleSubjectPool(pool, count) {
  if (count >= pool.length) return shuffle(pool);
  const groups = {};
  pool.forEach(function (q) {
    const bp = blueprintForQuestion(q);
    const key = bp ? bp.subject : "unmapped";
    if (!groups[key]) groups[key] = { blueprint: bp, items: [] };
    groups[key].items.push(q);
  });
  const entries = Object.values(groups);
  if (entries.length === 1 && entries[0].blueprint) return weightedPick(pool,count,entries[0].blueprint);
  const shares = entries.map(function (g) { const raw=count*g.items.length/pool.length; return {g:g,take:Math.floor(raw),fraction:raw-Math.floor(raw)}; });
  let used=shares.reduce(function(a,b){return a+b.take;},0);
  shares.slice().sort(function(a,b){return b.fraction-a.fraction;}).forEach(function(x){if(used<count){x.take++;used++;}});
  let result=[];
  shares.forEach(function(x){result.push.apply(result,x.g.blueprint?weightedPick(x.g.items,x.take,x.g.blueprint):shuffle(x.g.items).slice(0,x.take));});
  return shuffle(result);
}
function sampleTosWeighted(pool, count) {
  if (count >= pool.length) return shuffle(pool);
  if (subjectSelect.value !== "All") return sampleSubjectPool(pool,count);
  const groups={};
  pool.forEach(function(q){(groups[q.s]=groups[q.s]||[]).push(q);});
  const entries=Object.keys(groups).map(function(s){return {s:s,items:groups[s]};});
  const shares=entries.map(function(g){const raw=count*g.items.length/pool.length;return {g:g,take:Math.floor(raw),fraction:raw-Math.floor(raw)};});
  let used=shares.reduce(function(a,b){return a+b.take;},0);
  shares.slice().sort(function(a,b){return b.fraction-a.fraction;}).forEach(function(x){if(used<count){x.take++;used++;}});
  let result=[];
  shares.forEach(function(x){result.push.apply(result,sampleSubjectPool(x.g.items,x.take));});
  return shuffle(result);
}
function fillTopics() {
  const subject = subjectSelect.value;
  const options = [{ value: "All", label: "All topics" }];
  if (subject !== "All") {
    const topics = unique(questions.filter(function (q) { return q.s === subject; })
      .map(function (q) { return q.t; })).sort();
    topics.forEach(function (t) { options.push({ value: t, label: t }); });
  }
  fillSelect(topicSelect, options);
  topicSelect.disabled = subject === "All";
}

function updateSetup(resetMinutes) {
  const pool = getPool();
  const n = wantedCount(pool);
  const mapped = pool.filter(function (q) { return getQuestionTosUnit(q); }).length;
  poolInfo.textContent = pool.length + (pool.length === 1 ? " question matches" : " questions match") +
    " your filters. This quiz will have " + n + ". " + (mapped ? "Question sampling follows uploaded ToS weights where units match; unmatched items remain eligible." : "No clear ToS unit matches these items, so the set is randomized.");
  startBtn.disabled = pool.length === 0;
  minutesRow.hidden = currentMode() !== "exam";
  if (resetMinutes) minutesInput.value = Math.max(1, n);
}

fillSelect(subjectSelect, [{ value: "All", label: "All subjects" }].concat(
  subjects.map(function (s) { return { value: s, label: s }; })));
fillSelect(sourceSelect, [{ value: "All", label: "All sources" }].concat(
  unique(questions.map(function (q) { return q.src; })).map(function (s) { return { value: s, label: s }; })));
fillTopics();
updateSetup(true);

subjectSelect.addEventListener("change", function () { fillTopics(); updateSetup(true); });
topicSelect.addEventListener("change", function () { updateSetup(true); });
sourceSelect.addEventListener("change", function () { updateSetup(true); });
countSelect.addEventListener("change", function () { updateSetup(true); });
document.querySelectorAll('input[name="mode"]').forEach(function (r) {
  r.addEventListener("change", function () { updateSetup(true); });
});

startBtn.addEventListener("click", function () {
  const pool = getPool();
  const parts = [];
  if (subjectSelect.value !== "All") parts.push(subjectSelect.value);
  if (topicSelect.value !== "All") parts.push(topicSelect.value);
  const label = parts.length ? parts.join(" › ") : "All subjects";
  const count = wantedCount(pool);
  const selectedPool = sampleTosWeighted(pool, count);
  const minutes = Math.min(180, Math.max(1, parseInt(minutesInput.value, 10) || 10));
  startSession(selectedPool, currentMode(), label, selectedPool.length, minutes);
});

// ================= Quiz session =================
const progressEl = $("progress");
const examTimerEl = $("exam-timer");
const questionEl = $("question");
const answersDiv = $("answers");
const resultEl = $("result");
const explainEl = $("explain");
const prevBtn = $("prev");
const nextBtn = $("next");
const finishBtn = $("finish-btn");

let session = null;

function startSession(pool, mode, label, count, minutes) {
  if (session && session.timerId) clearInterval(session.timerId);

  const chosen = shuffle(pool).slice(0, count);
  session = {
    mode: mode,
    label: label,
    current: 0,
    finished: false,
    timerId: null,
    endTime: 0,
    missedQuestions: [],
    items: chosen.map(function (q) {
      const choices = q.c.map(function (text, i) { return { text: text, isCorrect: i === q.a }; });
      return { q: q, picked: null, choices: shuffle(choices) };
    })
  };

  setupBox.hidden = true;
  endBox.hidden = true;
  runBox.hidden = false;

  if (mode === "exam") {
    session.endTime = Date.now() + minutes * 60000;
    examTimerEl.hidden = false;
    tickExam();
    session.timerId = setInterval(tickExam, 1000);
  } else {
    examTimerEl.hidden = true;
  }
  renderQuestion();
}

function tickExam() {
  if (!session || session.finished) return;
  const left = Math.max(0, Math.round((session.endTime - Date.now()) / 1000));
  examTimerEl.textContent = "Time left " + formatTime(left);
  examTimerEl.classList.toggle("urgent", left <= 60);
  if (left <= 0) finishSession(true);
}

function appendAnswerRationale(container, item) {
  const q = item.q;
  const correctChoice = item.choices.filter(function (choice) { return choice.isCorrect; })[0];
  const selectedChoice = item.picked === null ? null : item.choices[item.picked];
  container.appendChild(el("b", "", q.e ? "Why: " : "Answer-key check: "));
  if (q.e) {
    container.appendChild(document.createTextNode(q.e));
  } else {
    const correctText = correctChoice ? correctChoice.text : "the keyed option";
    const pickedText = selectedChoice ? selectedChoice.text : "no answer";
    const summary = selectedChoice && selectedChoice.isCorrect
      ? "Your choice, “" + pickedText + "”, matches the stored answer “" + correctText + "”."
      : "The stored answer is “" + correctText + "”; your choice “" + pickedText + "” does not match it, so it was marked incorrect.";
    container.appendChild(document.createTextNode(summary + " "));
    container.appendChild(document.createTextNode(q.keyRef
      ? "The matching answer-key PDF confirms the option, but it contains no written reasoning for this item."
      : "This item uses the prepared answer key; the source paper did not include a written worked explanation."));
  }
  const links = el("div", "explanation-links");
  if (q.keyRef) {
    const keyLink = el("a", "", "Open answer key PDF");
    keyLink.href = encodeURI("reference-pdfs/keys/" + q.keyRef); keyLink.target = "_blank"; keyLink.rel = "noopener";
    links.appendChild(keyLink);
  }
  const book = (window.references || references).find(function (r) { return r.subject === q.s && r.grade === "Grade 12" && r.pdfPath; });
  if (book) {
    const bookLink = el("a", "", "Open " + book.title);
    bookLink.href = encodeURI(book.pdfPath); bookLink.target = "_blank"; bookLink.rel = "noopener";
    links.appendChild(bookLink);
  }
  const tos = blueprintForQuestion(q);
  if (tos) {
    const tosLink = el("a", "", "View " + tos.title);
    tosLink.href = encodeURI(tos.pdfPath); tosLink.target = "_blank"; tosLink.rel = "noopener";
    links.appendChild(tosLink);
  }
  if (links.childNodes.length) container.appendChild(links);
}
function renderQuestion() {
  const item = session.items[session.current];
  const q = item.q;
  const exam = session.mode === "exam";
  const last = session.current === session.items.length - 1;

  progressEl.textContent = "Question " + (session.current + 1) + " of " + session.items.length;
  $("subject-tag").textContent = q.s;
  $("topic-tag").textContent = q.t;
  $("source-tag").textContent = q.src + (q.y ? " · " + q.y : "");
  questionEl.textContent = q.q;

  answersDiv.innerHTML = "";
  item.choices.forEach(function (choice, i) {
    const btn = el("button", "", choice.text);
    if (exam) {
      if (item.picked === i) btn.classList.add("selected");
    } else if (item.picked !== null) {
      btn.disabled = true;
      if (choice.isCorrect) btn.classList.add("correct");
      else if (item.picked === i) btn.classList.add("incorrect");
    }
    btn.addEventListener("click", function () { choose(i); });
    answersDiv.appendChild(btn);
  });

  // Instant feedback and explanation (practice mode only)
  resultEl.textContent = "";
  resultEl.className = "";
  explainEl.hidden = true;
  explainEl.textContent = "";
  if (!exam && item.picked !== null) {
    const ok = item.choices[item.picked].isCorrect;
    resultEl.textContent = ok ? "Correct!" : "Not quite. The right answer is highlighted.";
    resultEl.className = ok ? "right" : "wrong";
    explainEl.hidden = false;
    explainEl.classList.add("answer-explanation");
    appendAnswerRationale(explainEl, item);
  }

  // Keep navigation visible in practice and exam modes so students can move
  // between questions and return to earlier items.
  prevBtn.hidden = false;
  prevBtn.disabled = session.current === 0;
  if (exam) {
    nextBtn.hidden = false;
    nextBtn.disabled = last;
    nextBtn.textContent = "Next";
    finishBtn.textContent = "Submit exam";
  } else {
    nextBtn.hidden = false;
    nextBtn.disabled = false;
    nextBtn.textContent = last ? "Finish practice" : "Next";
    finishBtn.textContent = "End quiz early";
  }
}

function choose(i) {
  const item = session.items[session.current];
  if (session.mode === "practice") {
    if (item.picked !== null) return;
    item.picked = i;
    recordResult(item.q, item.choices[i].isCorrect);
  } else {
    item.picked = i; // in exam mode you can change your answer until you submit
  }
  renderQuestion();
}

prevBtn.addEventListener("click", function () {
  if (session.current > 0) {
    session.current--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", function () {
  const last = session.current === session.items.length - 1;
  if (last) {
    if (session.mode === "practice") finishSession(false);
    return;
  }
  session.current++;
  renderQuestion();
});

finishBtn.addEventListener("click", function () {
  if (session.mode === "exam") {
    const blank = session.items.filter(function (i) { return i.picked === null; }).length;
    if (blank && !confirm("You have " + blank + " unanswered question(s). Submit anyway?")) return;
    finishSession(false);
  } else {
    const answered = session.items.filter(function (i) { return i.picked !== null; }).length;
    if (!answered) {
      runBox.hidden = true;
      setupBox.hidden = false;
      return;
    }
    finishSession(false);
  }
});

function finishSession(timeUp) {
  if (!session || session.finished) return;
  session.finished = true;
  clearInterval(session.timerId);
  const exam = session.mode === "exam";

  // In practice mode, only answered questions count
  if (!exam) session.items = session.items.filter(function (i) { return i.picked !== null; });

  let score = 0;
  const missed = [];
  session.items.forEach(function (item) {
    const ok = item.picked !== null && item.choices[item.picked].isCorrect;
    if (exam) recordResult(item.q, ok); // practice answers were recorded one by one
    if (ok) score++;
    else missed.push(item);
  });
  const total = session.items.length;
  session.missedQuestions = missed.map(function (m) { return m.q; });

  const history = load("history", []);
  history.push({
    date: new Date().toISOString(),
    mode: session.mode,
    label: session.label,
    score: score,
    total: total
  });
  save("history", history);

  // Results screen
  runBox.hidden = true;
  endBox.hidden = false;
  $("end-title").textContent = timeUp ? "Time is up!" : (exam ? "Exam submitted!" : "Quiz finished!");
  $("final-score").textContent = "You scored " + score + " out of " + total + " (" + percent(score, total) + "%)";
  $("end-note").textContent = missed.length
    ? "Review the " + missed.length + " question(s) you missed below."
    : "Perfect score. Nothing to review!";
  $("retry-btn").hidden = missed.length === 0;

  const review = $("review");
  review.innerHTML = "";
  if (missed.length) {
    review.appendChild(el("h3", "", "Review your missed questions"));
    missed.forEach(function (item) {
      const box = el("div", "review-item");
      box.appendChild(el("div", "review-q", item.q.q));
      const yours = item.picked === null ? "No answer" : item.choices[item.picked].text;
      box.appendChild(el("div", "review-line wrong", "Your answer: " + yours));
      const correct = item.choices.filter(function (c) { return c.isCorrect; })[0].text;
      box.appendChild(el("div", "review-line right", "Correct answer: " + correct));
      const why = el("div", "review-why");
      appendAnswerRationale(why, item);
      box.appendChild(why);
      box.appendChild(el("div", "review-meta", item.q.s + " › " + item.q.t + " · " + item.q.src));
      review.appendChild(box);
    });
  }
}

$("retry-btn").addEventListener("click", function () {
  startSession(session.missedQuestions, "practice", "Missed questions", session.missedQuestions.length, 0);
});

$("again-btn").addEventListener("click", function () {
  endBox.hidden = true;
  setupBox.hidden = false;
  updateSetup(true);
});

// ================= Notes =================
const noteTitle = $("note-title");
const noteSubject = $("note-subject");
const noteBody = $("note-body");
const noteStatus = $("note-status");
const noteSaveBtn = $("note-save");
const noteCancelBtn = $("note-cancel");
const noteSearch = $("note-search");
const noteFilter = $("note-filter");
const noteList = $("note-list");

let editingId = null;
let lastSavedId = null;

const noteSubjects = ["General"].concat(subjects);
fillSelect(noteSubject, noteSubjects.map(function (s) { return { value: s, label: s }; }));
fillSelect(noteFilter, [{ value: "All", label: "All subjects" }].concat(
  noteSubjects.map(function (s) { return { value: s, label: s }; })));

// Notes from the first version only had { id, text }, so we convert them
function loadNotes() {
  return load("notes", []).map(function (n) {
    const body = n.body !== undefined ? n.body : (n.text || "");
    return {
      id: n.id,
      title: n.title || body.split("\n")[0].slice(0, 40) || "Untitled",
      subject: n.subject || "General",
      body: body,
      updated: n.updated || n.id
    };
  });
}

function setStatus(text, cls) {
  noteStatus.textContent = text;
  noteStatus.className = "hint " + (cls || "");
}

function clearNoteForm() {
  editingId = null;
  noteTitle.value = "";
  noteBody.value = "";
  noteSubject.value = "General";
  noteSaveBtn.textContent = "Save note";
  noteCancelBtn.hidden = true;
}

[noteTitle, noteBody, noteSubject].forEach(function (field) {
  field.addEventListener("input", function () { setStatus("Unsaved changes", "unsaved"); });
  field.addEventListener("change", function () { setStatus("Unsaved changes", "unsaved"); });
});

noteSaveBtn.addEventListener("click", function () {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();
  if (!title && !body) {
    setStatus("Write a title or a note first.", "unsaved");
    return;
  }
  const notes = loadNotes();
  const now = Date.now();
  const existing = editingId !== null ? notes.filter(function (n) { return n.id === editingId; })[0] : null;

  if (existing) {
    existing.title = title || "Untitled";
    existing.body = body;
    existing.subject = noteSubject.value;
    existing.updated = now;
    lastSavedId = existing.id;
  } else {
    notes.push({ id: now, title: title || "Untitled", subject: noteSubject.value, body: body, updated: now });
    lastSavedId = now;
  }
  save("notes", notes);
  clearNoteForm();
  setStatus("Saved ✓ at " + clockText(new Date()), "saved");
  renderNotes();
});

noteCancelBtn.addEventListener("click", function () {
  clearNoteForm();
  setStatus("");
});

noteSearch.addEventListener("input", renderNotes);
noteFilter.addEventListener("change", renderNotes);

function renderNotes() {
  const all = loadNotes();
  const term = noteSearch.value.trim().toLowerCase();
  const filter = noteFilter.value;
  const shown = all.filter(function (n) {
    return (filter === "All" || n.subject === filter) &&
           (!term || n.title.toLowerCase().indexOf(term) !== -1 || n.body.toLowerCase().indexOf(term) !== -1);
  });

  noteList.innerHTML = "";
  if (!shown.length) {
    noteList.appendChild(el("p", "hint", all.length ? "No notes match your search." : "No notes yet. Write your first one above."));
    return;
  }

  const groups = unique(noteSubjects.concat(shown.map(function (n) { return n.subject; })));
  groups.forEach(function (group) {
    const inGroup = shown.filter(function (n) { return n.subject === group; })
      .sort(function (a, b) { return b.updated - a.updated; });
    if (!inGroup.length) return;

    noteList.appendChild(el("h3", "note-group", group + " (" + inGroup.length + ")"));
    inGroup.forEach(function (n) {
      const box = el("div", "note");
      const title = el("div", "note-title", n.title);
      if (n.id === lastSavedId) title.appendChild(el("span", "badge saved", "Saved ✓"));
      box.appendChild(title);
      if (n.body) box.appendChild(el("div", "note-body", n.body));
      box.appendChild(el("small", "", "Updated " + new Date(n.updated).toLocaleString()));

      const actions = el("div", "note-actions");
      const editBtn = el("button", "secondary", "Edit");
      editBtn.addEventListener("click", function () {
        editingId = n.id;
        noteTitle.value = n.title;
        noteSubject.value = n.subject;
        noteBody.value = n.body;
        noteSaveBtn.textContent = "Update note";
        noteCancelBtn.hidden = false;
        setStatus("Editing this note", "");
        noteTitle.scrollIntoView({ behavior: "smooth", block: "center" });
        noteTitle.focus();
      });
      const delBtn = el("button", "danger", "Delete");
      delBtn.addEventListener("click", function () {
        if (!confirm("Delete this note?")) return;
        save("notes", loadNotes().filter(function (x) { return x.id !== n.id; }));
        if (editingId === n.id) clearNoteForm();
        setStatus("Note deleted", "");
        renderNotes();
      });
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      box.appendChild(actions);
      noteList.appendChild(box);
    });
  });
}

// ================= Timer =================
const displayEl = $("timer-display");
const modeEl = $("timer-mode");
const timerBtn = $("timer-start");
const timerMsg = $("timer-message");
const focusInput = $("focus-input");
const breakInput = $("break-input");

function clampMinutes(value, fallback, max) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return fallback;
  return Math.min(max, Math.max(1, n));
}

const savedTimer = load("timerSettings", { focus: 25, brk: 5 });
let focusMin = clampMinutes(savedTimer.focus, 25, 180);
let breakMin = clampMinutes(savedTimer.brk, 5, 60);

let secondsLeft = focusMin * 60;
let onBreak = false;
let timerRunning = false;
let timerStarted = false;
let timerEnd = 0;
let timerId = null;

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(function () { osc.stop(); ctx.close(); }, 400);
  } catch (e) {}
}

function drawTimer() {
  displayEl.textContent = formatTime(secondsLeft);
  modeEl.textContent = onBreak ? "Break time" : "Focus session";
  document.title = timerRunning ? formatTime(secondsLeft) + " · EUEE Study Hub" : "EUEE Study Hub";
}

function drawSessions() {
  const sessions = load("sessions", {});
  let total = 0;
  Object.keys(sessions).forEach(function (k) { total += sessions[k]; });
  $("session-count").textContent =
    "Focus sessions completed: " + (sessions[todayKey()] || 0) + " today, " + total + " in total.";
}

function addSession() {
  const sessions = load("sessions", {});
  const key = todayKey();
  sessions[key] = (sessions[key] || 0) + 1;
  save("sessions", sessions);
  drawSessions();
}

function timerTick() {
  // We compare with the clock, so the time stays correct even if the tab is in the background
  secondsLeft = Math.max(0, Math.round((timerEnd - Date.now()) / 1000));
  if (secondsLeft <= 0) {
    if (!onBreak) {
      addSession();
      onBreak = true;
      secondsLeft = breakMin * 60;
      timerMsg.textContent = "Focus session complete! Take a " + breakMin + " minute break.";
    } else {
      onBreak = false;
      secondsLeft = focusMin * 60;
      timerMsg.textContent = "Break is over. Back to studying!";
    }
    timerEnd = Date.now() + secondsLeft * 1000;
    beep();
  }
  drawTimer();
}

timerBtn.addEventListener("click", function () {
  if (timerRunning) {
    secondsLeft = Math.max(1, Math.round((timerEnd - Date.now()) / 1000));
    clearInterval(timerId);
    timerRunning = false;
    timerBtn.textContent = "Resume";
    timerMsg.textContent = "Paused.";
  } else {
    timerEnd = Date.now() + secondsLeft * 1000;
    timerId = setInterval(timerTick, 1000);
    timerRunning = true;
    timerStarted = true;
    timerBtn.textContent = "Pause";
    timerMsg.textContent = "";
  }
  drawTimer();
});

$("timer-reset").addEventListener("click", function () {
  clearInterval(timerId);
  timerRunning = false;
  timerStarted = false;
  onBreak = false;
  secondsLeft = focusMin * 60;
  timerBtn.textContent = "Start";
  timerMsg.textContent = "";
  drawTimer();
});

function applyTimerSettings() {
  focusMin = clampMinutes(focusInput.value, focusMin, 180);
  breakMin = clampMinutes(breakInput.value, breakMin, 60);
  focusInput.value = focusMin;
  breakInput.value = breakMin;
  save("timerSettings", { focus: focusMin, brk: breakMin });
  if (!timerStarted) {
    secondsLeft = focusMin * 60;
    drawTimer();
  }
}

focusInput.addEventListener("change", applyTimerSettings);
breakInput.addEventListener("change", applyTimerSettings);
$("preset-btn").addEventListener("click", function () {
  focusInput.value = 25;
  breakInput.value = 5;
  applyTimerSettings();
});

focusInput.value = focusMin;
breakInput.value = breakMin;

// ================= Start =================
renderHome();
renderNotes();
drawTimer();
drawSessions();



// ================= Reference library =================
const referenceSearch = $("reference-search");
const referenceFilter = $("reference-filter");
if (referenceSearch && referenceFilter && Array.isArray(references)) {
  fillSelect(referenceFilter, [{value:"All",label:"All subjects"}].concat(unique(references.map(function (r) { return r.subject; }).concat(tosBlueprints.map(function (b) { return b.subject; }))).sort().map(function (s) { return {value:s,label:s}; })));
  referenceSearch.addEventListener("input", renderReferences);
  referenceFilter.addEventListener("change", function () { renderReferences(); renderTosBlueprints(); });
}
function renderReferences() {
  if (!$("reference-list") || !Array.isArray(references)) return;
  const term = $("reference-search").value.trim().toLowerCase();
  const subject = $("reference-filter").value || "All";
  const items = references.filter(function (r) {
    const text = [r.subject,r.grade,r.kind,r.title,r.file].concat(r.sections || []).join(" ").toLowerCase();
    return (subject === "All" || r.subject === subject) && (!term || text.includes(term));
  });
  const list = $("reference-list"); list.innerHTML = "";
  $("reference-count").textContent = items.length + " reference " + (items.length === 1 ? "file" : "files");
  if (!items.length) { list.appendChild(el("p","hint","No references match your search.")); return; }
  items.forEach(function (r) {
    const card = el("article","reference-card");
    card.appendChild(el("span","reference-subject",r.subject));
    card.appendChild(el("h3","",r.title));
    card.appendChild(el("p","reference-meta",r.grade + " · " + r.kind));
    card.appendChild(el("p","reference-file",r.file));
    const open = el("a", "reference-open", "Open textbook PDF");
    open.href = encodeURI(r.pdfPath);
    card.appendChild(open);
    const download = el("a", "reference-download", "Download PDF");
    download.href = encodeURI(r.pdfPath); download.setAttribute("download", r.file);
    card.appendChild(download);
    if (r.sections && r.sections.length) {
      const details = el("ul","reference-sections");
      r.sections.forEach(function (line) { details.appendChild(el("li","",line)); });
      card.appendChild(details);
    } else card.appendChild(el("p","reference-meta","No reliable unit or page breakdown was visible in the supplied copy."));
    list.appendChild(card);
  });
}


function renderTosBlueprints() {
  const host = $("tos-list");
  if (!host || !Array.isArray(tosBlueprints)) return;
  host.innerHTML = "";
  const filter = $("reference-filter").value || "All";
  const shown = tosBlueprints.filter(function (b) { return filter === "All" || b.subject === filter; });
  if (!shown.length) { host.appendChild(el("p", "hint", "No uploaded ToS for this filter.")); return; }
  shown.forEach(function (blueprint) {
    const card = el("article", "tos-card");
    card.appendChild(el("span", "reference-subject", blueprint.subject));
    card.appendChild(el("h3", "", blueprint.title));
    card.appendChild(el("p", "reference-meta", blueprint.scope));
    blueprint.units.forEach(function (unit) {
      const row = el("div", "tos-unit");
      const label = el("div", "tos-unit-label");
      label.appendChild(el("span", "", unit.name));
      label.appendChild(el("b", "", unit.weight + "%"));
      const bar = el("div", "tos-meter");
      const fill = el("i", ""); fill.style.width = unit.weight + "%"; bar.appendChild(fill);
      row.appendChild(label); row.appendChild(bar); card.appendChild(row);
    });
    const link = el("a", "reference-open", "Open ToS PDF");
    link.href = encodeURI(blueprint.pdfPath);
    card.appendChild(link);
    const download = el("a", "reference-download", "Download ToS PDF");
    download.href = encodeURI(blueprint.pdfPath); download.setAttribute("download", blueprint.file);
    card.appendChild(download);
    host.appendChild(card);
  });
}






