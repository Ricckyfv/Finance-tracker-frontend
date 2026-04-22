export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  recurring: boolean;
  categoryId: number;
  categoryName: string;
  categoryType: 'INCOME' | 'EXPENSE';
}
