// popup.js — screenshot-based LinkedIn ICP analyzer using Groq vision

const show = (id) => {
  ["error-state", "loading-state", "result-state", "not-linkedin"].forEach(
    (s) => document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
};

const showError = (msg) => {
  document.getElementById("error-message").textContent = msg;
  show("error-state");
};

async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 85 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        // Strip the data:image/jpeg;base64, prefix — Groq wants raw base64
        resolve(dataUrl.split(",")[1]);
      }
    });
  });
}

async function extractPageText(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action: "extractText" });
    return response?.fullText || "";
  } catch {
    return ""; // graceful fallback — screenshot alone will still work
  }
}

async function analyzeScreenshot(base64Image, pageText, apiKey, icp) {
  const textSection = pageText
    ? `\n\nHere is the full extracted text from the LinkedIn profile page for deeper context:\n\n${pageText}`
    : "";

  const systemPrompt = `You are an ICP (Ideal Customer Profile) analyzer for a marketing agency.

The user has defined their ICP as:
"${icp}"

You will be given a screenshot of a LinkedIn profile AND the full extracted text from the page.
Use both to get the most complete picture of this person — the screenshot for visual context, the text for depth (full About, all experience, skills, etc.).

Return a JSON response with exactly these fields:

{
  "name": "Full name of the person",
  "headline": "Their LinkedIn headline",
  "fit": "Strong Fit" | "Weak Fit" | "Not a Fit",
  "reason": "2-3 sentence explanation of why this person is or is not a fit",
  "message": "A short, warm, human opening message (3-4 sentences max) the user can send on LinkedIn. Reference something specific from their profile. Do NOT make it sound like a sales pitch. Make it feel like genuine curiosity."
}

Only return valid JSON. No extra text. No markdown code fences.${textSection}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: systemPrompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Groq API error: " + response.status + " — " + err);
  }

  const data = await response.json();
  let raw = data.choices[0].message.content.trim();

  // Strip markdown fences if model adds them
  raw = raw.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/```$/, "").trim();

  return JSON.parse(raw);
}

function renderResult(result) {
  document.getElementById("profile-name").textContent = result.name || "Unknown";
  document.getElementById("profile-headline").textContent = result.headline || "";

  const badge = document.getElementById("fit-badge");
  badge.textContent = result.fit;
  badge.className = "fit-badge";
  if (result.fit === "Strong Fit") badge.classList.add("strong");
  else if (result.fit === "Weak Fit") badge.classList.add("weak");
  else badge.classList.add("no-fit");

  document.getElementById("fit-score").textContent = "";

  const bar = document.getElementById("score-bar");
  bar.style.width = result.fit === "Strong Fit" ? "100%" : result.fit === "Weak Fit" ? "50%" : "15%";
  bar.style.background = result.fit === "Strong Fit" ? "#22c55e" : result.fit === "Weak Fit" ? "#f59e0b" : "#ef4444";

  document.getElementById("fit-reason").textContent = result.reason;
  document.getElementById("fit-message").textContent = result.message;

  show("result-state");

  document.getElementById("copy-btn").onclick = () => {
    navigator.clipboard.writeText(result.message).then(() => {
      document.getElementById("copy-btn").textContent = "✅ Copied!";
      setTimeout(() => {
        document.getElementById("copy-btn").textContent = "📋 Copy message";
      }, 2000);
    });
  };
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url || !tab.url.includes("linkedin.com/in/")) {
    show("not-linkedin");
    return;
  }

  const { groqApiKey, icpDefinition } = await chrome.storage.local.get([
    "groqApiKey",
    "icpDefinition",
  ]);

  if (!groqApiKey) {
    showError("No Groq API key found. Please add it in ⚙ Settings.");
    return;
  }

  if (!icpDefinition) {
    showError("No ICP defined. Please describe your ideal client in ⚙ Settings.");
    return;
  }

  show("loading-state");

  try {
    // Run screenshot and text extraction in parallel for speed
    const [base64Image, pageText] = await Promise.all([
      captureScreenshot(),
      extractPageText(tab.id),
    ]);
    const result = await analyzeScreenshot(base64Image, pageText, groqApiKey, icpDefinition);
    renderResult(result);
  } catch (e) {
    showError("Something went wrong: " + e.message);
  }
}

document.addEventListener("DOMContentLoaded", init);
