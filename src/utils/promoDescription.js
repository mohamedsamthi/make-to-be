/**
 * Parse promotion `description` stored as JSON or plain text.
 * Supports camelCase and UPPERCASE keys (e.g. text/TEXT, mediaUrl/MEDIAURL).
 */
export function parsePromoDescription(raw) {
  if (!raw || typeof raw !== 'string') return { text: '', mediaUrl: '' }
  const s = raw.trim()
  if (!s) return { text: '', mediaUrl: '' }
  try {
    const d = JSON.parse(s)
    if (d && typeof d === 'object' && !Array.isArray(d)) {
      const text = (d.text ?? d.TEXT ?? '').toString().trim()
      const mediaUrl = (d.mediaUrl ?? d.MEDIAURL ?? d.media_url ?? '').toString().trim()
      return { text, mediaUrl }
    }
  } catch {
    if (s.startsWith('{')) return { text: '', mediaUrl: '' }
    return { text: s, mediaUrl: '' }
  }
  return { text: '', mediaUrl: '' }
}

/** Line under promo title in the top bar: human text, or owner fallback — never raw JSON. */
export function announcementPromoSubtitle(raw, ownerFallback) {
  const { text } = parsePromoDescription(raw)
  if (text) return text
  return ownerFallback
}
