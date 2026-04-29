import React, { useMemo, useState } from "react";
import { ExpenseLedger } from "./finance";
import "./App.css";

function NavIcon({ type }) {
  switch (type) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
          <rect x="13.5" y="3.5" width="7" height="11" rx="1.2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
          <rect x="13.5" y="17.5" width="7" height="3" rx="1.2" />
        </svg>
      );
    case "enrollment":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "validator":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1.5 1.5 0 0 1 1-1.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 3.5V8h4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m9 14 1.7 1.7L15 11.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "section":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="6" cy="9" r="2.2" />
          <circle cx="18" cy="9" r="2.2" />
          <circle cx="12" cy="7" r="2.2" />
          <path d="M2.8 18a3.6 3.6 0 0 1 6.4-1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14.8 16.2A3.6 3.6 0 0 1 21.2 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7.5 18a4.5 4.5 0 0 1 9 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1.5 1.5 0 0 1 1-1.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 3.5V8h4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 12h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "finance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="12" width="4" height="7" rx="1" />
          <rect x="10" y="8" width="4" height="11" rx="1" />
          <rect x="16" y="4" width="4" height="15" rx="1" />
          <path d="M3 20h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 8l4 4-4 4M9 12h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "enrollment", label: "Student Enrollment", icon: "enrollment" },
  { id: "validator", label: "Requirement Validator", icon: "validator" },
  { id: "section", label: "Section Assignment", icon: "section" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "finance", label: "Finance", icon: "finance" },
];

function App() {
  const [activeSection, setActiveSection] = useState("finance");

  const activeLabel = useMemo(() => {
    return navigationItems.find((item) => item.id === activeSection)?.label || "Finance";
  }, [activeSection]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">
            <div className="sidebar-logo-ring">
              <div className="sidebar-logo-core" />
            </div>
          </div>
          <div className="sidebar-brand-copy">
            <strong>PNHS</strong>
            <span>Finance Management System</span>
          </div>
        </div>

        <div className="sidebar-user">
          <span>Logged in as:</span>
          <strong>Administrator</strong>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              type="button"
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">
                <NavIcon type={item.icon} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" type="button">
          <span className="nav-icon">
            <NavIcon type="logout" />
          </span>
          Logout
        </button>
      </aside>

      <main className="app-main">
        <section className="content-header">
          <h1>{activeLabel}</h1>
          <p>
            {activeSection === "finance"
              ? "Overview of finance statistics for Pateros National High School"
              : "This section is currently a blank mock page."}
          </p>
        </section>

        {activeSection === "finance" ? (
          <ExpenseLedger />
        ) : (
          <section className="blank-panel" aria-label={`${activeLabel} placeholder`} />
        )}
      </main>
    </div>
  );
}

export default App;
