import React, { useState } from "react";
import { getExpenseCategoryMeta } from "./financeUtils";

const initialForm = {
  category: "",
  amount: "",
  description: "",
  status: "",
  department: "",
  referenceNo: "",
  priority: "",
  notes: "",
  date: "",
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
};

function AddExpense({ addExpense, categoryOptions, departmentOptions, priorityOptions, statusOptions }) {
  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.category || !form.amount || !form.description || !form.status || !form.date) {
      alert("Please fill required fields");
      return;
    }

    const categoryMeta = getExpenseCategoryMeta(form.category, categoryOptions);

    addExpense({
      id: Date.now(),
      date: formatDate(form.date),
      category: form.category,
      title: form.description,
      description: form.description,
      department: form.department,
      priority: form.priority,
      amount: Number(form.amount),
      status: form.status,
      icon: categoryMeta.icon,
      iconClass: categoryMeta.iconClass,
      referenceNo: form.referenceNo,
      notes: form.notes,
    });

    setForm(initialForm);
  };

  return (
    <div className="ledger-page">
      <main className="ledger-shell">
        <section className="page-panel">
          <div className="section-title">
            <h2>Add New Expenses</h2>
            <p>Fill in the details to add a new expense</p>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-column">
              <label className="form-field">
                <span>Category <strong>*</strong></span>
                {categoryOptions.length ? (
                  <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                    <option value="">Select Category</option>
                    {categoryOptions.map((item) => (
                      <option key={item.category} value={item.category}>
                        {item.category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.category}
                    placeholder="Enter category"
                    onChange={(event) => updateField("category", event.target.value)}
                  />
                )}
              </label>

              <label className="form-field">
                <span>Description <strong>*</strong></span>
                <input
                  type="text"
                  value={form.description}
                  placeholder="Enter description"
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </label>

              <label className="form-field">
                <span>Department</span>
                {departmentOptions.length ? (
                  <select value={form.department} onChange={(event) => updateField("department", event.target.value)}>
                    <option value="">Select Department</option>
                    {departmentOptions.map((department) => (
                      <option key={department}>{department}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.department}
                    placeholder="Enter department"
                    onChange={(event) => updateField("department", event.target.value)}
                  />
                )}
              </label>

              <label className="form-field">
                <span>Priority</span>
                {priorityOptions.length ? (
                  <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
                    <option value="">Select Priority</option>
                    {priorityOptions.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.priority}
                    placeholder="Enter priority"
                    onChange={(event) => updateField("priority", event.target.value)}
                  />
                )}
              </label>

              <label className="form-field">
                <span>Date <strong>*</strong></span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                />
              </label>
            </div>

            <div className="form-column">
              <label className="form-field">
                <span>Amount <strong>*</strong></span>
                <div className="amount-input">
                  <span>P</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    placeholder="Enter amount"
                    onChange={(event) => updateField("amount", event.target.value)}
                  />
                </div>
              </label>

              <label className="form-field">
                <span>Status <strong>*</strong></span>
                {statusOptions.length ? (
                  <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                    <option value="">Select Status</option>
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.status}
                    placeholder="Enter status"
                    onChange={(event) => updateField("status", event.target.value)}
                  />
                )}
              </label>

              <label className="form-field">
                <span>Reference No.</span>
                <input
                  type="text"
                  value={form.referenceNo}
                  placeholder="Enter reference number"
                  onChange={(event) => updateField("referenceNo", event.target.value)}
                />
              </label>

              <label className="form-field notes-field">
                <span>Notes (Optional)</span>
                <textarea
                  value={form.notes}
                  placeholder="Enter notes (optional)"
                  onChange={(event) => updateField("notes", event.target.value)}
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="cancel-btn" type="button" onClick={() => setForm(initialForm)}>
                Cancel
              </button>
              <button className="save-btn" type="submit">
                Save Expense
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AddExpense;
