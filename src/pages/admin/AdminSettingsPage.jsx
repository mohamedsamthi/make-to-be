import { useState, useEffect, useCallback } from 'react'
import { FiSettings, FiBell, FiShield, FiMail, FiMoon, FiCheck, FiSun } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'

const STORAGE_KEY = 'adminPanelSettings'

const DEFAULTS = {
  notifications: true,
  emailAlerts: false,
  autoSave: true,
  publicShop: true,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      toast.success('Settings saved')
    } catch {
      toast.error('Could not save settings')
    }
  }, [settings])

  const handleRestore = useCallback(() => {
    setSettings({ ...DEFAULTS })
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Restored defaults')
  }, [])

  const isDark = theme === 'dark'

  const preferenceRows = [
    {
      id: 'notifications',
      title: 'Push notifications',
      desc: 'Show alerts for new orders and customer messages in this panel.',
      icon: <FiBell size={20} className="text-[var(--color-accent)]" aria-hidden />,
    },
    {
      id: 'emailAlerts',
      title: 'Email alerts',
      desc: 'Receive critical updates by email (when connected to mail services).',
      icon: <FiMail size={20} className="text-[var(--color-accent)]" aria-hidden />,
    },
    {
      id: 'autoSave',
      title: 'Auto-save drafts',
      desc: 'Remember product and promotion drafts while you edit.',
      icon: <FiCheck size={20} className="text-[var(--color-success)]" aria-hidden />,
    },
    {
      id: 'publicShop',
      title: 'Storefront visible',
      desc: 'When off, treat the shop as in maintenance (preference flag for your team).',
      icon: <FiShield size={20} className="text-[var(--color-accent)]" aria-hidden />,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl animate-fadeInUp pb-8">
      <header className="mb-8">
        <h1 className="font-[var(--font-family-heading)] text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-secondary)]">
          Preferences for this browser. Appearance follows your global theme toggle.
        </p>
      </header>

      <div className="grid gap-6">
        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xl sm:rounded-[1.75rem]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]/80 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                <FiSettings size={20} aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">General</h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Notifications &amp; storefront
                </p>
              </div>
            </div>
          </div>

          <ul className="divide-y divide-[var(--color-border)]">
            {preferenceRows.map((opt) => (
              <li key={opt.id}>
                <div className="flex flex-col gap-4 p-5 transition-colors hover:bg-[var(--color-surface-light)]/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 md:p-8">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] shadow-inner">
                      {opt.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[var(--color-text-primary)]">{opt.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{opt.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-label={opt.title}
                    aria-checked={Boolean(settings[opt.id])}
                    onClick={() => toggle(opt.id)}
                    className={`relative mx-auto h-11 w-14 shrink-0 min-h-[44px] rounded-full transition-colors duration-200 sm:mx-0 ${
                      settings[opt.id] ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                    }`}
                  >
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        settings[opt.id] ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xl sm:rounded-[1.75rem]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]/80 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                {isDark ? <FiMoon size={20} aria-hidden /> : <FiSun size={20} aria-hidden />}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">Appearance</h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Linked to header theme control
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 md:p-8">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] shadow-inner">
                <FiMoon size={20} className="text-[var(--color-accent)]" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">Dark theme</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Reduces glare for long sessions. Same as the sun/moon control in the admin header.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="Dark theme"
              aria-checked={isDark}
              onClick={(e) => toggleTheme(e)}
              className={`relative mx-auto h-11 w-14 shrink-0 min-h-[44px] rounded-full transition-colors duration-200 sm:mx-0 ${
                isDark ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
              }`}
            >
              <span
                className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isDark ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-8">
          <div className="min-w-0">
            <h3 className="font-bold text-[var(--color-text-primary)]">Save preferences</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              General options above are stored in this browser. Theme is saved automatically.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleRestore}
              className="h-11 min-h-[44px] rounded-xl border border-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-light)]"
            >
              Restore defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-11 min-h-[44px] rounded-xl bg-[var(--color-accent)] px-8 text-sm font-bold text-black shadow-lg shadow-[var(--color-accent)]/20 transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Save settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
