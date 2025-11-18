# Twitter Automation Agent — Full Documentation

## 📌 Overview

The **Twitter Automation Agent** is a Node.js-based system that automatically:

- Fetches the latest **Tech** and **Business** news
- Uses **Google Gemini** to generate high-quality tweets
- Posts **twice-daily news tweets** (8 AM & 6 PM)
- Posts a **standalone AI-generated tweet** at noon
- Likes & retweets relevant tech/business tweets automatically
- Scrapes images for articles missing images
- Hosts easily on **Render**, without needing webhooks

This agent handles **content curation**, **tweet generation**, **media uploading**, **scheduling**, and **engagement automation** with minimal human intervention.

---

# 🚀 Features

### 📰 **Automated News Fetching**

- Pulls RSS feeds from multiple tech & business outlets
- Extracts titles, links, summaries, images, and publication dates
- Scrapes article images using `cheerio` when RSS feeds lack them

### 🧠 **AI Tweet Generation (Gemini)**

The agent uses **@google/genai** (Gemini 2.0 Flash) to:

- Summarize news into tweets under 280 characters
- Generate smart captions, hooks, or questions
- Generate a standalone midday tweet with no article source

### 🖼️ **Image Support**

- Automatically extracts and uploads images to Twitter
- Uses the Twitter v1 media upload API
- Attaches the image to the tweet

### 📅 **Scheduled Automation**

Using **node-cron**, the agent runs:

| Time (Africa/Nairobi) | Action                              |
| --------------------- | ----------------------------------- |
| **8 AM**              | Tweet latest curated news           |
| **12 PM**             | Standalone AI-generated tweet       |
| **6 PM**              | Tweet latest curated news           |
| **Every 3 hours**     | Auto-like + retweet relevant tweets |

### ❤️ **Auto Engagement**

- Searches for tweets related to _tech_, _business_, and _AI_
- Likes and retweets them every 3 hours
- Tracks already-engaged tweets to avoid duplication

### 🛠️ **Content Curation Logic**

- Pools multiple feeds
- Sorts by publication date
- Filters out previously posted stories
- Selects the best items for posting

### 🔧 **Zero Webhook Setup**

The scheduler runs automatically when deployed on Render.
No external triggers required.

---

# 🧱 Tech Stack

### **Backend**

- Node.js (ES Modules)
- Axios (HTTP)
- RSS-parser
- Cheerio (HTML scraping)
- Node-cron

### **AI**

- Google Gemini (via `@google/genai`)
- Models used: `gemini-2.0-flash`

### **Twitter**

- Twitter API v2 (tweet posting, search, retweeting, liking)
- Twitter API v1 (image upload)

### **Deployment**

- Render (always-on background worker)
- Node.js environment

---

# 📂 Project Structure

```
src/
│
├── index.js                 # Entry point
│
├── config/
│   ├── scheduler.js         # Cron-based automation logic
│   ├── twitter.js           # Twitter client config
│   └── sources.js           # RSS feed URLs
│
├── services/
│   ├── newsFetcher.js       # RSS + image scraping
│   ├── contentCurator.js    # De-duplication & selection logic
│   ├── tweetGenerator.js    # Gemini tweet generation
│   ├── twitterPoster.js     # Tweet & media posting
│   ├── twitterEngagement.js # Auto-like & retweet logic
│   └── storage.json         # Tracks posted & engaged tweets
│
└── testTweet.js             # Manual testing script
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the Project

```bash
git clone https://github.com/your/repo.git
cd twitter-agent
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Install Required Packages

Here is the complete list:

```bash
npm install @google/genai rss-parser axios cheerio node-cron twitter-api-v2 dotenv
```

## 4️⃣ Create `.env`

```
GEMINI_API_KEY=your_gemini_key_here

TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

---

# 📌 The Automated Workflow

## 1. Fetch News

`newsFetcher.js` retrieves RSS items → sorts → scrapes missing images.

## 2. Curate Articles

`contentCurator.js` filters out previously posted articles.

## 3. Generate Tweet Text

`tweetGenerator.js` uses Gemini to turn articles into readable tweets.

## 4. Upload Images + Post Tweet

`twitterPoster.js` uploads images via Twitter v1 API then posts via v2.

## 5. Auto Engagement

`twitterEngagement.js`:

- Searches for trending tech/business tweets
- Likes them
- Retweets them
- Skips ones already engaged

## 6. Schedule Everything

`scheduler.js` automates the timeline flawlessly.

---

# 🚀 Deployment on Render

### Create a "Web Service" or "Background Worker"

- Runtime: **Node**
- Build command:

  ```
  npm install
  ```

- Start command:

  ```
  node src/index.js
  ```

### Enable "Keep Alive"

This ensures cron jobs keep running.

### No Webhook Required

Cron triggers run inside your Node process.
Render will keep your instance alive and running.

---

# 🧪 Testing Locally

To test tweet generation + posting:

```bash
node src/testTweet.js
```

To test only the Gemini tweet text:

```bash
node src/testTweetText.js
```

---

# 🔐 Storage & Safety

### `storage.json`

Tracks:

- Posted articles (by link)
- Tweets already liked/retweeted

This prevents duplicates and unwanted behavior.

---

# 🧩 Future Enhancements (Optional)

- Auto-follow relevant accounts
- Auto-DM new followers
- Trend detection with Gemini
- Multi-language tweet support
- Image caption generation using Gemini Vision

---

# 🎯 Final Notes

This agent is designed to:

- Run continuously
- Require **no human supervision**
- Blend AI + automation + news intelligently
- Grow your account organically and safely
