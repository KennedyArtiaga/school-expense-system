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

export const expensePriorityOptions = ["High", "Medium", "Low"];

export const expenseStatusOptions = ["Paid", "Pending", "Unpaid"];

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

const expenseYears = [2019, 2020, 2021, 2022, 2023, 2024];

const statusCycle = ["Paid", "Paid", "Pending", "Unpaid"];

export const mockExpenseLedgerData = expenseYears.flatMap((year, yearIndex) =>
  expenseCategoryDefinitions.map((expense, categoryIndex) => {
    const month = String((categoryIndex % 12) + 1).padStart(2, "0");
    const day = String(((categoryIndex * 2 + yearIndex) % 25) + 1).padStart(2, "0");

    return {
      id: yearIndex * expenseCategoryDefinitions.length + categoryIndex + 1,
      category: expense.category,
      title: expense.title,
      description: expense.description,
      amount: expense.baseAmount + yearIndex * 1100 + categoryIndex * 350,
      date: `${month}/${day}/${year}`,
      status: statusCycle[(yearIndex + categoryIndex) % statusCycle.length],
      department: expense.department,
      priority: expense.priority,
    };
  })
);
