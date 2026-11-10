import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Architecture from './pages/Architecture'
import FailoverRecovery from './pages/FailoverRecovery'
import BackupRestore from './pages/BackupRestore'
import Technology from './pages/Technology'
import GitHubPage from './pages/GitHub'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="failover-recovery" element={<FailoverRecovery />} />
          <Route path="backup-restore" element={<BackupRestore />} />
          <Route path="technology" element={<Technology />} />
          <Route path="github" element={<GitHubPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
