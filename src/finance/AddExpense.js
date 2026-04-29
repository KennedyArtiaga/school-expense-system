import React, { useState } from "react";

function AddExpense({ addExpense }) {
  const [form, setForm] = useState({
    date: "",
    category: "",
    description: "",
    department: "",
    priority: "Low",
    amount: "",
    status: "Pending",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.date || !form.category || !form.amount) {
      alert("Please fill required fields");
      return;
    }

    addExpense({
      ...form,
      id: Date.now(),
      amount: parseFloat(form.amount),
    });

    setForm({
      date: "",
      category: "",
      description: "",
      department: "",
      priority: "Low",
      amount: "",
      status: "Pending",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <input
        type="text"
        placeholder="Date"
        onChange={(event) => setForm({ ...form, date: event.target.value })}
      />

      <input
        type="text"
        placeholder="Category"
        onChange={(event) => setForm({ ...form, category: event.target.value })}
      />

      <input
        type="text"
        placeholder="Description"
        onChange={(event) => setForm({ ...form, description: event.target.value })}
      />

      <input
        type="text"
        placeholder="Department"
        onChange={(event) => setForm({ ...form, department: event.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        onChange={(event) => setForm({ ...form, amount: event.target.value })}
      />

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default AddExpense;
