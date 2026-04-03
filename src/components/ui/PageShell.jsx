/**
 * PageShell — consistent horizontal rhythm for mobile-first layouts.
 * Uses padding that tightens on narrow viewports (more content width on phones)
 * and widens on tablets/desktop per container-custom breakpoints.
 */
export default function PageShell({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`container-custom w-full ${className}`.trim()}>{children}</Tag>
  )
}
