import React, { useMemo } from "react";
import CategoryIcon from "./CategoryIcon";

function ExpenseCategories({ expenses, categoryOptions, onSelectCategory }) {
  const categories = useMemo(() => {
    const sourceCategories = categoryOptions.length
      ? categoryOptions
      : Array.from(new Set(expenses.map((expense) => expense.category))).map((category) => ({
          category,
          description: "",
          icon: "other",
          iconClass: "other",
        }));

    return sourceCategories.map((category) => {
      const recordCount = expenses.filter((expense) => expense.category === category.category).length;

      return {
        ...category,
        recordCount,
      };
    });
  }, [categoryOptions, expenses]);

  return (
    <div className="ledger-page">
      <main className="ledger-shell">
        <section className="page-panel">
          <div className="section-title">
            <h2>Expense Categories</h2>
            <p>Manage expense categories</p>
          </div>

          <div className="category-grid">
            {categories.map((item) => (
              <button
                key={item.category}
                className="category-card"
                type="button"
                onClick={() => onSelectCategory(item.category)}
              >
                <span className={`category-icon category-card-icon ${item.iconClass}`}>
                  <CategoryIcon icon={item.icon} />
                </span>
                <span className="category-card-copy">
                  <strong>{item.category}</strong>
                  <span>{item.description}</span>
                  <small>{item.recordCount} records</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ExpenseCategories;
