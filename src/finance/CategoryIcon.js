import React from "react";

function CategoryIcon({ icon }) {
  switch (icon) {
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 2 6.8 12h4.4L10.5 22l6.7-10h-4.4L13.5 2Z" fill="currentColor" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14.8 4.2a4.3 4.3 0 0 0 1.3 4.5l-6.6 6.6a2 2 0 1 0 1.4 1.4l6.6-6.6a4.3 4.3 0 0 0 4.5 1.3L18 7.5l1.7-1.7 3.1.4a4.3 4.3 0 0 0-8-2Z"
            fill="currentColor"
          />
        </svg>
      );
    case "supplies":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3h8l3 3v15H7z" fill="currentColor" />
          <path d="M15 3v4h4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 10h5M10 14h5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" fill="currentColor" />
          <path d="M12 10a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 12 10Zm-3.2 5.4a3.2 3.2 0 1 1 6.4 0" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "computer":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="10" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M9 19h6M12 15v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "fund":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4 4 8.5V10h16V8.5L12 4Z" fill="currentColor" />
          <path d="M6 11v5M10 11v5M14 11v5M18 11v5M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" fill="currentColor" />
          <path d="m9 12 2 2 4-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 9.5a13 13 0 0 1 17 0M6.5 12.8a8.2 8.2 0 0 1 11 0M9.8 16a3.7 3.7 0 0 1 4.4 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );
    case "utilities":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0-6 6c0 4.7 6 12 6 12s6-7.3 6-12a6 6 0 0 0-6-6Z" fill="currentColor" />
          <path d="M12 6.5c1.4 2-.6 3.1-.6 4.5 0 1 .8 1.7.8 1.7s-3.2-.8-3.2-3.3c0-1.6 1-2.7 3-2.9Z" fill="#fff" />
        </svg>
      );
    case "electrical":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="7" y="4" width="10" height="12" rx="2" fill="currentColor" />
          <path d="M10 16v4M14 16v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="9.5" r="1" fill="#fff" />
          <circle cx="14" cy="9.5" r="1" fill="#fff" />
        </svg>
      );
    case "replace":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7h8a4 4 0 0 1 0 8H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m7 4-3 3 3 3M17 20l3-3-3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "transport":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h10l3 4v6H4V9a2 2 0 0 1 1-2Z" fill="currentColor" />
          <circle cx="8" cy="17.5" r="1.8" fill="#fff" />
          <circle cx="16" cy="17.5" r="1.8" fill="#fff" />
          <path d="M15 7v4h5" fill="none" stroke="#fff" strokeWidth="1.8" />
        </svg>
      );
    case "rent":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11 12 4l8 7v9H6v-6h4v6h8v-7.2L12 7.6l-6 5.2V20H4Z" fill="currentColor" />
        </svg>
      );
    case "other":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default CategoryIcon;
