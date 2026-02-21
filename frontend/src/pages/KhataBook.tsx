import { useEffect, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Filter, Calendar, Download, Search, Edit, Trash2, ChevronDown, X } from 'lucide-react';
import { Button } from '../components/custom/Button';
import { Input } from '../components/custom/Input';
import { Label } from '../components/custom/Label';
import { Badge } from '../components/custom/Badge';
import { Card } from '../components/custom/Card';
import { Skeleton } from '../components/custom/Skeleton';
import { toast } from 'sonner';
import api from '../services/api';

interface Transaction {
  _id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  incomeCount: number;
  expenseCount: number;
  profitMargin: number;
}

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: string;
}

const KhataBook = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ income: CategoryBreakdown[], expense: CategoryBreakdown[] }>({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentYear] = useState(new Date().getFullYear());
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'CASH',
    tags: ''
  });

  const [categories] = useState({
    income: ['Crop Sales', 'Livestock Sales', 'Government Subsidy', 'Rental Income', 'Dairy Products', 'Other Income'],
    expense: ['Seeds', 'Fertilizers', 'Pesticides', 'Labor', 'Equipment', 'Irrigation', 'Transportation', 'Maintenance', 'Electricity', 'Other Expenses']
  });

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, transactionsRes] = await Promise.all([
        api.get(`/finance/summary?year=${currentYear}`),
        api.get('/finance/transactions?limit=100')
      ]);

      console.log('=== FRONTEND DATA RECEIVED ===');
      console.log('Summary response:', summaryRes.data);
      console.log('Summary object:', summaryRes.data.summary);
      console.log('Chart data:', summaryRes.data.chartData);
      console.log('Chart data type:', typeof summaryRes.data.chartData);
      console.log('Chart data is array:', Array.isArray(summaryRes.data.chartData));
      console.log('Chart data length:', summaryRes.data.chartData?.length);
      console.log('Category breakdown:', summaryRes.data.categoryBreakdown);
      console.log('Expense categories:', summaryRes.data.categoryBreakdown?.expense);
      console.log('Expense length:', summaryRes.data.categoryBreakdown?.expense?.length);

      setSummary(summaryRes.data.summary);
      setChartData(summaryRes.data.chartData || []);
      setCategoryBreakdown(summaryRes.data.categoryBreakdown || { income: [], expense: [] });
      setTransactions(transactionsRes.data.transactions || []);
      
      console.log('=== STATE UPDATED ===');
      console.log('chartData state after set:', summaryRes.data.chartData);
      console.log('categoryBreakdown state after set:', summaryRes.data.categoryBreakdown);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data', {
        description: error.response?.data?.message || 'Unable to load your financial data',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryOnly = async () => {
    try {
      const summaryRes = await api.get(`/finance/summary?year=${currentYear}`);
      setSummary(summaryRes.data.summary);
      setChartData(summaryRes.data.chartData || []);
      setCategoryBreakdown(summaryRes.data.categoryBreakdown || { income: [], expense: [] });
    } catch (error: any) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    try {
      const payload = {
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      console.log('Sending payload to API:', payload);

      let newTransaction: Transaction;

      if (editingTransaction) {
        const response = await api.put(`/finance/transactions/${editingTransaction._id}`, payload);
        console.log('Update response:', response.data);
        newTransaction = response.data;
        
        // Update transaction in state immediately
        setTransactions(prev => prev.map(t => t._id === editingTransaction._id ? newTransaction : t));
        toast.success('Transaction updated successfully!', {
          description: 'Your transaction has been updated in the records.',
        });
      } else {
        const response = await api.post('/finance/transactions', payload);
        console.log('Create response:', response.data);
        newTransaction = response.data;
        
        // Add new transaction to state immediately
        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Transaction added successfully!', {
          description: 'Your new transaction has been recorded.',
        });
      }

      setShowAddDialog(false);
      setEditingTransaction(null);
      setFormData({
        type: 'EXPENSE',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'CASH',
        tags: ''
      });
      
      console.log('Fetching updated summary data...');
      // Fetch summary data in background to update stats (without overwriting transactions)
      fetchSummaryOnly();
    } catch (error: any) {
      console.error('Transaction save error:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to save transaction', {
        description: error.response?.data?.message || 'Unable to save your transaction. Please try again.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/finance/transactions/${id}`);
      // Update state immediately for real-time feedback
      setTransactions(prev => prev.filter(t => t._id !== id));
      // Fetch updated summary in background
      fetchSummaryOnly();
      toast.success('Transaction deleted successfully!', {
        description: 'Your transaction has been removed from the records.',
      });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error('Failed to delete transaction', {
        description: error.response?.data?.message || 'Unable to delete the transaction. Please try again.',
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date.split('T')[0],
      description: transaction.description || '',
      paymentMethod: transaction.paymentMethod || 'CASH',
      tags: transaction.tags?.join(', ') || ''
    });
    setShowAddDialog(true);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesCategory = !filterCategory || t.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const transactionDate = new Date(t.date);
    const matchesStartDate = !startDate || transactionDate >= new Date(startDate);
    const matchesEndDate = !endDate || transactionDate <= new Date(endDate);
    return matchesType && matchesCategory && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-2">
              <Skeleton className="h-8 sm:h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border border-olive/10 p-4 sm:p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </Card>
            ))}
          </div>

          {/* Transactions Skeleton */}
          <Card className="bg-card/50 backdrop-blur-sm border border-olive/10">
            <div className="p-4 border-b border-olive/10">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-vanilla/10 rounded-lg p-3">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-moss">📒 Khata Book</h1>
            <p className="text-olive text-sm sm:text-base mt-1">Track your farm income and expenses</p>
          </div>
          <Button
            onClick={() => { setShowAddDialog(true); setEditingTransaction(null); }}
            className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-r from-olive to-olive/90 hover:from-olive/90 hover:to-olive text-white shadow-lg text-sm sm:text-base px-4 py-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Add Transaction</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card/50 backdrop-blur-sm border border-olive/10 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">Total Income</p>
                    <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate text-olive">{formatCurrency(summary.totalIncome)}</p>
                    <p className="text-muted-foreground text-xs mt-1">{summary.incomeCount} transactions</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-olive/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-olive/10 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">Total Expense</p>
                    <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate text-foreground">{formatCurrency(summary.totalExpense)}</p>
                    <p className="text-muted-foreground text-xs mt-1">{summary.expenseCount} transactions</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-jonquil/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-olive/10 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">{summary.profit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
                    <p className={`text-xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate ${summary.profit >= 0 ? 'text-olive' : 'text-foreground'}`}>{formatCurrency(Math.abs(summary.profit))}</p>
                    <p className="text-muted-foreground text-xs mt-1">{summary.profitMargin.toFixed(2)}% margin</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${summary.profit >= 0 ? 'bg-olive/20' : 'bg-jonquil/20'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-olive/10 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">Total Transactions</p>
                    <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-foreground">{summary.incomeCount + summary.expenseCount}</p>
                    <p className="text-muted-foreground text-xs mt-1">This year</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-jonquil/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-olive" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE: Show Transactions First */}
        <div className="lg:hidden space-y-4">
          {/* Filters */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-olive/10 shadow-sm">
            <div className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-dark-moss font-semibold">Type</Label>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-sm border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive bg-background"
                    >
                      <option value="ALL">All</option>
                      <option value="INCOME">Income</option>
                      <option value="EXPENSE">Expense</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs text-dark-moss font-semibold">Search</Label>
                    <Input
                      className="text-sm h-9 bg-background border-olive/30"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-dark-moss font-semibold">Start Date</Label>
                    <Input className="text-sm h-9 bg-background border-olive/30" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-dark-moss font-semibold">End Date</Label>
                    <Input className="text-sm h-9 bg-background border-olive/30" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Transactions List */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-olive/10 shadow-sm">
            <div className="p-4 border-b border-olive/10 bg-olive/5">
              <h2 className="text-lg font-bold text-dark-moss">Recent Transactions ({filteredTransactions.length})</h2>
            </div>
            <div className="p-0">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-olive text-sm">
                  No transactions found. Add your first transaction!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction._id} className="p-3 hover:bg-olive/5 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={transaction.type === 'INCOME' ? 'success' : 'error'} size="sm">
                              {transaction.type}
                            </Badge>
                            <span className="text-xs text-olive">{formatDate(transaction.date)}</span>
                          </div>
                          <p className="font-semibold text-sm text-dark-moss truncate">{transaction.category}</p>
                          {transaction.description && (
                            <p className="text-xs text-olive truncate mt-0.5">{transaction.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-sm font-bold whitespace-nowrap ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-white/40 rounded transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(transaction._id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-white/40 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP: Show Filters and Table */}
        <div className="hidden lg:block space-y-6">
          {/* Filters */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-olive/10 shadow-sm">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label className="text-dark-moss font-semibold">Type</Label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive bg-background"
                  >
                    <option value="ALL">All</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div>
                  <Label className="text-dark-moss font-semibold">Category</Label>
                  <Input
                    placeholder="Filter by category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-background border-olive/30"
                  />
                </div>
                <div>
                  <Label className="text-dark-moss font-semibold">Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background border-olive/30" />
                </div>
                <div>
                  <Label className="text-dark-moss font-semibold">End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-background border-olive/30" />
                </div>
                <div>
                  <Label className="text-dark-moss font-semibold">Search</Label>
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background border-olive/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-olive/10 shadow-sm">
            <div className="p-4 border-b border-olive/10 bg-olive/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark-moss">Recent Transactions ({filteredTransactions.length})</h2>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-background hover:bg-olive/5 border-olive/30">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-olive/5 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-dark-moss uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-dark-moss uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-dark-moss uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-dark-moss uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-dark-moss uppercase">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-dark-moss uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-olive">
                          No transactions found. Add your first transaction!
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-olive/5 transition-colors">
                          <td className="px-4 py-3 text-sm text-dark-moss font-medium">{formatDate(transaction.date)}</td>
                          <td className="px-4 py-3">
                            <Badge variant={transaction.type === 'INCOME' ? 'success' : 'error'}>
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-moss font-medium">{transaction.category}</td>
                          <td className="px-4 py-3 text-sm text-olive">{transaction.description || '-'}</td>
                          <td className={`px-4 py-3 text-sm text-right font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-white/40 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(transaction._id)}
                                className="text-red-600 hover:text-red-800 p-1.5 hover:bg-white/40 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Transaction Dialog */}
        {showAddDialog && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddDialog(false);
                setEditingTransaction(null);
              }
            }}
          >
            <div className="bg-card rounded-2xl border border-olive/20 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-olive/5 z-10 border-b border-olive/20 px-6 py-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-moss">{editingTransaction ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h2>
                  <button
                    onClick={() => {
                      setShowAddDialog(false);
                      setEditingTransaction(null);
                    }}
                    className="text-olive hover:text-dark-moss p-2 hover:bg-white/40 rounded-full transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-bold text-dark-moss mb-2 block">Type *</Label>
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })} 
                        required
                        className="w-full px-4 py-2.5 text-sm border border-olive/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive bg-white/70 backdrop-blur-sm font-medium text-dark-moss shadow-sm"
                      >
                        <option value="INCOME">💰 Income</option>
                        <option value="EXPENSE">💸 Expense</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-bold text-dark-moss mb-2 block">Amount (₹) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        min="0"
                        placeholder="0.00"
                        className="text-sm bg-white/70 backdrop-blur-sm border-olive/30 rounded-xl shadow-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-dark-moss mb-2 block">Category *</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-olive/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive bg-white/70 backdrop-blur-sm font-medium text-dark-moss shadow-sm"
                    >
                      <option value="">Select Category</option>
                      {(formData.type === 'INCOME' ? categories.income : categories.expense).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-dark-moss mb-2 block">Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="text-sm bg-white/70 backdrop-blur-sm border-olive/30 rounded-xl shadow-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-dark-moss mb-2 block">Payment Method</Label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-olive/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive bg-white/70 backdrop-blur-sm font-medium text-dark-moss shadow-sm"
                    >
                      <option value="CASH">💵 Cash</option>
                      <option value="UPI">📱 UPI</option>
                      <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                      <option value="CHEQUE">📝 Cheque</option>
                      <option value="CARD">💳 Card</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-dark-moss mb-2 block">Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add details..."
                      className="text-sm bg-white/70 backdrop-blur-sm border-olive/30 rounded-xl shadow-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-dark-moss mb-2 block">Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="wheat, winter, harvest"
                      className="text-sm bg-white/70 backdrop-blur-sm border-olive/30 rounded-xl shadow-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 text-sm sm:text-base font-bold bg-olive hover:bg-dark-moss text-white shadow-lg rounded-xl transition-colors"
                    >
                      <span className="hidden xs:inline">{editingTransaction ? '✅ Update' : '➕ Add'} Transaction</span>
                      <span className="xs:hidden">{editingTransaction ? '✅ Update' : '➕ Add'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddDialog(false);
                        setEditingTransaction(null);
                      }}
                      className="flex-1 h-12 text-base font-semibold bg-white/70 hover:bg-white/90 border-olive/30 text-olive rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDeleteConfirmId(null);
              }
            }}
          >
            <div className="bg-card rounded-2xl border border-olive/20 shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark-moss">Delete Transaction?</h3>
                      <p className="text-sm text-olive mt-1">This action cannot be undone.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setDeleteConfirmId(null)}
                      variant="outline"
                      className="flex-1 border-olive/30 text-olive hover:bg-olive/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(deleteConfirmId)}
                      className="flex-1 bg-dark-moss hover:bg-olive text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Success Toast Notification */}
        {showSuccess && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-olive text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md">
              <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-semibold text-sm sm:text-base">{successMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KhataBook;
