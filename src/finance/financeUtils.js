export const parseExpenseAmount = (amount) => {
  if (typeof amount === "number") {
    return amount;
  }

  return Number(String(amount ?? "").replace(/[^0-9.-]+/g, "")) || 0;
};

const normalizeDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  if (text.includes("-")) {
    const [year, month, day] = text.split("-").map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  if (text.includes("/")) {
    const [month, day, year] = text.split("/").map(Number);

    if (month && day && year) {
      return new Date(year, month - 1, day);
    }
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfLocalDay = (date) => {
  const normalizedDate = normalizeDateValue(date) || new Date();
  return new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());
};

const toDateInputValue = (date) => {
  const normalizedDate = startOfLocalDay(date);
  const year = normalizedDate.getFullYear();
  const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
  const day = String(normalizedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getTodayInputValue = () => toDateInputValue(new Date());

export const differenceInCalendarDays = (dateLeft, dateRight) => {
  const first = startOfLocalDay(dateLeft);
  const second = startOfLocalDay(dateRight);

  return Math.round((first - second) / 86400000);
};

export const isPaidStatus = (status) => String(status || "").trim().toLowerCase() === "paid";

export const getSafeReferenceNo = (expense) => {
  return isPaidStatus(expense?.status) ? expense?.referenceNo || expense?.reference || "" : "";
};

export const getDisplayReferenceNo = (expense) => getSafeReferenceNo(expense) || "—";

export const getPriorityClassName = (priority) => {
  return String(priority || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const formatPeso = (amount) => {
  return `P ${parseExpenseAmount(amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

export const getExpenseDate = (date) => {
  return normalizeDateValue(date) || new Date(0);
};

export const formatDateForDisplay = (value) => {
  if (!value) {
    return "";
  }

  if (String(value).includes("/")) {
    return value;
  }

  const [year, month, day] = String(value).split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${month}/${day}/${year}`;
};

export const getExpenseDueDate = (expense) => {
  return expense?.dueDate ? getExpenseDate(formatDateForDisplay(expense.dueDate)) : null;
};

export const calculatePriority = (dueDate, today = new Date(), status = "") => {
  if (isPaidStatus(status)) {
    return "Paid";
  }

  if (!dueDate) {
    return "Normal/Upcoming";
  }

  const daysUntilDue = differenceInCalendarDays(dueDate, today);

  if (daysUntilDue < 0) {
    return "Overdue";
  }

  if (daysUntilDue === 0) {
    return "Due Today";
  }

  if (daysUntilDue <= 7) {
    return "High";
  }

  if (daysUntilDue <= 18) {
    return "Medium";
  }

  if (daysUntilDue <= 30) {
    return "Low";
  }

  return "Normal/Upcoming";
};

export const getExpensePriority = (expense, today = new Date()) => {
  return calculatePriority(getExpenseDueDate(expense), today, expense.status);
};

export const getDaysUntilDue = (expense, today = new Date()) => {
  const dueDate = getExpenseDueDate(expense);
  return dueDate ? differenceInCalendarDays(dueDate, today) : null;
};

export const getAlertMessage = (expense, today = new Date()) => {
  const name = expense?.title || expense?.description || "Expense";
  const daysUntilDue = getDaysUntilDue(expense, today);

  if (daysUntilDue === null) {
    return `${getExpensePriority(expense, today)} Priority: ${name} does not have a due date.`;
  }

  if (daysUntilDue < 0) {
    return `Overdue: ${name} was due ${Math.abs(daysUntilDue)} day(s) ago.`;
  }

  if (daysUntilDue === 0) {
    return `Due Today: ${name} is due today.`;
  }

  return `${getExpensePriority(expense, today)} Priority: ${name} is due in ${daysUntilDue} day(s).`;
};

export const getOverdueExpenses = (expenses, today = new Date()) => {
  return sanitizeExpenseRecords(expenses, today)
    .map((expense) => ({
      ...expense,
      priority: getExpensePriority(expense, today),
      daysUntilDue: getDaysUntilDue(expense, today),
      alertMessage: getAlertMessage(expense, today),
    }))
    .filter((expense) => {
      return !isPaidStatus(expense.status) && getExpenseDueDate(expense) && getExpenseDueDate(expense) < startOfLocalDay(today);
    })
    .sort((first, second) => first.daysUntilDue - second.daysUntilDue);
};

const getPriorityExpenses = (expenses, priority, today = new Date()) => {
  return sanitizeExpenseRecords(expenses, today)
    .map((expense) => ({
      ...expense,
      priority: getExpensePriority(expense, today),
      daysUntilDue: getDaysUntilDue(expense, today),
      alertMessage: getAlertMessage(expense, today),
    }))
    .filter((expense) => !isPaidStatus(expense.status) && expense.priority === priority)
    .sort((first, second) => {
      const firstDays = first.daysUntilDue ?? Number.MAX_SAFE_INTEGER;
      const secondDays = second.daysUntilDue ?? Number.MAX_SAFE_INTEGER;

      return firstDays - secondDays;
    });
};

export const getHighPriorityExpenses = (expenses, today = new Date()) => getPriorityExpenses(expenses, "High", today);

export const getMediumPriorityExpenses = (expenses, today = new Date()) => getPriorityExpenses(expenses, "Medium", today);

export const getLowPriorityExpenses = (expenses, today = new Date()) => getPriorityExpenses(expenses, "Low", today);

export const getExpenseAlertGroups = (expenses, today = new Date()) => {
  const overdue = getOverdueExpenses(expenses, today);
  const high = getHighPriorityExpenses(expenses, today).filter(
    (expense) => !overdue.some((overdueExpense) => overdueExpense.id === expense.id)
  );
  const medium = getMediumPriorityExpenses(expenses, today);
  const low = getLowPriorityExpenses(expenses, today);

  return {
    overdue,
    high,
    medium,
    low,
    critical: [...overdue, ...high],
    other: [...medium, ...low],
  };
};

export const sanitizeExpenseRecord = (expense, today = new Date()) => {
  const status = expense.status || "Pending";
  const normalizedExpense = {
    ...expense,
    status,
  };
  const priority = getExpensePriority(normalizedExpense, today);
  const referenceNo = isPaidStatus(normalizedExpense.status) ? normalizedExpense.referenceNo || "" : "";

  if (
    expense.status === status &&
    expense.priority === priority &&
    (expense.referenceNo || "") === referenceNo
  ) {
    return expense;
  }

  return {
    ...normalizedExpense,
    priority,
    referenceNo,
  };
};

export const sanitizeExpenseRecords = (expenses, today = new Date()) => {
  return Array.isArray(expenses) ? expenses.map((expense) => sanitizeExpenseRecord(expense, today)) : [];
};

export const isSameExpenseList = (firstList, secondList) => {
  if (firstList.length !== secondList.length) {
    return false;
  }

  return firstList.every((expense, index) => expense === secondList[index]);
};

export const updateOverdueExpenses = (expenses) => {
  return sanitizeExpenseRecords(expenses);
};

export const summarizeExpenses = (expenses) => {
  return expenses.reduce(
    (summary, expense) => {
      const amount = parseExpenseAmount(expense.amount);
      const status = expense.status || "";

      summary.recordCount += 1;
      summary.totalAmount += amount;

      if (status === "Paid") {
        summary.totalPaid += amount;
      }

      if (!isPaidStatus(status)) {
        summary.totalPending += amount;
      }

      if (getExpensePriority(expense) === "Overdue") {
        summary.totalOverdue += amount;
      }

      return summary;
    },
    {
      recordCount: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
    }
  );
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
