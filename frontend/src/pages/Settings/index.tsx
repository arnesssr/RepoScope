import { useState } from 'react'
import { Settings, User, Lock, Shield, Bell, SidebarClose, SidebarOpen } from 'lucide-react'
import { GeneralSettings } from '../../components/settings/GeneralSettings'
import { AccountSettings } from '../../components/settings/AccountSettings'
import { SecuritySettings } from '../../components/settings/SecuritySettings'
import { NotificationSettings } from '../../components/settings/NotificationSettings'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')

  const tabConfig = [
    {
      key: 'general',
      name: 'General',
      icon: Settings,
      component: GeneralSettings
    },
    {
      key: 'account',
      name: 'Account',
      icon: User,
      component: AccountSettings
    },
    {
      key: 'security',
      name: 'Security',
      icon: Shield,
      component: SecuritySettings
    },
    {
      key: 'notifications',
      name: 'Notifications',
      icon: Bell,
      component: NotificationSettings
    }
  ]

  const ActiveComponent = tabConfig.find(
    tab => tab.key === activeTab
  )?.component || GeneralSettings

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-400">
          Configure your account, application, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            <tab.icon className="h-5 w-5" /> {tab.name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  )
}

export default SettingsPage

