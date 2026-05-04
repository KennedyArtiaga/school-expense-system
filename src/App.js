import React, { useEffect, useMemo, useRef, useState } from "react";
import { AddExpense, ExpenseCategories, ExpenseLedger, FinanceDashboard } from "./finance";
import { financeDataSource } from "./finance/loadMockExpenseData";
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
  { id: "finance", label: "Finance Management", icon: "finance" },
];

const financeViews = [
  { id: "categories", label: "Expense Categories" },
  { id: "ledger", label: "Expenses Ledger" },
  { id: "add", label: "Add New Expenses" },
];

const formatHeaderDate = (date) => {
  const monthDayYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);

  return `${monthDayYear} | ${weekday}`;
};

function App() {
  const [activeSection, setActiveSection] = useState("finance");
  const [financeView, setFinanceView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState(() => financeDataSource.mockExpenseLedgerData);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [headerDate, setHeaderDate] = useState(() => formatHeaderDate(new Date()));
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const transitionTimer = useRef(null);

  const activeLabel = useMemo(() => {
    return navigationItems.find((item) => item.id === activeSection)?.label || "Finance Management";
  }, [activeSection]);

  useEffect(() => {
    const dateTimer = window.setInterval(() => {
      setHeaderDate(formatHeaderDate(new Date()));
    }, 60000);

    return () => {
      window.clearInterval(dateTimer);
      window.clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }

    const handleDocumentPointerDown = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleDocumentKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isAccountMenuOpen]);

  const scrollToTop = () => {
    const content = document.querySelector(".content-scroll");

    if (content) {
      content.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showFinanceView = (viewId, category = "") => {
    scrollToTop();
    window.clearTimeout(transitionTimer.current);

    if (financeView === viewId && selectedCategory === category) {
      return;
    }

    setIsTransitioning(true);

    transitionTimer.current = window.setTimeout(() => {
      setFinanceView(viewId);
      setSelectedCategory(category);
      setIsTransitioning(false);
    }, financeDataSource.viewTransitionDurationMs);
  };

  const handleSidebarNavigation = (sectionId) => {
    setActiveSection(sectionId);

    if (sectionId === "finance") {
      showFinanceView("home");
      return;
    }

    scrollToTop();
  };

  const handleFinanceViewChange = (viewId) => {
    showFinanceView(viewId);
  };

  const handleCategorySelect = (category) => {
    showFinanceView("ledger", category);
  };

  const handleAddExpense = (expense) => {
    setExpenses((currentExpenses) => [expense, ...currentExpenses]);
    showFinanceView("ledger");
  };

  const renderFinanceContent = () => {
    if (financeView === "home") {
      return (
        <FinanceDashboard
          expenses={expenses}
          categoryOptions={financeDataSource.expenseCategoryOptions}
          financeBudget={financeDataSource.financeBudget}
          recentLimit={financeDataSource.dashboardRecentLimit}
          onOpenLedger={() => showFinanceView("ledger")}
        />
      );
    }

    if (financeView === "categories") {
      return (
        <ExpenseCategories
          expenses={expenses}
          categoryOptions={financeDataSource.expenseCategoryOptions}
          onSelectCategory={handleCategorySelect}
        />
      );
    }

    if (financeView === "ledger") {
      return (
        <ExpenseLedger
          expenses={expenses}
          categoryOptions={financeDataSource.expenseCategoryOptions}
          statusOptions={financeDataSource.expenseStatusOptions}
          selectedCategory={selectedCategory}
        />
      );
    }

    return (
      <AddExpense
        addExpense={handleAddExpense}
        categoryOptions={financeDataSource.expenseCategoryOptions}
        departmentOptions={financeDataSource.expenseDepartmentOptions}
        priorityOptions={financeDataSource.expensePriorityOptions}
        statusOptions={financeDataSource.expenseStatusOptions}
      />
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              type="button"
              onClick={() => handleSidebarNavigation(item.id)}
            >
              <span className="nav-icon">
                <NavIcon type={item.icon} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="main-section">
        <header className="top-header">
          <div className="top-header-brand">
            <div className="top-header-logo" aria-hidden="true">
              <div className="sidebar-logo-ring">
                <div className="sidebar-logo-core" />
              </div>
            </div>
            <strong>FINANCE MANAGEMENT</strong>
          </div>

          <div className="top-header-actions">
            <span className="header-date">{headerDate}</span>
            <div className="account-menu" ref={accountMenuRef}>
              <button
                className="header-user"
                type="button"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              >
                <span className="header-avatar" aria-hidden="true" />
                <span>Admin</span>
              </button>

              {isAccountMenuOpen && (
                <div className="account-dropdown" role="menu">
                  <button type="button" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                    Profile
                  </button>
                  <button type="button" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-main content-scroll">
          <section className="content-header">
            <h1>{activeLabel}</h1>
            <p>Overview of finance statistics for Pateros National High School</p>

            {activeSection === "finance" && (
              <div className="finance-tabs" aria-label="Finance Management navigation">
                {financeViews.map((view) => (
                  <button
                    key={view.id}
                    className={`finance-tab ${financeView === view.id && !selectedCategory ? "active" : ""}`}
                    type="button"
                    onClick={() => handleFinanceViewChange(view.id)}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {activeSection === "finance" ? (
            <div
              key={`${financeView}-${selectedCategory || "global"}`}
              className={`finance-content ${isTransitioning ? "is-exiting" : "is-entering"}`}
            >
              {renderFinanceContent()}
            </div>
          ) : (
            <section className="blank-panel" aria-label={`${activeLabel} placeholder`} />
          )}
        </main>
      </section>
    </div>
  );
}

export default App;
