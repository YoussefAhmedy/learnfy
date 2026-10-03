import { Route, Routes, Link } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthProvider } from './features/auth/AuthProvider'
import { AuthPage } from './features/auth/AuthPage'
import { AccountPage } from './features/auth/AccountPage'
import { RecoveryPage } from './features/auth/RecoveryPage'
import { HomePage } from './features/catalog/HomePage'
import { CatalogPage } from './features/catalog/CatalogPage'
import { CoursePage } from './features/catalog/CoursePage'
import './App.css'

export default function App() {
  return <AuthProvider><Routes><Route element={<Layout />}>
    <Route index element={<HomePage />} /><Route path="courses" element={<CatalogPage />} /><Route path="courses/:id" element={<CoursePage />} />
    <Route path="login" element={<AuthPage key="login" mode="login" />} /><Route path="register" element={<AuthPage key="register" mode="register" />} />
    <Route path="account" element={<AccountPage />} /><Route path="forgot-password" element={<RecoveryPage key="forgot" />} /><Route path="reset-password" element={<RecoveryPage key="reset" reset />} />
    <Route path="*" element={<div className="container status-panel"><h1>That page isn’t here.</h1><p>Let’s get you back on track.</p><Link className="button" to="/courses">Explore courses</Link></div>} />
  </Route></Routes></AuthProvider>
}
