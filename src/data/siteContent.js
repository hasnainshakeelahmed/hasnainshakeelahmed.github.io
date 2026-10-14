// Refined content migrated from the v1 Career Radar site (Supabase tables:
// about_page, team_members, education_items, weekly_content, community_page).
// Facts preserved; tone rewritten to professional, SEO-friendly copy.
// Emoji, hashtags and link spam removed. Expired items are flagged, not hidden.

export const ABOUT = {
  storyHeading: 'Career Radar',
  tagline: 'Find opportunities. Build skills. Grow global.',
  story:
    'Career Radar started with a simple belief: talented people should not miss opportunities because they lack access, guidance, or a network. What began as a student-focused initiative has grown into a global community built around career development, AI learning, freelancing, scholarships, internships, and professional growth. We are not just an opportunity-sharing page — we are building a career ecosystem where people can learn, connect, and grow with purpose.',
  mission:
    'To help students and early-career professionals become more employable, more skilled, and more connected — through opportunities, guidance, community support, and career-focused learning.',
  values: [
    { title: 'Authenticity', text: 'Real guidance, real opportunities, honest communication.' },
    { title: 'Community First', text: 'We grow by helping people, not by chasing hype.' },
    { title: 'Learning Mindset', text: 'Growth comes through continuous learning and adaptation.' },
    { title: 'Global Thinking', text: 'Members from different countries, backgrounds, and ambitions.' },
    { title: 'Impact Over Noise', text: 'Meaningful outcomes, not just visibility.' },
  ],
  whatWeDo: [
    { title: 'Scholarships & internships', text: 'Verified updates, researched before publication.' },
    { title: 'Freelancing & remote work', text: 'Real roles and honest guidance on getting started.' },
    { title: 'Career guidance & mentorship', text: 'Direction from people who have walked the path.' },
    { title: 'AI & trending skills', text: 'What the market actually demands, without the hype.' },
    { title: 'Professional networking', text: 'A community that opens doors for each other.' },
    { title: 'LinkedIn & personal branding', text: 'Profiles that get noticed by the right people.' },
    { title: 'Workshops & resources', text: 'Practical learning that turns into proof of work.' },
  ],
  whoCanJoin: [
    'University students and fresh graduates',
    'Freelancers and job seekers',
    'Young professionals',
    'Anyone working to improve their career, skills, or opportunities',
  ],
  whoCanJoinNote: "You don't need to be an expert — you only need the mindset to learn and grow.",
  whyJoin: [
    { title: 'Guidance & career clarity', text: 'Clear direction on where to take your professional life.' },
    { title: 'Skill-building direction', text: 'Focused paths to learn what the market actually demands.' },
    { title: 'Global exposure', text: 'A network of ambitious people and worldwide opportunities.' },
    { title: 'Community support', text: 'A tight-knit group cheering you on and keeping you accountable.' },
  ],
}

export const TEAM = [
  {
    initials: 'HS',
    name: 'Hasnain Shakeel Ahmed',
    role: 'Founder',
    education: 'BS Electrical Engineering',
    skills: [],
    bio: 'Founded Career Radar to make verified opportunities and honest career guidance available to every student.',
  },
  {
    initials: 'SA',
    name: 'Shaheer Ahmed',
    role: 'Core Admin',
    education: 'FSc (Pre-Medical) — Brooks School System and College, Havelian, Abbottabad',
    skills: ['Digital Marketing (certified, Govt. of Khyber Pakhtunkhwa)'],
    bio: 'Runs day-to-day community operations and digital outreach.',
  },
  {
    initials: 'US',
    name: 'Usman Shafiq',
    role: 'Developer',
    education: 'BS Cyber Security (2025–2029)',
    skills: ['React', 'Python', 'Tailwind CSS', 'HTML', 'Java', 'SQL', 'AI workflows'],
    bio: 'To build and scale secure, innovative digital products while bridging the gap between full-stack development and infrastructure security.',
  },
]

export const EDUCATION_ITEMS = [
  {
    title: 'Free Full-Stack Web Development Bootcamp',
    type: 'Course',
    level: 'Beginner',
    duration: '3 Months',
    description:
      'A free, three-month full-stack web development bootcamp led by Kennedy Kamau Kamande (KamandeDevHub, Kenya), open to Career Radar community members at no cost.',
    topics: ['HTML', 'CSS & JavaScript', 'React.js Frontend Development', 'Node.js & Express Backend Development'],
  },
  {
    title: 'Chain of Thought & Role Prompting: The Only 2 AI Tricks You Need',
    type: 'Course',
    level: 'Beginner',
    duration: '3 Minutes',
    description:
      'Two prompting techniques that change the quality of AI output: chain-of-thought reasoning and role-based prompting. Learn when and how to use each — with examples for study, planning, and career tasks.',
    topics: ['Chain-of-thought prompting', 'Role & persona prompting', 'Practical AI examples'],
  },
  {
    title: 'UNICEF Free Online Courses 2026 — With Free Certificates',
    type: 'Course',
    level: 'Beginner',
    duration: 'Self-paced',
    description:
      'Free online courses from UNICEF with free certificates on completion. Flexible, self-paced learning from a globally recognized organization — no IELTS required.',
    topics: ['Free certificates', 'Flexible learning', 'Globally recognized provider'],
  },
]

export const WEEKLY_GUIDES = [
  {
    title: 'Gates Cambridge Scholarship 2027–28 — Complete Guide',
    category: 'Scholarships',
    status: 'open',
    description:
      'A fully funded scholarship to study at the University of Cambridge in the UK, covering full tuition, a £23,152 yearly living allowance, flights, and visa costs. This guide covers eligibility, deadlines (14 October 2026 for US applicants; 8 December 2026 or 6 January 2027 for others), benefits, how to apply, and the mistake that costs more applicants than weak grades.',
  },
  {
    title: 'CM Punjab E-Bike Scheme: Phase 2 for Students',
    category: 'Government Schemes',
    status: 'closed',
    statusLabel: 'Applications closed — 4 Oct 2026',
    description:
      'The Punjab government’s electric bike scheme returned with Phase 2: 125,000+ electric bikes for students, zero down payment, government-covered interest and insurance, and monthly installments of around Rs 3,028. Applications for this phase have closed.',
  },
  {
    title: '100 Artificial Intelligence Interview Questions — Book by Career Radar',
    category: 'Interview Prep',
    status: 'open',
    description:
      '100 AI interview questions covering machine learning, prompting, and applied AI — with structured answers to help you prepare for internships, junior roles, and technical interviews.',
  },
]

export const COMMUNITY_CTA = {
  heading: 'Start Your Career Journey Today',
  text: 'Join thousands of students discovering opportunities, building skills, and preparing for the future with Career Radar.',
}
