import { X, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PaymentModal from '@/react-app/components/PaymentModal';
import { useUser } from '@/react-app/hooks/useUser';
import { useNavigate } from 'react-router';

interface PaywallOverlayProps {
  serviceName: string;
  serviceId: number;
  onClose: () => void;
}

export default function PaywallOverlay({ serviceName, serviceId, onClose }: PaywallOverlayProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    serviceIds: number[];
    subscriptionType: string;
  } | null>(null);

  const servicePricingINR: Record<number, number> = {
    1: 499,
    2: 499,
    3: 699,
    4: 399,
    5: 799,
    6: 0,
  };

  const openBuyNow = () => {
    const amount = servicePricingINR[serviceId] ?? 499;
    const fakeOrderId = `order_${Date.now()}`;
    setOrderDetails({
      orderId: fakeOrderId,
      amount,
      currency: 'INR',
      serviceIds: [serviceId],
      subscriptionType: 'monthly',
    });
    setIsPaymentOpen(true);
  };
  const handleSubscribeClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    openBuyNow();
  };

  const handleDemoClick = () => {
    window.location.href = '/#demo';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 relative overflow-auto shadow-2xl flex flex-col items-center max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors z-10 p-2 hover:bg-background rounded-full"
          style={{ top: 16, right: 16 }}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center gap-4 mt-4 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary text-center">
            Unlock {serviceName}
          </h2>
          <p className="text-base text-text-secondary text-center max-w-xs">
            Subscribe to access this feature and all other powerful tools in VorniQ. Start your success journey now!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              onClick={handleSubscribeClick}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg"
            >
              Buy Now <ArrowRight size={18} />
            </button>
            <button
              onClick={handleDemoClick}
              className="flex-1 bg-white hover:bg-background border-2 border-primary hover:border-accent text-primary hover:text-accent px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              Request Demo
            </button>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setOrderDetails(null);
        }}
        orderDetails={orderDetails}
      />
    </div>
  );
}
