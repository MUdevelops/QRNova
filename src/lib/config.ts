const raw = (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim();
/** Public contact email, or '' when not configured. */
export const CONTACT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : '';
