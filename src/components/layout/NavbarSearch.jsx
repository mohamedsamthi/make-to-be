import { memo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Isolated search field so typing does not re-render the full Navbar.
 */
function NavbarSearch({ variant = 'desktop', resetToken, onAfterSubmit, className = '' }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    setQuery('')
  }, [resetToken])

  const submit = useCallback(
    (e) => {
      e?.preventDefault()
      const q = query.trim()
      if (!q) return
      navigate(`/products?search=${encodeURIComponent(q)}`)
      setQuery('')
      onAfterSubmit?.()
    },
    [query, navigate, onAfterSubmit]
  )

  const placeholder =
    variant === 'mobile'
      ? t('userMenu.searchMobilePlaceholder')
      : t('userMenu.searchPlaceholder')

  const clearLabel = t('common.clearSearch')

  if (variant === 'mobile') {
    return (
      <form
        onSubmit={submit}
        className={`flex w-full min-w-0 gap-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] shadow-inner transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_rgba(200,230,0,0.12)] ${className}`.trim()}
      >
        <div className="relative flex min-h-[48px] min-w-0 flex-1 items-center">
          <FiSearch
            className="pointer-events-none absolute left-3.5 text-[var(--color-text-muted)]"
            size={18}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            enterKeyHint="search"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            aria-label={placeholder}
            className="h-full min-h-[48px] w-full min-w-0 border-0 bg-transparent py-3 pl-11 pr-11 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:ring-0"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text-primary)]"
              aria-label={clearLabel}
            >
              <FiX size={18} />
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          className="shrink-0 border-l border-[var(--color-border)] bg-[var(--color-accent)] px-5 text-[11px] font-black uppercase tracking-widest text-black transition-colors hover:bg-[var(--color-accent-dark)] active:scale-[0.98]"
        >
          {t('common.search')}
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={submit}
      className={`flex min-w-0 max-w-2xl flex-1 ${className}`.trim()}
    >
      <div className="group/search flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] shadow-inner transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_rgba(200,230,0,0.12)]">
        <div className="relative flex min-h-[44px] min-w-0 flex-1 items-center">
          <FiSearch
            className="pointer-events-none absolute left-3.5 text-[var(--color-text-muted)] transition-colors group-focus-within/search:text-[var(--color-accent)]"
            size={18}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            enterKeyHint="search"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={placeholder}
            className="h-full min-h-[44px] w-full min-w-0 border-0 bg-transparent py-2.5 pl-11 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:ring-0"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text-primary)]"
              aria-label={clearLabel}
            >
              <FiX size={16} />
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          className="shrink-0 border-l border-[var(--color-border)] bg-[var(--color-accent)] px-5 text-[10px] font-black uppercase tracking-widest text-black transition-colors hover:bg-[var(--color-accent-dark)] active:scale-[0.98] sm:px-6"
        >
          {t('common.search')}
        </button>
      </div>
    </form>
  )
}

export default memo(NavbarSearch)
