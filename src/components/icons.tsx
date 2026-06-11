// Presentational SVGs lifted from the design prototype. All decorative —
// adjacent text or aria-labels carry the meaning.

export function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="#9AA0AB" strokeWidth="1.5" />
      <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#9AA0AB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2C5.8 2 4 3.8 4 6v3l-1.2 2.2c-.2.4.1.8.5.8h9.4c.4 0 .7-.4.5-.8L12 9V6c0-2.2-1.8-4-4-4z"
        stroke="#686E7B"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6.7 13.5a1.4 1.4 0 0 0 2.6 0" stroke="#686E7B" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <line x1="1.5" y1="3.5" x2="11.5" y2="3.5" stroke="#686E7B" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="3.5" y1="6.5" x2="9.5" y2="6.5" stroke="#686E7B" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="5.5" y1="9.5" x2="7.5" y2="9.5" stroke="#686E7B" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <line x1="6" y1="1.5" x2="6" y2="10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="1.5" y1="6" x2="10.5" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function KebabIcon() {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" aria-hidden="true">
      <circle cx="2" cy="2" r="1.4" fill="#9AA0AB" />
      <circle cx="7" cy="2" r="1.4" fill="#9AA0AB" />
      <circle cx="12" cy="2" r="1.4" fill="#9AA0AB" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6.3" fill="#30A46C" />
      <path
        d="M4.4 7.2l1.8 1.8 3.4-3.8"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
