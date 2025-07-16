import Header from '@/react-app/components/Header';
import PaymentModal from '@/react-app/components/PaymentModal';
import { BarChart3, TrendingUp, FileText, Users, Target, Star } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const features = [
  { icon: BarChart3, title: 'Real-time KPI Monitoring', desc: 'Track your business health at a glance with live dashboards.' },
  { icon: TrendingUp, title: 'Sales Analytics', desc: 'Visualize sales trends and spot growth opportunities instantly.' },
  { icon: FileText, title: 'Custom Reports', desc: 'Generate, export, and share detailed business reports in seconds.' },
  { icon: Users, title: 'HR Metrics', desc: 'Monitor team performance and HR stats alongside financials.' },
  { icon: Target, title: 'Profit Analysis', desc: 'See profit & loss breakdowns and optimize your margins.' },
  { icon: Star, title: 'Easy Sharing', desc: 'Share insights securely with your team or investors.' },
];

export default function DashboardPreview() {
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();
  useEffect(() => {
    if (hasActiveSubscription && subscribedServices.length === 6) {
      navigate('/dashboard');
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
        <h1 className="text-5xl font-extrabold mb-3 text-primary drop-shadow">Your Business, Visualized</h1>
        <p className="text-xl text-text-secondary mb-8">All your key metrics, sales, profits, and team performance in one beautiful dashboard.</p>
        {/* Mockup Area */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-10 bg-white border-4 border-primary-100">
          <img src="/dashboard-report.png" alt="Dashboard & Reports Preview" className="w-full h-64 object-cover" />
        </div>
        {/* Features Grid */}
        <h2 className="text-2xl font-bold mb-6 text-accent">Why You'll Love VorniQ Dashboards</h2>
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
          <p className="text-lg italic text-text-primary mb-2">“VorniQ’s dashboard gave us instant clarity on our business. We make decisions faster and smarter now!”</p>
          <span className="font-bold text-primary">— Priya S., Startup Founder</span>
        </div>
        {/* CTA */}
        <button className="mt-4 px-10 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-transform" onClick={handleBuy}>Buy Dashboard & Reports</button>
        <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} orderDetails={orderDetails} />
      </div>
    </div>
  );
} 