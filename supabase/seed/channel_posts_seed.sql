-- Seed: real CareerRadar channel posts (29 Sep – 11 Oct 2026).
-- Source: WhatsApp side-chat deliveries, extracted 14 Oct 2026 into
-- src/data/channelPostsSeed.json. Idempotent: re-running skips rows
-- that already exist for the same channel + date + title.
--
-- Images: image_url is left NULL here. Each post's original graphic
-- is recorded in channelPostsSeed.json as image_file; attach it via
-- Admin → Manage Channel Posts → Edit → Upload an image.
-- Run AFTER migration 202610140003_add_channel_posts.sql.

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'CBD Punjab Youth Career Program 2026', '💼 CBD Punjab Youth Career Program 2026

A paid, full-time internship with the Punjab Central Business District Development Authority — real government-sector experience for fresh graduates.
Eight directorates to choose from, including engineering, finance, IT, and law.

📌 Key details:
• Duration: up to 3 months, full-time (paid)
• Who can apply: fresh graduates, CGPA 3.0+, max age 25
• ⏰ Deadline: 12 October 2026

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

👍 Follow for daily opportunities, share with a friend who needs this, and react if you''re applying!

Apply here: https://www.cbdpunjab.gov.pk/career

https://www.career-radar.space/

#CareerRadar #Internship #PakistanJobs #YouthProgram #CBDPunjab #PaidInternship #CareerOpportunity', NULL, NULL, '2026-09-29', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-09-29' AND title = 'CBD Punjab Youth Career Program 2026');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'CM Punjab E-Bike Scheme: Phase 2 Open for Students', '🛵 CM Punjab E-Bike Scheme: Phase 2 Open for Students

Big news for Punjab''s students — the government''s electric bike scheme is back with Phase 2, and applications are open now.
Zero down payment, government-covered interest and insurance, and easy monthly installments made for student budgets.

📌 Key details:
• 125,000+ electric bikes for Punjab students
• Zero down payment — you pay only ~Rs 3,028/month
• Government pays the interest & insurance
• ⏰ Last date to apply: 4 October 2026

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

❤️ Follow the channel, share this with a student who needs a ride, and drop a reaction!

🔗 https://bikes.punjab.gov.pk/

https://www.career-radar.space/

#CareerRadar #GovtScheme #PunjabStudents #EBikeScheme #StudentSupport #Pakistan', NULL, NULL, '2026-09-29', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-09-29' AND title = 'CM Punjab E-Bike Scheme: Phase 2 Open for Students');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Micro1: Software Engineer (New Grad)', '💼 Micro1: Software Engineer (New Grad)

A fully remote software engineering role built for fresh graduates — your chance to start an international tech career from your own desk.
Micro1 is hiring new grads of any batch to work on a modern stack with a global team.

📍 Fully remote, full-time
🛠 Tech stack: React, TypeScript, Node.js, PostgreSQL
🎓 Open to recent graduates of any batch
⏰ Deadline: 31 December 2026

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

Know a fresh grad who''d be perfect? Share this with them and react ❤️ to keep the opportunities coming!

Official details / apply: https://jobdexo.com/job-custom.php?id=C027-J095&slug=software-engineer-new-grad-jobsmicro1ai-2026

Visit our website: https://www.career-radar.space/

#CareerRadar #RemoteJobs #SoftwareEngineer #FreshGraduates #JobAlert', NULL, NULL, '2026-09-30', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-09-30' AND title = 'Micro1: Software Engineer (New Grad)');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Build a Standout CV With Zero Experience', '🎓 Build a Standout CV With Zero Experience

No internships? No job history? Your first CV can still land interviews. Lead with a sharp summary and your education, turn projects and coursework into quantified achievements, and tailor every version to the role you''re chasing.

📌 Key details:
• Structure: 3-line summary → Education → Projects → Skills
• Quantify everything — recruiters scan numbers, not adjectives
• Tailor every application: job seekers with 4+ CV versions average 4.2 interview invites vs 2.0 for those who send one CV everywhere (Novorésumé Resume Report 2026)

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

