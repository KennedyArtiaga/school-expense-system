export const financeBudget = 500000;

export const dashboardRecentLimit = 5;

export const viewTransitionDurationMs = 240;

export const expenseDepartmentOptions = [
  "Admin",
  "Facilities",
  "IT Dept",
  "Academic Affairs",
  "Student Affairs",
  "Security",
  "Property Office",
  "Logistics",
];

export const expensePriorityOptions = ["Overdue", "Due Today", "High", "Medium", "Low", "Normal/Upcoming", "Paid"];

export const expenseStatusOptions = ["Paid", "Pending", "Unpaid", "Not Paid"];

const expenseCategoryDefinitions = [
  {
    category: "Water & Electric Bill",
    description: "Expenses for water supply and electricity consumption.",
    icon: "bolt",
    iconClass: "water-electric",
    title: "Water & Electric Bill",
    department: "Admin",
    priority: "High",
    baseAmount: 34200,
  },
  {
    category: "Internet Bill",
    description: "Monthly payment for internet connectivity.",
    icon: "wifi",
    iconClass: "internet",
    title: "Internet Bill",
    department: "IT Dept",
    priority: "High",
    baseAmount: 18000,
  },
  {
    category: "Utilities",
    description: "General utility costs such as gas, waste disposal, etc.",
    icon: "utilities",
    iconClass: "utilities",
    title: "Utility Services",
    department: "Admin",
    priority: "Medium",
    baseAmount: 9300,
  },
  {
    category: "Maintenance & Repairs",
    description: "Costs for repairs, upkeep, and maintenance.",
    icon: "wrench",
    iconClass: "maintenance",
    title: "Classroom Repairs",
    department: "Facilities",
    priority: "Medium",
    baseAmount: 12600,
  },
  {
    category: "Equipment Expenses",
    description: "Purchases or repairs of school equipment.",
    icon: "computer",
    iconClass: "equipment",
    title: "Equipment Repair",
    department: "Property Office",
    priority: "High",
    baseAmount: 17800,
  },
  {
    category: "Supplies Expenses",
    description: "Consumable items used daily in the school.",
    icon: "supplies",
    iconClass: "supplies",
    title: "School Supplies",
    department: "Admin",
    priority: "Low",
    baseAmount: 7900,
  },
  {
    category: "Electrical Materials",
    description: "Expenses for electrical materials and supplies.",
    icon: "electrical",
    iconClass: "electrical",
    title: "Electrical Materials",
    department: "Facilities",
    priority: "Medium",
    baseAmount: 7200,
  },
  {
    category: "Fire Safety Equipment",
    description: "Costs for fire extinguishers, alarms, and safety devices.",
    icon: "shield",
    iconClass: "fire-safety",
    title: "Fire Safety Equipment",
    department: "Facilities",
    priority: "High",
    baseAmount: 10400,
  },
  {
    category: "Development Fund",
    description: "Budget for future school improvements and projects.",
    icon: "fund",
    iconClass: "development",
    title: "Development Fund",
    department: "Academic Affairs",
    priority: "Medium",
    baseAmount: 28600,
  },
  {
    category: "Security & Janitorial Services",
    description: "Payments for security and cleaning services.",
    icon: "security",
    iconClass: "security",
    title: "Security & Janitorial Services",
    department: "Security",
    priority: "High",
    baseAmount: 20000,
  },
  {
    category: "Replacement of Lost or Damaged Items",
    description: "Expenses for replacing or repairing lost or damaged items.",
    icon: "replace",
    iconClass: "replacement",
    title: "Item Replacement",
    department: "Property Office",
    priority: "Medium",
    baseAmount: 11800,
  },
  {
    category: "Transportation Expenses",
    description: "Costs related to transportation and travel expenses.",
    icon: "transport",
    iconClass: "transportation",
    title: "Transportation Expenses",
    department: "Logistics",
    priority: "Medium",
    baseAmount: 13400,
  },
];

export const expenseCategoryOptions = expenseCategoryDefinitions.map(({ baseAmount, ...category }) => category);

const expenseYears = [2022, 2023, 2024, 2025, 2026];
const expenseMonths = Array.from({ length: 12 }, (_, index) => index + 1);
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const padNumber = (value) => String(value).padStart(2, "0");

const formatDate = (month, day, year) => `${padNumber(month)}/${padNumber(day)}/${year}`;

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const createDate = (month, day, year) => new Date(year, month - 1, day);

const differenceInCalendarDays = (dateLeft, dateRight) => {
  return Math.round((startOfDay(dateLeft) - startOfDay(dateRight)) / 86400000);
};

const isPaidStatus = (status) => String(status || "").trim().toLowerCase() === "paid";

