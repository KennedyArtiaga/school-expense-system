import React, { useMemo } from "react";
import CategoryIcon from "./CategoryIcon";
import {
  formatPeso,
  getExpenseCategoryMeta,
  getExpenseDate,
  getExpensePriority,
  getPriorityClassName,
  parseExpenseAmount,
  summarizeExpenses,
} from "./financeUtils";

const metricIcons = [
  { key: "expenses", icon: "other", iconClass: "water-electric" },
  { key: "budget", icon: "rent", iconClass: "rent" },
  { key: "categories", icon: "other", iconClass: "maintenance" },
  { key: "transactions", icon: "supplies", iconClass: "electrical" },
];

function FinanceDashboard({ expenses, categoryOptions, recentLimit, onOpenLedger }) {
  const expenseSummary = useMemo(() => summarizeExpenses(expenses), [expenses]);
  const totalReceipts = useMemo(() => expenses.filter((expense) => expense.status === "Paid").length, [expenses]);

  const recentExpenses = useMemo(() => {
    const safeRecentLimit = recentLimit || expenses.length;

    return [...expenses]
      .sort((a, b) => getExpenseDate(b.date) - getExpenseDate(a.date))
      .slice(0, safeRecentLimit);
  }, [expenses, recentLimit]);

  const categoryTotals = useMemo(() => {
    const totals = categoryOptions.map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category.category)
        .reduce((sum, expense) => sum + parseExpenseAmount(expense.amount), 0);

      return {
        ...category,
        total,
        percent: expenseSummary.totalAmount ? (total / expenseSummary.totalAmount) * 100 : 0,
      };
    });

    const overviewLimit = recentLimit || categoryOptions.length;

    return totals
      .filter((category) => category.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, overviewLimit);
  }, [categoryOptions, expenseSummary.totalAmount, expenses, recentLimit]);

  const metrics = [
    {
      label: "Total Expenses",
      value: formatPeso(expenseSummary.totalAmount),
      caption: "This Period",
      ...metricIcons[0],
    },
    {
      label: "Pending Amount",
      value: formatPeso(expenseSummary.totalPending),
      caption: `${expenses.filter((expense) => expense.status === "Pending").length} pending records`,
      ...metricIcons[1],
    },
    {
      label: "Total Receipts",
      value: totalReceipts,
      caption: "Paid records",
      ...metricIcons[2],
    },
    {
      label: "Total Records",
      value: expenses.length,
      caption: `${expenses.filter((expense) => getExpensePriority(expense) === "Overdue").length} overdue`,
      ...metricIcons[3],
    },
  ];

  return (
    <div className="ledger-page">
      <main className="ledger-shell">
        <section className="dashboard-metrics">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span className={`category-icon metric-icon ${metric.iconClass}`}>
                <CategoryIcon icon={metric.icon} />
              </span>
              <span className="metric-copy">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.caption}</small>
              </span>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-title">
              <h2>Expense Overview (This Period)</h2>
            </div>

            <div className="overview-content">
              <div className="donut-chart" aria-hidden="true">
                <div>
                  <strong>{formatPeso(expenseSummary.totalAmount)}</strong>
                  <span>Total Expenses</span>
                </div>
              </div>

              <div className="overview-list">
                {categoryTotals.map((category) => (
                  <div className="overview-row" key={category.category}>
                    <span className={`overview-dot ${category.iconClass}`} />
                    <span>{category.category}</span>
                    <strong>{category.percent.toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-title recent-title">
              <h2>Recent Expenses</h2>
              <button type="button" onClick={onOpenLedger}>
                View All
              </button>
            </div>

            <div className="recent-list">
              {recentExpenses.map((expense) => {
                const categoryMeta = getExpenseCategoryMeta(expense.category, categoryOptions);

                return (
                  <div className="recent-item" key={expense.id}>
                    <span className={`category-icon recent-icon ${categoryMeta.iconClass}`}>
                      <CategoryIcon icon={categoryMeta.icon} />
                    </span>
                    <span className="recent-copy">
                      <strong>{expense.title}</strong>
                      <span>{expense.date}</span>
                    </span>
                    <strong className="recent-amount">{formatPeso(expense.amount)}</strong>
                    <span className={`badge status ${getPriorityClassName(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default FinanceDashboard;
