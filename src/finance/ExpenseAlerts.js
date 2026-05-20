import React, { useState } from "react";
import CategoryIcon from "./CategoryIcon";
import { formatPeso, getExpenseCategoryMeta, getPriorityClassName } from "./financeUtils";

function AlertRecord({ alert, categoryOptions }) {
  const categoryMeta = getExpenseCategoryMeta(alert.category, categoryOptions);

  return (
    <article className={`alert-card ${getPriorityClassName(alert.priority)}`}>
      <div className="alert-card-head">
        <span className={`category-icon recent-icon ${categoryMeta.iconClass}`}>
          <CategoryIcon icon={categoryMeta.icon} />
        </span>
        <strong>{alert.title || alert.description}</strong>
        <span className={`badge priority ${getPriorityClassName(alert.priority)}`}>{alert.priority}</span>
      </div>
      <div className="alert-card-meta">
        <span>{alert.category}</span>
        <span>{formatPeso(alert.amount)}</span>
        <span>Due {alert.dueDate || "-"}</span>
      </div>
      <div className="alert-card-foot">
        <span>
          {alert.daysUntilDue < 0
            ? `${Math.abs(alert.daysUntilDue)} day(s) overdue`
            : `${alert.daysUntilDue} day(s) remaining`}
        </span>
        <span className={`badge status ${getPriorityClassName(alert.status)}`}>{alert.status}</span>
      </div>
    </article>
  );
}

function AlertSubgroup({ title, records, categoryOptions }) {
  return (
    <section className="alert-subgroup">
      <div className="alert-subgroup-title">
        <h4>{title}</h4>
        <span className="alert-count-badge">{records.length}</span>
      </div>

      {records.length ? (
        <div className="alert-card-grid">
          {records.map((alert) => (
            <AlertRecord key={alert.id} alert={alert} categoryOptions={categoryOptions} />
          ))}
        </div>
      ) : (
        <p className="empty-alerts">No {title.toLowerCase()} found.</p>
      )}
    </section>
  );
}

function ExpenseAlerts({ alertGroups, categoryOptions, panelRef }) {
  const [isCriticalOpen, setIsCriticalOpen] = useState(true);
  const [isOtherOpen, setIsOtherOpen] = useState(false);

  const criticalCount = alertGroups.critical.length;
  const otherCount = alertGroups.other.length;

  return (
    <section className="dashboard-alerts expense-alerts-panel" ref={panelRef} tabIndex="-1" aria-label="Expense alerts">
      <div className="dashboard-panel-title">
        <h2>Expense Alerts</h2>
        <span>{criticalCount + otherCount} active alert{criticalCount + otherCount === 1 ? "" : "s"}</span>
      </div>

      <div className="alert-collapse-list">
        <section className="alert-collapse-section">
          <button
            className="alert-collapse-button"
            type="button"
            aria-expanded={isCriticalOpen}
            onClick={() => setIsCriticalOpen((isOpen) => !isOpen)}
          >
            <span>
              <strong>Critical Alerts</strong>
              <small>Overdue and high-priority expenses</small>
            </span>
            <span className="alert-collapse-meta">
              <span className="alert-count-badge urgent">{criticalCount}</span>
              <span aria-hidden="true">{isCriticalOpen ? "-" : "+"}</span>
            </span>
          </button>

          {isCriticalOpen && (
            <div className="alert-collapse-content">
              <AlertSubgroup
                title="Overdue Expenses"
                records={alertGroups.overdue}
                categoryOptions={categoryOptions}
              />
              <AlertSubgroup
                title="High Priority Expenses"
                records={alertGroups.high}
                categoryOptions={categoryOptions}
              />
            </div>
          )}
        </section>

        <section className="alert-collapse-section">
          <button
            className="alert-collapse-button"
            type="button"
            aria-expanded={isOtherOpen}
            onClick={() => setIsOtherOpen((isOpen) => !isOpen)}
          >
            <span>
              <strong>Other Alerts</strong>
              <small>Medium and low-priority expenses</small>
            </span>
            <span className="alert-collapse-meta">
              <span className="alert-count-badge">{otherCount}</span>
              <span aria-hidden="true">{isOtherOpen ? "-" : "+"}</span>
            </span>
          </button>

          {isOtherOpen && (
            <div className="alert-collapse-content">
              <AlertSubgroup
                title="Medium Priority Expenses"
                records={alertGroups.medium}
                categoryOptions={categoryOptions}
              />
              <AlertSubgroup
                title="Low Priority Expenses"
                records={alertGroups.low}
                categoryOptions={categoryOptions}
              />
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default ExpenseAlerts;
