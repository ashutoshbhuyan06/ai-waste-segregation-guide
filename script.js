// ============================================================
//  AI-Based Waste Segregation Guide — Classification Logic
//  No backend, no API. Everything runs in the browser.
//  Prototype: uses keyword matching against a curated database.
// ============================================================

// ---- Waste Database ----------------------------------------
// Each entry maps keywords to a waste category.
// 'exactMatch' keywords produce a higher confidence score.

const wasteData = [

  // ── Wet / Organic Waste ──────────────────────────────────
  {
    exactMatch: ["banana peel", "orange peel", "apple core", "egg shell", "eggshell",
                 "coffee grounds", "tea leaves", "fruit peel", "potato peel",
                 "vegetable peel", "food scrap", "food waste", "garden waste",
                 "grass clippings", "cooked food", "leftover rice", "leftover food",
                 "fruit waste", "vegetable waste", "kitchen waste", "organic waste",
                 "corn cob", "mango seed", "coconut shell", "sugarcane bagasse"],
    keywords:   ["banana", "orange", "apple", "vegetable", "veggie", "rice",
                 "bread", "onion", "grass", "leaves", "flower", "plant", "compost",
                 "tomato", "carrot", "spinach", "cabbage", "lettuce", "pea",
                 "bean", "lemon", "lime", "mango", "papaya", "guava", "pineapple",
                 "watermelon", "cucumber", "potato", "cooked", "rotten", "spoiled",
                 "expired food", "tea bag", "coffee filter"],
    category:   "Wet / Organic Waste",
    cssClass:   "wet",
    icon:       "🍌",
    reason:     "This item is biodegradable — it breaks down naturally through composting or microbial activity.",
    disposal:   "Place in the green/wet waste bin. Many municipalities collect it separately for composting.",
    tip:        "Start a small compost pit or bin at home. Organic waste turned into compost is a free, rich fertilizer for your garden."
  },

  // ── Dry Waste ────────────────────────────────────────────
  {
    exactMatch: ["newspaper", "cardboard", "old clothes", "broken glass", "mirror",
                 "notebook", "magazine", "wrapping paper", "paper bag",
                 "bubble wrap", "styrofoam", "foam packaging", "wooden plank",
                 "broken ceramic", "broken pottery"],
    keywords:   ["paper", "book", "cloth", "fabric", "textile", "jeans", "shirt",
                 "wood", "furniture", "mattress", "rubber", "leather", "ceramic",
                 "pottery", "dupatta", "saree", "trouser", "towel", "bedsheet",
                 "curtain", "carpet", "rug", "foam", "sponge", "stationery",
                 "pen", "pencil", "eraser", "scale", "envelope", "file",
                 "folder", "packaging material", "thermocol"],
    category:   "Dry Waste",
    cssClass:   "dry",
    icon:       "📰",
    reason:     "This item is non-biodegradable dry waste that doesn't decompose easily but can often be reused or recycled through specific channels.",
    disposal:   "Separate from wet waste and place in the dry waste bin. Some items like old clothes can be donated or given to rag-pickers.",
    tip:        "Donate old clothes and furniture rather than throwing them away. One person's waste is another's resource."
  },

  // ── Recyclable Waste ─────────────────────────────────────
  {
    exactMatch: ["plastic bottle", "plastic bag", "plastic container", "plastic cup",
                 "pet bottle", "aluminium can", "tin can", "steel can", "metal can",
                 "glass bottle", "glass jar", "milk carton", "tetra pack",
                 "aluminium foil", "copper wire", "metal scrap", "steel scrap",
                 "cardboard box", "paper carton", "juice carton", "water bottle"],
    keywords:   ["plastic", "polythene", "can", "carton", "scrap metal", "iron",
                 "aluminium", "aluminum", "copper", "steel", "tin", "glass",
                 "recycle", "recyclable", "pet", "hdpe", "ldpe", "pvc",
                 "packaging", "wrapper", "sachet", "pouch", "tray", "container"],
    category:   "Recyclable Waste",
    cssClass:   "recycle",
    icon:       "♻️",
    reason:     "This item is made of a material that can be processed and converted into new products, saving raw materials and energy.",
    disposal:   "Rinse clean and deposit at a local recycling centre or hand to an authorised kabadiwala / scrap dealer.",
    tip:        "Reduce single-use plastics wherever possible. Carry a reusable bag and water bottle to cut plastic waste at the source."
  },

  // ── E-Waste ───────────────────────────────────────────────
  {
    exactMatch: ["old mobile phone", "mobile phone", "smartphone", "laptop", "circuit board",
                 "hard drive", "pen drive", "led bulb", "cfl", "tube light",
                 "electric kettle", "iron box", "air conditioner", "remote control",
                 "charging cable", "charging adapter", "power bank", "set top box",
                 "electric iron", "hair dryer", "hair straightener", "electric shaver",
                 "electric toothbrush", "digital camera", "gaming console",
                 "smart watch", "fitness band", "bluetooth speaker", "wifi router"],
    keywords:   ["computer", "tablet", "monitor", "keyboard", "mouse", "printer",
                 "scanner", "television", "tv", "remote", "charger", "cable",
                 "earphones", "headphones", "camera", "calculator", "electronic",
                 "usb", "router", "modem", "refrigerator", "washing machine",
                 "microwave", "ac", "fan", "toaster", "bulb", "inverter",
                 "ups", "battery pack", "solar panel", "drone", "projector",
                 "speaker", "amplifier", "electronic device", "gadget",
                 "electric appliance", "electrical appliance", "fridge",
                 "geyser", "water heater", "mixer", "grinder", "juicer",
                 "blender", "cooler", "heater", "trimmer", "shaver"],
    category:   "E-Waste",
    cssClass:   "ewaste",
    icon:       "📱",
    reason:     "Electronic and electrical items contain toxic materials (lead, mercury, cadmium) that are dangerous if sent to landfill, but the metals inside are highly recoverable.",
    disposal:   "Never put in a regular bin. Drop at an authorised e-waste collection point, manufacturer take-back programme, or certified recycler.",
    tip:        "Before discarding, ask yourself if the item can be repaired or donated. Extending a device's life by even one year significantly lowers its environmental footprint."
  },

  // ── Hazardous Waste ───────────────────────────────────────
  {
    exactMatch: ["battery", "batteries", "lithium battery", "alkaline battery",
                 "paint can", "motor oil", "engine oil", "nail polish remover",
                 "fire extinguisher", "expired medicine", "paint", "pesticide",
                 "aerosol can", "spray paint", "weed killer", "rat poison",
                 "fluorescent bulb", "fluorescent tube", "mercury thermometer",
                 "used syringe", "used needle", "medical waste", "clinical waste"],
    keywords:   ["insecticide", "herbicide", "fertiliser", "fertilizer", "chemical",
                 "bleach", "acid", "solvent", "thinner", "nail polish", "aerosol",
                 "spray can", "lighter", "medicine", "pill", "tablet",
                 "capsule", "syringe", "needle", "thermometer", "mercury",
                 "radioactive", "asbestos", "cleaning agent", "disinfectant",
                 "sanitiser", "sanitizer", "hand sanitizer", "floor cleaner",
                 "toilet cleaner", "drain cleaner", "rust remover", "glue",
                 "adhesive", "resin", "epoxy", "varnish", "lacquer",
                 "turpentine", "kerosene", "fuel", "petrol", "diesel",
                 "gas cylinder", "lpg", "poison", "toxic", "corrosive",
                 "flammable", "biohazard", "sharps"],
    category:   "Hazardous Waste",
    cssClass:   "hazardous",
    icon:       "⚠️",
    reason:     "This item contains substances that are toxic, flammable, corrosive, or reactive and can cause serious harm to people, animals, or the environment if not handled correctly.",
    disposal:   "Store safely away from children and heat. Deliver to a certified hazardous-waste collection facility or municipal collection drive. NEVER pour down a drain or burn.",
    tip:        "Buy only the quantity of hazardous products you need, and choose eco-friendly alternatives where possible (e.g. vinegar-based cleaners instead of chemical ones)."
  }
];

