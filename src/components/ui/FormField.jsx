import { Children, cloneElement, isValidElement } from 'react'

/**
 * Accessible form field: associates label + hint via id/htmlFor.
 * Clones the child control to add aria-describedby / aria-invalid when needed.
 */
export default function FormField({
  id,
  label,
  hint,
  error,
  children,
  className = '',
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const child = Children.only(children)
  const control = isValidElement(child)
    ? cloneElement(child, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      })
    : child

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--color-text-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  )
}
