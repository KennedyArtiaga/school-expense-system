const emptyFinanceData = {
  financeBudget: 0,
  expenseCategoryOptions: [],
  expenseDepartmentOptions: [],
  expensePriorityOptions: [],
  expenseStatusOptions: [],
  mockExpenseLedgerData: [],
  dashboardRecentLimit: 5,
  viewTransitionDurationMs: 240,
};

const normalizeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const loadMockModule = () => {
  try {
    const context = require.context("./", false, /^\.\/mockExpenseLedgerData\.js$/);

    if (!context.keys().includes("./mockExpenseLedgerData.js")) {
      return {};
    }

    return context("./mockExpenseLedgerData.js") || {};
  } catch (error) {
    return {};
  }
};

const mockModule = loadMockModule();

export const financeDataSource = {
  financeBudget: Number(mockModule.financeBudget) || emptyFinanceData.financeBudget,
  expenseCategoryOptions: normalizeArray(mockModule.expenseCategoryOptions),
  expenseDepartmentOptions: normalizeArray(mockModule.expenseDepartmentOptions),
  expensePriorityOptions: normalizeArray(mockModule.expensePriorityOptions),
  expenseStatusOptions: normalizeArray(mockModule.expenseStatusOptions),
  mockExpenseLedgerData: normalizeArray(mockModule.mockExpenseLedgerData ?? mockModule.default),
  dashboardRecentLimit: Number(mockModule.dashboardRecentLimit) || emptyFinanceData.dashboardRecentLimit,
  viewTransitionDurationMs: Number(mockModule.viewTransitionDurationMs) || emptyFinanceData.viewTransitionDurationMs,
};
