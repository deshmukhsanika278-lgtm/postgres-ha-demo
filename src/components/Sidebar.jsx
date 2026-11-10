import { NavLink } from 'react-router-dom'
import {
  House,
  LayoutDashboard,
  Network,
  Activity,
  DatabaseBackup,
  Cpu,
  GitBranch,
  ShieldCheck,
  PanelLeftClose,
} from 'lucide-react'

const navigation = [
  { label: 'Home', path: '/', icon: House },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Architecture', path: '/architecture', icon: Network },
  { label: 'Failover & Recovery', path: '/failover-recovery', icon: Activity },
  { label: 'Backup & Restore', path: '/backup-restore', icon: DatabaseBackup },
  { label: 'Technology Stack', path: '/technology', icon: Cpu },
  { label: 'GitHub', path: '/github', icon: GitBranch },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <ShieldCheck size={23} />
        </div>

        <div className="sidebar-brand-text">
          <strong>Postgres<span>HA</span></strong>
          <small>HIGH AVAILABILITY</small>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="sidebar-status-dot" />
          <div>
            <strong>Project Demo</strong>
            <small>Local environment</small>
          </div>
        </div>

        <div className="sidebar-version">
          <PanelLeftClose size={14} />
          <span>Postgres HA · v1.0</span>
        </div>
      </div>
    </aside>
  )
}
