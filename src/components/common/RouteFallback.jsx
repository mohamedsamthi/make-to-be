/** Minimal in-layout loader so nav/footer stay visible during lazy page hydration */
export default function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center px-4 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</p>
    </div>
  )
}
