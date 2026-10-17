(() => {
  const $ = (id) => document.getElementById(id);
  const canvas = $("qr"), ctx = canvas.getContext("2d");
  const state = { mode: "link", imageUrl: "" };
  let timer, current = null;

  const tabs = ["link", "text", "image"];
  function setMode(mode) {
    state.mode = mode;
    tabs.forEach((t) => {
      const sel = t === mode;
      $("tab-" + t).setAttribute("aria-selected", sel);
      $("tab-" + t).tabIndex = sel ? 0 : -1;
      $("panel-" + t).hidden = !sel;
    });
    schedule(0);
  }
  tabs.forEach((t) => {
    $("tab-" + t).addEventListener("click", () => setMode(t));
    $("tab-" + t).addEventListener("keydown", (e) => {
      const i = tabs.indexOf(t);
      const next = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!next) return;
      const to = tabs[(i + next + tabs.length) % tabs.length];
      setMode(to); $("tab-" + to).focus();
    });
  });

  function getValue() {
    if (state.mode === "link") {
      const v = $("in-link").value.trim();
      if (!v) return "";
      return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : "https://" + v;
    }
    if (state.mode === "text") return $("in-text").value;
    return state.imageUrl;
  }

  function luminance(hex) {
    const c = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  function buildQR(value) {
    const qr = qrcode(0, $("ec").value);
    qr.addData(value, "Byte");
    qr.make();
    return qr;
  }

  function draw(qr, size, fg, bg, round) {
    const n = qr.getModuleCount(), quiet = 4, cell = size / (n + quiet * 2);
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fg;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c)) continue;
      const x = (c + quiet) * cell, y = (r + quiet) * cell;
      if (round && ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, cell, cell, cell * 0.32); ctx.fill(); }
      else ctx.fillRect(x, y, cell + 0.4, cell + 0.4);
    }
  }

  function toSVG(qr, fg, bg, round) {
    const n = qr.getModuleCount(), quiet = 4, total = n + quiet * 2;
    let rects = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) rects += `<rect x="${c + quiet}" y="${r + quiet}" width="1" height="1"${round ? ' rx=".32"' : ""}/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="1024" height="1024" shape-rendering="${round ? "auto" : "crispEdges"}"><rect width="${total}" height="${total}" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`;
  }

  function showError(msg) { $("error").textContent = msg || ""; $("error").hidden = !msg; }

  function render() {
    const value = getValue();
    const fg = $("fg").value, bg = $("bg").value, round = $("shape").value === "round";
    $("contrast").hidden = contrast(fg, bg) >= 3;
    $("count").textContent = $("in-text").value.length + " characters";
    showError("");
    current = null;
    document.querySelector(".frame").classList.remove("live");
    $("dl-png").disabled = $("dl-svg").disabled = true;
    if (!value) return;
    try {
      const qr = buildQR(value);
      draw(qr, canvas.width, fg, bg, round);
      current = { qr, fg, bg, round };
      document.querySelector(".frame").classList.add("live");
      $("dl-png").disabled = $("dl-svg").disabled = false;
    } catch (e) {
      showError("That’s too much for one QR code. Shorten it, or lower error correction.");
    }
  }
  function schedule(ms = 150) { clearTimeout(timer); timer = setTimeout(render, ms); }

  ["in-link", "in-text", "fg", "bg", "shape", "ec"].forEach((id) => {
    $(id).addEventListener("input", () => schedule());
    $(id).addEventListener("change", () => schedule());
  });

  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  $("dl-png").addEventListener("click", () => canvas.toBlob((b) => b && download(b, "qrnova-code.png"), "image/png"));
  $("dl-svg").addEventListener("click", () => {
    if (!current) return;
    download(new Blob([toSVG(current.qr, current.fg, current.bg, current.round)], { type: "image/svg+xml" }), "qrnova-code.svg");
  });

  /* Image tab: shrink the photo in the browser, upload it, encode the returned link. */
  const status = (msg, bad) => { $("status").textContent = msg; $("status").classList.toggle("bad", !!bad); };

  function shrink(file) {
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const max = 1600, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        const g = c.getContext("2d");
        g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
        g.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => (b ? resolve(b) : reject()), "image/jpeg", 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }
  const toBase64 = (blob) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1]);
    r.onerror = rej; r.readAsDataURL(blob);
  });

  $("in-image").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    state.imageUrl = ""; schedule(0);
    $("drop").classList.remove("has");
    if (file.size > 25 * 1024 * 1024) return status("That image is too large. Choose one under 25 MB.", true);
    status("Uploading…");
    try {
      const blob = await shrink(file);
      if (blob.size > 3.5 * 1024 * 1024) return status("Image is still too large after resizing. Try a smaller one.", true);
      const res = await fetch("/api/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: await toBase64(blob), type: "image/jpeg" }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Upload failed");
      state.imageUrl = out.url;
      $("drop-label").textContent = file.name;
      $("drop").classList.add("has");
      status("Done. Scan the code to open your image.");
      schedule(0);
    } catch (err) {
      status(err.message && err.message !== "undefined" ? err.message : "Upload failed. Check your connection and try again.", true);
    }
  });

  render();
})();
