# Database Schema Specification

AI School Platform

This document defines the database structure for the AI School Platform.

The database supports the following systems:

- User learning platform
- Skill evaluation system
- Talent database
- Corporate opportunity system
- Subscription billing

---

# 1 Users

Stores all platform users.

Table: users

Fields:

id (uuid)
name (string)
email (string, unique)
password_hash (string)
role (enum: student, instructor, admin, company)
created_at (timestamp)
updated_at (timestamp)

---

# 2 User Profiles

Extended profile information.

Table: user_profiles

Fields:

id (uuid)
user_id (uuid, fk users.id)
bio (text)
location (string)
avatar_url (string)
portfolio_url (string)
visibility (boolean)
created_at (timestamp)

---

# 3 Skills

Master skill table.

Table: skills

Fields:

id (uuid)
name (string)
category (string)

Example skills:

AI Automation
AI Marketing
AI Development
AI Design
AI Video Production

---

# 4 User Skills

Mapping between users and skills.

Table: user_skills

Fields:

id (uuid)
user_id (uuid, fk users.id)
skill_id (uuid, fk skills.id)
skill_level (integer)
verified (boolean)

---

# 5 Courses

Learning courses.

Table: courses

Fields:

id (uuid)
title (string)
description (text)
category (string)
level (integer)
published (boolean)
created_at (timestamp)

---

# 6 Lessons

Lessons within courses.

Table: lessons

Fields:

id (uuid)
course_id (uuid, fk courses.id)
title (string)
video_url (string)
content (text)
order_index (integer)

---

# 7 Enrollments

Users enrolled in courses.

Table: enrollments

Fields:

id (uuid)
user_id (uuid)
course_id (uuid)
progress (integer)
created_at (timestamp)

---

# 8 Assignments

Course assignments.

Table: assignments

Fields:

id (uuid)
course_id (uuid)
title (string)
description (text)
max_score (integer)

---

# 9 Assignment Submissions

User assignment submissions.

Table: assignment_submissions

Fields:

id (uuid)
assignment_id (uuid)
user_id (uuid)
submission_url (string)
score (integer)
feedback (text)
created_at (timestamp)

---

# 10 Skill Scores

Aggregated AI skill evaluation.

Table: skill_scores

Fields:

id (uuid)
user_id (uuid)
score (integer)
level (integer)
last_updated (timestamp)

---

# 11 Projects

Real-world AI projects.

Table: projects

Fields:

id (uuid)
title (string)
description (text)
status (enum: open, active, completed)
created_at (timestamp)

---

# 12 Project Members

Users participating in projects.

Table: project_members

Fields:

id (uuid)
project_id (uuid)
user_id (uuid)
role (string)

---

# 13 Portfolios

User portfolio items.

Table: portfolios

Fields:

id (uuid)
user_id (uuid)
title (string)
description (text)
project_url (string)
created_at (timestamp)

---

# 14 Companies

Corporate users.

Table: companies

Fields:

id (uuid)
company_name (string)
industry (string)
website (string)
created_at (timestamp)

---

# 15 Opportunities

Corporate job or project opportunities.

Table: opportunities

Fields:

id (uuid)
company_id (uuid)
title (string)
description (text)
required_skills (text)
status (open / closed)
created_at (timestamp)

---

# 16 Applications

User applications to opportunities.

Table: applications

Fields:

id (uuid)
opportunity_id (uuid)
user_id (uuid)
status (pending / accepted / rejected)
created_at (timestamp)

---

# 17 Subscriptions

Subscription billing.

Table: subscriptions

Fields:

id (uuid)
user_id (uuid)
plan_name (string)
status (active / cancelled)
current_period_end (timestamp)

---

# 18 Payments

Payment records.

Table: payments

Fields:

id (uuid)
user_id (uuid)
amount (integer)
currency (string)
payment_provider (string)
created_at (timestamp)

---

# Key Relationships

users → user_profiles
users → enrollments
users → assignment_submissions
users → skill_scores
users → portfolios
courses → lessons
courses → assignments
companies → opportunities
opportunities → applications