❤️ Found this useful? Follow the channel, share this post with a friend who needs it, and drop a reaction!

🔗 https://novoresume.co.uk/gb?noRedirect=true

Visit our website: https://www.career-radar.space/

#CareerRadar #CareerGuidance #CVTips #ResumeTips #Students #JobSearch', NULL, NULL, '2026-09-30', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-09-30' AND title = 'Build a Standout CV With Zero Experience');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Google NotebookLM: Your AI Study Partner (Free)', '🤖 Google NotebookLM: Your AI Study Partner (Free)

Turn your scattered study material into a personal AI tutor. NotebookLM reads YOUR notes, PDFs, slides, and even YouTube videos — then answers questions grounded only in what you gave it. No hallucinations, just your sources talking back to you.

📌 Key details:
• 100% free with a Google account
• Upload PDFs, docs, slides, YouTube videos & websites as sources
• Get summaries, mind maps, study guides & even audio overviews

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X
Found this useful? Follow the channel, share it with a friend who studies, and react ❤️ so we keep bringing you the best tools!

🔗 https://notebooklm.google.com

Visit our website: https://www.career-radar.space/
#CareerRadar #EdTech #FreeTools #StudyTips #AIForStudents #NotebookLM', NULL, NULL, '2026-10-01', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-01' AND title = 'Google NotebookLM: Your AI Study Partner (Free)');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Harvard CS50x: Free Intro to Computer Science', '🎓 Harvard CS50x: Free Intro to Computer Science

Harvard''s legendary CS50 — the course that made computer science famous — is free to audit online. From C and Python to SQL and web development, it''s the single best starting point if you want real programming skills.
Perfect for students anywhere in the world: self-paced, beginner-friendly, and a certificate that actually means something on a CV.

📌 Key details:
• Free to audit on edX (paid certificate optional)
• Self-paced: ~12 weeks, 10–20 hrs/week
• No prior experience needed

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X
Know someone who wants to learn coding? Share this with them and react ❤️ so we keep bringing premium courses!

🔗 https://www.edx.org/course/introduction-computer-science-harvardx-cs50x

Visit our website: https://www.career-radar.space/
#CareerRadar #FreeCourses #OnlineCourses #CS50 #LearnToCode #CareerGuidance', NULL, NULL, '2026-10-02', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-02' AND title = 'Harvard CS50x: Free Intro to Computer Science');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Spaced Repetition: Study Less, Remember More', '🧠 Spaced Repetition: Study Less, Remember More

Cramming feels productive but your brain dumps most of it within days. Spaced repetition — reviewing material at expanding intervals — is the most evidence-backed study technique in existence. It''s how top students remember more while studying less.

📌 Key details:
• Review at expanding gaps: 1 day → 3 days → 7 days → 30 days
• Test yourself (active recall) instead of re-reading notes
• Free tool: Anki — flashcards with built-in spaced repetition scheduling

Follow CareerRadar on WhatsApp: https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X
Studying for exams? Share this with a friend who crams, and react ❤️ so we keep bringing study skills that actually work!

🔗 https://apps.ankiweb.net/

Visit our website: https://www.career-radar.space/
#CareerRadar #StudyTips #SpacedRepetition #StudySkills #ExamPrep', NULL, NULL, '2026-10-03', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-03' AND title = 'Spaced Repetition: Study Less, Remember More');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Gates Cambridge Scholarship 2027-28', '🎓 Gates Cambridge Scholarship 2027-28

One of the world''s most prestigious fully-funded scholarships is now open. Study a PhD, MLitt, or 1-year Masters at the University of Cambridge — with every major cost covered. If Cambridge has ever been your dream, this is the door. 🚪✨

📌 Key details:
• Full cost covered: tuition, £23,152/year stipend, airfare, visa + health surcharge
• ~70 awards for citizens of any country outside the UK
• One application covers both admission and funding
• ⏰ Deadlines: 14 Oct 2026 (US round); 8 Dec 2026 / 6 Jan 2027 (international, course-wise)

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

Know someone dreaming of Cambridge? Share this with them, and follow for a new opportunity every day. 🎯

