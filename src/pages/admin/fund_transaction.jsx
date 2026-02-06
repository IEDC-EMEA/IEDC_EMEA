import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Trash2, Edit, Eye, Calendar, DollarSign, 
  User, TrendingUp, TrendingDown, Filter, SortAsc, SortDesc
} from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { toast } from 'sonner';

// Form and Dialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components2/ui/alert-dialog";
import { Label } from "@/components2/ui/label";
import { Button } from "@/components2/ui/button";
import { Input } from "@/components2/ui/input";
import { Textarea } from "@/components2/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components2/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components2/ui/select";

function FundTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const [formData, setFormData] = useState({
    person_name: '',
    amount: '',
    purpose: '',
    transaction_type: 'credit'
  });

  const initialFormData = {
    person_name: '',
    amount: '',
    purpose: '',
    transaction_type: 'credit'
  };

  const transactionTypes = [
    { value: 'credit', label: 'Credit', color: 'text-green-600 bg-green-100', icon: TrendingUp },
    { value: 'debit', label: 'Debit', color: 'text-red-600 bg-red-100', icon: TrendingDown }
  ];

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('fund_transactions')
        .select('*');

      // Apply sorting
      if (sortField) {
        query = query.order(sortField, { 
          ascending: sortDirection === 'asc' 
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [sortField, sortDirection]);

  // Set form data when editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        person_name: editingTransaction.person_name || '',
        amount: editingTransaction.amount || '',
        purpose: editingTransaction.purpose || '',
        transaction_type: editingTransaction.transaction_type || 'credit'
      });
      setSheetOpen(true);
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData = {
        person_name: formData.person_name,
        amount: formData.amount,
        purpose: formData.purpose,
        transaction_type: formData.transaction_type
      };

      if (editingTransaction) {
        const { error } = await supabase
          .from('fund_transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id);

        if (error) throw error;

        // Update local state
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === editingTransaction.id ? { ...transaction, ...transactionData } : transaction
          )
        );
        
        toast.success("Transaction updated successfully!");
      } else {
        const { data, error } = await supabase
          .from('fund_transactions')
          .insert([transactionData])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setTransactions((prev) => [data[0], ...prev]);
        }
        
        toast.success("Transaction added successfully!");
      }

      // Reset form
      resetForm();
      setSheetOpen(false);

    } catch (error) {
      console.error("Error saving transaction: ", error);
      toast.error(error.message || "Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const { error } = await supabase
        .from('fund_transactions')
        .delete()
        .eq('id', transactionToDelete.id);

      if (error) throw error;

      // Update local state
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== transactionToDelete.id));
      setDeleteDialogOpen(false);
      toast.success("Transaction deleted successfully!");

    } catch (error) {
      console.error("Error deleting transaction: ", error);
      toast.error("Failed to delete transaction");
    }
  };

  const openDeleteDialog = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleViewTransaction = (transaction) => {
    setViewTransaction(transaction);
    setSheetOpen(true);
  };

  // Filter transactions based on search term and type filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        transaction.person_name?.toLowerCase().includes(searchLower) ||
        transaction.purpose?.toLowerCase().includes(searchLower) ||
        transaction.amount?.toLowerCase().includes(searchLower);

      const matchesType = typeFilter === 'All' || transaction.transaction_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, typeFilter]);

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingTransaction(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="w-4 h-4 ml-1" />
    ) : (
      <SortDesc className="w-4 h-4 ml-1" />
    );
  };

  const getTransactionTypeIcon = (type) => {
    const typeObj = transactionTypes.find(t => t.value === type);
    const Icon = typeObj ? typeObj.icon : TrendingUp;
    return <Icon className="w-4 h-4" />;
  };

  const getTransactionTypeColor = (type) => {
    const typeObj = transactionTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : 'text-gray-600 bg-gray-100';
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalCredit = 0;
    let totalDebit = 0;
    
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0;
      if (transaction.transaction_type === 'credit') {
        totalCredit += amount;
      } else {
        totalDebit += amount;
      }
    });

    const balance = totalCredit - totalDebit;
    
    return {
      totalCredit: totalCredit.toFixed(2),
      totalDebit: totalDebit.toFixed(2),
      balance: balance.toFixed(2)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fund Transactions</h1>
              <p className="text-gray-600 mt-1">Manage and track all fund transactions</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setSheetOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <Label htmlFor="search" className="mb-1 font-medium text-gray-700">Search Transactions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by person, purpose, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label htmlFor="typeFilter" className="mb-1 font-medium text-gray-700">Filter by Type</Label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Transactions</SelectItem>
                    {transactionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {getTransactionTypeIcon(type.value)}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Credit</h3>
                <p className="text-2xl font-bold text-green-600">₹{totals.totalCredit}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Debit</h3>
                <p className="text-2xl font-bold text-red-600">₹{totals.totalDebit}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Balance</h3>
                <p className={`text-2xl font-bold ${
                  parseFloat(totals.balance) >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  ₹{totals.balance}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                parseFloat(totals.balance) >= 0 ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  parseFloat(totals.balance) >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(searchTerm || typeFilter !== 'All') && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
              {searchTerm && ` matching "${searchTerm}"`}
              {typeFilter !== 'All' && ` of type "${typeFilter}"`}
            </p>
          </div>
        )}

        {/* Transactions Table - Using HTML Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('person_name')}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Person
                      {getSortIcon('person_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Amount
                      {getSortIcon('amount')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('transaction_type')}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon('transaction_type')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date & Time
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <DollarSign className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-1">
                        {transactions.length === 0 ? 'No transactions yet' : 'No transactions found'}
                      </h3>
                      <p className="text-gray-500">
                        {transactions.length === 0 
                          ? 'Click "Add Transaction" to get started' 
                          : 'Try adjusting your search or filters'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const TypeIcon = getTransactionTypeIcon(transaction.transaction_type);
                    const typeColor = getTransactionTypeColor(transaction.transaction_type);
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{transaction.person_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-bold ${
                            transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.transaction_type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {transaction.purpose || 'No purpose specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                            {TypeIcon}
                            {transaction.transaction_type === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTransaction(transaction)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTransaction(transaction);
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(transaction)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Sheet */}
      <Sheet open={sheetOpen && !viewTransaction} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</SheetTitle>
            <SheetDescription>
              {editingTransaction ? 'Update transaction details' : 'Add a new fund transaction'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="person_name">Person Name *</Label>
                <Input
                  id="person_name"
                  name="person_name"
                  value={formData.person_name}
                  onChange={handleInputChange}
                  placeholder="Enter person's name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="transaction_type">Type *</Label>
                  <Select 
                    value={formData.transaction_type} 
                    onValueChange={(value) => handleSelectChange('transaction_type', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Enter purpose of the transaction"
                  rows="3"
                />
              </div>
            </div>

            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Add Transaction')}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* View Transaction Sheet */}
      <Sheet open={viewTransaction && sheetOpen} onOpenChange={(open) => {
        if (!open) setViewTransaction(null);
        setSheetOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {viewTransaction && (
            <>
              <SheetHeader>
                <SheetTitle>Transaction Details</SheetTitle>
                <SheetDescription>
                  View complete transaction information
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className={`p-4 rounded-lg ${
                  viewTransaction.transaction_type === 'credit' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-red-50 border border-red-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className={`text-2xl font-bold ${
                        viewTransaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {viewTransaction.transaction_type === 'credit' ? '+' : '-'}₹{viewTransaction.amount}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${
                      viewTransaction.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getTransactionTypeIcon(viewTransaction.transaction_type)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      viewTransaction.transaction_type === 'credit' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-red-600 bg-red-100'
                    }`}>
                      {viewTransaction.transaction_type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Person Name</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{viewTransaction.person_name}</p>
                    </div>
                  </div>

                  {viewTransaction.purpose && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Purpose</Label>
                      <p className="mt-1 text-gray-700 whitespace-pre-wrap">{viewTransaction.purpose}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500">Transaction Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p>{formatDate(viewTransaction.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    setEditingTransaction(viewTransaction);
                    setViewTransaction(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Transaction
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction
              from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FundTransactions;