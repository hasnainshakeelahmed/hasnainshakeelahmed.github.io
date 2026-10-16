import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/public/Home'
import Jobs from './pages/public/Jobs'
import Scholarships from './pages/public/Scholarships'
import Education from './pages/public/Education'
import SearchPage from './pages/public/Search'
import Community from './pages/public/Community'
import About from './pages/public/About'
import Team from './pages/public/Team'
import Volunteer from './pages/public/Volunteer'
import Donate from './pages/public/Donate'
import Partner from './pages/public/Partner'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import Guides from './pages/public/Guides'
import GuideDetail from './pages/public/GuideDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ResumeReview from './pages/dashboard/ResumeReview'
import VerifyCertificate from './pages/public/VerifyCertificate'
import Videos from './pages/public/Videos'
import VideoBlog from './pages/public/VideoBlog'
import Posts from './pages/public/Posts'
import PostDetail from './pages/public/PostDetail'
import Services from './pages/public/Services'
import Links from './pages/public/Links'
import IssueCertificate from './pages/admin/IssueCertificate'
import ManageCertificates from './pages/admin/ManageCertificates'
import ManagePosts from './pages/admin/ManagePosts'
import ManageUsers from './pages/admin/ManageUsers'
import ManageDonations from './pages/admin/ManageDonations'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageJobs from './pages/admin/ManageJobs'
import ManageScholarships from './pages/admin/ManageScholarships'
import { useAuth } from './context/AuthContext'

function Placeholder({ title }) {
  return (
    <div className="container-x py-24 text-center">
      <p className="section-kicker">{title}</p>
      <h1 className="section-title mt-2">{title} — coming soon in v2</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
        This page is being rebuilt as part of the new Career Radar. Check back soon.
      </p>
    </div>
  )
}

function Protected({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="container-x py-24 text-center text-sm text-slate-500">Loading…</div>
  if (!user) return <Navigate to={adminOnly ? '/login?tab=admin&reason=admin-required' : '/login'} replace />
  if (adminOnly && !isAdmin) return <Navigate to="/login?tab=admin&reason=admin-required" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="education" element={<Education />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="community" element={<Community />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="volunteer" element={<Volunteer />} />
        <Route path="donate" element={<Donate />} />
        <Route path="partner" element={<Partner />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="guides" element={<Guides />} />
        <Route path="guides/:slug" element={<GuideDetail />} />
        <Route path="verify" element={<VerifyCertificate />} />
        <Route path="verify/:token" element={<VerifyCertificate />} />
        <Route path="videos" element={<Videos />} />
        <Route path="videos/:slug" element={<VideoBlog />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="links" element={<Links />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="dashboard/resume"
          element={
            <Protected>
              <ResumeReview />
            </Protected>
          }
        />
        <Route
          path="admin"
          element={
            <Protected adminOnly>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<ManageJobs />} />
          <Route path="scholarships" element={<ManageScholarships />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="certificates/issue" element={<IssueCertificate />} />
          <Route path="posts" element={<ManagePosts />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="donations" element={<ManageDonations />} />
          <Route path="education" element={<Placeholder title="Manage Education" />} />
          <Route path="volunteers" element={<Placeholder title="Manage Volunteers" />} />
          <Route path="settings" element={<Placeholder title="Admin Settings" />} />
        </Route>
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Route>
    </Routes>
  )
}
