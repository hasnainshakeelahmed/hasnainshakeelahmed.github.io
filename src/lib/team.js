// Shared constants for the Team programme (interns + volunteers).

export const KINDS = [
  { key: 'intern', label: 'Intern' },
  { key: 'volunteer', label: 'Volunteer' },
]

export const TRACKS = [
  'Content & Research',
  'Web Development',
  'Design & Media',
  'Video Production',
  'Community',
  'Outreach & Partnerships',
  'Operations',
]

export const TIERS = [
  { key: 'casual', label: 'Casual (2–4 hrs/wk)' },
  { key: 'core', label: 'Core (5–8 hrs/wk)' },
  { key: 'lead', label: 'Lead (8+ hrs/wk)' },
]

export const LEVELS = [
  { key: 'contributor', label: 'Contributor' },
  { key: 'core', label: 'Core' },
  { key: 'lead', label: 'Lead' },
]

export const MEMBER_STATUSES = ['active', 'paused', 'alumni']

export const TASK_STATUSES = [
  { key: 'todo', label: 'To do' },
  { key: 'in_review', label: 'In review' },
  { key: 'done', label: 'Done' },
]

export const APPLICATION_STATUSES = ['pending', 'trial', 'accepted', 'rejected']

export const kindLabel = (k) => (KINDS.find((x) => x.key === k) || {}).label || k
export const tierLabel = (t) => (TIERS.find((x) => x.key === t) || {}).label || t
export const levelLabel = (l) => (LEVELS.find((x) => x.key === l) || {}).label || l
export const taskStatusLabel = (s) => (TASK_STATUSES.find((x) => x.key === s) || {}).label || s

export const STATUS_BADGE = {
  active: 'badge-green',
  paused: 'badge-gold',
  alumni: 'badge-slate',
  todo: 'badge-slate',
  in_review: 'badge-gold',
  done: 'badge-green',
  pending: 'badge-gold',
  trial: 'badge-navy',
  accepted: 'badge-green',
  rejected: 'badge-red',
}
