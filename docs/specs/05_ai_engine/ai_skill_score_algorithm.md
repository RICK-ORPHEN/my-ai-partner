# AI Skill Score Algorithm

AI School Platform

This document defines the algorithm used to calculate the AI Skill Score for users.

The AI Skill Score represents a user's practical capability to create value using artificial intelligence.

The score is used for:

- skill evaluation
- user ranking
- talent discovery by companies
- progress tracking

---

# 1 Score Overview

The AI Skill Score is a composite score calculated from multiple learning and activity signals.

Score Range

0 – 1000

Skill Levels

Level 1 : 0 – 199
Level 2 : 200 – 399
Level 3 : 400 – 599
Level 4 : 600 – 799
Level 5 : 800 – 1000

---

# 2 Score Components

The total score is calculated using the following components.

Assignment Score
Project Score
Skill Verification Score
Portfolio Score
Activity Score

Total Score Formula

AI Skill Score =
Assignment Score +
Project Score +
Skill Verification Score +
Portfolio Score +
Activity Score

---

# 3 Assignment Score

Assignments measure understanding of course material.

Each assignment has a maximum score.

Assignment Score Formula

Assignment Score =
Sum of all assignment results

Example

Assignment 1 : 80
Assignment 2 : 90
Assignment 3 : 70
Total Assignment Score = 240

Maximum recommended contribution:
300 points

---

# 4 Project Score

Projects measure real-world ability to apply AI.

Projects may include:

AI automation system
AI content production
AI software development
AI marketing workflow

Project evaluation factors:

Technical complexity
Innovation
Practical usefulness
Execution quality

Project Score Range

0 – 300

---

# 5 Skill Verification Score

Users can verify individual AI skills.

Examples

AI Automation
AI Development
AI Marketing
AI Creative Production

Each verified skill adds score.

Skill Score Formula

Verified Skill Level × Skill Weight

Example

AI Development Level 3
Weight = 40
Score = 120

Maximum contribution:
200 points

---

# 6 Portfolio Score

Users may submit portfolio projects.

Portfolio evaluation criteria:

Technical complexity
Originality
Real-world usage
Design quality

Portfolio Score Range

0 – 150

---

# 7 Activity Score

Measures user engagement.

Signals include:

course completion
assignment submissions
project participation
community contribution

Activity Score Range

0 – 50

---

# 8 Score Calculation Process

Step 1

Collect data from:

assignments
projects
skills
portfolio
activity logs

Step 2

Normalize each score category.

Step 3

Calculate weighted totals.

Step 4

Store result in skill_scores table.

---

# 9 Ranking System

Users are ranked globally based on AI Skill Score.

Ranking Types

Global Ranking
Category Ranking
Regional Ranking

Example Categories

AI Developer
AI Marketer
AI Creator
AI Automation Specialist

---

# 10 Company Talent Discovery

Companies may search users using:

AI Skill Score
Skill category
Project experience
Portfolio

This allows companies to discover qualified AI professionals directly from the platform.

---

# 11 Score Update Triggers

The AI Skill Score should be recalculated when:

assignment submitted
project completed
skill verified
portfolio updated

---

# 12 Anti Gaming Measures

To prevent score manipulation:

duplicate submissions should be filtered
portfolio evaluation requires manual review
project score requires peer or instructor validation

---

# 13 Future Improvements

Possible future enhancements include:

AI-based portfolio evaluation
automated project quality scoring
machine learning ranking models
