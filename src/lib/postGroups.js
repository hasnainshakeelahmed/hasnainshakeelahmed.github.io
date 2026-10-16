// Channel-post grouping: posts are NOT a standalone section. Every post
// belongs to one of three site sections by its category:
//   Scholarships -> Scholarship posts
//   Jobs         -> Job / Internship posts
//   Education    -> Course, Study Skill, Career Guidance, Ed-Tech Tool, EDU Update
// Posts with no category fall back to their channel for navigation only
// (scholarships channel -> Scholarships, main channel -> Education); they
// are not shown in section blocks until an admin classifies them.

export const POST_CATEGORIES = [
  'Scholarship',
  'Internship',
  'Job',
  'Course',
  'Study Skill',
  'Career Guidance',
  'Ed-Tech Tool',
  'EDU Update',
]

export const POST_GROUPS = {
  scholarships: ['Scholarship'],
  jobs: ['Job', 'Internship'],
  education: ['Course', 'Study Skill', 'Career Guidance', 'Ed-Tech Tool', 'EDU Update'],
}

export const POST_GROUP_META = {
  scholarships: { label: 'Scholarships', path: '/scholarships' },
  jobs: { label: 'Jobs', path: '/jobs' },
  education: { label: 'Education', path: '/education' },
}

// Strict grouping used by the section blocks: only classified posts appear.
export function postGroup(post) {
  if (!post) return null
  for (const [group, cats] of Object.entries(POST_GROUPS)) {
    if (cats.includes(post.category)) return group
  }
  return null
}

// Navigation fallback for unclassified posts (detail-page breadcrumbs etc.).
export function postGroupWithFallback(post) {
  return postGroup(post) || (post?.channel === 'scholarships' ? 'scholarships' : 'education')
}