const calculatePriority = (dueDate, today, status) => {
  if (isPaidStatus(status)) {
    return "Paid";
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

const getMonthDistance = (year, month, today) => {
  return (year - today.getFullYear()) * 12 + (month - (today.getMonth() + 1));
};

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const getExpenseDay = (categoryIndex) => 3 + (categoryIndex % 5);

const getDueDay = ({ year, month, categoryIndex, expenseDay, today }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const monthDistance = getMonthDistance(year, month, today);

  if (monthDistance === 0) {
    const currentMonthOffsets = [-8, 0, 3, 7, 10, 14, 18, 22, 26, 30, 9, 12];
    return Math.min(daysInMonth, Math.max(expenseDay, today.getDate() + currentMonthOffsets[categoryIndex]));
  }

  if (monthDistance === 1) {
    const nextMonthDueDays = [10, 12, 15, 18, 20, 22, 25, 26, 27, 28, 14, 16];
    return Math.min(daysInMonth, Math.max(expenseDay, nextMonthDueDays[categoryIndex]));
  }

  return Math.min(daysInMonth, Math.max(expenseDay, 12 + (categoryIndex % 12)));
};

const getUnpaidStatus = (categoryIndex) => {
  const statuses = ["Pending", "Unpaid", "Not Paid"];
  return statuses[categoryIndex % statuses.length];
};

const generateStatus = ({ year, month, categoryIndex, today }) => {
  const monthDistance = getMonthDistance(year, month, today);

  if (monthDistance <= -5) {
    return "Paid";
  }

  if (monthDistance < 0) {
    return categoryIndex % 5 === 0 ? getUnpaidStatus(categoryIndex) : "Paid";
  }

  if (monthDistance === 0) {
    return categoryIndex % 4 === 3 ? "Paid" : getUnpaidStatus(categoryIndex);
  }

  return categoryIndex % 4 === 0 ? "Paid" : getUnpaidStatus(categoryIndex);
};

const generateAmount = (baseAmount, yearIndex, monthIndex, categoryIndex) => {
  const yearlyIncrease = 1 + yearIndex * 0.025;
  const seasonalVariation = 1 + ((monthIndex % 4) - 1.5) * 0.012;
  const categoryVariation = categoryIndex * 37;

  return Math.round(baseAmount * yearlyIncrease * seasonalVariation + categoryVariation);
};

const generateReferenceNo = (year, month, categoryIndex, sequence, status) => {
  if (!isPaidStatus(status)) {
    return "";
  }

  return `EXP-${year}-${padNumber(month)}-${padNumber(categoryIndex + 1)}-${String(sequence).padStart(3, "0")}`;
};

const generateNotes = (expense, status, priority) => {
  if (isPaidStatus(status)) {
    return "Paid and posted to the monthly expense ledger.";
  }

  if (priority === "Overdue") {
    return "Requires immediate payment follow-up.";
  }

  return `${expense.department} monthly billing record.`;
};

const mockToday = startOfDay(new Date());

export const mockExpenseLedgerData = expenseYears.flatMap((year, yearIndex) =>
  expenseMonths.flatMap((month, monthIndex) =>
    expenseCategoryDefinitions.map((expense, categoryIndex) => {
      const sequence = yearIndex * expenseMonths.length * expenseCategoryDefinitions.length
        + monthIndex * expenseCategoryDefinitions.length
        + categoryIndex
        + 1;
      const expenseDay = getExpenseDay(categoryIndex);
      const dueDay = getDueDay({ year, month, categoryIndex, expenseDay, today: mockToday });
      const dueDate = createDate(month, dueDay, year);
      const status = generateStatus({ year, month, categoryIndex, today: mockToday });
      const priority = calculatePriority(dueDate, mockToday, status);
      const monthlyTitle = `${monthNames[monthIndex]} ${expense.title}`;

      return {
        id: sequence,
        date: formatDate(month, expenseDay, year),
        dueDate: formatDate(month, dueDay, year),
        category: expense.category,
        title: monthlyTitle,
        description: expense.description,
        department: expense.department,
        priority,
        amount: generateAmount(expense.baseAmount, yearIndex, monthIndex, categoryIndex),
        status,
        referenceNo: generateReferenceNo(year, month, categoryIndex, sequence, status),
        notes: generateNotes(expense, status, priority),
      };
    })
  )
);

export const financeDataSource = {
  financeBudget,
  dashboardRecentLimit,
  viewTransitionDurationMs,
  expenseDepartmentOptions,
  expensePriorityOptions,
  expenseStatusOptions,
  expenseCategoryOptions,
  mockExpenseLedgerData,
};

export default financeDataSource;
