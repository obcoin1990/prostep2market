/* Plausible custom-event helpers — only fires when the Plausible script is loaded */

declare global {
  interface Window {
    plausible?: (...args: [string, { props?: Record<string, string | number> }]) => void
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number>,
) {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(name, { props })
  }
}

/* ── Pre-defined business events ─────────────────────────────────────── */

export const trackSignup = (method: string) =>
  trackEvent("Signup", { method })

export const trackLogin = (method: string) =>
  trackEvent("Login", { method })

export const trackTradeImported = (source: string, count: number) =>
  trackEvent("Trade Imported", { source, count })

export const trackSubscription = (plan: string, action: "start" | "cancel" | "upgrade") =>
  trackEvent("Subscription", { plan, action })

export const trackMtConnect = (platform: string) =>
  trackEvent("MT Connect", { platform })

export const trackDemoStart = () =>
  trackEvent("Demo Started")

export const trackAiInsight = (type: string) =>
  trackEvent("AI Insight Generated", { type })
