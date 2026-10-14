import { supabase } from './supabase'

// Certificate helpers for v2 — same tables/RPCs as the v1 system
// (certificates, certificate_templates, public_verify_certificate,
// revoke_certificate, generate-certificate-pdf).

export function certificateVerifyUrl(ref) {
  return `/verify/${encodeURIComponent(ref)}`
}

function notFound() {
  const e = new Error('No certificate matches that reference. Please check the ID and try again.')
  e.code = 'not_found'
  return e
}

// Public verification. Tries the SECURITY DEFINER RPC first, then a direct
// select under the public-verify RLS policy.
export async function verifyCertificate(reference) {
  const ref = String(reference || '').trim()
  if (!ref) throw new Error('Enter a certificate ID or scan a certificate QR code')
  const { data, error } = await supabase.rpc('public_verify_certificate', {
    p_reference: ref,
    p_method: 'certificate_id',
  })
  if (!error && data) {
    if (data.found === false) throw notFound()
    return { certificate: data.certificate ?? data, status: data.status ?? data.certificate?.status ?? 'valid' }
  }
  const { data: row, error: qErr } = await supabase
    .from('certificates')
    .select(
      'id, certificate_id, recipient_name, recipient_email, certificate_title, description, achievement, issue_date, organization_name, status, signatory_1_name, signatory_1_title, signatory_2_name, signatory_2_title',
    )
    .eq('certificate_id', ref)
    .maybeSingle()
  if (qErr || !row) throw notFound()
  return { certificate: row, status: row.status }
}

// Look up a user account by email (public_users). Only super_admin can read
// other users' rows per RLS — for other admins this returns null, and the
// certificate is issued to the email alone (see the email-recipient policy
// migration) until the account is linked.
export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('public_users')
    .select('id, full_name, email')
    .ilike('email', email.trim())
    .maybeSingle()
  if (error) return null
  return data
}

export async function listTemplates() {
  const { data, error } = await supabase
    .from('certificate_templates')
    .select('id, name, certificate_type, version, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Issue one certificate. Email is REQUIRED — it is how the certificate finds
// the recipient's profile. When the email matches an account, the certificate
// appears on their dashboard immediately; otherwise the email-recipient RLS
// policy lets them see it as soon as they sign up with that email.
export async function issueCertificate({
  name,
  email,
  title,
  description,
  achievement,
  issueDate,
  templateId,
}) {
  const cleanEmail = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid recipient email')
  if (!name.trim()) throw new Error('Enter the recipient name')

  const { data: template, error: tErr } = await supabase
    .from('certificate_templates')
    .select('*')
    .eq('id', templateId)
    .single()
  if (tErr) throw tErr
  if (!template.is_active) throw new Error('That template is deactivated.')

  const { data: me } = await supabase.auth.getUser()
  if (!me?.user) throw new Error('Your session expired. Sign in again to issue certificates.')

  const account = await findUserByEmail(cleanEmail)
  const snapshot = {
    ...(template.design || {}),
    certificate_type: template.certificate_type,
    template_id: template.id,
    template_name: template.name,
    template_version: Number.isInteger(template.version) && template.version >= 1 ? template.version : 1,
    orientation: template.orientation,
    page_size: template.page_size,
    backgroundUrl: template.background_url || '',
  }

  const { data, error } = await supabase
    .from('certificates')
    .insert([
      {
        template_id: templateId,
        template_snapshot: snapshot,
        template_version: snapshot.template_version,
        recipient_name: name.trim(),
        recipient_email: cleanEmail,
        recipient_user_id: account?.id ?? null,
        certificate_title: title.trim() || 'Certificate of Achievement',
        description: description?.trim() || null,
        achievement: achievement?.trim() || null,
        issue_date: issueDate || new Date().toISOString().slice(0, 10),
        organization_name: 'Career Radar',
        signatory_1_name: 'HASNAIN SHAKEEL AHMED',
        signatory_1_title: 'FOUNDER & CEO',
        status: 'valid',
        issued_by: me.user.id,
      },
    ])
    .select('id, certificate_id, recipient_name, recipient_email')
    .single()
  if (error) throw error
  return { certificate: data, accountLinked: Boolean(account) }
}

// Certificates belonging to the signed-in user: matched by account link OR by
// the verified email on their JWT (see the email-recipient RLS policy).
export async function listMyCertificates() {
  const { data: me } = await supabase.auth.getUser()
  if (!me?.user) return []
  const email = me.user.email
  const { data, error } = await supabase
    .from('certificates')
    .select('id, certificate_id, recipient_name, recipient_email, certificate_title, description, achievement, issue_date, organization_name, status')
    .or(`recipient_user_id.eq.${me.user.id},recipient_email.eq.${email}`)
    .order('issue_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listAllCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('id, certificate_id, recipient_name, recipient_email, certificate_title, issue_date, status')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return data ?? []
}

export async function revokeCertificate(certificateUuid, reason) {
  if (!reason.trim()) throw new Error('A revocation reason is required')
  const { error } = await supabase.rpc('revoke_certificate', {
    p_certificate_id: certificateUuid,
    p_reason: reason.trim(),
  })
  if (error) throw error
}

// Authoritative PDF for an issued certificate.
export async function getCertificatePdfUrl(certificateUuid) {
  const { data, error } = await supabase.functions.invoke('generate-certificate-pdf', {
    body: { certificateId: certificateUuid, download: true },
  })
  if (error) throw new Error(error.message || 'PDF generation failed')
  const url = data?.signedUrl || data?.url || data?.pdfUrl
  if (!url) throw new Error('PDF generation returned no download link')
  return url
}
