import { useState, useEffect } from 'react';
import { Calculator, Plus, Download, FileText, AlertCircle } from 'lucide-react';
import { accountingService, type TaxSettings, type TaxCalculation } from '../../services/accountingService';

export default function TaxCalculations() {
  const [taxSettings, setTaxSettings] = useState<TaxSettings[]>([]);
  const [calculations, setCalculations] = useState<TaxCalculation[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setLoading(true);
        const [settings, calculationsData] = await Promise.all([
          accountingService.getTaxSettings(),
          accountingService.getTaxCalculations(),
        ]);
        
        setTaxSettings(settings);
        setCalculations(calculationsData);
      } catch (error) {
        console.error('Error fetching tax data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxData();
  }, []);

  const TaxCalculatorForm = ({ onSave, onCancel }: {
    onSave: (data: Partial<TaxCalculation>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      description: '',
      amount: 0,
      taxType: '',
      category: 'Sales',
      date: new Date().toISOString().split('T')[0]
    });

    const selectedTax = taxSettings.find(t => t.name === formData.taxType);
    const taxAmount = selectedTax ? (formData.amount * selectedTax.rate) / 100 : 0;
    const totalAmount = formData.amount + taxAmount;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        taxRate: selectedTax?.rate || 0,
        taxAmount,
        totalAmount
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculator</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
              <select
                value={formData.taxType}
                onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Tax Type</option>
                {taxSettings.filter(t => t.isActive).map(tax => (
                  <option key={tax.id} value={tax.name}>{tax.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Service">Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

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

            {/* Tax Calculation Display */}
            {selectedTax && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Calculation Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{formData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({selectedTax.rate}%):</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save Calculation
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

  const TaxSettingsForm = ({ onSave, onCancel }: {
    onSave: (data: Partial<TaxSettings>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      rate: 0,
      type: 'GST',
      isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Tax Setting</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., GST 18%"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="GST">GST</option>
                <option value="VAT">VAT</option>
                <option value="TDS">TDS</option>
                <option value="Service Tax">Service Tax</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Tax Setting
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

  const handleSaveCalculation = async (data: Partial<TaxCalculation>) => {
    try {
      const newCalculation = await accountingService.addTaxCalculation(data);
      setCalculations([...calculations, newCalculation]);
      setShowCalculator(false);
    } catch (error) {
      console.error('Error saving tax calculation:', error);
    }
  };

  const handleSaveTaxSetting = async (data: Partial<TaxSettings>) => {
    try {
      // This would need to be implemented in the service
      const newSetting = {
        ...data,
        id: Math.max(...taxSettings.map(t => t.id), 0) + 1
      } as TaxSettings;
      setTaxSettings([...taxSettings, newSetting]);
      setShowTaxSettings(false);
    } catch (error) {
      console.error('Error saving tax setting:', error);
    }
  };

  const totalTaxAmount = calculations.reduce((sum, calc) => sum + calc.taxAmount, 0);
  const totalSalesAmount = calculations.filter(c => c.category === 'Sales').reduce((sum, calc) => sum + calc.totalAmount, 0);
  const totalPurchaseAmount = calculations.filter(c => c.category === 'Purchase').reduce((sum, calc) => sum + calc.totalAmount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
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
      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Tax Amount</p>
            <p className="text-2xl font-bold text-purple-600">₹{totalTaxAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Sales Tax Collected</p>
            <p className="text-2xl font-bold text-green-600">₹{totalSalesAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Purchase Tax Paid</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalPurchaseAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tax Calculations</h2>
            <p className="text-sm text-gray-600">Manage GST and tax calculations</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCalculator(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Calculator size={18} />
                New Calculation
              </button>
              <button
                onClick={() => setShowTaxSettings(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tax Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxSettings.map((setting) => (
            <div key={setting.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{setting.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  setting.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {setting.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{setting.type}</p>
              <p className="text-lg font-semibold text-purple-600">{setting.rate}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calculations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Calculations</h3>
          <button className="text-purple-600 hover:text-purple-700 flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(calc.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {calc.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      calc.category === 'Sales' ? 'bg-green-100 text-green-800' :
                      calc.category === 'Purchase' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {calc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{calc.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calc.taxType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    ₹{calc.taxAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{calc.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms */}
      {showCalculator && (
        <TaxCalculatorForm
          onSave={handleSaveCalculation}
          onCancel={() => setShowCalculator(false)}
        />
      )}

      {showTaxSettings && (
        <TaxSettingsForm
          onSave={handleSaveTaxSetting}
          onCancel={() => setShowTaxSettings(false)}
        />
      )}
    </div>
  );
}