🔗 https://www.gatescambridge.org/

Visit our website: https://www.career-radar.space/

#CareerRadar #GatesCambridge #Scholarships #StudyInUK #FullyFunded #CambridgeUniversity #InternationalStudents', NULL, NULL, '2026-10-04', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-04' AND title = 'Gates Cambridge Scholarship 2027-28');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'UN Moves to Make Free Education a Global Right', '🌍 UN Moves to Make Free Education a Global Right

Imagine a world where every child — no matter the country — is guaranteed free schooling from nursery to the final school year. The UN has just taken a big step towards making that a reality. ✊

📌 Key details:
• A UN working group met in Geneva (31 Aug – 2 Sep) to advance a new binding treaty
• 62 countries now publicly back the free-education treaty
• It would guarantee free pre-primary and secondary schooling for all children
• Next official session: October 2027

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

Follow for daily premium education updates, share this with a student who should know, and react if you believe education should be free for every child. 💛

🔗 https://www.hrw.org/news/2026/09/22/un-talks-on-free-education-advance-as-states-weigh-next-steps

Visit our website: https://www.career-radar.space/

#CareerRadar #EducationUpdate #FreeEducation #EducationForAll #UN #GlobalEducation #StudyTips #CareerGuidance', NULL, NULL, '2026-10-04', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-04' AND title = 'UN Moves to Make Free Education a Global Right');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Punjab STI Teacher Interns 2026', '🎓 Punjab STI Teacher Interns 2026

Thinking about a teaching career? Punjab''s School Teacher Interns program is hiring across the province — a paid 7-month teaching engagement in government schools, starting this November. 🏫

📌 Key details:
• Stipend: Rs. 38,000–45,000/month
• Levels: Primary, Elementary & Higher Secondary
• Who can apply: BA/BS & MA/MSc graduates
• Duration: 7 months (Nov 2026 – May 2027)
⏰ Deadline: 18 October 2026

📲 Follow our Scholarships & Internships channel for daily verified opportunities: https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

👍 Found this useful? React ❤️, share it with a friend looking for teaching work, and follow the channel so you never miss a deadline!

🔗 Official details & apply: https://sti.pesrp.edu.pk/

Visit our website: https://www.career-radar.space/

#PunjabSTI #TeacherInterns #TeachingJobs #InternshipAlert #PunjabJobs #PakistanJobs #CareerRadar', NULL, NULL, '2026-10-05', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-05' AND title = 'Punjab STI Teacher Interns 2026');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'The 10 Skills That Will Rule Jobs by 2030', '💼 The 10 Skills That Will Rule Jobs by 2030

The World Economic Forum''s Future of Jobs Report 2025 just mapped where the job market is heading — and the winners won''t be the ones with the most degrees, but the right skills. Here''s what to start building now. 🚀

📌 Key details:
• Fastest-growing skills: AI & big data, followed by networks, cybersecurity & tech literacy
• Rising human skills: creative thinking, resilience, flexibility & curiosity
• ~40% of job skills expected to change by 2030
• 59% of the global workforce will need upskilling or reskilling

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

Follow for daily career guidance, share this with a friend planning their future, and react if you''re already building one of these skills. 💛

🔗 https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/

Visit our website: https://www.career-radar.space/

#CareerRadar #CareerGuidance #FutureOfJobs #Skills2030 #WEF #Upskilling #CareerTips', NULL, NULL, '2026-10-05', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-05' AND title = 'The 10 Skills That Will Rule Jobs by 2030');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'UN Young Professionals Programme 2026', '🌐 UN Young Professionals Programme 2026

Dreaming of a career with the United Nations? 🇺🇳 The flagship UN YPP is your gateway to becoming an international civil servant — a paid professional career at the UN, not just another internship. Applications for the 2026 cycle open soon, and the exam area this year is Development & Sustainability.

📌 Key details:
• Paid 2-year UN contract (P-1 / P-2 level)
• Age 32 or younger, with a bachelor''s degree in a relevant field
• Fluent in English or French; national of a participating country
⏰ Deadline: November 2026 (applications open mid-October 2026)

