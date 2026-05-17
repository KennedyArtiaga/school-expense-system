import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import CategoryIcon from "./CategoryIcon";
import {
  formatPeso,
  getExpenseCategoryMeta,
  getExpenseDate,
  getDisplayReferenceNo,
  getExpensePriority,
  getPriorityClassName,
  parseExpenseAmount,
  summarizeExpenses,
} from "./financeUtils";

const defaultFilters = {
  category: "All Categories",
  month: "All Months",
  year: "All Years",
  status: "All Statuses",
  search: "",
};

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const fileDateFormatter = new Intl.DateTimeFormat("en-CA");

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const sanitizePdfText = (value) => {
  return String(value ?? "")
    .split("")
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
    })
    .join("")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
};

const truncateText = (value, maxLength) => {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, Math.max(0, maxLength - 3))}...` : text;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getExpenseDescription = (expense) => expense.title || expense.description || "";
const getExpenseReference = (expense) => getDisplayReferenceNo(expense);
const getExpenseNotes = (expense) => expense.notes || expense.remarks || "";

const getAppliedFilterLabels = (filters, dateRange) => {
  const labels = [];

  if (filters.category !== "All Categories") {
    labels.push(`Category: ${filters.category}`);
  }

  if (filters.month !== "All Months") {
    labels.push(`Month: ${monthFormatter.format(new Date(2026, Number(filters.month), 1))}`);
  }

  if (filters.year !== "All Years") {
    labels.push(`Year: ${filters.year}`);
  }

  if (filters.status !== "All Statuses") {
    labels.push(`Status: ${filters.status}`);
  }

  if (filters.search.trim()) {
    labels.push(`Search: ${filters.search.trim()}`);
  }

  if (dateRange.startDate && dateRange.endDate) {
    labels.push(`Date range: ${dateRange.startDate} to ${dateRange.endDate}`);
  }

  return labels.length ? labels.join("; ") : "None";
};

const getExportDateError = (dateRange) => {
  if ((dateRange.startDate && !dateRange.endDate) || (!dateRange.startDate && dateRange.endDate)) {
    return "Please select both Start Date and End Date to export by date range.";
  }

  if (dateRange.startDate && dateRange.endDate && getExpenseDate(dateRange.startDate) > getExpenseDate(dateRange.endDate)) {
    return "Start Date must not be later than End Date.";
  }

  return "";
};

const filterRecordsByDateRange = (records, dateRange) => {
  if (getExportDateError(dateRange) || !dateRange.startDate || !dateRange.endDate) {
    return records;
  }

  const startDate = getExpenseDate(dateRange.startDate);
  const endDate = getExpenseDate(dateRange.endDate);

  return records.filter((expense) => {
    const expenseDate = getExpenseDate(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

const buildCsv = (records) => {
  const headers = [
    "Date",
    "Category",
    "Description / Expense Name",
    "Amount",
    "Status",
    "Receipt / Reference Number",
    "Notes / Remarks",
  ];

  const rows = records.map((expense) => [
    expense.date,
    expense.category,
    getExpenseDescription(expense),
    parseExpenseAmount(expense.amount).toFixed(2),
    expense.status,
    getExpenseReference(expense),
    getExpenseNotes(expense),
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
};

const buildPdf = ({ records, summary, appliedFilters }) => {
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 36;
  const rowHeight = 16;
  const columns = [
    { label: "Date", x: 36, length: 10 },
    { label: "Category", x: 104, length: 22 },
    { label: "Description", x: 246, length: 24 },
    { label: "Amount", x: 404, length: 12 },
    { label: "Status", x: 486, length: 9 },
    { label: "Reference", x: 556, length: 14 },
    { label: "Notes", x: 656, length: 24 },
  ];
  const pages = [];
  let commands = [];
  let y = margin;

  const addText = (x, top, size, text) => {
    commands.push(`BT /F1 ${size} Tf ${x} ${pageHeight - top} Td (${sanitizePdfText(text)}) Tj ET`);
  };

  const addPage = () => {
    if (commands.length) {
      pages.push(commands);
    }

    commands = [];
    y = margin;
  };

  const addHeader = () => {
    addText(margin, y, 16, "School Expense Management System");
    y += 22;
    addText(margin, y, 13, "Expense Ledger Report");
    y += 18;
    addText(margin, y, 9, `Exported: ${new Date().toLocaleString()}`);
    y += 14;
    addText(margin, y, 9, `Applied filters: ${truncateText(appliedFilters, 110)}`);
    y += 22;
    addText(margin, y, 10, `Total records: ${summary.recordCount}`);
    addText(190, y, 10, `Total amount: ${formatPeso(summary.totalAmount)}`);
    addText(370, y, 10, `Paid: ${formatPeso(summary.totalPaid)}`);
    addText(510, y, 10, `Pending: ${formatPeso(summary.totalPending)}`);
    addText(665, y, 10, `Overdue: ${formatPeso(summary.totalOverdue)}`);
    y += 24;
    columns.forEach((column) => addText(column.x, y, 9, column.label));
    y += 12;
  };

  addHeader();

  records.forEach((expense) => {
    if (y > pageHeight - 52) {
      addPage();
      addHeader();
    }

    [
      expense.date,
      expense.category,
      getExpenseDescription(expense),
      formatPeso(expense.amount),
      expense.status,
      getExpenseReference(expense),
      getExpenseNotes(expense),
    ].forEach((value, index) => {
      addText(columns[index].x, y, 8, truncateText(value, columns[index].length));
    });

    y += rowHeight;
  });

  addPage();

  const pdfObjects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids ${pages.map((_, index) => `${index * 2 + 3} 0 R`).join(" ")} /Count ${pages.length} >>`,
  ];

  pages.forEach((pageCommands, index) => {
    const pageNumber = index + 1;
    const streamCommands = [
      ...pageCommands,
      `BT /F1 8 Tf ${pageWidth - 92} 24 Td (Page ${pageNumber} of ${pages.length}) Tj ET`,
    ].join("\n");
    const contentObjectNumber = index * 2 + 4;

    pdfObjects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${pages.length * 2 + 3} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
      `<< /Length ${streamCommands.length} >>\nstream\n${streamCommands}\nendstream`
    );
  });

  pdfObjects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  pdfObjects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${pdfObjects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${pdfObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

function ExpenseLedger({ expenses, categoryOptions, statusOptions, selectedCategory = "" }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [exportScope, setExportScope] = useState("filtered");
  const [exportDateRange, setExportDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    setFilters({
      ...defaultFilters,
      category: selectedCategory || "All Categories",
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (!isExportModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExportModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExportModalOpen]);

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
    return Array.from(new Set([...statusOptions, ...expenses.map((expense) => expense.status).filter(Boolean)]));
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
          getExpenseReference(expense),
          expense.notes,
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

  const exportDateError = useMemo(() => getExportDateError(exportDateRange), [exportDateRange]);
  const exportBaseRecords = exportScope === "all" ? expenses : visibleExpenses;
  const exportRecords = useMemo(
    () => filterRecordsByDateRange(exportBaseRecords, exportDateRange),
    [exportBaseRecords, exportDateRange]
  );
  const exportSummary = useMemo(() => summarizeExpenses(exportRecords), [exportRecords]);
  const appliedFilters = useMemo(() => getAppliedFilterLabels(filters, exportDateRange), [exportDateRange, filters]);
  const reportDate = fileDateFormatter.format(new Date());
  const exportFilename = `expense-ledger-report-${reportDate}.${exportFormat.toLowerCase()}`;
  const canExport = !exportDateError && exportRecords.length > 0;

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

  const updateExportDateRange = (field, value) => {
    setExportDateRange((currentRange) => ({
      ...currentRange,
      [field]: value,
    }));
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

  const handleExport = () => {
    if (!canExport) {
      return;
    }

    if (exportFormat === "CSV") {
      downloadBlob(new Blob([buildCsv(exportRecords)], { type: "text/csv;charset=utf-8" }), exportFilename);
      setIsExportModalOpen(false);
      return;
    }

    downloadBlob(buildPdf({ records: exportRecords, summary: exportSummary, appliedFilters }), exportFilename);
    setIsExportModalOpen(false);
  };

  return (
    <div className="ledger-page">
      <main className="ledger-shell">
        <section className="section-title ledger-title">
          <div>
            <h2>{selectedCategory ? `${selectedCategory} Expense Ledger` : "Expenses Ledger"}</h2>
            <p>{selectedCategory ? `List of recorded ${selectedCategory} expenses` : "List of all recorded expenses"}</p>
          </div>
          <button className="export-open-btn" type="button" onClick={() => setIsExportModalOpen(true)}>
            Export
          </button>
        </section>

        <div className="automation-note">Automatic Overdue Tracking Enabled</div>

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
                <th>Due Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference No.</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleExpenses.map((expense) => {
                const categoryMeta = getExpenseCategoryMeta(expense.category, ledgerCategoryOptions);
                const priority = getExpensePriority(expense);

                return (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.dueDate || "—"}</td>
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
                      <span className={`badge priority ${getPriorityClassName(priority)}`}>
                        {priority}
                      </span>
                    </td>
                    <td>
                      <span className="amount-pill">{formatPeso(expense.amount)}</span>
                    </td>
                    <td>
                      <span className={`badge status ${getPriorityClassName(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td>{getExpenseReference(expense)}</td>
                    <td className="actions-cell">...</td>
                  </tr>
                );
              })}

              {!visibleExpenses.length && (
                <tr>
                  <td className="empty-row" colSpan="10">
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

        {isExportModalOpen &&
          createPortal(
          <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsExportModalOpen(false)}>
            <section
              className="export-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="export-ledger-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="export-modal-header">
                <h3 id="export-ledger-title">Export Expense Ledger</h3>
                <button type="button" aria-label="Close export modal" onClick={() => setIsExportModalOpen(false)}>
                  x
                </button>
              </div>

              <div className="export-option-group">
                <span>Format</span>
                <div className="segmented-control" role="radiogroup" aria-label="Export format">
                  {["PDF", "CSV"].map((format) => (
                    <button
                      key={format}
                      className={exportFormat === format ? "active" : ""}
                      type="button"
                      role="radio"
                      aria-checked={exportFormat === format}
                      onClick={() => setExportFormat(format)}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <fieldset className="export-option-group export-scope">
                <legend>Export scope</legend>
                <label>
                  <input
                    type="radio"
                    name="exportScope"
                    checked={exportScope === "all"}
                    onChange={() => setExportScope("all")}
                  />
                  Export all records
                </label>
                <label>
                  <input
                    type="radio"
                    name="exportScope"
                    checked={exportScope === "filtered"}
                    onChange={() => setExportScope("filtered")}
                  />
                  Export currently filtered records
                </label>
              </fieldset>

              <div className="export-option-group export-date-range">
                <span>Date range</span>
                <div className="export-date-grid">
                  <label>
                    Start Date
                    <input
                      type="date"
                      value={exportDateRange.startDate}
                      onChange={(event) => updateExportDateRange("startDate", event.target.value)}
                    />
                  </label>
                  <label>
                    End Date
                    <input
                      type="date"
                      value={exportDateRange.endDate}
                      onChange={(event) => updateExportDateRange("endDate", event.target.value)}
                    />
                  </label>
                </div>
                {exportDateError && <p className="export-validation-message">{exportDateError}</p>}
              </div>

              <div className="export-summary">
                <div>
                  <span>Records</span>
                  <strong>{exportSummary.recordCount}</strong>
                </div>
                <div>
                  <span>Total amount</span>
                  <strong>{formatPeso(exportSummary.totalAmount)}</strong>
                </div>
                <div>
                  <span>Paid</span>
                  <strong>{formatPeso(exportSummary.totalPaid)}</strong>
                </div>
                <div>
                  <span>Pending</span>
                  <strong>{formatPeso(exportSummary.totalPending)}</strong>
                </div>
                <div>
                  <span>Overdue</span>
                  <strong>{formatPeso(exportSummary.totalOverdue)}</strong>
                </div>
              </div>

              {!canExport && <p className="export-empty-message">No expense records are available for this export.</p>}

              <div className="export-actions">
                <button className="cancel-btn" type="button" onClick={() => setIsExportModalOpen(false)}>
                  Cancel
                </button>
                <button className="save-btn" type="button" disabled={!canExport} onClick={handleExport}>
                  Export
                </button>
              </div>
            </section>
          </div>,
          document.body
        )}
      </main>
    </div>
  );
}

export default ExpenseLedger;
