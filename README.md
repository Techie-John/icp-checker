# ICP Checker

A free, open source Chrome extension that tells you if someone on LinkedIn matches your Ideal Customer Profile — and exactly what to say to them.

Powered by [Groq](https://groq.com) (free API). Fast. Private. No data stored anywhere except your own browser.

---

## What it does

1. You visit any LinkedIn profile
2. Click the extension icon
3. Get back:
   - ✅ Fit score (Strong Fit / Weak Fit / Not a Fit)
   - 🧠 Why they are or aren't a fit
   - 💬 A personalized opening message you can copy and send instantly

---

## Setup (takes 3 minutes)

### 1. Get a free Groq API key
- Go to [console.groq.com](https://console.groq.com)
- Sign up for free
- Create an API key


### 2. Load the extension in Chrome
- Go to `chrome://extensions`
- Enable **Developer Mode** (top right)
- Click **Load Unpacked**
- Select the `icp-checker` folder

### 3. Configure your ICP
- Click the extension icon → **⚙ Settings**
- Paste your Groq API key
- Describe your ideal client in plain English

**Example ICP:**
> Early-stage SaaS founders with a live product but under 500 users. Struggling with organic user acquisition. No big marketing budget. Based in US, UK, or Nigeria.

### 4. Use it
- Visit any LinkedIn profile (`linkedin.com/in/...`)
- Click the extension icon
- See the result in seconds

---

## Stack
- Chrome Extension (Manifest V3)
- Vanilla JavaScript
- Groq API (`llama3-8b-8192` model)

---

## Contributing
PRs welcome. Open an issue first for major changes.

---

## Need help with your marketing?

This extension was built by **[John Ayodele](https://linkedin.com/in/techie-john)** — the software engineer who helps early-stage startups get their first users through organic marketing (no paid ads, no bloated agencies).

If you're struggling to get traction, I offer done-for-you marketing for founders who'd rather be building than figuring out outreach.

👉 **[Fill out this form and I'll reach out](https://docs.google.com/forms/d/e/1FAIpQLSdew87rWJ7cdpqUe2bLbw5blKJLmAuSibL0IPt780qh7tPY1Q/viewform?usp=header)**

No pressure. Just a quick chat to see if I can help.

---

Built by [John Gbenga Ayodele](https://linkedin.com/in/techie-john)
