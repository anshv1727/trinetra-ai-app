(function () {
  var $ = function (id) { return document.getElementById(id); };

  // Navigation
  function show(view) {
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    $("view-" + view).classList.add("active");
    document.querySelectorAll(".nav").forEach(function (n) {
      n.classList.toggle("active", n.dataset.nav === view);
    });
  }
  document.querySelectorAll("[data-nav]").forEach(function (b) {
    b.addEventListener("click", function () { show(b.dataset.nav); });
  });

  // Toast for features not built yet
  var timer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  document.querySelectorAll("[data-toast]").forEach(function (b) {
    b.addEventListener("click", function () { toast(b.dataset.toast); });
  });
  $("micBtn").addEventListener("click", function () { toast("Voice arrives in Phase 3"); });

  // Clock, date, greeting
  function tick() {
    var d = new Date(), h = d.getHours();
    $("clock").textContent = d.toLocaleTimeString([], { hour12: false });
    $("date").textContent = d.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    var g = h < 12 ? "Suprabhat (Good morning)" : h < 17 ? "Namaste (Good afternoon)" : h < 21 ? "Shubh Sandhya (Good evening)" : "Shubh Ratri (Good night)";
    $("greeting").textContent = g;
  }
  tick();
  setInterval(tick, 1000);

  // Chat
  var log = $("chatLog"), input = $("chatInput");
  function add(text, who) {
    var m = document.createElement("div");
    m.className = "msg " + who;
    m.textContent = text; // textContent keeps user input safe
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  function send() {
    var text = input.value.trim();
    if (!text) return;
    add(text, "user");
    input.value = "";
    var wait = add("...", "bot");
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) { wait.textContent = d.reply || d.error || "Unknown error"; })
      .catch(function () { wait.textContent = "Cannot reach the server. Is Flask running?"; });
  }
  $("sendBtn").addEventListener("click", send);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
