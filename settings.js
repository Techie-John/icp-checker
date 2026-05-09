// settings.js

async function load() {
  const { groqApiKey, icpDefinition } = await chrome.storage.local.get([
    "groqApiKey",
    "icpDefinition",
  ]);
  if (groqApiKey) document.getElementById("api-key").value = groqApiKey;
  if (icpDefinition) document.getElementById("icp").value = icpDefinition;
}

document.getElementById("save-btn").addEventListener("click", async () => {
  const groqApiKey = document.getElementById("api-key").value.trim();
  const icpDefinition = document.getElementById("icp").value.trim();

  await chrome.storage.local.set({ groqApiKey, icpDefinition });

  const msg = document.getElementById("save-msg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2000);
});

load();
