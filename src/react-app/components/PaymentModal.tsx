import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/react-app/hooks/useSubscription';

interface OrderDetails {
  orderId: string;
  amount: number;
  currency: string;
  serviceIds: number[];
  subscriptionType: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ isOpen, onClose, orderDetails }: PaymentModalProps) {
  const { refreshSubscription } = useSubscription();
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRazorpayKey();
    }
  }, [isOpen]);

  const fetchRazorpayKey = async () => {
    try {
      const response = await fetch('/api/razorpay-key');
      const data = await response.json();
      setRazorpayKey(data.key);
    } catch (error) {
      console.error('Error fetching Razorpay key:', error);
    }
  };

  const handlePayment = async () => {
    if (!orderDetails || !razorpayKey) return;

    setIsProcessing(true);

    const options = {
      key: razorpayKey,
      amount: orderDetails.amount * 100, // Convert to paise
      currency: orderDetails.currency,
      name: 'VorniQ',
      description: `${orderDetails.subscriptionType === 'bundle' ? 'Complete Bundle' : 'Individual Services'} Subscription`,
      order_id: orderDetails.orderId,
      image: 'https://mocha-cdn.com/0197f346-0f36-7457-8bb2-456a9982a967/vorniq_logo.jpg',
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            setPaymentStatus('success');
            // Refresh subscription status after successful payment
            refreshSubscription();
          } else {
            setPaymentStatus('failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('failed');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#7c3aed'
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleClose = () => {
    setPaymentStatus('pending');
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {paymentStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your subscription has been activated successfully. You can now access all the selected services.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Get Started
            </button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : 'Try Again'}
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'pending' && orderDetails && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Your Purchase
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subscription Type:</span>
                  <span className="font-medium">
                    {orderDetails.subscriptionType === 'bundle' ? 'Complete Bundle' : 'Individual Services'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Services:</span>
                  <span className="font-medium">{orderDetails.serviceIds.length} selected</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{orderDetails.amount}/month</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isProcessing || !razorpayKey}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
              
              <button
                onClick={handleClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Powered by Razorpay • Secure Payment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
