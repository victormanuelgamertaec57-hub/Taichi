// ─── Meta Pixel Integration ───────────────────────────────────────────────────
// NOTE: The Meta Pixel script is loaded in index.html. This module only provides
// TypeScript declarations and helper functions for tracking events.

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

// initMetaPixel is kept for backwards compatibility but does nothing
// since the pixel is now loaded via index.html
export function initMetaPixel(): void {
  // Pixel is loaded via index.html - no-op
}

// ─── Event Helpers ────────────────────────────────────────────────────────────

type PixelEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'CompleteRegistration';

/**
 * Track a standard Meta Pixel event.
 *
 * Recommended mapping:
 *   Screen 1  → ViewContent   (quiz start)
 *   Screen 12 → Lead          (name entered)
 *   Screen 17 → InitiateCheckout
 *   Hotmart   → Purchase      (fire on redirect if possible)
 */
export function trackPixelEvent(event: PixelEvent, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!window.fbq) {
    console.info(`[Meta Pixel] Event queued (pixel not loaded): ${event}`, params);
    return;
  }
  window.fbq('track', event, params);
}

/**
 * Track a custom Meta Pixel event (for granular funnel steps).
 */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;
  window.fbq('trackCustom', eventName, params);
}
