export default function PrivacyPolicy() {
  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-lg font-bold text-brand-navy">What we collect</h2>
          <p className="mt-2">
            When you create an account, we collect the information you provide:
            your name, email address, and the profile details you choose to add.
            If you upload a resume for AI analysis, we process the document to
            generate feedback and a career readiness score. We do not sell your
            personal data.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-brand-navy">How we use it</h2>
          <p className="mt-2">
            Your data powers your experience: your dashboard, saved
            opportunities, AI guidance, and readiness score. Aggregated,
            anonymized statistics (for example, total opportunities posted) may
            be shown publicly.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-brand-navy">Cookies</h2>
          <p className="mt-2">
            We use cookies and local storage to keep you signed in, remember
            your preferences, and understand which pages are useful. You can
            clear site data in your browser at any time; signing in again will
            restore your session.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-brand-navy">Third-party services</h2>
          <p className="mt-2">
            Our site runs on Vercel hosting with a Supabase database, and our
            AI features use language-model providers to generate guidance.
            These providers process the text you send them in order to respond.
            We do not share your resume with advertisers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-bold text-brand-navy">Your control</h2>
          <p className="mt-2">
            You can update your profile, delete uploaded documents, and delete
            your account from your dashboard. Questions about privacy? Reach
            us through the community channels.
          </p>
        </section>
      </div>
    </div>
  )
}
