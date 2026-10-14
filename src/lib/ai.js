import { supabase } from './supabase'

// Thin wrappers over the existing Supabase Edge Functions (same backend as v1).
// All three verify the caller's JWT server-side; anon calls are rejected.

// AI chat — POST { messages: [{role, content}], session_id }
// Response: { content, mode }. The function injects LIVE jobs + content so
// answers stay grounded in real listings.
export async function callAIChat(messages, sessionId) {
  const { data, error } = await supabase.functions.invoke('radar-ai-chat', {
    body: { messages, session_id: sessionId },
  })
  if (error) throw new Error(error.message || 'AI chat failed')
  return data
}

// Resume parse — POST { text }. Response: { success, data: { personal,
// education, skills, experience, projects, certifications } }.
export async function parseResumeText(text) {
  const { data, error } = await supabase.functions.invoke('parse-resume', {
    body: { text },
  })
  if (error) throw new Error(error.message || 'Resume parse failed')
  if (!data?.success) throw new Error('Resume parse failed')
  return data.data
}

// Career blueprint — reads the caller's onboarding_data server-side and
// stores the result in career_blueprints. Response: { success, blueprint }.
export async function generateBlueprint() {
  const { data, error } = await supabase.functions.invoke('generate-career-blueprint', {
    body: {},
  })
  if (error) throw new Error(error.message || 'Blueprint generation failed')
  if (!data?.success) throw new Error('Blueprint generation failed')
  return data.blueprint
}

// Current user's JWT (edge functions verify it). Null when signed out.
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}