// ---- Confidence Score ---------------------------------------
// Returns a percentage (35–95) based on how closely the input
// matches the database. This is a deterministic prototype
// estimate — NOT a certified AI prediction.
function getConfidence(input, entry) {
  if (!entry || entry.cssClass === "unknown") return 35;
  const query = input.trim().toLowerCase();

  // Exact multi-word phrase matched
  if (entry.exactMatch) {
    for (const phrase of entry.exactMatch) {
      if (query === phrase || query.includes(phrase)) return 92;
    }
  }
  // Single keyword matched
  for (const kw of entry.keywords) {
    if (query === kw || query.includes(kw)) return 74;
  }
  return 60; // fallback (should not normally reach here)
}

// ---- Classification Function --------------------------------
function classify(input) {
  const query = input.trim().toLowerCase();

  for (const entry of wasteData) {
    // Check exact-match phrases first (higher specificity)
    if (entry.exactMatch) {
      for (const phrase of entry.exactMatch) {
        if (query.includes(phrase)) return entry;
      }
    }
    // Then check general keywords
    for (const kw of entry.keywords) {
      if (query.includes(kw)) return entry;
    }
  }

  // Nothing matched — unknown item
  return {
    exactMatch: [],
    keywords:   [],
    category:   "Classification Uncertain",
    cssClass:   "unknown",
    icon:       "❓",
    reason:     `We couldn't confidently classify "${input.trim()}" with our current knowledge base.`,
    disposal:   "Check with your local municipal authority or waste-management body for the correct disposal method.",
    tip:        "When in doubt, keep the item separate from your regular bins and seek guidance — improper disposal can have lasting environmental consequences."
  };
}

