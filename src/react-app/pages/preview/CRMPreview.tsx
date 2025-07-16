import Header from '@/react-app/components/Header';
import PaymentModal from '@/react-app/components/PaymentModal';
import { Users, UserCheck, TrendingUp, MessageSquare, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const features = [
  { icon: Users, title: 'Customer Database', desc: 'Centralize all your customer info for easy access and management.' },
  { icon: UserCheck, title: 'Lead Tracking', desc: 'Never miss a lead. Track, nurture, and convert with ease.' },
  { icon: TrendingUp, title: 'Sales Pipeline', desc: 'Visualize your sales funnel and boost conversions.' },
  { icon: MessageSquare, title: 'Communication History', desc: 'See every call, email, and note in one place.' },
  { icon: Calendar, title: 'Follow-up Reminders', desc: 'Automated reminders so you never drop the ball.' },
  { icon: FileText, title: 'Analytics & Reports', desc: 'Get actionable insights to grow your business.' },
];

export default function CRMPreview() {
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();
  useEffect(() => {
    if (hasActiveSubscription && subscribedServices.length === 6) {
      navigate('/crm');
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
        <h1 className="text-5xl font-extrabold mb-3 text-primary drop-shadow">Build Lasting Customer Relationships</h1>
        <p className="text-xl text-text-secondary mb-8">Manage leads, track sales, and delight customers with VorniQ CRM.</p>
        {/* Mockup Area */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-10 bg-white border-4 border-primary-100">
          <img src="/crm-dashboard.png" alt="CRM Dashboard Preview" className="w-full h-64 object-cover" />
        </div>
        {/* Features Grid */}
        <h2 className="text-2xl font-bold mb-6 text-accent">CRM Features Designed for Growth</h2>
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
          <p className="text-lg italic text-text-primary mb-2">“With VorniQ CRM, our sales team doubled their follow-ups and closed more deals!”</p>
          <span className="font-bold text-primary">— Rahul M., Sales Lead</span>
        </div>
        {/* CTA */}
        <button className="mt-4 px-10 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-transform" onClick={handleBuy}>Buy CRM</button>
        <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} orderDetails={orderDetails} />
      </div>
    </div>
  );
} 