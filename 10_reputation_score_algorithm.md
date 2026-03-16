# Reputation Score Algorithm

AI School Platform

This document defines the Reputation Score system used to measure a user's trust, reliability, and collaboration quality.

The Reputation Score complements the AI Skill Score.

Skill Score represents capability.
Reputation Score represents trustworthiness.

---

# 1 Score Overview

Reputation Score Range

0 – 1000

Score Meaning

0 – 199  : New User
200 – 399 : Emerging Contributor
400 – 599 : Trusted Contributor
600 – 799 : Highly Trusted Professional
800 – 1000 : Elite AI Professional

---

# 2 Reputation Components

Reputation Score is calculated using multiple trust signals.

Project Feedback
Peer Reviews
Instructor Reviews
Corporate Reviews
Community Contribution

Total Formula

Reputation Score =
Project Feedback +
Peer Reviews +
Instructor Reviews +
Corporate Reviews +
Community Contribution

---

# 3 Project Feedback

After participating in projects, members evaluate each other.

Evaluation Criteria

Communication
Reliability
Delivery Quality
Collaboration

Score Range

0 – 300

---

# 4 Peer Reviews

Users may review other participants after:

team projects
collaborative assignments

Review signals include:

helpfulness
technical contribution
responsiveness

Score Range

0 – 150

---

# 5 Instructor Reviews

Instructors may rate students based on:

project quality
problem solving
learning progress

Score Range

0 – 200

---

# 6 Corporate Reviews

Companies may evaluate talent after:

project completion
contract work
internship collaboration

Evaluation factors:

professionalism
delivery quality
communication

Score Range

0 – 300

---

# 7 Community Contribution

Community activity contributes to reputation.

Examples

forum answers
mentoring other users
open resource sharing

Score Range

0 – 50

---

# 8 Reputation Calculation

Step 1

Collect signals from:

projects
reviews
community activity

Step 2

Normalize scores.

Step 3

Update reputation_score table.

---

# 9 Reputation Decay

To keep the score current, inactivity may reduce reputation.

Example

No activity for 6 months
→ score decay 5%

No activity for 12 months
→ score decay 15%

---

# 10 Fraud Prevention

To prevent manipulation:

peer reviews require mutual interaction
corporate reviews require verified projects
suspicious voting patterns are flagged

---

# 11 Reputation in Talent Discovery

Companies may filter talent by:

Reputation Score
Skill Score
Project Experience

Example search

Skill Score ≥ 600
Reputation Score ≥ 500

---

# 12 Combined Talent Score

Platforms may combine Skill Score and Reputation Score.

Example formula

Talent Score =
(Skill Score × 0.7) +
(Reputation Score × 0.3)

This provides a balanced evaluation of both capability and trust.
