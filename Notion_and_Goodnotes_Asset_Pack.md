# Notion & Goodnotes Asset Pack - Questify

This guide contains all the assets, copy-pasteable formulas, database relations, and templates required to build and sell the **Notion** and **Goodnotes** versions of the *Questify Dashboard*. 

Use this documentation to compile your digital product bundle for platforms like Gumroad, Etsy, or your own store.

---

## 1. Notion Database Architecture & Copy-Paste Formulas

To build the automated Notion version, you need 3 core databases: **1. Character Profile**, **2. Tasks & Habits**, and **3. Quests & Adventures**.

### Database A: Character Profile
This is the single-row dashboard database holding character stats, levels, and total currency.

* **Strength** (Number) - 💪 STR
* **Intelligence** (Number) - 🧠 INT
* **Wealth** (Number) - 💰 WLT
* **Health** (Number) - ❤️ HLT
* **Social** (Number) - 🤝 SOC
* **Total XP Rollup** (Rollup) - Summarizes completed XP from Database B. Name it `Total XP`.
* **Total Gold Rollup** (Rollup) - Summarizes earned Gold from Database B and C. Name it `Total Gold`.
* **Spent Gold** (Number) - Gold spent in the reward shop.
* **Current Gold** (Formula):
  ```text
  prop("Total Gold") - prop("Spent Gold")
  ```

#### Formula 1: Current Level (Algebraic Formula)
This formula automatically calculates the Character Level using a quadratic equation based on cumulative XP (0 XP for Level 1, 100 XP for Level 2, 250 XP for Level 3, 450 XP for Level 4, 700 XP for Level 5, etc.):
```text
floor(-0.5 + 0.2 * sqrt(56.25 + prop("Total XP")))
```

#### Formula 2: XP Needed for Next Level
Calculates the total cumulative XP required to reach the *next* level:
```text
let(currentLvl, floor(-0.5 + 0.2 * sqrt(56.25 + prop("Total XP"))), 25 * pow(currentLvl + 1, 2) + 25 * (currentLvl + 1) - 50)
```

#### Formula 3: XP Earned in Current Level
Calculates the XP earned solely within the current level boundary:
```text
let(currentLvl, floor(-0.5 + 0.2 * sqrt(56.25 + prop("Total XP"))), let(prevLvlXp, 25 * pow(currentLvl, 2) + 25 * currentLvl - 50, prop("Total XP") - prevLvlXp))
```

#### Formula 4: XP Next Level Delta
Calculates the total XP spacing between the current level and the next:
```text
let(currentLvl, floor(-0.5 + 0.2 * sqrt(56.25 + prop("Total XP"))), 100 + (currentLvl - 1) * 50)
```

#### Formula 5: Synthwave Progress Bar
Generates a visual progress bar (e.g. `██████░░░░ 60%`) based on current level progress:
```text
let(currentLvl, floor(-0.5 + 0.2 * sqrt(56.25 + prop("Total XP"))), let(prevLvlXp, 25 * pow(currentLvl, 2) + 25 * currentLvl - 50, let(lvlXp, prop("Total XP") - prevLvlXp, let(nextLvlXp, 100 + (currentLvl - 1) * 50, let(percent, min(100, max(0, round(lvlXp / nextLvlXp * 100))), let(filled, floor(percent / 10), slice("██████████", 0, filled) + slice("░░░░░░░░░░", 0, 10 - filled) + " " + format(percent) + "%"))))))
```

---

### Database B: Tasks & Habits
This database holds daily habits, checklist items, and one-off tasks.

* **Task Name** (Title)
* **Completed** (Checkbox)
* **XP Value** (Number) - (e.g., Workout = 20, Water = 5)
* **Gold Value** (Number) - (e.g., 5-10 gold)
* **Stat Alignment** (Select) - (Strength, Intelligence, Wealth, Health, Social)
* **Relation to Profile** (Relation) - Connects to the single row in **Database A**.

#### Formula 6: Completed XP Awarded
Only counts XP if checked complete:
```text
if(prop("Completed"), prop("XP Value"), 0)
```

#### Formula 7: Completed Gold Awarded
Only counts Gold if checked complete:
```text
if(prop("Completed"), prop("Gold Value"), 0)
```

---

### Database C: Quests Database
Holds your main adventures (e.g. "Lose 10 kg") and tracks subquests progress.

* **Quest Name** (Title)
* **Stat Category** (Select) - (Strength, Intelligence, Wealth, Health, Social)
* **XP Reward** (Number) - Large payout (e.g. 500 XP)
* **Gold Reward** (Number) - Large payout (e.g. 200 Gold)
* **Subquest Total** (Number) - Number of total subquests (e.g., 3)
* **Subquests Completed** (Number) - Number of subquests checked off (e.g., 2)

