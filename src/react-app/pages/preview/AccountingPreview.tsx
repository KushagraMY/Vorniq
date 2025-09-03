import Header from '@/react-app/components/Header';
import PaymentModal from '@/react-app/components/PaymentModal';
import { Calculator, DollarSign, FileText, Bell, CreditCard, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const features = [
  { icon: DollarSign, title: 'Income & Expense Tracking', desc: 'Easily record and categorize every transaction.' },
  { icon: FileText, title: 'Profit & Loss Statements', desc: 'Instantly see your business health with clear P&L reports.' },
  { icon: Calculator, title: 'GST/Tax Calculations', desc: 'Automatic GST and tax calculations for peace of mind.' },
  { icon: Bell, title: 'Payment Reminders', desc: 'Never miss a due date with smart reminders.' },
  { icon: CreditCard, title: 'Bank Reconciliation', desc: 'Match your books with your bank in a few clicks.' },
  { icon: TrendingUp, title: 'Financial Analytics', desc: 'Visualize trends and make data-driven decisions.' },
];

export default function AccountingPreview() {
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();
  useEffect(() => {
    if (hasActiveSubscription && subscribedServices.length === 6) {
      navigate('/accounting');
    }
  }, [hasActiveSubscription, subscribedServices, navigate]);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleBuy = () => {
    setOrderDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Header />
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-3 text-primary drop-shadow">Effortless Accounting for Startups</h1>
        <p className="text-xl text-text-secondary mb-8">Track income, expenses, taxes, and more with VorniQ Accounting.</p>
        {/* Mockup Area */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-10 bg-white border-4 border-primary-100">
          <img src="/accounting%20finance.png" alt="Accounting & Finance Dashboard Preview" className="w-full h-64 object-cover" />
        </div>
        {/* Features Grid */}
        <h2 className="text-2xl font-bold mb-6 text-accent">Accounting Features for Modern Businesses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
              <f.icon className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1 text-text-primary">{f.title}</h3>
              <p className="text-text-secondary text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        {/* Testimonial */}
        <div className="bg-primary-100 rounded-xl p-8 mb-10 shadow flex flex-col items-center">
          <p className="text-lg italic text-text-primary mb-2">“I used to dread accounting. Now it’s the easiest part of my business!”</p>
          <span className="font-bold text-primary">— Ritu G., Founder</span>
        </div>
        {/* CTA */}
        <button className="mt-4 px-10 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-transform" onClick={handleBuy}>Buy Accounting</button>
        <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} orderDetails={orderDetails} />
      </div>
    </div>
  );
} 