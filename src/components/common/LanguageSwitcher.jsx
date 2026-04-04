import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'

const MENU_FALLBACK_HEIGHT = 200
const Z_MENU = 9999

/**
 * EN / TA / SI — custom menu (black + brand green) with fixed positioning so it stays on-screen.
 * @param {'auto' | 'above' | 'below'} menuPlacement — `above` for tight footers (e.g. mobile drawer).
 * @param {'toolbar' | 'block'} layout — `toolbar` = compact globe on small screens (navbar). `block` = full label (drawer/settings).
 */
export default function LanguageSwitcher({ className = '', menuPlacement = 'auto', layout = 'toolbar' }) {
  const { language, setLanguage, t } = useLanguage()
  const triggerId = useId()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [menuStyle, setMenuStyle] = useState({})

  const options = [
    { value: 'en', label: t('lang.en') },
    { value: 'ta', label: t('lang.ta') },
    { value: 'si', label: t('lang.si') },
  ]

  const current = options.find((o) => o.value === language) ?? options[0]

  const updatePosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const menuH = menuRef.current?.getBoundingClientRect().height || MENU_FALLBACK_HEIGHT
    const rect = el.getBoundingClientRect()
    const padding = 10
    const vw = window.innerWidth
    const vh = window.innerHeight
    const minMenuWidth = Math.min(220, vw - 2 * padding)
    const width = Math.max(rect.width, minMenuWidth)
    let left = rect.right - width
    left = Math.max(padding, Math.min(left, vw - width - padding))

    const topBelow = rect.bottom + 6
    const topAbove = rect.top - menuH - 6

    let top = topBelow
    if (menuPlacement === 'above') {
      top = topAbove
    } else if (menuPlacement === 'below') {
      top = topBelow
    } else {
      const fitsBelow = topBelow + menuH <= vh - padding
      const fitsAbove = topAbove >= padding
      if (!fitsBelow && fitsAbove) top = topAbove
      else if (!fitsBelow && !fitsAbove) {
        top = Math.max(padding, vh - menuH - padding)
      }
    }

    top = Math.max(padding, Math.min(top, vh - menuH - padding))

    setMenuStyle({
      position: 'fixed',
      top,
      left,
      width,
      zIndex: Z_MENU,
    })
  }, [menuPlacement])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const id = requestAnimationFrame(() => updatePosition())
    const onWin = () => updatePosition()
    window.addEventListener('resize', onWin)
    window.addEventListener('scroll', onWin, true)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', onWin)
      window.removeEventListener('scroll', onWin, true)
    }
  }, [open, updatePosition, language])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      const t = e.target
      if (
        triggerRef.current?.contains(t) ||
        menuRef.current?.contains(t)
      ) {
        return
      }
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const select = (value) => {
    setLanguage(value)
    setOpen(false)
  }

  return (
    <div className={`relative min-w-0 max-w-full ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('lang.label')}: ${current.label}`}
        title={current.label}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-w-0 max-w-full items-center gap-1.5 rounded-xl border border-[var(--color-accent)]/35 bg-[#050505] py-2 pl-2.5 pr-2 text-left shadow-sm transition-colors hover:border-[var(--color-accent)]/55 hover:bg-[#0a0a0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] lg:w-full lg:gap-2 lg:pl-3 lg:pr-2.5 ${
          layout === 'block'
            ? ''
            : 'max-lg:h-10 max-lg:w-10 max-lg:shrink-0 max-lg:justify-center max-lg:gap-0 max-lg:px-0 max-lg:py-0'
        }`}
      >
        <FiGlobe className="shrink-0 text-[var(--color-accent)]" size={16} aria-hidden />
        <span
          className={`min-w-0 flex-1 truncate text-left text-[10px] font-black uppercase tracking-wider text-zinc-100 sm:text-[11px] ${
            layout === 'block' ? '' : 'max-lg:sr-only'
          }`}
        >
          {current.label}
        </span>
        <FiChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-accent)] transition-transform ${open ? 'rotate-180' : ''} ${
            layout === 'block' ? '' : 'max-lg:hidden'
          }`}
          aria-hidden
        />
      </button>

      {open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-labelledby={triggerId}
            style={menuStyle}
            className="max-h-[min(50vh,280px)] overflow-y-auto rounded-xl border border-[var(--color-accent)]/40 bg-[#050505] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
          >
            {options.map((opt) => {
              const active = opt.value === language
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => select(opt.value)}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors sm:py-3 ${
                      active
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]'
                        : 'text-zinc-200 hover:bg-[var(--color-accent)]/10 hover:text-white'
                    }`}
                  >
                    <span className="min-w-0 flex-1 break-words font-semibold leading-snug">
                      {opt.label}
                    </span>
                    {active && (
                      <FiCheck className="shrink-0 text-[var(--color-accent)]" size={16} aria-hidden />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body
        )}
    </div>
  )
}