📲 Follow our WhatsApp channel for daily scholarships, internships and jobs: https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

👉 Follow, share this with someone who dreams of working at the UN, and react ❤️ if you''re applying!

🔗 Official details & apply: https://careers.un.org/young-professionals-programme?language=en

Visit our website: https://www.career-radar.space/

#UNJobs #YoungProfessionalsProgramme #UNCareers #GlobalJobs #CareerOpportunity #UnitedNations #CareerRadar', NULL, NULL, '2026-10-06', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-06' AND title = 'UN Young Professionals Programme 2026');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Zotero — Free Research Manager for Students', '🛠️ Zotero — Free Research Manager for Students

Drowning in PDFs and citations for your assignments or thesis? 📚 Zotero is the free, open-source tool researchers swear by — it collects your sources, builds your bibliography, and plugs straight into Word and Google Docs.

📌 Key details:
• 100% free & open-source reference manager
• One-click source capture from any browser
• 10,000+ citation styles, Word & Google Docs plugins
• Built-in PDF reader, notes & retraction alerts

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

👍 Know a student writing a thesis? Share this with them and react ❤️!

🔗 https://www.zotero.org/

Visit our website: https://www.career-radar.space/

#CareerRadar #EdTech #FreeTools #Zotero #ResearchTools #StudyTips #Students', NULL, NULL, '2026-10-06', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-06' AND title = 'Zotero — Free Research Manager for Students');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Commonwealth Master''s Scholarships 2027/28', '🎓 Commonwealth Master''s Scholarships 2027/28

One of the most prestigious fully funded scholarships in the world is now open. Study your Master''s in the UK with tuition, a monthly living stipend of £1,712 (£2,000 in London), airfare and a travel grant all covered by the Commonwealth Scholarship Commission.

Key details: Fully funded Master''s in the UK | Monthly stipend £1,712 (£2,000 London) | Tuition + airfare + travel grant covered | Deadline: 20 October 2026 (16:00 BST)

Follow CareerRadar Scholarships & Internships for daily global opportunities: https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

Know someone dreaming of studying in the UK? Share this with them 👇 React if you''re applying!

Official details & apply: https://opportunitydesk.org/2026/09/09/commonwealth-masters-scholarships-2027-2028/

Visit our website: https://www.career-radar.space/

#CareerRadar #Scholarships #StudyInUK #CommonwealthScholarship #FullyFunded #MastersScholarship', NULL, NULL, '2026-10-07', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-07' AND title = 'Commonwealth Master''s Scholarships 2027/28');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Harvard''s CS50 — Learn Computer Science for Free', '🎓 Harvard''s CS50 — Learn Computer Science for Free

Harvard''s world-famous intro to computer science is open to everyone, entirely free to audit. You''ll learn C, Python, SQL, JavaScript and web development the same way Harvard students do — through hands-on problem sets, not just lectures.

Whether you''re starting from zero or switching careers, this is one of the most respected free courses on the planet — and it fits around your schedule.

📌 Key details:
• Free to audit · self-paced, start anytime
• 12 weeks · C, Python, SQL, JavaScript, HTML/CSS
• 9 problem sets + a final project you build
• Free certificate track available via Harvard OCW

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

🔔 Follow for daily premium courses & study resources | ♻️ Share with a friend who wants to learn coding | ❤️ React if you''ll enrol today!

🔗 https://harvardonline.harvard.edu/course/cs50-introduction-computer-science

Visit our website: https://www.career-radar.space/

#CareerRadar #FreeCourses #OnlineCourses #LearnToCode #Harvard #StudyTips', NULL, NULL, '2026-10-07', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-07' AND title = 'Harvard''s CS50 — Learn Computer Science for Free');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'CBD Punjab Youth Career Program 2026', '💼 CBD Punjab Youth Career Program 2026

A rare paid internship inside one of Pakistan''s biggest urban development projects! 🏙️
CBD Punjab is hiring fresh graduates across 9 directorates — engineering, IT, finance, law, GIS & more.
This is your shot at real corporate experience with a government-backed authority.