#### Formula 8: Quest Progress Bar
Generates progress bars for individual quest cards:
```text
let(percent, round(prop("Subquests Completed") / prop("Subquest Total") * 100), let(filled, floor(percent / 10), slice("██████████", 0, filled) + slice("░░░░░░░░░░", 0, 10 - filled) + " " + format(percent) + "%"))
```

#### Formula 9: Claimable Reward Indicator
Instructs the user when they can claim the adventure XP/Gold:
```text
if(prop("Subquests Completed") == prop("Subquest Total"), "🏆 Claim Rewards Available!", "⚔️ Quest Active")
```

---

## 2. Goodnotes Interactive PDF Layout Planner

Goodnotes planners rely on clean, beautiful visual aesthetics. The PDF should be designed in **Canva** or **Figma** and exported as a **PDF with hyperlinked tabs** on the right side.

### Page-by-Page Asset List

| Page Number | Page Title | Visual Assets / Grid Items | Purpose |
| :--- | :--- | :--- | :--- |
| **Page 1** | **Character Cover** | Portrait box, Name banner, Level badge, circular XP ring. | First dashboard impression. |
| **Page 2** | **Daily Guild Board** | 5 blocks (Strength, Intellect, Wealth, Health, Social) with checkmarks. | Log habits and daily tasks. |
| **Page 3** | **Quest Adventure Log** | Floating scrolls templates, progress tracks (1-10 steps), reward boxes. | Multi-week epic goals. |
| **Page 4** | **Skill Trees Grid** | 5 branching trees with circles (Novice ➔ Hero ➔ Legend nodes). | Log milestones and write down unlocked titles. |
| **Page 5** | **Achievement Hall** | Grid of 12 badge outlines (trophy, shield, book icons). | Color in badges when milestones are reached. |
| **Page 6** | **Rewards Shop & Vault**| Coin bags slots, price tags, item inventory cards boxes. | Log earned gold and purchase rewards. |

### Canva / Figma Hyperlink Setup
1. Create a 6-page landscape canvas (1920x1080px or Standard A4 Landscape).
2. Design a **Tab Navigation Sidebar** on the right side of every page with buttons: `Profile`, `Dailies`, `Quests`, `Skills`, `Badges`, `Shop`.
3. In Canva/Figma, select the tab text/shape, press **Link**, and link it to the corresponding page number (e.g., Link `Dailies` button to Page 2).
4. Export as **PDF (Standard/Best for Printing)** to preserve vector icons and hyperlinks.

---

## 3. High-Converting Sales Copy (Gumroad / Etsy)

Use this sales page copy to list your finished product package!

```markdown
# ⚔️ Turn Self-Improvement into an RPG: Questify Dashboard ⚔️

Are you tired of ordinary, boring habit trackers that feel like another chore? 

It’s time to stop checking off lists and start **leveling up your life**. The **Questify Dashboard** turns your daily routines, long-term goals, and skill acquisitions into a fully interactive role-playing game experience.

---

## 🎮 What’s Inside the Bundle?

When you purchase the Questify Bundle, you unlock three powerful formats to fit your style:

### 1. 🌐 The Web App Dashboard (HTML5/CSS3/JS)
* **Retro 8-Bit Audio Synth**: Built-in chiptune sound effects for clicks, quest completions, level ups, and shop purchases.
* **Character Creator**: Choose from 18 gorgeous SVG avatars (Men/Women across Young, Adult, and Elder age groups).
* **Level-Up Stat Point System**: Gain points when you level up and allocate them to Strength, Intelligence, Wealth, Health, and Social.
* **Interactive Skill Trees & Achievements**: Glowing SVG connecting lines light up as you build habits and unlock traits.
* **Completely Private**: Stores data 100% locally in your browser with JSON backups.

### 2. 📋 The Automated Notion Dashboard
* Pre-configured databases with advanced formulas that automatically calculate your current level, XP bars, and reward shop transactions.
* Custom database rollups that dynamically calculate stats based on checked habits.

### 3. ✍️ The Interactive Goodnotes PDF
* Vector-based landscape pages designed for Goodnotes, Notability, or Penly.
* Clickable hyperlinked sidebar tabs for instant page switching.
* Minimalist retro styling suitable for writing, sketching, and coloring in achievement badges.

---

## 💪 Level Up Your Life Stats:
* **Strength** 🏋️ - Workouts, steps count, sports consistency.
* **Intelligence** 🧠 - Reading, courses progress, writing.
* **Wealth** 💰 - Monthly savings targets, investment deposits, side hustles.
* **Health** ❤️ - Quality sleep, hydration trackers, healthy meals.
* **Social** 🤝 - Reaching out to friends, networking events, family dinners.

---

### 🎁 Claim Your Reward:
Completing quests yields **Gold Coins**. Spend your hard-earned gold in the **Rewards Shop** to purchase guilt-free, real-life treats! (e.g. coffee treats, movie night, gaming sessions).

**Stop planning. Start questing. Level up today!**
```
