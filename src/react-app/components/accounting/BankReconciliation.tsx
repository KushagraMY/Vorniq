import { useState, useEffect } from 'react';
import { CreditCard, Plus, Check, X, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { accountingService, type BankAccount, type BankTransaction, type BookTransaction } from '../../services/accountingService';

export default function BankReconciliation() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [bookTransactions, setBookTransactions] = useState<BookTransaction[]>([]);
  const [reconciliationPeriod, setReconciliationPeriod] = useState('this_month');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        setLoading(true);
        const [accounts, bookData] = await Promise.all([
          accountingService.getBankAccounts(),
          accountingService.getBookTransactions(),
        ]);
        
        setBankAccounts(accounts);
        setBookTransactions(bookData);
        
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
          const bankData = await accountingService.getBankTransactions(accounts[0].id);
          setBankTransactions(bankData);
        }
      } catch (error) {
        console.error('Error fetching bank reconciliation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const fetchBankTransactions = async () => {
        try {
          const data = await accountingService.getBankTransactions(selectedAccount);
          setBankTransactions(data);
        } catch (error) {
          console.error('Error fetching bank transactions:', error);
        }
      };

      fetchBankTransactions();
    }
  }, [selectedAccount]);

  const AddTransactionForm = ({ onSave, onCancel }: {
    onSave: (data: Partial<BookTransaction>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      type: 'debit' as 'debit' | 'credit',
      category: 'Office Expenses'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        isReconciled: false
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Book Transaction</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'debit' | 'credit'})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="debit">Debit (Money Out)</option>
                <option value="credit">Credit (Money In)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Sales Revenue">Sales Revenue</option>
                <option value="Consulting Revenue">Consulting Revenue</option>
                <option value="Office Expenses">Office Expenses</option>
                <option value="Marketing">Marketing</option>
                <option value="Salaries">Salaries</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Transaction
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSave = (data: Partial<BookTransaction>) => {
    const newTransaction = {
      ...data,
      id: Math.max(...bookTransactions.map(t => t.id), 0) + 1
    } as BookTransaction;
    setBookTransactions([...bookTransactions, newTransaction]);
    setShowAddTransaction(false);
  };

  const handleMatchTransactions = (bankId: number, bookId: number) => {
    setBankTransactions(bankTransactions.map(t => 
      t.id === bankId ? {...t, isReconciled: true, matchedTransactionId: bookId} : t
    ));
    setBookTransactions(bookTransactions.map(t => 
      t.id === bookId ? {...t, isReconciled: true, matchedBankTransactionId: bankId} : t
    ));
  };

  const handleUnmatchTransaction = (bankId: number, bookId: number) => {
    setBankTransactions(bankTransactions.map(t => 
      t.id === bankId ? {...t, isReconciled: false, matchedTransactionId: undefined} : t
    ));
    setBookTransactions(bookTransactions.map(t => 
      t.id === bookId ? {...t, isReconciled: false, matchedBankTransactionId: undefined} : t
    ));
  };

  const selectedAccountData = bankAccounts.find(acc => acc.id === selectedAccount);
  const accountBankTransactions = bankTransactions.filter(t => t.bankAccountId === selectedAccount);
  const unreconciledBankTransactions = accountBankTransactions.filter(t => !t.isReconciled);
  const unreconciledBookTransactions = bookTransactions.filter(t => !t.isReconciled);
  const difference = selectedAccountData ? selectedAccountData.currentBalance - selectedAccountData.reconciledBalance : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bank Reconciliation</h2>
            <p className="text-sm text-gray-600">Match bank statements with book transactions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Account</option>
              {bankAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.bankName}
                </option>
              ))}
            </select>
            
            <select
              value={reconciliationPeriod}
              onChange={(e) => setReconciliationPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddTransaction(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Add Transaction
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Upload size={18} />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedAccountData && (
        <>
          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Balance</p>
                <p className="text-2xl font-bold text-blue-600">₹{selectedAccountData.currentBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reconciled Balance</p>
                <p className="text-2xl font-bold text-green-600">₹{selectedAccountData.reconciledBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Difference</p>
                <p className={`text-2xl font-bold ${difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(difference).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <X className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Unmatched Items</p>
                <p className="text-2xl font-bold text-purple-600">
                  {unreconciledBankTransactions.length + unreconciledBookTransactions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Reconciliation Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Bank Statement</h3>
                <p className="text-sm text-gray-600">
                  {selectedAccountData.name} - {selectedAccountData.accountNumber}
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {accountBankTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-3 rounded-lg border ${
                        transaction.isReconciled 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </p>
                          </div>
                          {transaction.isReconciled ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <button
                                onClick={() => handleUnmatchTransaction(
                                  transaction.id, 
                                  transaction.matchedTransactionId!
                                )}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Unmatch"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {transaction.id}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Book Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Book Transactions</h3>
                <p className="text-sm text-gray-600">Your recorded transactions</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {bookTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-3 rounded-lg border ${
                        transaction.isReconciled 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </p>
                          </div>
                          {transaction.isReconciled ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <button
                                onClick={() => handleUnmatchTransaction(
                                  transaction.matchedBankTransactionId!,
                                  transaction.id
                                )}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Unmatch"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {transaction.id}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Match Suggestions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Match Suggestions</h3>
            <div className="space-y-3">
              {unreconciledBankTransactions.slice(0, 3).map((bankTx) => {
                const suggestedBookTx = unreconciledBookTransactions.find(bookTx => 
                  Math.abs(bankTx.amount - bookTx.amount) <= 100 && 
                  bankTx.type === bookTx.type
                );
                
                if (!suggestedBookTx) return null;
                
                return (
                  <div key={`${bankTx.id}-${suggestedBookTx.id}`} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {bankTx.description} ↔ {suggestedBookTx.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Amount: ₹{bankTx.amount.toLocaleString()} | 
                        Date: {new Date(bankTx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMatchTransactions(bankTx.id, suggestedBookTx.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Check size={16} />
                      Match
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reconciliation Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reconciliation Status</h3>
                <p className="text-sm text-gray-600">
                  {difference === 0 ? 'Account is balanced' : `Difference of ₹${Math.abs(difference).toLocaleString()}`}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Download size={18} />
                  Export Report
                </button>
                {difference === 0 && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <CheckCircle size={18} />
                    Complete Reconciliation
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Transaction Form */}
      {showAddTransaction && (
        <AddTransactionForm
          onSave={handleSave}
          onCancel={() => setShowAddTransaction(false)}
        />
      )}
    </div>
  );
}