📌 Paid internship — up to 3 months
📌 Fresh graduates only (age 25 or under)
📌 CGPA 3.0+, 16 years of education required
🗓️ Deadline: 12 October 2026 — only 4 days left!

📲 Follow our channel for daily opportunities:
https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

❤️ React, share with a fresh graduate who needs this, and follow for daily career opportunities!
🔗 Apply here: https://cbdpunjab.gov.pk/ycp2026

Visit our website: https://www.career-radar.space/

#CareerRadar #ScholarshipsAndInternships #PaidInternship #CBDpunjab #Internship2026 #PakistanJobs #FreshGraduates #EngineeringCareers #ITCareers', NULL, NULL, '2026-10-08', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-08' AND title = 'CBD Punjab Youth Career Program 2026');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Active Recall — The #1 Study Technique You''re Not Using', '🧠 Active Recall — The #1 Study Technique You''re Not Using

Most students spend hours re-reading their notes — and forget almost everything within a week. Cognitive science has a better answer: stop recognising, start retrieving.
Testing yourself builds memory that actually lasts — the research is clear, and it works for every subject.

📌 Key details:
• Re-reading fails — students who only re-read notes remembered just ~36% a week later
• Self-testing works — students who tested themselves remembered ~80%, more than double (Roediger & Karpicke)
• The blank-page trick — after each topic, close your notes, write down everything you remember, then check the gaps

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

👉 Try the blank-page trick in your next study session, share this with a friend who studies the hard way, and react 👍 if you''re switching to active recall this week!

🔗 https://elimu.dev/blog/active-recall-study-method

Visit our website: https://www.career-radar.space/

#CareerRadar #StudyTips #ActiveRecall #ExamPrep #StudySmart #CareerGuidance', NULL, NULL, '2026-10-08', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-08' AND title = 'Active Recall — The #1 Study Technique You''re Not Using');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Deloitte Graduate Scheme 2027', '💼 Deloitte Graduate Scheme 2027

One of the world''s biggest professional services firms is hiring graduates for its 2027 intake. This is a full-time role across consulting, technology, audit and advisory — a serious launchpad if you''re aiming for a global career straight out of university.

Key details: open to final-year students and recent graduates | Multiple UK locations including Belfast | Deadline: 23 October 2026 — apply early, popular roles fill fast.

Follow CareerRadar Scholarships & Internships on WhatsApp:
https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

👉 React if this helps, share it with a friend who''s job hunting, and follow so you never miss a deadline!

Official details and apply: https://www.brightnetwork.co.uk/graduate-jobs/deloitte/technology-strategy-consulting-technology-strategy-transformation-belfast-2027-an3f

Visit our website: https://www.career-radar.space/

#Jobs #GraduateScheme #Deloitte #CareerRadar #Students #FreshGraduates', NULL, NULL, '2026-10-09', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-09' AND title = 'Deloitte Graduate Scheme 2027');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'PM Youth Programme x China: Digital Skills for 100,000 Youth', '🇵🇰🇨🇳 PM Youth Programme x China: Digital Skills for 100,000 Youth

Big education update from Pakistan: the PM Youth Programme is partnering with China to train 100,000 young people in digital skills. For students anywhere watching how governments invest in future-ready skills, this is a major signal of where the digital economy is heading.

📌 Key details: training in high-demand digital skills | 100,000 youth to benefit | Announced via the official Press Information Department.

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

👉 Share this with a student friend, react if you found it useful, and follow for daily education updates!

🔗 https://pid.gov.pk/site/press_detail/29278

Visit our website: https://www.career-radar.space/

#CareerRadar #EduUpdate #DigitalSkills #Pakistan #YouthProgramme #OnlineLearning', NULL, NULL, '2026-10-09', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-09' AND title = 'PM Youth Programme x China: Digital Skills for 100,000 Youth');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'Yenching Academy Scholarship 2027 — Peking University', '🎓 Yenching Academy Scholarship 2027 — Peking University

Dreaming of a fully funded Master''s in China? The Yenching Academy Scholarship at Peking University covers tuition, accommodation, and living expenses for a prestigious Master''s in China Studies. It''s one of Asia''s most sought-after fully funded graduate scholarships.

