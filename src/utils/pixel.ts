// ─── Meta Pixel Integration ───────────────────────────────────────────────────
// Replace PIXEL_ID_PLACEHOLDER with your actual Meta Pixel ID before going live.

const PIXEL_ID = 'PIXEL_ID_PLACEHOLDER';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

// ─── Pixel Loader ─────────────────────────────────────────────────────────────

export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (PIXEL_ID === 'PIXEL_ID_PLACEHOLDER') {
    console.warn('[Meta Pixel] Pixel ID not set. Events will not fire in production.');
    return;
  }

  /* eslint-disable */
  (function (f: Window, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n = (f.fbq = function () {
      // @ts-ignore
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    } as unknown as typeof f.fbq);
    if (!f._fbq) f._fbq = n;
    // @ts-ignore
    n.push = n;
    // @ts-ignore
    n.loaded = true;
    // @ts-ignore
    n.version = '2.0';
    // @ts-ignore
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq?.('init', PIXEL_ID);
  window.fbq?.('track', 'PageView');
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
