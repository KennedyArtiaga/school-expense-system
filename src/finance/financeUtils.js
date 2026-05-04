export const parseExpenseAmount = (amount) => {
  if (typeof amount === "number") {
    return amount;
  }

  return Number(String(amount ?? "").replace(/[^0-9.-]+/g, "")) || 0;
};

export const formatPeso = (amount) => {
  return `P ${parseExpenseAmount(amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

export const getExpenseDate = (date) => {
  if (!date) {
    return new Date(0);
  }

  const [month, day, year] = String(date).split("/").map(Number);

  if (!month || !day || !year) {
    return new Date(0);
  }

  return new Date(year, month - 1, day);
};

export const getExpenseCategoryMeta = (category, categoryOptions = []) => {
  return (
    categoryOptions.find((item) => item.category === category) || {
      category,
      description: "",
      icon: "other",
      iconClass: "other",
    }
  );
};
