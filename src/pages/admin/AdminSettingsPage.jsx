import { useState } from 'react'
import { FiSettings, FiBell, FiShield, FiGlobe, FiMoon, FiCheck } from 'react-icons/fi'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    autoSave: true,
    publicShop: true
  })

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const options = [
    { 
       id: 'notifications', 
       title: 'Push Notifications', 
       desc: 'Receive alerts for new orders and messages',
       icon: <FiBell size={20} className="text-violet-400" /> 
    },
    { 
       id: 'emailAlerts', 
       title: 'Email Alerts', 
       desc: 'Get critical system updates via email',
       icon: <FiGlobe size={20} className="text-emerald-400" /> 
    },
    { 
       id: 'autoSave', 
       title: 'Auto-Save Changes', 
       desc: 'Automatically save product and order changes',
       icon: <FiCheck size={20} className="text-amber-400" /> 
    },
    { 
       id: 'darkMode', 
       title: 'System Theme', 
       desc: 'Toggle between dark and light admin panel',
       icon: <FiMoon size={20} className="text-blue-400" /> 
    },
    { 
       id: 'publicShop', 
       title: 'Maintenance Mode', 
       desc: 'Pause orders and mark shop as under maintenance',
       icon: <FiShield size={20} className="text-rose-400" /> 
    },
  ]

  return (
    <div className="max-w-4xl animate-fadeInUp">
      <div className="grid gap-6">
        {/* Settings Groups */}
        <section className="bg-[var(--color-surface-card)] rounded-[2.5rem] border border-[var(--color-border)] overflow-hidden shadow-2xl">
           <div className="px-8 py-6 border-b border-[var(--color-border)] bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                    <FiSettings size={20} />
                 </div>
                 <div>
                    <h3 className="font-black text-lg tracking-tight leading-none mb-1">General Systems</h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-black uppercase tracking-widest">Configuration</p>
                 </div>
              </div>
           </div>
           
           <div className="divide-y divide-[var(--color-border)]">
              {options.map((opt) => (
                <div key={opt.id} className="p-6 sm:p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                         {opt.icon}
                      </div>
                      <div>
                         <h4 className="text-base font-black text-white mb-1 tracking-tight">{opt.title}</h4>
                         <p className="text-sm text-[var(--color-text-muted)] font-medium">{opt.desc}</p>
                      </div>
                   </div>

                   <button 
                     onClick={() => toggle(opt.id)}
                     className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                       settings[opt.id] ? 'bg-violet-600 shadow-lg shadow-violet-600/30' : 'bg-white/10'
                     }`}
                   >
                     <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                       settings[opt.id] ? 'left-8 scale-110' : 'left-1'
                     }`} />
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] border-l-4 border-l-violet-500 gap-6">
           <div>
              <h4 className="font-black text-white mb-1">Unsaved Changes</h4>
              <p className="text-sm text-[var(--color-text-muted)] font-medium">Modified settings will be applied immediately across all admin sessions.</p>
           </div>
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">Restore Defaults</button>
              <button className="flex-1 sm:flex-none h-12 px-10 rounded-xl bg-violet-600 text-white font-black text-sm hover:scale-105 transition-all shadow-xl shadow-violet-600/20 uppercase tracking-widest">Save Config</button>
           </div>
        </div>
      </div>
    </div>
  )
}
