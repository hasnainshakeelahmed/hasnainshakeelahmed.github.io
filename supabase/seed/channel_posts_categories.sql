-- Classify the 28 existing channel posts into the fixed category set used
-- by the site sections (Scholarship / Internship / Job / Course /
-- Study Skill / Career Guidance / Ed-Tech Tool / EDU Update).
-- Posts are NOT a standalone section: Scholarships, Jobs and Education
-- each show their own posts block filtered by category.
--
-- Classification is by the post's own title/content — nothing else changes.
-- Idempotent: re-running sets the same values again.
-- Run in Supabase SQL Editor AFTER the posts exist.
--
-- NOTE: the live DB already has these rows; this only fills category,
-- which was NULL for all seeded posts.

-- Scholarships channel: scholarships
UPDATE channel_posts SET category = 'Scholarship' WHERE title = 'Gates Cambridge Scholarship 2027-28';
UPDATE channel_posts SET category = 'Scholarship' WHERE title = 'Commonwealth Master''s Scholarships 2027/28';
UPDATE channel_posts SET category = 'Scholarship' WHERE title = 'Yenching Academy Scholarship 2027 — Peking University';
UPDATE channel_posts SET category = 'Scholarship' WHERE title = 'University of Miami Stamps Scholarship 2027';
UPDATE channel_posts SET category = 'Scholarship' WHERE title = 'Commonwealth Master''s/PhD 2027-28 — 5 days left countdown';

-- Scholarships channel: internships
UPDATE channel_posts SET category = 'Internship' WHERE title = 'CBD Punjab Youth Career Program 2026';
UPDATE channel_posts SET category = 'Internship' WHERE title = 'Punjab STI Teacher Interns 2026';
UPDATE channel_posts SET category = 'Internship' WHERE title = 'WAPDA Paid Internship Program 2026';

-- Scholarships channel: jobs
UPDATE channel_posts SET category = 'Job' WHERE title = 'Micro1: Software Engineer (New Grad)';
UPDATE channel_posts SET category = 'Job' WHERE title = 'UN Young Professionals Programme 2026';
UPDATE channel_posts SET category = 'Job' WHERE title = 'Deloitte Graduate Scheme 2027';
UPDATE channel_posts SET category = 'Job' WHERE title = 'NADRA Flutter Developer Jobs 2026';

-- Main channel: courses
UPDATE channel_posts SET category = 'Course' WHERE title = 'Harvard CS50x: Free Intro to Computer Science';
UPDATE channel_posts SET category = 'Course' WHERE title = 'Harvard''s CS50 — Learn Computer Science for Free';

-- Main channel: study skills
UPDATE channel_posts SET category = 'Study Skill' WHERE title = 'Spaced Repetition: Study Less, Remember More';
UPDATE channel_posts SET category = 'Study Skill' WHERE title = 'Active Recall — The #1 Study Technique You''re Not Using';

-- Main channel: career guidance
UPDATE channel_posts SET category = 'Career Guidance' WHERE title = 'Build a Standout CV With Zero Experience';
UPDATE channel_posts SET category = 'Career Guidance' WHERE title = 'The 10 Skills That Will Rule Jobs by 2030';
UPDATE channel_posts SET category = 'Career Guidance' WHERE title = 'Freelancing Roadmap for Students: From Zero to First Client';
UPDATE channel_posts SET category = 'Career Guidance' WHERE title = 'How to Start in Data Analytics';

-- Main channel: ed-tech tools
UPDATE channel_posts SET category = 'Ed-Tech Tool' WHERE title = 'Google NotebookLM: Your AI Study Partner (Free)';
UPDATE channel_posts SET category = 'Ed-Tech Tool' WHERE title = 'Zotero — Free Research Manager for Students';
UPDATE channel_posts SET category = 'Ed-Tech Tool' WHERE title = 'Anki — The Free App That Makes Anything Memorable';

-- Main channel: edu updates
UPDATE channel_posts SET category = 'EDU Update' WHERE title = 'CM Punjab E-Bike Scheme: Phase 2 Open for Students';
UPDATE channel_posts SET category = 'EDU Update' WHERE title = 'UN Moves to Make Free Education a Global Right';
UPDATE channel_posts SET category = 'EDU Update' WHERE title = 'PM Youth Programme x China: Digital Skills for 100,000 Youth';
UPDATE channel_posts SET category = 'EDU Update' WHERE title = '273 Million Still Out of School';
