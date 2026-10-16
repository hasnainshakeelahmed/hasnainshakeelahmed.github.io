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
  guide: {
    "intro": "This guide distils the founder story behind Career Radar: how sharing opportunities with fellow students grew into a community, and what that experience teaches about careers, skills, and employability.",
    "steps": [
      {
        "title": "Start by helping the people around you",
        "text": "Share opportunities you come across instead of keeping them to yourself. Helping others builds trust and a reputation faster than competing quietly. Over time, the people you help become the network that brings opportunities back to you."
      },
      {
        "title": "Watch what actually makes students employable",
        "text": "Grades alone rarely decide who gets hired. Employers look for skills, proof of work, and the ability to communicate clearly. Notice which students get interviews and offers, and study what they do differently beyond their marks."
      },
      {
        "title": "Avoid the biggest student mistakes",
        "text": "Common mistakes include waiting until graduation to build skills, never showing any work publicly, and only applying when you feel fully ready. Another is treating every opportunity as a competition instead of a chance to learn. Spotting these patterns early lets you correct course while you still have time."
      },
      {
        "title": "Build skills and proof alongside your degree",
        "text": "Pick one or two skills connected to the work you want and practise them on real projects. Save the results as evidence you can show: a portfolio, a write-up, or a finished project. Proof of work turns a claim on a CV into something a recruiter can verify."
      },
      {
        "title": "Invest in a community built on trust",
        "text": "A community that shares honest, useful opportunities becomes an asset for everyone in it. Contribute consistently rather than only asking when you need something. Trust compounds: the more reliable you are, the more people think of you when opportunities appear."
      },
      {
        "title": "If you are starting university today, focus on this",
        "text": "Combine steady study with visible skill-building from your first year. Meet people, share what you learn, and keep a record of what you build. Small consistent actions across a degree add up to a strong profile by graduation."
      }
    ],
    "faq": [
      {
        "q": "Do I need good grades to build a career?",
        "a": "Grades matter, but they are only one part of the picture. Skills, proof of work, and communication often decide who gets hired among students with similar marks. Aim for solid grades while building evidence of what you can actually do."
      },
      {
        "q": "How can I start helping others if I have nothing to offer yet?",
        "a": "Start small by passing on opportunities, notes, or resources you find. You do not need to be an expert to be useful. Sharing consistently is itself a valuable contribution."
      },
      {
        "q": "What is the first step if I feel behind?",
        "a": "Pick one skill related to your target field and one small project that proves it. Finish it, document it, and share it. One finished piece of proof beats a long list of vague intentions."
      }
    ]
  },
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
  guide: {
    "intro": "The Gates Cambridge Scholarship funds study at the University of Cambridge for outstanding applicants committed to improving the lives of others. This guide covers what it looks for and how to build a strong application for a given cycle.",
    "steps": [
      {
        "title": "Understand what Gates Cambridge rewards",
        "text": "The scholarship supports study at Cambridge for applicants with strong academic ability and a clear commitment to improving the lives of others. It is highly competitive, so a strong academic record alone is rarely enough. Your application must show both excellence and purpose."
      },
      {
        "title": "Check the current cycle on the official page",
        "text": "This video covers a specific application cycle, so do not treat its dates or details as current. Always confirm eligibility, deadlines, and funding coverage on the official Gates Cambridge page before you apply. Rules and timelines can change between cycles."
      },
      {
        "title": "Prove your fit with Cambridge and your course",
        "text": "Show why your chosen course at Cambridge is the right next step for your academic path. Explain how the course content, teaching, and research environment connect to what you have already done. Fit with the course matters more than grades alone."
      },
      {
        "title": "Write a statement that connects past work to future impact",
        "text": "Your statement should link your past work to a clear future goal. Describe the problem you want to help solve and how this course prepares you to contribute. Vague ambition is weak; a specific, credible plan is persuasive."
      },
      {
        "title": "Choose referees who can say something real",
        "text": "Pick referees who know your work closely and can give concrete examples. A detailed letter from someone who supervised your work beats a generic letter from a famous name. Give your referees time, your statement, and clear points you would like them to cover."
      },
      {
        "title": "Start early and revise carefully",
        "text": "Strong references and a polished statement take weeks, not days. Draft early so you have time to get feedback and revise. Check every requirement against the official guidance before you submit."
      }
    ],
    "faq": [
      {
        "q": "Is the Gates Cambridge Scholarship only about grades?",
        "a": "No. Academic strength matters, but fit with Cambridge and your course, plus a convincing commitment to impact, are central to selection. Your statement and references must show both."
      },
      {
        "q": "What makes a Gates Cambridge statement stand out?",
        "a": "A strong statement connects past work to a clear future contribution. It shows why Cambridge and this course specifically are needed for that plan. Generic praise for Cambridge does not stand out."
      },
      {
        "q": "When should I start preparing?",
        "a": "As early as possible, ideally months before the deadline. References take time to earn and to write well, and your statement will need several drafts. Starting early also leaves room to fix problems."
      }
    ]
  },
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
  guide: {
    "intro": "This guide helps you work through a set of seven fully funded scholarships across different countries and levels of study. The focus is on shortlisting wisely and applying before each cycle closes.",
    "steps": [
      {
        "title": "Shortlist by eligibility first",
        "text": "Before reading any essay prompt, check each scholarship's eligibility: level of study, field, nationality or residence rules, and academic requirements. Discard any you clearly do not qualify for. This saves time and keeps your effort on real chances."
      },
      {
        "title": "Check deadlines and coverage for the current cycle",
        "text": "This video covers a specific set of cycles, so always verify deadlines and funding details on each scholarship's official page. Deadlines and coverage can change between cycles. Note each current deadline in one place so nothing slips."
      },
      {
        "title": "Read what fully funded actually covers",
        "text": "Fully funded rarely means zero costs. Check whether tuition, living costs, travel, insurance, and visas are included, and what is left out. Knowing the gaps lets you plan honestly and compare offers fairly."
      },
      {
        "title": "Match each scholarship to your profile",
        "text": "For each remaining option, ask why you are a credible fit: does your academic background, experience, and future plan align with what it funds? Prioritise the ones where your fit is strongest. A good match beats a prestigious name you cannot justify."
      },
      {
        "title": "Apply to several, not just one",
        "text": "Even strong applicants face rejection from competitive scholarships. Applying to several suitable options spreads your risk. Keep your core story consistent while tailoring each application to that scholarship's criteria."
      },
      {
        "title": "Build a simple application calendar",
        "text": "List each scholarship, its current deadline, required documents, and essay questions. Work backwards from the earliest deadline. A shared calendar prevents last-minute rushes and missing documents."
      }
    ],
    "faq": [
      {
        "q": "Does fully funded mean I will pay nothing?",
        "a": "Not always. Fully funded usually means tuition and major living costs are covered, but some expenses may still fall to you. Always read the funding breakdown for each scholarship rather than trusting the headline."
      },
      {
        "q": "How many scholarships should I apply to?",
        "a": "Apply to several that genuinely fit your profile rather than one dream option. Quality still matters, so choose a manageable number you can tailor properly. A handful of strong applications beats many rushed ones."
      },
      {
        "q": "What should I do if deadlines in the video have passed?",
        "a": "Treat the video as a guide to the scholarships themselves, not as a source of current dates. Check each official page for the next cycle. Use the time before it opens to strengthen your essays, references, and documents."
      }
    ]
  },
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
  guide: {
    "intro": "University of the People (UoPeople) is a US-accredited online university with no tuition fees, where students pay assessment fees per course. This guide explains how it works, what it offers, and who it is actually for.",
    "steps": [
      {
        "title": "Understand the tuition-free model",
        "text": "UoPeople charges no tuition fees, which is what tuition-free means in this context. Students pay assessment fees per course instead. This distinction matters for budgeting, because the total cost is real even though tuition is zero."
      },
      {
        "title": "Learn how study actually works",
        "text": "Study is fully online and self-paced, with peer learning built into the model. You will need reliable internet, steady self-discipline, and a routine for weekly coursework. If you learn best with in-person structure, weigh that honestly before enrolling."
      },
      {
        "title": "Check what degrees are offered",
        "text": "Review the current degree programmes on UoPeople's official pages and confirm the one you want is available. Compare the curriculum with your goals and with other options. A degree is only useful if its content and recognition fit your plans."
      },
      {
        "title": "Verify accreditation and recognition for your goals",
        "text": "UoPeople holds WASC (WSCUC) regional US accreditation, the same tier held by established US universities. Accreditation and local recognition are different questions, so check how the degree is treated where you plan to work or study next. Always verify claims on official sources."
      },
      {
        "title": "Decide who it is actually for",
        "text": "UoPeople suits self-motivated learners who need low cost and flexibility. It is less suited to students who want campus life, in-person networking, or a degree with well-established local recognition in every country. Match the university to your budget, learning style, and goals."
      }
    ],
    "faq": [
      {
        "q": "Is UoPeople really free?",
        "a": "It is tuition-free, but not free overall. Students pay assessment fees per course, so you should budget for the full degree cost. Check the current fee schedule on the official site before enrolling."
      },
      {
        "q": "Is a UoPeople degree recognised everywhere?",
        "a": "No degree is recognised everywhere automatically. UoPeople holds WASC (WSCUC) regional US accreditation, but local recognition depends on the country and the purpose. Check the rules that apply to your own goals."
      },
      {
        "q": "Who should consider UoPeople?",
        "a": "Students who need an affordable, flexible, fully online degree and who can study independently are the best fit. If you need campus facilities or in-person teaching, a traditional university may suit you better."
      }
    ]
  },
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
  guide: {
    "intro": "Recruiters spend seconds on a first CV scan, so small mistakes can end an application before it is properly read. This guide covers nine mistakes that get CVs rejected and how to fix each one.",
    "steps": [
      {
        "title": "Replace vague claims with numbers",
        "text": "Adjectives like hardworking or results-driven prove nothing on their own. Quantify results wherever you can: how many people, how much time saved, what outcome changed. Numbers help a recruiter judge what you actually achieved."
      },
      {
        "title": "Tailor every CV to the role",
        "text": "One generic CV fits no job well. Read the job description, identify the skills and outcomes it asks for, and emphasise the matching experience. Remove or downplay anything irrelevant to that specific role."
      },
      {
        "title": "Make your best work easy to find",
        "text": "Recruiters scan quickly, so your strongest achievements should be visible at a glance. Put the most relevant experience near the top and use clear headings. Do not bury your best work under long paragraphs."
      },
      {
        "title": "Cut clutter and keep it to one or two pages",
        "text": "A clean layout with one to two pages is easier to scan than a dense multi-page document. Remove filler, outdated entries, and repetition. Every line should earn its place by showing a skill or result the employer cares about."
      },
      {
        "title": "Turn duties into proof",
        "text": "Listing what you were responsible for tells the reader what you were supposed to do, not what you achieved. Rewrite each bullet as an action plus a result. Show the difference you made, not just the tasks you were given."
      },
      {
        "title": "Proofread for formatting and accuracy",
        "text": "Inconsistent formatting, typos, and unclear dates create doubt in seconds. Use one clean font, consistent spacing, and standard date formats. Read the finished CV aloud or ask someone else to check it before you send it."
      }
    ],
    "faq": [
      {
        "q": "How long should my CV be?",
        "a": "For most students and early-career applicants, one to two pages is right. A longer CV only helps if every additional line adds clear, relevant proof. Cut anything that does not help this specific application."
      },
      {
        "q": "Should I use the same CV for every job?",
        "a": "No. Tailor the emphasis, keywords, and examples to each role. The core facts stay the same, but the story you highlight should match what that employer is hiring for."
      },
      {
        "q": "What matters most in the first few seconds?",
        "a": "Clarity and relevance. A recruiter should immediately see what you do, what you have achieved, and why you fit this role. Numbers, clean headings, and a strong top section do most of that work."
      }
    ]
  },
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
  guide: {
    "intro": "Accreditation is the first question every serious student should ask about UoPeople. This guide explains what accreditation means, who accredits UoPeople, and how to verify it yourself.",
    "steps": [
      {
        "title": "Understand what accreditation means",
        "text": "Accreditation is an independent check that an institution meets recognised quality standards. It affects how employers, universities, and authorities view a degree. It is not the same as being popular, well-known, or affordable."
      },
      {
        "title": "Know who accredits UoPeople",
        "text": "UoPeople holds WASC (WSCUC) regional US accreditation. Regional accreditation in the United States is the same tier held by established US universities. Knowing the accreditor's name lets you verify the claim directly."
      },
      {
        "title": "Verify the claim on the accreditor's own website",
        "text": "Do not rely on the university's own marketing or on social media claims. Search the accreditor's official directory or listings for the institution. If you cannot find it there, treat the claim as unverified."
      },
      {
        "title": "Separate accreditation from local recognition",
        "text": "Accreditation and local recognition are two different questions. A degree can be properly accredited in one country and still need a separate recognition or equivalence process in another. Check both before you enrol if you plan to use the degree abroad."
      },
      {
        "title": "Check what accreditation means for your next step",
        "text": "Think about where you want to use the degree: further study, employment, licensing, or government recognition. Each path may have its own rules about which accreditation it accepts. Confirm the relevant rules for your specific goal."
      }
    ],
    "faq": [
      {
        "q": "Is UoPeople accredited?",
        "a": "Yes. UoPeople holds WASC (WSCUC) regional accreditation in the United States. You can confirm this by checking the accreditor's own official listings."
      },
      {
        "q": "Does accreditation guarantee recognition in my country?",
        "a": "No. Accreditation confirms quality standards in the accrediting country, but local recognition is a separate process. Check the rules in the country where you plan to use the degree."
      },
      {
        "q": "How do I check any university's accreditation?",
        "a": "Find the accreditor it names, then look for the institution in that accreditor's official directory. If the institution is listed there, the claim is verified at source. Never rely on screenshots or second-hand claims alone."
      }
    ]
  },
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
  guide: {
    "intro": "A US-accredited degree still needs recognition where you plan to use it. This guide explains how HEC Pakistan treats foreign degrees and how to verify the current position for your own degree.",
    "steps": [
      {
        "title": "Understand HEC equivalence",
        "text": "HEC Pakistan assesses foreign degrees for equivalence on a case-by-case basis. Equivalence is a separate step from holding an accredited foreign degree. It depends on your specific degree, institution, mode of study, and documents."
      },
      {
        "title": "Treat reported precedents as reported, not as guarantees",
        "text": "A reported 2026 precedent covered a UoPeople BS CS receiving equivalence, but it is presented as reported, not as a guarantee. One case does not mean every degree or every applicant will receive the same outcome. Always check the current position for your own situation."
      },
      {
        "title": "Keep every document from day one",
        "text": "Equivalence needs the full file, so keep every transcript, certificate, and official record from the start. Save both digital and physical copies where possible. Missing documents are a common cause of delays."
      },
      {
        "title": "Check the current process on official HEC sources",
        "text": "Equivalence rules and procedures can change, so confirm the current requirements through official HEC channels before you apply. Note which documents, forms, and verifications are required. Do not rely on older posts or second-hand summaries for current rules."
      },
      {
        "title": "Plan for your specific goal",
        "text": "Equivalence matters differently depending on whether you want a job, further study, or a government process. Identify which outcome you need and confirm what evidence it requires. Planning around your real goal prevents wasted effort."
      }
    ],
    "faq": [
      {
        "q": "Is a UoPeople degree automatically valid in Pakistan?",
        "a": "No. HEC Pakistan assesses foreign degrees for equivalence case by case. You must go through the equivalence process for your own degree rather than assuming approval."
      },
      {
        "q": "Does the reported UoPeople BS CS precedent guarantee my equivalence?",
        "a": "No. The reported 2026 precedent is useful background, but it is not a guarantee for any other applicant or degree. Your outcome depends on your own file and the current rules."
      },
      {
        "q": "What should I keep for an equivalence application?",
        "a": "Keep every transcript, certificate, and official document from day one. Equivalence requires the full file, and gaps slow the process. Store copies safely so you can produce them when asked."
      }
    ]
  },
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
  guide: {
    "intro": "The Commonwealth Master's Scholarships fund fully supported study in the UK for students who could not otherwise afford it. This guide covers eligibility, coverage, and how to shape a strong application for a given cycle.",
    "steps": [
      {
        "title": "Confirm eligibility for the current cycle",
        "text": "This video covers a specific cycle, so do not treat its dates or eligibility details as current. Always check the official Commonwealth Scholarships page for the current cycle's rules and deadlines. Eligibility can change between cycles."
      },
      {
        "title": "Understand what the scholarship covers",
        "text": "The scholarship is described as covering tuition, airfare, and living costs. Read the official funding breakdown for the current cycle to confirm exactly what is included. Knowing the coverage helps you plan for any remaining costs."
      },
      {
        "title": "Choose a course that connects to your home country's needs",
        "text": "Pick a course whose content clearly relates to a real need in your home country. Your choice should make sense alongside your background and future plans. A loose connection weakens the whole application."
      },
      {
        "title": "Make development impact central, not an afterthought",
        "text": "Development impact is a core selection criterion for this scholarship. Explain the problem you want to address, who it affects, and how your study will help you contribute after graduation. Be specific about the change you hope to support."
      },
      {
        "title": "Start the essays early",
        "text": "Do not leave the essays to the last day. Draft early so you have time to get feedback and revise. Strong essays are specific, honest, and tied to your course choice and development goals."
      },
      {
        "title": "Check every requirement before submitting",
        "text": "Confirm the documents, references, and submission steps for the current cycle on the official page. Allow time for references and for any nomination or application route that applies to you. Submit early enough to fix technical problems."
      }
    ],
    "faq": [
      {
        "q": "What does the Commonwealth Master's Scholarship cover?",
        "a": "It is described as covering tuition, airfare, and living costs. Always confirm the exact coverage for the current cycle on the official page, since details can change. Check what is excluded as well as what is included."
      },
      {
        "q": "How important is development impact?",
        "a": "It is a core selection criterion, not an afterthought. Your application should show a clear link between your course, your country's needs, and the contribution you plan to make. Vague statements about helping people are not enough."
      },
      {
        "q": "Is the deadline in the video still current?",
        "a": "No deadline in the video should be treated as current. The video covers a specific cycle, so check the official page for the current deadline. Use the official source for all dates."
      }
    ]
  },
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
  guide: {
    "intro": "Applying to UoPeople is straightforward if you prepare in order. This guide walks through the steps from creating your account to what happens after admission.",
    "steps": [
      {
        "title": "Prepare your documents before you start",
        "text": "Gather the documents the application asks for before you open the form. Missing documents are one of the two delays that slow most applicants down. Having everything ready keeps the process smooth."
      },
      {
        "title": "Create your account and complete the application",
        "text": "Follow the application in order, entering accurate personal and academic details. Double-check names, dates, and qualifications against your documents. Errors at this stage cause avoidable delays later."
      },
      {
        "title": "Submit your documents correctly",
        "text": "Upload clear, complete copies in the format the application requests. Check that every required document is included before you submit. Keep copies of everything you send."
      },
      {
        "title": "Meet the English proficiency requirement",
        "text": "English proficiency proof is part of the process, so check which tests or evidence UoPeople accepts. Unverified English proficiency is the other common delay. Confirm the accepted options and any score requirements on the official pages."
      },
      {
        "title": "Know what happens after admission",
        "text": "Admission is only the start. Foundations and assessment fees come next, so plan for the cost and the coursework that follows. Read the next steps carefully so you know what to complete before your first courses."
      }
    ],
    "faq": [
      {
        "q": "What slows down a UoPeople application most often?",
        "a": "Missing documents and unverified English proficiency are the two delays that slow most applicants down. Prepare both before you start. Checking requirements early prevents most problems."
      },
      {
        "q": "Do I need English proficiency proof to apply?",
        "a": "Yes, English proficiency proof is part of the process. Check the accepted tests or evidence on UoPeople's official pages. Make sure your proof meets the current requirements."
      },
      {
        "q": "What happens after I am admitted?",
        "a": "Admission is only the start. You will still need to complete foundations and pay assessment fees for courses. Plan for both the academic and financial next steps."
      }
    ]
  },
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
  guide: {
    "intro": "UoPeople is tuition-free, but that is not the whole story. This guide does the full maths: assessment fees, the total cost of a bachelor's degree, and the extra costs students forget to budget for.",
    "steps": [
      {
        "title": "Understand what tuition-free really means",
        "text": "Tuition-free means you pay no tuition fees. It does not mean the degree costs nothing. Students pay assessment fees per course, and those fees are the main cost to budget for."
      },
      {
        "title": "Budget $180 per course in assessment fees",
        "text": "Undergraduate assessment is $180 per course. Multiply that by the number of courses in your programme to estimate your core cost. Always confirm the current fee on the official site, since fees can change."
      },
      {
        "title": "Plan for the full degree total",
        "text": "A full bachelor's degree totals $7,260 at the stated rates. Treat this as your baseline budget for the degree itself. It is a fraction of a traditional degree, but it is still a number you should plan for honestly."
      },
      {
        "title": "Budget for the costs students forget",
        "text": "Beyond assessment fees, plan for costs like reliable internet, a suitable device, and any study materials you need. These smaller costs add up over a degree. A realistic budget prevents surprises midway through your studies."
      },
      {
        "title": "Look into scholarships and aid",
        "text": "Scholarships and financial aid exist and may reduce what you pay. Aid is separate from admission and is limited and competitive. Check the current aid options and application process on the official pages."
      }
    ],
    "faq": [
      {
        "q": "How much does a UoPeople bachelor's degree cost?",
        "a": "At the stated rates, undergraduate assessment is $180 per course and a full bachelor's degree totals $7,260. Always confirm the current fees on the official site. Your total may also include smaller study costs."
      },
      {
        "q": "Is UoPeople really tuition-free?",
        "a": "Yes, in the sense that there are no tuition fees. Students still pay assessment fees per course. The degree is low-cost compared with a traditional degree, but it is not free overall."
      },
      {
        "q": "Can scholarships cover the cost?",
        "a": "Scholarships and financial aid exist, but aid is limited and competitive. Aid applications are separate from admission. Plan for the possibility of paying some fees while aid is decided."
      }
    ]
  },
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
  guide: {
    "intro": "UoPeople's scholarships and financial aid offer a route to studying for less, or in some cases for free. This guide explains who qualifies, how to apply, and how to present your case clearly.",
    "steps": [
      {
        "title": "Know that aid is separate from admission",
        "text": "Financial aid applications are separate from admission, so apply for both. Being admitted does not automatically mean you receive aid. Check the aid process and deadlines on the official pages."
      },
      {
        "title": "Check who qualifies",
        "text": "Review the current eligibility criteria for UoPeople scholarships and financial aid. Aid is limited and competitive, so confirm that you meet the requirements before you apply. Do not assume aid is available to every student."
      },
      {
        "title": "Present your need and plan clearly",
        "text": "A clear statement of need and goals strengthens your case. Explain your financial situation honestly and describe what you plan to do with the degree. A concrete plan is more persuasive than a general request."
      },
      {
        "title": "Apply carefully and completely",
        "text": "Follow the aid application instructions in full and provide every document requested. Incomplete applications are easy to overlook in a competitive process. Keep copies of what you submit."
      },
      {
        "title": "Plan for the possibility of paying some fees",
        "text": "Aid is not guaranteed, so plan for the possibility of paying some fees while aid is decided. Budget for at least part of the assessment costs. Having a backup plan keeps your studies on track if aid is delayed or declined."
      },
      {
        "title": "Know what to do if your first application does not succeed",
        "text": "If your first application does not succeed, check whether you can reapply and what would strengthen a future application. Review the feedback or guidance available and improve your statement. Consider other funding options in the meantime."
      }
    ],
    "faq": [
      {
        "q": "Is financial aid automatic after admission?",
        "a": "No. Financial aid applications are separate from admission. You must apply for aid in addition to applying for admission."
      },
      {
        "q": "Can UoPeople scholarships cover all my costs?",
        "a": "Scholarships and aid may reduce your costs substantially, but aid is limited and competitive. Plan for the possibility of paying some fees. Always check the current aid terms on the official pages."
      },
      {
        "q": "What makes an aid application stronger?",
        "a": "A clear, honest statement of need combined with a concrete plan for your studies and goals. Show why the aid matters and how you will use the opportunity. Complete documentation also helps."
      }
    ]
  },
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
  guide: {
    "intro": "The Yenching Academy at Peking University offers a fully funded master's in China covering tuition, housing, and living costs. This guide covers how it works, who it suits, and how to build a competitive application for a given cycle.",
    "steps": [
      {
        "title": "Understand what Yenching selects for",
        "text": "Yenching selects for leadership and China engagement, not grades alone. Strong academics help, but the committee also looks for evidence of initiative and genuine interest in China. Show both in your application."
      },
      {
        "title": "Check the current cycle on the official page",
        "text": "This video covers a specific cycle, so do not treat its dates or details as current. Always confirm eligibility, deadlines, and programme details on the official Yenching Academy page. Requirements can change between cycles."
      },
      {
        "title": "Make your research proposal specific and realistic",
        "text": "Your research proposal must be specific and realistic. State a clear question, explain why it matters, and show that it can be pursued within the programme. Vague or overly broad proposals weaken an otherwise strong application."
      },
      {
        "title": "Show leadership with evidence, not claims",
        "text": "Describe leadership through concrete examples: what you led, what you did, and what changed. Avoid generic claims about being a leader. Evidence from real experience is far more convincing."
      },
      {
        "title": "Start early on references and essays",
        "text": "References and essays take weeks, not days, so start early. Give referees time and context, and leave yourself room to revise your essays. Rushing either one is a common reason strong applicants are rejected."
      },
      {
        "title": "Avoid the mistakes that reject strong applicants",
        "text": "Common mistakes include a vague proposal, weak evidence of China engagement, and generic essays. Check every part of your application against the official criteria. Ask a trusted reader to spot gaps before you submit."
      }
    ],
    "faq": [
      {
        "q": "What does the Yenching Academy cover?",
        "a": "It is described as covering tuition, housing, and living costs for a fully funded master's at Peking University. Confirm the exact coverage for the current cycle on the official page. Coverage details can change between cycles."
      },
      {
        "q": "Are grades enough to win Yenching?",
        "a": "No. Yenching selects for leadership and China engagement as well as academic strength. Your proposal, essays, and references must show those qualities with evidence."
      },
      {
        "q": "Is the deadline in the video still current?",
        "a": "No deadline in the video should be treated as current. The video covers a specific cycle, so check the official page for the current deadline. Use the official source for all dates."
      }
    ]
  },
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
  guide: {
    "intro": "UoPeople and a traditional university each have real strengths and real trade-offs. This guide compares them honestly so you can match the choice to your goals, budget, and learning style.",
    "steps": [
      {
        "title": "Compare cost honestly",
        "text": "UoPeople wins on cost: there are no tuition fees, and a full bachelor's degree totals $7,260 in assessment fees at the stated rates. A traditional university usually costs far more, though its total varies widely. Compare the full cost of each option, not just the headline figure."
      },
      {
        "title": "Compare flexibility",
        "text": "UoPeople's fully online, self-paced model offers flexibility for students who work or have other commitments. Traditional universities offer fixed schedules, in-person teaching, and campus facilities. Decide how much flexibility you need and how much structure you benefit from."
      },
      {
        "title": "Weigh campus life and networking",
        "text": "Traditional universities win on campus life and in-person networking. Face-to-face classes, societies, and local contacts can shape your career. UoPeople's peer learning is online, so it suits students who can build networks in other ways."
      },
      {
        "title": "Weigh recognition for your goal",
        "text": "Local recognition varies by country and purpose. UoPeople holds WASC (WSCUC) regional US accreditation, but recognition where you plan to work or study next needs separate checking. A traditional local university may have more established recognition in its own country."
      },
      {
        "title": "Be honest about self-discipline",
        "text": "Self-discipline is the deciding factor in online study. If you can set a routine, meet deadlines, and keep going without in-person pressure, online study can work well. If you rely on classroom structure, a traditional university may suit you better."
      },
      {
        "title": "Match the university to your goals",
        "text": "There is no universal answer. List your goals, budget, learning style, and where you want to use the degree, then compare both options against that list. The right choice is the one that fits your situation, not the one that suits someone else."
      }
    ],
    "faq": [
      {
        "q": "Is UoPeople better than a traditional university?",
        "a": "Neither is better in general. UoPeople wins on cost and flexibility, while traditional universities win on campus life and local networks. The right answer depends on your goals, budget, and how you learn best."
      },
      {
        "q": "What is the hardest part of studying at UoPeople?",
        "a": "Self-discipline. Online, self-paced study requires you to manage your own routine and deadlines. Students who thrive are those who build a steady habit and stick to it."
      },
      {
        "q": "How should I decide between the two?",
        "a": "Compare cost, flexibility, campus experience, networking, and recognition for your specific goal. Be honest about your learning style and budget. Choose the option that fits your real situation."
      }
    ]
  },
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
  guide: {
    "intro": "Reference managers format your citations automatically, so you never need to type references by hand. This guide shows how to set one up and use it from your first assignment.",
    "steps": [
      {
        "title": "Pick a free reference manager",
        "text": "Choose a free reference manager that works with your writing setup. Most offer a browser extension and a word-processor plugin. Pick one and stick with it so all your references live in one place."
      },
      {
        "title": "Save sources as you read them",
        "text": "Save each source to your manager the moment you find it useful, rather than at the end. Add the full details: author, title, year, and publication information. Saving early prevents lost sources and last-minute scrambling."
      },
      {
        "title": "Insert citations while you write",
        "text": "Use the manager's plugin to insert citations as you draft. The tool formats each citation in your chosen style. This keeps your writing flow intact and avoids manual formatting errors."
      },
      {
        "title": "Generate the reference list in one click",
        "text": "When your draft is done, let the manager generate the full reference list. Check that every cited source appears and that no uncited sources are included. One click replaces an hour of manual formatting."
      },
      {
        "title": "Check the output before submitting",
        "text": "Tools can misread a source's details, so proofread the generated list. Verify author names, years, and titles against the originals. A quick check keeps small errors from costing marks."
      }
    ],
    "faq": [
      {
        "q": "Do I need a reference manager for short assignments?",
        "a": "Yes, starting early is the point. Using one from your first assignment builds a habit and a library you can reuse. Even short assignments benefit from accurate, automatic formatting."
      },
      {
        "q": "Can a reference manager get the details wrong?",
        "a": "Yes, it can misread imported data. Always check author names, dates, and titles before submitting. The tool saves time, but the final check is still yours."
      },
      {
        "q": "Which citation style should I use?",
        "a": "Use the style your course or institution requires. Most managers support many styles and let you switch with one click. Confirm the required style before you start writing."
      }
    ]
  },
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
  guide: {
    "intro": "Most scholarship rejections come from skipping a basic check before applying. This guide covers the three things to verify before you write a single essay.",
    "steps": [
      {
        "title": "Read the eligibility rules first",
        "text": "Before writing anything, check whether you meet the eligibility criteria: level of study, field, nationality or residence rules, and academic requirements. If you clearly do not qualify, move on. Applying to scholarships you are not eligible for wastes time you could spend on real chances."
      },
      {
        "title": "Verify the real deadline on the official page",
        "text": "Confirm the deadline on the scholarship's official page, not on social media or second-hand posts. Note the time zone and the exact submission method. Deadlines can change, and late applications are usually not considered."
      },
      {
        "title": "Check what the funding actually covers",
        "text": "Read the funding breakdown to see what is included and what is not. Fully funded rarely means every cost is covered. Knowing the gaps lets you plan honestly and compare offers fairly."
      },
      {
        "title": "Decide whether the scholarship fits your profile",
        "text": "Ask whether your background, experience, and future plan align with what the scholarship funds. A good fit is worth far more than a prestigious name. Shortlist only the scholarships where you can make a credible case."
      },
      {
        "title": "Only then start the application",
        "text": "Once the checks pass, gather documents and start the essays. Tailor your application to that scholarship's criteria. A careful application to a fitting scholarship beats a rushed application to a famous one."
      }
    ],
    "faq": [
      {
        "q": "What is the most common scholarship mistake?",
        "a": "Applying without checking eligibility, deadlines, and coverage. Most rejections come from skipping this step. A few minutes of checking saves hours of wasted work."
      },
      {
        "q": "Where should I check deadlines?",
        "a": "On the scholarship's official page. Social media posts and forwarded messages can be outdated or wrong. The official source is the only one to trust for dates."
      },
      {
        "q": "Does fully funded mean everything is paid for?",
        "a": "Not always. Fully funded usually covers tuition and major living costs, but some expenses may still fall to you. Always read the funding breakdown."
      }
    ]
  },
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
  guide: {
    "intro": "Three CV mistakes get applications rejected before they are properly read. This guide explains each one and how to fix it quickly.",
    "steps": [
      {
        "title": "Prove vague claims with numbers",
        "text": "Vague claims with no proof are the first mistake. Replace adjectives with evidence: what you did, how much, and what changed. Numbers help a recruiter judge your real impact."
      },
      {
        "title": "Tailor the CV to this job",
        "text": "A CV written for every job is written for none. Read the job description and emphasise the experience that matches it. Remove or downplay anything irrelevant to that specific role."
      },
      {
        "title": "Cut clutter that buries your best work",
        "text": "Clutter hides your strongest achievements. Remove filler, repetition, and outdated entries. A clean, scannable layout lets your best work stand out."
      },
      {
        "title": "Do a final scan test",
        "text": "Glance at your CV for a few seconds, as a recruiter would. Your strongest, most relevant achievements should be visible immediately. If they are not, reorder and simplify until they are."
      }
    ],
    "faq": [
      {
        "q": "What is the quickest CV fix?",
        "a": "Add numbers to your achievements. Replacing vague claims with measurable results improves a CV faster than any formatting change. Start with your strongest bullets."
      },
      {
        "q": "Should I really rewrite my CV for each job?",
        "a": "Yes. Tailoring does not mean starting from scratch, but the emphasis should match each role. A tailored CV shows the employer you understand what they need."
      },
      {
        "q": "How do I know if my CV is cluttered?",
        "a": "If a quick scan does not reveal your best work, it is cluttered. Cut filler, shorten long paragraphs, and use clear headings. Every line should earn its place."
      }
    ]
  },
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
  guide: {
    "intro": "A degree gets you considered, but skills, proof of work, and communication get you hired. This guide shows how to build the evidence employers actually look for while you study.",
    "steps": [
      {
        "title": "Treat your degree as a starting point",
        "text": "A degree shows you completed a programme, but it does not prove you can do the job. Employers also want to see skills, work samples, and how you communicate. Plan to build all three alongside your studies."
      },
      {
        "title": "Build proof while you study",
        "text": "Work on projects, internships, freelance tasks, or volunteer work that produce something you can show. Save the results: a portfolio, a write-up, or a finished product. Proof turns a claim on your CV into something verifiable."
      },
      {
        "title": "Develop skills employers ask for",
        "text": "Identify the skills listed in job postings for roles you want. Practise them on real tasks rather than only reading about them. Skills you have used are far more convincing than skills you have only studied."
      },
      {
        "title": "Practise communicating your work",
        "text": "Communication is a career skill, not a soft extra. Learn to explain what you did, why it mattered, and what you learned. Clear communication helps in interviews, applications, and on the job itself."
      },
      {
        "title": "Show your work consistently",
        "text": "Share what you build in a portfolio, on professional profiles, or through your community. Consistent, honest sharing builds credibility over time. Employers notice candidates whose work they can already see."
      }
    ],
    "faq": [
      {
        "q": "Is a degree still worth it?",
        "a": "Yes. A degree gets you considered and opens doors that stay closed without one. It works best when combined with skills, proof of work, and clear communication."
      },
      {
        "q": "What counts as proof of work?",
        "a": "Anything an employer can inspect: a project, a portfolio piece, an internship outcome, or a published write-up. Proof should show what you did and what changed as a result."
      },
      {
        "q": "How do I start if I have no experience?",
        "a": "Start with one small project connected to the work you want. Finish it, document it, and share it. One finished piece of proof is a strong starting point."
      }
    ]
  },
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
  guide: {
    "intro": "AI tools can read and summarise long PDFs in seconds. This guide shows how to use them to get the structure of a paper fast, then read the important parts yourself.",
    "steps": [
      {
        "title": "Pick a reputable AI reading tool",
        "text": "Choose a well-known tool that can summarise PDFs and answer questions about them. Check what it does with your files and whether it suits academic use. Avoid tools that make unclear privacy claims."
      },
      {
        "title": "Get the structure first",
        "text": "Ask the tool for a summary: the main question, method, findings, and conclusion. Use this overview to decide which sections deserve your full attention. A fast structural pass saves hours of unfocused reading."
      },
      {
        "title": "Read the important parts yourself",
        "text": "Summaries are a starting point, not a substitute for reading. Read the key sections, figures, and arguments in the original paper. Your understanding must come from the source, not only from the summary."
      },
      {
        "title": "Verify anything you plan to cite",
        "text": "AI summaries can miss nuance or misstate details. Before citing a claim, check it against the original text. If you cannot find it in the paper, do not cite it."
      },
      {
        "title": "Never submit AI output as your own work",
        "text": "Do not copy AI-generated text into assignments or present it as your own writing. Use AI to help you understand, then write your own analysis. Submitting AI output as your own work is academic misconduct."
      }
    ],
    "faq": [
      {
        "q": "Can AI replace reading the paper?",
        "a": "No. AI can give you a fast overview and help you find the important parts. Deep understanding still requires reading the key sections yourself."
      },
      {
        "q": "Can I cite an AI summary?",
        "a": "No. Cite the original paper, and only after verifying the claim in the source text. An AI summary is a reading aid, not a source."
      },
      {
        "q": "Is using AI to summarise papers cheating?",
        "a": "Using it to understand a paper is a legitimate study aid, provided you then read and write your own work. Submitting AI output as your own work is not. Follow your institution's rules on AI use."
      }
    ]
  },
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
  guide: {
    "intro": "Average students often win better jobs because they spend their energy on skills, networking, and real experience. This guide explains why grades alone are not enough and what to do instead.",
    "steps": [
      {
        "title": "See grades for what they are",
        "text": "Grades open doors, but they do not walk you through them. Many employers use grades as a filter, then decide based on skills, experience, and interviews. Strong grades help most when paired with real evidence of ability."
      },
      {
        "title": "Invest in skills employers ask for",
        "text": "Look at job postings for roles you want and note the skills they repeat. Practise those skills on real tasks. Skills you have used are far more convincing than grades alone."
      },
      {
        "title": "Build real experience while you study",
        "text": "Internships, projects, freelance work, and volunteering all count as experience. Choose activities that produce something you can show. Experience beats a transcript in most interviews because it proves you can do the work."
      },
      {
        "title": "Build relationships, not just a CV",
        "text": "Networking is not collecting contacts; it is building trust through useful work and honest communication. Help others, show up consistently, and keep in touch. Relationships often surface opportunities that never reach public job boards."
      },
      {
        "title": "Keep grades solid while you build the rest",
        "text": "The point is not to ignore grades. Keep them respectable so they do not block you, then put your extra energy into skills, experience, and relationships. That combination is what wins better jobs."
      }
    ],
    "faq": [
      {
        "q": "Do grades not matter at all?",
        "a": "Grades do matter. They open doors and can filter applications. They are simply not enough on their own, because employers also weigh skills, experience, and how you perform in interviews."
      },
      {
        "q": "What if I am a top scorer with no experience?",
        "a": "Start building experience now with one small project or internship. Your grades already open doors, so adding proof of work makes you a much stronger candidate. It is never too late to add experience."
      },
      {
        "q": "How do I network as a student?",
        "a": "Start by helping people around you and showing your work. Attend events, contribute to communities, and follow up with people you meet. Consistent, genuine effort beats collecting contacts."
      }
    ]
  },
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
  guide: {
    "intro": "Your first client usually comes from someone who already trusts you. This guide shows how to land that first project by offering one clear service and delivering work you can show.",
    "steps": [
      {
        "title": "Offer one clear service",
        "text": "One clear service beats ten vague ones. Pick a specific outcome you can deliver, such as designing a logo, building a simple website, or editing a video. A clear offer makes it easy for people to say yes and to refer you."
      },
      {
        "title": "Start with your existing network",
        "text": "Your first client is often one conversation away. Tell friends, family, classmates, and community members what you offer. People who already trust you are far more likely to give you a first chance."
      },
      {
        "title": "Make the first offer easy to accept",
        "text": "Describe exactly what you will deliver, by when, and for what price or terms. Keep the scope small enough that you can deliver it well. A small, successful first project builds confidence on both sides."
      },
      {
        "title": "Deliver work you can show publicly",
        "text": "Do the work to a standard you would be proud to display. Ask permission to share the result as a sample. Your first project becomes the proof that wins your second client."
      },
      {
        "title": "Turn one client into the next",
        "text": "After delivery, ask for honest feedback and, if the client is happy, a testimonial or referral. Stay in touch and keep showing new work. One good client often leads to more through word of mouth."
      }
    ],
    "faq": [
      {
        "q": "What if nobody in my network needs my service?",
        "a": "Ask them who they know that might. A warm introduction from someone who trusts you is far more effective than cold outreach. Keep telling people what you offer so they can connect you."
      },
      {
        "q": "Should I work for free to get my first client?",
        "a": "Not necessarily. A small paid project proves that someone values your work. If you do offer a low-cost first project, keep the scope small and make sure you can show the result."
      },
      {
        "q": "What service should I offer first?",
        "a": "Offer the one thing you can already deliver well. A narrow, concrete service is easier to sell than a broad promise. You can expand your offers once you have proof."
      }
    ]
  },
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
  guide: {
    "intro": "Tell me about yourself is not your life story. This guide gives you a simple structure: where you are now, what you have done that matters for this role, and where you are headed.",
    "steps": [
      {
        "title": "Start with where you are now",
        "text": "Open with your current position in one sentence: what you study or do, and the field you work in. Keep it brief and relevant to the role. This gives the interviewer a clear starting point."
      },
      {
        "title": "Share past proof that matters for this role",
        "text": "Pick one or two experiences that connect directly to the job. Describe what you did and what changed as a result. Relevance beats a full life history."
      },
      {
        "title": "End with where you are headed",
        "text": "Close by connecting your direction to this role. Explain what you want to do next and why this job fits. A clear forward direction shows purpose and preparation."
      },
      {
        "title": "Keep it under two minutes",
        "text": "Aim for a concise answer of under two minutes. Longer answers lose the interviewer's attention and drift off-topic. Practise aloud until the structure feels natural."
      },
      {
        "title": "Tailor it to each role",
        "text": "Adjust which experiences you highlight based on the job description. The structure stays the same, but the proof should match what the employer is hiring for. Preparation is what makes the answer sound effortless."
      }
    ],
    "faq": [
      {
        "q": "Should I start from childhood or school?",
        "a": "No. Start with where you are now. The interviewer wants a professional snapshot, not your life story. Keep the focus on what matters for this role."
      },
      {
        "q": "How long should the answer be?",
        "a": "Keep it under two minutes. A concise, structured answer is more memorable than a long one. Practise with a timer until it feels natural."
      },
      {
        "q": "What if I have little experience?",
        "a": "Use projects, coursework, volunteering, or community work as your proof. What matters is showing relevant skills and initiative, not a long job history. Pick the strongest examples you have."
      }
    ]
  },
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
  guide: {
    "intro": "Harvard's famous introductory computer science course is available online for free. This guide shows how to approach it so you actually finish and learn to code from zero.",
    "steps": [
      {
        "title": "Start with the right expectations",
        "text": "This is a real university course, not a quick tutorial. Expect challenging problem sets and a steep learning curve at first. Free does not mean easy, and the difficulty is part of why it works."
      },
      {
        "title": "Set a steady weekly schedule",
        "text": "Block regular time each week for lectures, reading, and problem sets. Short, consistent sessions beat occasional long ones. Treat the schedule like a real class."
      },
      {
        "title": "Finish the problem sets, not just the lectures",
        "text": "Watching lectures feels like progress, but coding skill comes from solving problems. Complete every problem set, even when it is hard. Struggling through a problem teaches more than rewatching a lecture."
      },
      {
        "title": "Use the course community and resources",
        "text": "Make use of the course materials, discussion spaces, and help resources. Asking good questions when you are stuck is part of learning. Do not stay stuck in silence for days."
      },
      {
        "title": "Build something with what you learn",
        "text": "After the basics, apply your skills to a small project of your own. A finished project turns course knowledge into proof you can show. It also makes the concepts stick far better than lectures alone."
      }
    ],
    "faq": [
      {
        "q": "Do I need prior coding experience?",
        "a": "No. The course is designed as a starting point for anyone learning to code from zero. You will need patience and consistent practice, but no prior programming is assumed."
      },
      {
        "q": "Is the free version good enough?",
        "a": "Yes. The free version gives you access to the course content itself, which is where the learning happens. Free does not mean low quality, and the best courses are often open."
      },
      {
        "q": "How do I stay motivated through hard problem sets?",
        "a": "Work in small steps, take breaks, and ask for help when stuck. Finishing one hard problem builds more confidence than watching many lectures. A steady schedule keeps momentum going."
      }
    ]
  },
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
  guide: {
    "intro": "Fully funded rarely means every cost is covered. This guide shows how to read a funding offer properly so you can budget for what is left out.",
    "steps": [
      {
        "title": "Read the funding breakdown, not just the headline",
        "text": "Always read the full funding breakdown rather than trusting the headline. Check each line: tuition, living costs, travel, insurance, and any allowances. The breakdown tells you what is actually paid for."
      },
      {
        "title": "List what is not covered",
        "text": "Note every cost the funding does not cover. Common gaps include flights, visas, daily costs, and settling-in expenses. Knowing the gaps early prevents surprises after you accept."
      },
      {
        "title": "Budget for flights, visas, and daily costs",
        "text": "Even when tuition and living costs are covered, flights, visas, and daily costs can add up. Estimate each one for your specific route and destination. A realistic budget keeps you from running short."
      },
      {
        "title": "Check conditions and duration",
        "text": "Confirm how long the funding lasts and whether it depends on academic progress or other conditions. Some funding covers only part of a programme or renews annually. Knowing the terms helps you plan the full period."
      },
      {
        "title": "Compare offers on total cost, not labels",
        "text": "Compare scholarships by what you would still need to pay, not by the label fully funded. A smaller award with fewer gaps can be better than a larger-sounding one with many exclusions. Do the maths for each offer."
      }
    ],
    "faq": [
      {
        "q": "Does fully funded mean I pay nothing?",
        "a": "Not always. Fully funded usually means tuition and major living costs are covered, but some expenses may still fall to you. Always read the funding breakdown."
      },
      {
        "q": "What costs are most often left out?",
        "a": "Flights, visas, and daily costs are common gaps. Settling-in costs and personal expenses may also be excluded. Check each offer's breakdown rather than assuming."
      },
      {
        "q": "How should I compare two funded offers?",
        "a": "Compare what each one leaves you to pay, including travel, visas, and uncovered costs. The better offer is the one with the lower real cost to you, not the bigger headline."
      }
    ]
  },
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
  guide: {
    "intro": "Eight hours of passive reading feels productive, but focused study with active recall beats it. This guide shows how to replace long, passive sessions with shorter, harder ones that actually work.",
    "steps": [
      {
        "title": "Stop measuring study by hours",
        "text": "Hours spent reading do not measure learning. Focus on what you can recall and apply after a session. A short session that ends with real recall beats a long session that ends with vague familiarity."
      },
      {
        "title": "Use active recall",
        "text": "Test yourself instead of re-reading. Close the book and try to recall key ideas, definitions, and steps from memory. Recall feels harder than re-reading, and that difficulty is what builds lasting memory."
      },
      {
        "title": "Work in short, focused sessions",
        "text": "Study in focused blocks with a clear goal for each one. Remove distractions and set a timer. Shorter, harder sessions win because attention stays high throughout."
      },
      {
        "title": "Space your revision",
        "text": "Spread revision across days rather than cramming it into one session. Revisit material after a gap and test yourself again. Spaced practice strengthens memory far better than massed re-reading."
      },
      {
        "title": "Check understanding with practice",
        "text": "Use practice questions, past papers, or problems to check what you really know. Wrong answers show you exactly what to revisit. Practice turns passive review into useful feedback."
      }
    ],
    "faq": [
      {
        "q": "Is studying for 8 hours ever useful?",
        "a": "Long sessions can help if they are active and broken into focused blocks with recall and practice. Eight hours of passive reading, however, is a poor use of time. Focus beats hours."
      },
      {
        "q": "What is active recall?",
        "a": "Active recall means testing yourself from memory instead of re-reading. Close your notes and try to recall the material, then check what you missed. It is harder than re-reading and far more effective."
      },
      {
        "q": "How long should a study session be?",
        "a": "Long enough to stay focused, short enough to stay sharp. A focused block with a clear goal and a break afterwards works better than an unbroken marathon. Adjust the length to your concentration."
      }
    ]
  },
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
  guide: {
    "intro": "Applying everywhere feels productive and usually is not. This guide shows why ten tailored applications beat a hundred copy-paste ones.",
    "steps": [
      {
        "title": "Stop treating volume as progress",
        "text": "Sending many identical applications feels busy, but it rarely leads to interviews. Employers can tell when an application is generic. Volume without tailoring wastes time and hurts your chances."
      },
      {
        "title": "Shortlist roles you genuinely fit",
        "text": "Pick roles where your skills, experience, and interests clearly match the description. A smaller shortlist lets you invest real effort in each one. Fit matters more than the number of applications you send."
      },
      {
        "title": "Tailor each application to the role",
        "text": "Read each job description and adjust your CV and cover letter to match it. Highlight the experience and skills that role asks for. Tailoring shows the employer you understand what they need."
      },
      {
        "title": "Write a specific cover letter or message",
        "text": "Explain why this role and this organisation fit your skills and goals. Mention concrete experience that matches their needs. A specific message beats a generic template every time."
      },
      {
        "title": "Track and follow up",
        "text": "Keep a list of the roles you applied to, the date, and the status. Follow up politely where appropriate. Tracking keeps you organised and helps you learn which approaches work."
      }
    ],
    "faq": [
      {
        "q": "How many applications should I send?",
        "a": "Send as many as you can tailor properly, not as many as possible. Ten tailored applications beat a hundred copy-paste ones. Quality of applications beats quantity."
      },
      {
        "q": "Does tailoring really make a difference?",
        "a": "Yes. Tailored applications show the employer that you understand the role and can meet its needs. Generic applications are easy to ignore because they say nothing specific."
      },
      {
        "q": "What if I am not getting replies?",
        "a": "Review your tailoring before increasing volume. Check whether your CV matches the roles you target and whether your examples are specific. Improving a few strong applications usually helps more than sending more generic ones."
      }
    ]
  },
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
  guide: {
    "intro": "Student in your LinkedIn headline tells recruiters nothing. This guide shows how to write a headline that says what you do and who you help instead.",
    "steps": [
      {
        "title": "Remove the empty label",
        "text": "Student describes your status, not your value. Recruiters search for skills, fields, and outcomes, not enrolment status. Replace the label with something that tells them what you actually do."
      },
      {
        "title": "Say what you do and who you help",
        "text": "Write your headline around your skills, your field, and your direction. For example, name the area you work in and the kind of problem you help solve. A clear headline helps the right people understand you at a glance."
      },
      {
        "title": "Use keywords the right people search for",
        "text": "Include keywords from the roles and fields you want to be found in. Use terms recruiters actually search for, not jargon only your classmates use. Keywords help the right people find you."
      },
      {
        "title": "Make it specific, not generic",
        "text": "Avoid vague claims that could describe anyone. Be specific about your field, skills, or focus. Specificity makes your profile memorable and credible."
      },
      {
        "title": "Keep it honest and current",
        "text": "Only claim skills and experience you can back up. Update your headline as your focus changes. An honest, current headline builds trust with anyone who visits your profile."
      }
    ],
    "faq": [
      {
        "q": "What should I write instead of Student?",
        "a": "Write what you do and who you help: your field, your skills, and your direction. For example, name the area you are building skills in and the work you want to do. Keep it specific and honest."
      },
      {
        "q": "Do keywords in a headline really matter?",
        "a": "Yes. Recruiters search by keywords, so including the right terms helps the right people find you. Use the terms used in job postings for roles you want."
      },
      {
        "q": "Should students avoid mentioning study at all?",
        "a": "No. Your education still belongs on your profile, in the education section and experience. The headline itself should focus on what you do and where you are headed, not only on your status."
      }
    ]
  },
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
  guide: {
    "intro": "Some CV lines hurt more than they help. This guide shows which lines to cut so your real proof can speak.",
    "steps": [
      {
        "title": "Cut cliches with no evidence",
        "text": "Cliches like team player or fast learner prove nothing without evidence. Remove them or replace them with a concrete example. Proof beats adjectives every time."
      },
      {
        "title": "Remove irrelevant details",
        "text": "Cut details that do not help this specific application, even if they once felt impressive. Irrelevant lines distract from your strongest evidence. Every line should serve the role you are applying for."
      },
      {
        "title": "Remove skills you cannot back up",
        "text": "Listing skills you cannot demonstrate invites questions you cannot answer. Keep only the skills you have used and can prove. A shorter, honest skills list is stronger than a long, doubtful one."
      },
      {
        "title": "Let your real proof speak",
        "text": "Replace weak lines with measurable achievements and concrete examples. Show what you did and what changed. Strong proof makes the case for you without needing filler."
      },
      {
        "title": "Do a final line-by-line check",
        "text": "Read every remaining line and ask whether it earns its place with evidence. If it does not, cut or rewrite it. A lean CV with real proof beats a long CV full of filler."
      }
    ],
    "faq": [
      {
        "q": "What CV lines should I always remove?",
        "a": "Remove cliches with no evidence, irrelevant details, and skills you cannot back up. These lines weaken the CV because they add words without proof. Keep only lines that show real skills or results."
      },
      {
        "q": "Is a shorter CV always better?",
        "a": "A shorter CV is better when the removed lines were filler. The goal is not brevity alone, but a CV where every line earns its place. Keep anything that adds clear, relevant proof."
      },
      {
        "q": "How do I replace a cliche with proof?",
        "a": "Turn the claim into an example: what you did, in what context, and what changed. A single concrete example proves more than any adjective. Use numbers where you can."
      }
    ]
  },
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
  guide: {
    "intro": "Before a human ever sees your CV, an applicant tracking system may filter it out. This guide shows how to make your CV readable to both the software and the recruiter.",
    "steps": [
      {
        "title": "Understand what the system does",
        "text": "An applicant tracking system scans CVs for keywords and basic structure before a human reviews them. It can filter out CVs that do not match the role or that it cannot read. Your CV must pass this first screen to reach a person."
      },
      {
        "title": "Mirror the job description's keywords honestly",
        "text": "Use the same terms the job description uses for skills, tools, and qualifications, where they truthfully apply to you. Matching keywords helps the system recognise your fit. Never add keywords for skills you do not have."
      },
      {
        "title": "Keep formatting simple",
        "text": "Simple formatting parses best. Use standard headings, one clean font, and a straightforward layout. Avoid tables, text boxes, images, and unusual fonts that the system may misread."
      },
      {
        "title": "Never hide text",
        "text": "Never hide keywords in white text or invisible sections. Hidden text is dishonest and can get your application rejected. Earn the match with real, visible experience."
      },
      {
        "title": "Write for the human reader too",
        "text": "Once the system passes your CV on, a recruiter still needs to see clear proof. Use numbers, concrete achievements, and a clean layout. A CV that only chases keywords but reads poorly will still fail."
      }
    ],
    "faq": [
      {
        "q": "What is an applicant tracking system?",
        "a": "It is software employers use to scan and filter CVs before a human reviews them. It checks for keywords and readable structure. If your CV does not pass, a recruiter may never see it."
      },
      {
        "q": "Should I copy keywords from the job description?",
        "a": "Yes, where they honestly apply to you. Mirror the job description's terms for skills and tools you genuinely have. Never claim skills you do not have just to match keywords."
      },
      {
        "q": "What formatting should I avoid?",
        "a": "Avoid tables, text boxes, images, graphics, and unusual fonts. Keep headings standard and the layout simple. Simple formatting parses best and also reads well for humans."
      }
    ]
  },
  },
]

export const videoBySlug = (slug) => VIDEOS.find((v) => v.slug === slug)
export const longVideos = VIDEOS.filter((v) => v.type === 'long')
export const shortVideos = VIDEOS.filter((v) => v.type === 'short')