// ---- localStorage Helpers -----------------------------------
const STORAGE_KEY_HISTORY   = "wsg_history";
const STORAGE_KEY_THEME     = "wsg_theme";
const MAX_HISTORY           = 10;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
  } catch (e) {
    return [];
  }
}

function saveHistory(item, category, cssClass, confidence) {
  const history = loadHistory();
  history.unshift({ item, category, cssClass, confidence, ts: Date.now() });
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (e) { /* storage unavailable — silently skip */ }
}

// ---- Analytics Calculator -----------------------------------
function calcAnalytics(history) {
  const counts = { total: history.length, wet: 0, dry: 0, recycle: 0, ewaste: 0, hazardous: 0, unknown: 0 };
  for (const h of history) {
    if      (h.cssClass === "wet")       counts.wet++;
    else if (h.cssClass === "dry")       counts.dry++;
    else if (h.cssClass === "recycle")   counts.recycle++;
    else if (h.cssClass === "ewaste")    counts.ewaste++;
    else if (h.cssClass === "hazardous") counts.hazardous++;
    else                                 counts.unknown++;
  }
  return counts;
}

// ---- Render: Analytics Dashboard ----------------------------
function renderAnalytics() {
  const history = loadHistory();
  const c       = calcAnalytics(history);

  document.getElementById("stat-total").textContent     = c.total;
  document.getElementById("stat-wet").textContent       = c.wet;
  document.getElementById("stat-dry").textContent       = c.dry + c.recycle; // dry + recyclable together
  document.getElementById("stat-ewaste").textContent    = c.ewaste;
  document.getElementById("stat-hazardous").textContent = c.hazardous;
  document.getElementById("stat-unknown").textContent   = c.unknown;
}

// ---- Render: History List -----------------------------------
function renderHistory() {
  const history    = loadHistory();
  const listEl     = document.getElementById("historyList");
  const emptyEl    = document.getElementById("historyEmpty");
  const clearBtn   = document.getElementById("clearHistoryBtn");
  const sectionEl  = document.getElementById("historySection");

  if (!listEl) return;

  listEl.innerHTML = "";

  if (history.length === 0) {
    emptyEl.style.display = "block";
    clearBtn.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  clearBtn.style.display = "inline-flex";

  history.forEach(function (entry) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML =
      '<span class="history-icon cat-dot cat-dot--' + entry.cssClass + '"></span>' +
      '<span class="history-item-text">' +
        '<strong>' + escapeHtml(entry.item) + '</strong>' +
        '<span class="history-meta">' + escapeHtml(entry.category) + '</span>' +
      '</span>' +
      '<span class="history-confidence">' + entry.confidence + '%</span>';
    listEl.appendChild(li);
  });
}

