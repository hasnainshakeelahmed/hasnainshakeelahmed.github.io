import { supabase } from './supabase'

// Site-wide settings managed from /admin/settings (site_settings table).
// Falls back to hardcoded defaults when the table/rows are missing, so the
// site never breaks before the migration is run.

export const SETTING_DEFAULTS = {
  announce_enabled: 'true',
  announce_text: 'Ask Questions Directly on WhatsApp here.',
  announce_button_label: 'WhatsApp Broadcast Group',
  announce_button_url: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
  social_youtube: 'https://www.youtube.com/@careerradarai',
  social_linkedin: 'https://www.linkedin.com/company/careerradarofficial/',
  social_instagram: 'https://www.instagram.com/careerradar.ai/',
  social_facebook: '',
}

const LS_KEY = 'cr-site-settings'
const TTL_MS = 5 * 60 * 1000
let memCache = null
let memAt = 0

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.at > TTL_MS) return null
    return parsed.values
  } catch {
    return null
  }
}

function writeLocal(values) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ at: Date.now(), values }))
  } catch {
    /* ignore */
  }
}

export async function getSiteSettings() {
  if (memCache && Date.now() - memAt < TTL_MS) return memCache
  const local = readLocal()
  if (local) {
    memCache = { ...SETTING_DEFAULTS, ...local }
    memAt = Date.now()
    return memCache
  }
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (error) throw error
    const values = { ...SETTING_DEFAULTS }
    for (const row of data ?? []) values[row.key] = row.value ?? ''
    memCache = values
    memAt = Date.now()
    writeLocal(values)
    return values
  } catch {
    memCache = { ...SETTING_DEFAULTS }
    memAt = Date.now()
    return memCache
  }
}

export function clearSiteSettingsCache() {
  memCache = null
  memAt = 0
  try {
    localStorage.removeItem(LS_KEY)
  } catch {
    /* ignore */
  }
}
