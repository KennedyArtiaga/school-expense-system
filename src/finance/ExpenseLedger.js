import React, { useEffect, useMemo, useState } from "react";
import CategoryIcon from "./CategoryIcon";
import { formatPeso, getExpenseCategoryMeta, getExpenseDate, parseExpenseAmount } from "./financeUtils";

const defaultFilters = {
  category: "All Categories",
  month: "All Months",
  year: "All Years",
  status: "All Statuses",
  search: "",
};

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

function ExpenseLedger({ expenses, categoryOptions, statusOptions, selectedCategory = "" }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setFilters({
      ...defaultFilters,
      category: selectedCategory || "All Categories",
    });
  }, [selectedCategory]);

  const monthOptions = useMemo(() => {
    const monthMap = new Map();

    expenses.forEach((expense) => {
      const expenseDate = getExpenseDate(expense.date);
      monthMap.set(expenseDate.getMonth(), monthFormatter.format(expenseDate));
    });

    return Array.from(monthMap.entries())
      .sort(([firstMonth], [secondMonth]) => firstMonth - secondMonth)
      .map(([value, label]) => ({ value: String(value), label }));
  }, [expenses]);

  const ledgerCategoryOptions = useMemo(() => {
    if (categoryOptions.length) {
      return categoryOptions;
    }

    return Array.from(new Set(expenses.map((expense) => expense.category))).map((category) => ({
      category,
      description: "",
      icon: "other",
      iconClass: "other",
    }));
  }, [categoryOptions, expenses]);

  const ledgerStatusOptions = useMemo(() => {
    if (statusOptions.length) {
      return statusOptions;
    }

    return Array.from(new Set(expenses.map((expense) => expense.status).filter(Boolean)));
  }, [expenses, statusOptions]);

  const yearOptions = useMemo(() => {
    return Array.from(new Set(expenses.map((expense) => String(getExpenseDate(expense.date).getFullYear())))).sort();
  }, [expenses]);

  const visibleExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = getExpenseDate(expense.date);
      const scopedCategory = selectedCategory || filters.category;
      const searchTerm = filters.search.trim().toLowerCase();

      if (scopedCategory !== "All Categories" && expense.category !== scopedCategory) {
        return false;
      }

      if (filters.month !== "All Months" && String(expenseDate.getMonth()) !== filters.month) {
        return false;
      }

      if (filters.year !== "All Years" && String(expenseDate.getFullYear()) !== filters.year) {
        return false;
      }

      if (filters.status !== "All Statuses" && expense.status !== filters.status) {
        return false;
      }

      if (searchTerm) {
        const haystack = [
          expense.category,
          expense.title,
          expense.description,
          expense.department,
          expense.status,
          expense.date,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      }

      return true;
    });
  }, [expenses, filters, selectedCategory]);

  const totalExpenses = useMemo(() => {
    return visibleExpenses.reduce((sum, expense) => sum + parseExpenseAmount(expense.amount), 0);
  }, [visibleExpenses]);

  const updateFilter = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      ...defaultFilters,
      category: selectedCategory || "All Categories",
    });
  };

  const handleCategoryMouseEnter = (expense, event) => {
    setHoveredExpense(expense);
    setTooltipPosition({
      x: event.clientX + 16,
      y: event.clientY + 16,
    });
  };

  const handleCategoryMouseMove = (event) => {
    setTooltipPosition({
      x: event.clientX + 16,
      y: event.clientY + 16,
    });
  };

  const handleCategoryMouseLeave = () => {
    setHoveredExpense(null);
  };

  return (
    <div className="ledger-page">
      <main className="ledger-shell">
        <section className="section-title ledger-title">
          <h2>{selectedCategory ? `${selectedCategory} Expense Ledger` : "Expenses Ledger"}</h2>
          <p>{selectedCategory ? `List of recorded ${selectedCategory} expenses` : "List of all recorded expenses"}</p>
        </section>

        <section className="filters">
          <div className="filter-item">
            <label htmlFor="category">Filter By:</label>
            <select
              id="category"
              value={filters.category}
              disabled={Boolean(selectedCategory)}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option>All Categories</option>
              {ledgerCategoryOptions.map((category) => (
                <option key={category.category}>{category.category}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="month">Month:</label>
            <select id="month" value={filters.month} onChange={(event) => updateFilter("month", event.target.value)}>
              <option>All Months</option>
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="year">Year:</label>
            <select id="year" value={filters.year} onChange={(event) => updateFilter("year", event.target.value)}>
              <option>All Years</option>
              {yearOptions.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="status">Status:</label>
            <select id="status" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option>All Statuses</option>
              {ledgerStatusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="filter-item filter-search">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              value={filters.search}
              placeholder="Search description..."
              onChange={(event) => updateFilter("search", event.target.value)}
            />
          </div>

          <button className="search-btn light-action" type="button">
            Search
          </button>
          <button className="clear-btn light-action" type="button" onClick={clearFilters}>
            Clear
          </button>
        </section>

        <section className="table-card">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleExpenses.map((expense) => {
                const categoryMeta = getExpenseCategoryMeta(expense.category, ledgerCategoryOptions);

                return (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>
                      <div
                        className="category-cell"
                        onMouseEnter={(event) => handleCategoryMouseEnter(expense, event)}
                        onMouseMove={handleCategoryMouseMove}
                        onMouseLeave={handleCategoryMouseLeave}
                      >
                        <span className={`category-icon ${categoryMeta.iconClass}`}>
                          <CategoryIcon icon={categoryMeta.icon} />
                        </span>
                        <span className="category-name">{expense.category}</span>
                      </div>
                    </td>
                    <td>{expense.title}</td>
                    <td>{expense.department}</td>
                    <td>
                      <span className={`badge priority ${(expense.priority || "").toLowerCase()}`}>
                        {expense.priority}
                      </span>
                    </td>
                    <td>
                      <span className="amount-pill">{formatPeso(expense.amount)}</span>
                    </td>
                    <td>
                      <span className={`badge status ${(expense.status || "").toLowerCase()}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="actions-cell">...</td>
                  </tr>
                );
              })}

              {!visibleExpenses.length && (
                <tr>
                  <td className="empty-row" colSpan="8">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="total-box">
            <span>Total Expenses:</span>
            <strong>{formatPeso(totalExpenses)}</strong>
          </div>
        </section>

        {hoveredExpense && (
          <div
            className="category-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {hoveredExpense.description}
          </div>
        )}
      </main>
    </div>
  );
}

export default ExpenseLedger;