// ---- Safe HTML escape (for user-entered strings in innerHTML) --
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Render: Confidence Bar ---------------------------------
function renderConfidence(score) {
  const bar   = document.getElementById("confidenceBar");
  const label = document.getElementById("confidenceLabel");
  if (!bar || !label) return;

  bar.style.width = score + "%";

  // Colour the bar to reflect certainty level
  bar.className = "confidence-fill";
  if      (score >= 85) bar.classList.add("conf-high");
  else if (score >= 65) bar.classList.add("conf-medium");
  else                  bar.classList.add("conf-low");

  label.textContent = score + "%";
}

// ---- Download Report ----------------------------------------
// Generates a plain-text report and triggers a browser download.
// All processing is done entirely in the browser — no data is sent anywhere.
function downloadReport() {
  var item     = document.getElementById("wasteInput").value.trim();
  var category = document.getElementById("categoryName").textContent.trim();
  var conf     = document.getElementById("confidenceLabel").textContent.trim();
  var reason   = document.getElementById("resultReason").textContent.trim();
  var disposal = document.getElementById("resultDisposal").textContent.trim();
  var tip      = document.getElementById("resultTip").textContent.trim();

  var date = new Date().toLocaleString();

  var report =
    "AI-BASED WASTE SEGREGATION GUIDE\n" +
    "Generated: " + date + "\n" +
    "--------------------------------\n\n" +
    "Waste Item      : " + item      + "\n" +
    "Category        : " + category  + "\n" +
    "AI Confidence   : " + conf      + "\n\n" +
    "Reason          :\n" + reason   + "\n\n" +
    "Disposal Action :\n" + disposal + "\n\n" +
    "Sustainability Tip:\n" + tip    + "\n\n" +
    "--------------------------------\n" +
    "Prototype Notice:\n" +
    "This is a prototype decision-support tool using a curated keyword\n" +
    "knowledge base. The result is not a certified AI prediction.\n" +
    "Waste-management rules may vary by location.\n";

  var blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "waste-analysis-report.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- UI Helpers ---------------------------------------------
function showResult(entry, confidence) {
  const card = document.getElementById("resultCard");
  card.className = "result-card " + entry.cssClass;

  document.getElementById("categoryIcon").textContent   = entry.icon;
  document.getElementById("categoryName").textContent   = entry.category;
  document.getElementById("resultReason").textContent   = entry.reason;
  document.getElementById("resultDisposal").textContent = entry.disposal;
  document.getElementById("resultTip").textContent      = entry.tip;

  renderConfidence(confidence);

  // Show the reset and download buttons once a result is displayed
  document.getElementById("resetBtn").style.display        = "inline-flex";
  document.getElementById("downloadReportBtn").style.display = "inline-flex";
}

function clearValidation() {
  document.getElementById("validationMsg").textContent = "";
}

function hideResult() {
  document.getElementById("resultCard").className = "result-card hidden";
  document.getElementById("resetBtn").style.display          = "none";
  document.getElementById("downloadReportBtn").style.display = "none";
}

// ---- AI Workflow Panel Updater ------------------------------
const CSS_TO_CHIP = {
  wet:       "cat-wet",
  dry:       "cat-dry",
  recycle:   "cat-dry",
  ewaste:    "cat-ewaste",
  hazardous: "cat-hazardous",
  unknown:   "cat-unknown"
};

function updateWorkflow(inputText, entry, confidence) {
  document.getElementById("wf-input").textContent    = "\u201C" + inputText.trim() + "\u201D";
  document.getElementById("wf-norm").textContent     = "Normalized to lowercase: \u201C" + inputText.trim().toLowerCase() + "\u201D";
  document.getElementById("wf-match").textContent    =
    entry.cssClass === "unknown"
      ? "No keyword match found in the knowledge base."
      : "Keyword match found \u2192 category: " + entry.category;
  document.getElementById("wf-category").textContent = entry.icon + "  " + entry.category +
    "  \u2014  Confidence estimate: " + confidence + "%";
  document.getElementById("wf-reason").textContent   = entry.reason;
  document.getElementById("wf-disposal").textContent = entry.disposal;
  document.getElementById("wf-tip").textContent      = entry.tip;

  document.querySelectorAll(".workflow-step").forEach(function (step) {
    step.classList.add("active");
  });

  document.querySelectorAll(".cat-chip").forEach(function (chip) {
    chip.classList.remove("cat-active");
  });
  var chipClass = CSS_TO_CHIP[entry.cssClass];
  if (chipClass) {
    var activeChip = document.querySelector("." + chipClass);
    if (activeChip) activeChip.classList.add("cat-active");
  }
}

function resetWorkflow() {
  document.querySelectorAll(".workflow-step").forEach(function (step) {
    step.classList.remove("active");
  });
  document.getElementById("wf-input").textContent    = "Waiting for input\u2026";
  document.getElementById("wf-norm").textContent     = "Input will be lowercased and trimmed.";
  document.getElementById("wf-match").textContent    = "Keywords will be matched against the curated knowledge base.";
  document.getElementById("wf-category").textContent = "Category and confidence estimate will appear here.";
  document.getElementById("wf-reason").textContent   = "Explanation will appear here after analysis.";
  document.getElementById("wf-disposal").textContent = "Disposal guidance will appear here after analysis.";
  document.getElementById("wf-tip").textContent      = "Sustainability tip will appear here after analysis.";

  document.querySelectorAll(".cat-chip").forEach(function (chip) {
    chip.classList.remove("cat-active");
  });
}

// ---- Reset / New Analysis -----------------------------------
function resetAnalysis() {
  document.getElementById("wasteInput").value = "";
  clearValidation();
  hideResult();
  resetWorkflow();
  document.getElementById("wasteInput").focus();
}

// ---- Main Click Handler -------------------------------------
function analyzeWaste() {
  const input        = document.getElementById("wasteInput").value;
  const validationMsg = document.getElementById("validationMsg");

  if (!input.trim()) {
    validationMsg.textContent = "⚠️ Please enter a waste item before clicking Analyze.";
    hideResult();
    resetWorkflow();
    return;
  }

  clearValidation();
  const result     = classify(input);
  const confidence = getConfidence(input, result);

  showResult(result, confidence);
  updateWorkflow(input, result, confidence);
  saveHistory(input.trim(), result.category, result.cssClass, confidence);
  renderHistory();
  renderAnalytics();

  document.getElementById("resultCard").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---- Sample Chip Helper -------------------------------------
function fillSample(item) {
  document.getElementById("wasteInput").value = item;
  clearValidation();
  hideResult();
  resetWorkflow();
}

// ---- Clear History ------------------------------------------
function clearHistory() {
  try { localStorage.removeItem(STORAGE_KEY_HISTORY); } catch (e) {}
  renderHistory();
  renderAnalytics();
}

// ---- Dark / Light Mode Toggle -------------------------------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn  = document.getElementById("themeToggleBtn");
  if (!btn) return;
  if (theme === "dark") {
    btn.textContent = "☀️ Light Mode";
    btn.setAttribute("aria-label", "Switch to light mode");
  } else {
    btn.textContent = "🌙 Dark Mode";
    btn.setAttribute("aria-label", "Switch to dark mode");
  }
}

function toggleDarkMode() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next    = current === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(STORAGE_KEY_THEME, next); } catch (e) {}
}

// ---- Initialise on DOM Ready --------------------------------
document.addEventListener("DOMContentLoaded", function () {

  // Restore theme preference
  var savedTheme = "light";
  try { savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || "light"; } catch (e) {}
  applyTheme(savedTheme);

  // Hydrate history and analytics on load
  renderHistory();
  renderAnalytics();

  // Enter key triggers analysis
  document.getElementById("wasteInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") analyzeWaste();
  });
});
