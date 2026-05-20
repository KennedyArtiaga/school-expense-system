import React from "react";

function FinanceAlertToast({ overdueCount, highCount, onViewAlerts, onDismiss }) {
  if (!overdueCount && !highCount) {
    return null;
  }

  return (
    <aside className="finance-alert-toast" role="status" aria-live="polite">
      <div className="finance-alert-toast-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3 2.8 20h18.4L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M12 9v5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M12 17.5h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="finance-alert-toast-copy">
        <strong>Finance Alert</strong>
        <span>
          {overdueCount} overdue expense{overdueCount === 1 ? "" : "s"} and {highCount} high-priority expense
          {highCount === 1 ? "" : "s"} need attention.
        </span>
        <div className="finance-alert-toast-actions">
          <button type="button" onClick={onViewAlerts}>
            View Alerts
          </button>
          <button type="button" aria-label="Dismiss finance alert" onClick={onDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </aside>
  );
}

export default FinanceAlertToast;
