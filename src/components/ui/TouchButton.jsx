/**
 * Touch-friendly button: ensures minimum 44×44 CSS px hit area (WCAG 2.5.5 / iOS HIG).
 * Padding scales slightly on larger breakpoints for desktop density.
 */
export default function TouchButton({ className = '', children, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:opacity-50 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
