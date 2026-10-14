// Every video published on the Career Radar YouTube channel.
// Each one gets a blog-type page: embedded video + written description +
// thumbnail banner + a direct link. Source of truth for IDs/titles/dates:
// ~/workspace/faceless-channel/history.jsonl

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@CareerRadar'

export const youtubeUrl = (v) => `https://youtu.be/${v.videoId}`
export const thumbnailUrl = (v) => `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
export const embedUrl = (v) => `https://www.youtube-nocookie.com/embed/${v.videoId}`

export const VIDEOS = [
  {
    slug: 'founder-story',
    videoId: 'FYsJuqu_3Ow',
    title: "I'm a University Student Building a Career Platform — Here's What I've Learned",
    type: 'long',
    date: '2026-10-05',
    category: 'Founder Story',
    description: [
      'I started Career Radar by sharing opportunities with students around me. It grew into a 2,000+ member community and changed how I think about careers, skills, and what actually makes students employable.',
      'In this video I share why I started, what I observed among students, the biggest mistakes students make, and what I would focus on if I were starting university today.',
    ],
    takeaways: [
      'Share opportunities early — helping others compounds faster than competing alone.',
      'Skills and proof of work matter as much as grades.',
      'A community built on trust becomes a career asset for everyone in it.',
    ],
  },
  {
    slug: 'gates-cambridge-2027',
    videoId: 'L5B2p8ZtOUI',
    title: 'Gates Cambridge Scholarship 2027: How to Win a Fully Funded Seat at Cambridge',
    type: 'long',
    date: '2026-10-06',
    category: 'Scholarships',
    description: [
      'The Gates Cambridge Scholarship is one of the most competitive fully funded scholarships in the world — covering study at the University of Cambridge for outstanding applicants committed to improving the lives of others.',
      'This video breaks down what the scholarship covers, who can apply, and how to build an application that stands out: academic fit, a convincing statement of purpose, and references that actually say something.',
    ],
    takeaways: [
      'Fit with Cambridge and your chosen course matters more than grades alone.',
      'Your statement must connect your past work to a clear future impact.',
      'Start early — strong references take time to earn.',
    ],
  },
  {
    slug: '7-fully-funded-scholarships',
    videoId: 'ORCIwP7suck',
    title: '7 Fully Funded Scholarships You Can Apply for RIGHT NOW (2026–2027)',
    type: 'long',
    date: '2026-10-07',
    category: 'Scholarships',
    description: [
      'Seven fully funded scholarships open for applications right now, covering tuition, living costs, and more across different countries and levels of study.',
      'This video walks through each one: what it covers, who is eligible, and the deadlines to watch — so you can shortlist the ones that fit your profile and apply before they close.',
    ],
    takeaways: [
      'Shortlist by eligibility first, then by deadline.',
      'Fully funded rarely means zero costs — check what is and is not covered.',
      'Apply to several, not just one dream scholarship.',
    ],
  },
  {
    slug: 'what-is-uopeople',
    videoId: 'Bju5qNsPbHo',
    title: 'What Is University of the People? The Tuition-Free University Explained',
    type: 'long',
    date: '2026-10-07',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'what-is-uopeople',
    description: [
      'University of the People (UoPeople) is a US-accredited online university with no tuition fees — students pay only assessment fees per course. Episode 1 of the complete guide explains how it works, what degrees it offers, and who it is actually for.',
      'If you are considering it, read the written guide too: it covers the same facts with sources, so you can decide with the full picture.',
    ],
    takeaways: [
      'Tuition-free does not mean free — assessment fees apply per course.',
      'Study is fully online and self-paced, with peer learning.',
      'Check accreditation and recognition for your own goals before enrolling.',
    ],
  },
  {
    slug: '9-cv-mistakes',
    videoId: 'Bx-SqKeDKQ8',
    title: '9 CV Mistakes That Get You Rejected Instantly (What Recruiters Actually Think)',
    type: 'long',
    date: '2026-10-08',
    category: 'Career Guidance',
    description: [
      'Recruiters spend seconds on a first CV scan. This video covers the nine mistakes that get CVs rejected instantly — from vague claims and missing numbers to formatting that hides your best work.',
      'Fix these and your CV stops being a list of duties and starts being proof that you can do the job.',
    ],
    takeaways: [
      'Quantify results: numbers beat adjectives.',
      'Tailor every CV to the role — one generic CV fits no job.',
      'One to two pages, clean layout, no clutter.',
    ],
  },
  {
    slug: 'is-uopeople-accredited',
    videoId: 'Ih854Yc8L_k',
    title: 'Is University of the People Accredited? The Truth About Its Accreditation',
    type: 'long',
    date: '2026-10-09',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'is-uopeople-accredited',
    description: [
      'Accreditation is the first question every serious student asks about UoPeople — and the answer matters. Episode 2 explains what accreditation actually means, which body accredits UoPeople, and how to check it yourself from official sources.',
      'UoPeople holds WASC (WSCUC) regional accreditation in the United States — the same tier of accreditation held by established US universities.',
    ],
    takeaways: [
      'UoPeople is regionally accredited in the US by WSCUC.',
      'Accreditation and local recognition are two different questions — check both.',
      'Always verify claims on the accreditor’s own website.',
    ],
  },
  {
    slug: 'uopeople-degree-valid-pakistan',
    videoId: 'ihv_1FdT3FM',
    title: 'Is a UoPeople Degree Valid in Pakistan? HEC Equivalence Explained',
    type: 'long',
    date: '2026-10-09',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'uopeople-degree-valid-pakistan-hec',
    description: [
      'A US-accredited degree still needs recognition where you plan to use it. Episode 3 explains how HEC Pakistan treats foreign degrees, what the case-by-case equivalence process looks like, and the reported precedent of a UoPeople degree receiving equivalence.',
      'Equivalence is never guaranteed — this video shows you how to verify the current position for your own degree and goals.',
    ],
    takeaways: [
      'HEC foreign-degree equivalence is assessed case by case.',
      'A reported 2026 precedent covered a UoPeople BS CS — presented as reported, not a guarantee.',
      'Keep every transcript and document from day one; equivalence needs the full file.',
    ],
  },
  {
    slug: 'commonwealth-masters-2027',
    videoId: 'aYXv99qvISo',
    title: "Commonwealth Master's Scholarships 2027/28: Fully Funded UK Study (Deadline 20 October)",
    type: 'long',
    date: '2026-10-10',
    category: 'Scholarships',
    description: [
      'The Commonwealth Master’s Scholarships fund fully supported study in the UK for students who could not otherwise afford it — covering tuition, airfare, and living costs.',
      'This video walks through eligibility, what the scholarship covers, and how to apply before the 20 October deadline, including how to pick courses and frame your development impact.',
    ],
    takeaways: [
      'Applications close 20 October — do not leave the essays to the last day.',
      'Development impact is a core selection criterion, not an afterthought.',
      'Choose a course that clearly connects to your home country’s needs.',
    ],
  },
  {
    slug: 'how-to-apply-uopeople',
    videoId: '6iP3KlhAqOM',
    title: 'How to Apply to University of the People: Requirements & Step-by-Step (2026)',
    type: 'long',
    date: '2026-10-10',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'how-to-apply-uopeople',
    description: [
      'Episode 4 is the practical one: every step of the UoPeople application, from creating your account and submitting documents to the English proficiency requirement and what happens after you are admitted.',
      'Follow it in order and you will avoid the common delays — missing documents and unverified English proficiency are the two that slow most applicants down.',
    ],
    takeaways: [
      'Prepare your documents before you start the application.',
      'English proficiency proof is part of the process — check the accepted tests.',
      'Admission is only the start: foundations and assessment fees come next.',
    ],
  },
  {
    slug: 'real-cost-uopeople',
    videoId: 'V42e9DENc9E',
    title: "The Real Cost of University of the People: What 'Tuition-Free' Really Means",
    type: 'long',
    date: '2026-10-11',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'real-cost-uopeople',
    description: [
      '“Tuition-free” is true — and it is not the whole story. Episode 5 does the full maths: assessment fees per course, the total cost of a bachelor’s degree, and the extra costs students forget to budget for.',
      'Undergraduate assessment is $180 per course, putting a full bachelor’s degree at $7,260 — a fraction of a traditional degree, but a number you should plan for honestly.',
    ],
    takeaways: [
      'Budget $180 per course in assessment fees.',
      'A full BS totals $7,260 at current rates.',
      'Scholarships and aid exist — episode 6 covers them.',
    ],
  },
  {
    slug: 'uopeople-scholarships',
    videoId: 'lfwQn9at3t4',
    title: 'UoPeople Scholarships: How to Study for Free (2026)',
    type: 'long',
    date: '2026-10-12',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'uopeople-scholarships-study-free',
    description: [
      'Episode 6 covers the route to studying at UoPeople for free: the university’s scholarships and financial aid, who qualifies, and how the application works.',
      'Aid is limited and competitive — this video explains how to present your need and your plan clearly, and what to do if your first application does not succeed.',
    ],
    takeaways: [
      'Financial aid applications are separate from admission — apply for both.',
      'A clear statement of need and goals strengthens your case.',
      'Plan for the possibility of paying some fees while aid is decided.',
    ],
  },
  {
    slug: 'yenching-academy-2027',
    videoId: 'QbsWsyNAzfk',
    title: "Yenching Academy 2027: Fully Funded Master's at Peking University — How to Win It",
    type: 'long',
    date: '2026-10-13',
    category: 'Scholarships',
    description: [
      'The Yenching Academy at Peking University is one of the most generous scholarships in the world — a fully funded master’s in China covering tuition, housing, and living costs.',
      'This video breaks down how it works, who can apply, what the selection committee actually looks for, and the mistakes that get strong applicants rejected.',
    ],
    takeaways: [
      'Yenching selects for leadership and China engagement, not grades alone.',
      'Your research proposal must be specific and realistic.',
      'Start early: references and essays take weeks, not days.',
    ],
  },
  {
    slug: 'uopeople-vs-traditional',
    videoId: 'EYMnmAmyK8A',
    title: 'UoPeople vs Traditional University: Honest Pros and Cons — Who Should Actually Enroll',
    type: 'long',
    date: '2026-10-13',
    category: 'University of the People',
    series: 'University of the People — Complete Guide',
    guideSlug: 'uopeople-vs-traditional-university',
    description: [
      'The final episode of the series gives an honest verdict: where UoPeople beats a traditional university, where it does not, and who should actually enroll.',
      'Cost, flexibility, and self-direction weigh against campus life, local recognition, and in-person networking. The right answer depends on your goals, your budget, and how you learn best.',
    ],
    takeaways: [
      'UoPeople wins on cost and flexibility; traditional universities win on campus and local networks.',
      'Self-discipline is the deciding factor in online study.',
      'There is no universal answer — match the university to your goals.',
    ],
  },
  // Shorts
  {
    slug: 'stop-typing-references',
    videoId: 'dM0MGGZciF0',
    title: 'Stop Typing References by Hand — This Free Tool Does It in One Click #Shorts',
    type: 'short',
    date: '2026-10-07',
    category: 'Study Tools',
    description: [
      'Reference managers format your citations automatically. Stop typing them by hand and let a free tool do it in one click.',
    ],
    takeaways: ['Use a reference manager from your first assignment.', 'One click beats one hour of manual formatting.'],
  },
  {
    slug: 'check-before-applying-scholarship',
    videoId: 'mSBy510a9dM',
    title: 'Check This Before Applying to Any Scholarship #Shorts',
    type: 'short',
    date: '2026-10-07',
    category: 'Scholarships',
    description: [
      'Before you apply to any scholarship, check the eligibility, the real deadline, and what the funding actually covers. Most rejections come from skipping this step.',
    ],
    takeaways: ['Read eligibility before writing a single essay.', 'Verify deadlines on the official page.'],
  },
  {
    slug: '3-cv-mistakes',
    videoId: 'rUC63vy4IJA',
    title: '3 CV Mistakes That Get You Rejected #Shorts',
    type: 'short',
    date: '2026-10-07',
    category: 'Career Guidance',
    description: [
      'Three CV mistakes that get applications rejected: vague claims with no proof, a CV written for every job and therefore for none, and clutter that buries your best work.',
    ],
    takeaways: ['Prove claims with numbers.', 'Tailor every CV to the role.'],
  },
  {
    slug: 'degree-wont-get-you-hired',
    videoId: '_RgEt1GfZk8',
    title: "Your Degree Won't Get You Hired #Shorts",
    type: 'short',
    date: '2026-10-07',
    category: 'Career Guidance',
    description: [
      'A degree gets you considered. Skills, proof of work, and how you communicate get you hired. The students who win are the ones who build evidence while they study.',
    ],
    takeaways: ['Build projects and proof while you study.', 'Communication is a career skill, not a soft extra.'],
  },
  {
    slug: 'free-ai-tool-reads-pdfs',
    videoId: 'AxMZpAPwthI',
    title: 'This Free AI Tool Reads PDFs for You #Shorts',
    type: 'short',
    date: '2026-10-08',
    category: 'Study Tools',
    description: [
      'AI tools can now read and summarize long PDFs in seconds. Use them to get the structure of a paper fast — then read the important parts yourself.',
    ],
    takeaways: ['Summarize first, then read deeply.', 'Never submit AI output as your own work.'],
  },
  {
    slug: 'average-students-better-jobs',
    videoId: '9NrP0rR7CbE',
    title: 'Why Average Students Get Better Jobs #Shorts',
    type: 'short',
    date: '2026-10-08',
    category: 'Career Guidance',
    description: [
      'Average students often win better jobs because they spend their energy on skills, networking, and real experience — while top scorers sometimes rely on grades alone.',
    ],
    takeaways: ['Grades open doors; skills and relationships walk you through them.', 'Experience beats a transcript in most interviews.'],
  },
  {
    slug: 'first-client',
    videoId: 'AWL2J2-7riM',
    title: 'How Students Get Their First Client #Shorts',
    type: 'short',
    date: '2026-10-08',
    category: 'Freelancing',
    description: [
      'Your first client usually comes from someone who already trusts you. Start with your network, offer one clear service, and deliver work you can show publicly.',
    ],
    takeaways: ['One clear service beats ten vague ones.', 'Your first client is often one conversation away.'],
  },
  {
    slug: 'tell-me-about-yourself',
    videoId: 'rceR-cxMJ2Q',
    title: "Answer 'Tell Me About Yourself' Like This #Shorts",
    type: 'short',
    date: '2026-10-08',
    category: 'Career Guidance',
    description: [
      '“Tell me about yourself” is not your life story. Use a simple structure: where you are now, what you have done that matters for this role, and where you are headed.',
    ],
    takeaways: ['Present, past proof, future direction — in that order.', 'Keep it under two minutes.'],
  },
  {
    slug: 'harvard-cs-course-free',
    videoId: 'ishHdc7Cc_U',
    title: "Harvard's Famous CS Course Is Completely Free #Shorts",
    type: 'short',
    date: '2026-10-08',
    category: 'Courses',
    description: [
      'Harvard’s famous introductory computer science course is available online for free. It is one of the best starting points for anyone learning to code from zero.',
    ],
    takeaways: ['Free does not mean low quality — the best courses are often open.', 'Finish the problem sets, not just the lectures.'],
  },
  {
    slug: 'fully-funded-doesnt-mean-this',
    videoId: 'sYhIhb6z5lY',
    title: "'Fully Funded' Doesn't Mean This #Shorts",
    type: 'short',
    date: '2026-10-08',
    category: 'Scholarships',
    description: [
      '“Fully funded” rarely means every cost is covered. Always check what the funding includes — and what you will still need to pay for yourself.',
    ],
    takeaways: ['Read the funding breakdown, not just the headline.', 'Budget for flights, visas, and daily costs.'],
  },
  {
    slug: 'stop-studying-8-hours',
    videoId: 'nf0eBOeyJBM',
    title: 'Stop Studying for 8 Hours #Shorts',
    type: 'short',
    date: '2026-10-08',
    category: 'Study Skills',
    description: [
      'Eight hours of passive reading beats nothing — but focused study with active recall beats eight hours of reading. Shorter, harder sessions win.',
    ],
    takeaways: ['Test yourself instead of re-reading.', 'Focus beats hours.'],
  },
  {
    slug: 'stop-applying-everywhere',
    videoId: 'NdItbMuOH-U',
    title: 'Stop Applying Everywhere #Shorts',
    type: 'short',
    date: '2026-10-08',
    category: 'Career Guidance',
    description: [
      'Applying everywhere feels productive and usually is not. Ten tailored applications beat a hundred copy-paste ones.',
    ],
    takeaways: ['Tailor each application to the role.', 'Quality of applications beats quantity.'],
  },
  {
    slug: 'stop-writing-student-linkedin',
    videoId: 'snSxHasKfaI',
    title: "Stop Writing 'Student' in Your LinkedIn Headline #Shorts",
    type: 'short',
    date: '2026-10-09',
    category: 'Career Guidance',
    description: [
      '“Student” in your LinkedIn headline tells recruiters nothing. Write what you do and who you help instead — your skills, your field, your direction.',
    ],
    takeaways: ['Your headline should say what you do, not just your status.', 'Keywords help the right people find you.'],
  },
  {
    slug: 'stop-writing-these-on-cv',
    videoId: 'g7hs6fyqGMU',
    title: 'Stop Writing These on Your CV #Shorts',
    type: 'short',
    date: '2026-10-11',
    category: 'Career Guidance',
    description: [
      'Some CV lines hurt more than they help: clichés with no evidence, irrelevant details, and skills you cannot back up. Cut them and let your real proof speak.',
    ],
    takeaways: ['Every line should earn its place with evidence.', 'Cut clichés; keep proof.'],
  },
  {
    slug: 'cv-rejected-by-robot',
    videoId: 'yZQqYkcBFds',
    title: 'Your CV Gets Rejected by a Robot #Shorts',
    type: 'short',
    date: '2026-10-12',
    category: 'Career Guidance',
    description: [
      'Before a human ever sees your CV, an applicant tracking system may filter it out. Match the job’s keywords honestly, keep formatting simple, and never hide text.',
    ],
    takeaways: ['Mirror the job description’s keywords honestly.', 'Simple formatting parses best.'],
  },
]

export const videoBySlug = (slug) => VIDEOS.find((v) => v.slug === slug)
export const longVideos = VIDEOS.filter((v) => v.type === 'long')
export const shortVideos = VIDEOS.filter((v) => v.type === 'short')
