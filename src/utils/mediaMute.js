/**
 * Applies mute state to an HTMLMediaElement so UI and playback stay aligned
 * (some browsers need both `muted` and `volume`).
 */
export function applyMuteState(media, muted) {
  if (!media) return
  if (muted) {
    media.muted = true
    media.volume = 0
  } else {
    media.muted = false
    media.volume = 1
  }
}