Key details: Fully funded Master''s at Peking University, China | Open to international applicants worldwide | Deadline: 30 November 2026 — start your application early.

Follow CareerRadar Scholarships & Internships on WhatsApp:
https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

👉 React if this helps, share it with a friend planning to study abroad, and follow so you never miss a deadline!

Official details and apply: https://yenchingacademy.pku.edu.cn

Visit our website: https://www.career-radar.space/

#Scholarships #FullyFunded #StudyInChina #Masters #CareerRadar #Students', NULL, NULL, '2026-10-10', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-10' AND title = 'Yenching Academy Scholarship 2027 — Peking University');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Freelancing Roadmap for Students: From Zero to First Client', '🗺️ Freelancing Roadmap for Students: From Zero to First Client

No degree, no experience, no problem. Freelancing is one of the most realistic ways for students anywhere in the world to earn their first income while studying. The trick isn''t talent — it''s a simple, repeatable roadmap: pick one skill, build two sample projects, and start pitching.

📌 Key details: Pick ONE skill (writing, design, coding, video editing) | Build 2 sample projects to show your work | Start on platforms like Upwork with small jobs and grow from there.

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

👉 Share this with a student friend who wants to earn online, react if it helped, and follow for daily career guidance!

🔗 https://www.upwork.com/

Visit our website: https://www.career-radar.space/

#CareerRadar #CareerGuidance #Freelancing #Students #SideIncome #OnlineEarning', NULL, NULL, '2026-10-10', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-10' AND title = 'Freelancing Roadmap for Students: From Zero to First Client');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'scholarships', 'WAPDA Paid Internship Program 2026', '⚡ WAPDA Paid Internship Program 2026 🇵🇰

One of Pakistan''s biggest public-sector organisations is opening its doors to fresh graduates! WAPDA is offering 50 paid internship seats with a monthly stipend, real project exposure, and an official completion certificate.

📋 50 seats: engineering, IT, finance, HR & mass communication | 8-week programme with stipend up to Rs. 25,000/month | Open merit + provincial quota across all of Pakistan
✅ Fresh/recent graduates (within last 3 years), min 2.8 CGPA, max age 26
⏰ Deadline: 27 October 2026

📲 Follow our WhatsApp channel for daily opportunities: https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m

❤️ React, 🔁 share this with a fresh graduate who needs it, and follow CareerRadar so you never miss an opportunity!

🔗 Apply online at WAPDA''s careers portal: https://www.wapda.gov.pk/careers

Visit our website: https://www.career-radar.space/

#WAPDA #Internship2026 #PaidInternship #Pakistan #FreshGraduates #GovernmentInternship #CareerRadar #Engineering #YouthOpportunities #JobsInPakistan', NULL, NULL, '2026-10-11', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'scholarships' AND published_at = '2026-10-11' AND title = 'WAPDA Paid Internship Program 2026');

INSERT INTO channel_posts (channel, title, description, image_url, post_url, published_at, is_published)
SELECT 'main', 'Anki — The Free App That Makes Anything Memorable', '🗂️ Anki — The Free App That Makes Anything Memorable

Forgetting what you studied last week? Anki uses spaced repetition — a science-backed technique that shows you flashcards right before you''d forget them. Medical students, language learners and exam toppers worldwide swear by it.

📌 Key details: Free on desktop, web & Android (one-time fee on iOS only) | Thousands of free pre-made decks to download | Syncs across all your devices.

Follow CareerRadar on WhatsApp:
https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X

👉 Share this with a friend who''s preparing for exams, react if it helped, and follow for daily study tools!

🔗 https://apps.ankiweb.net/

Visit our website: https://www.career-radar.space/

#CareerRadar #EdTech #Anki #StudyTips #Flashcards #FreeTools', NULL, NULL, '2026-10-11', TRUE
WHERE NOT EXISTS (SELECT 1 FROM channel_posts WHERE channel = 'main' AND published_at = '2026-10-11' AND title = 'Anki — The Free App That Makes Anything Memorable');
