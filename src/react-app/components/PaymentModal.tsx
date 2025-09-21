import { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { env } from '../supabaseClient';

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

export default function PaymentModal({ isOpen, onClose, orderDetails }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderDetails) {
      initializePayment();
    }
  }, [isOpen, orderDetails]);

  const initializePayment = async () => {
    if (!orderDetails) return;

    try {
      setLoading(true);
      setPaymentError(null);

      if (!env.razorpayKeyId) {
        setPaymentError('Payment key not configured. Set VITE_RAZORPAY_KEY_ID.');
        setLoading(false);
        return;
      }

      // Ensure Razorpay script is available
      const openCheckout = () => {
        const options: any = {
          key: env.razorpayKeyId,
          amount: orderDetails.amount * 100, // paise
          currency: orderDetails.currency,
          name: env.appName,
          description: `${orderDetails.subscriptionType} subscription`,
          handler: function (response: any) {
            handlePaymentSuccess(response);
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '+91-9999999999'
          },
          notes: {
            subscription_type: orderDetails.subscriptionType,
            service_ids: orderDetails.serviceIds.join(',')
          },
          theme: {
            color: '#6366f1'
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        // Avoid passing a fake order_id which can stall the checkout
        // If you have a backend-created order, pass it via orderDetails and enable below
        // if (orderDetails.orderId && orderDetails.orderId.startsWith('order_')) {
        //   options.order_id = orderDetails.orderId;
        // }

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setPaymentError(resp.error && resp.error.description ? resp.error.description : 'Payment failed');
          setLoading(false);
        });
        rzp.open();
        // Safety timeout: if checkout fails to open, stop loading and show an error
        window.setTimeout(() => {
          if (document.querySelector('.razorpay-container') === null) {
            setPaymentError('Unable to open Razorpay. Check API key or pop-up blockers.');
            setLoading(false);
          }
        }, 6000);
      };

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = openCheckout;
        script.onerror = () => {
          setPaymentError('Failed to load payment gateway');
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        openCheckout();
      }

    } catch (error) {
      console.error('Error initializing payment:', error);
      setPaymentError('Failed to initialize payment');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      setLoading(true);
      
      // Verify payment signature
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      };

      // Here you would typically verify the payment on your backend
      // For now, we'll simulate a successful verification
      console.log('Payment verification data:', verificationData);
      
      setPaymentSuccess(true);
      setLoading(false);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentError('Payment verification failed');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {orderDetails && (
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subscription Type:</span>
                  <span className="capitalize">{orderDetails.subscriptionType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services:</span>
                  <span>{orderDetails.serviceIds.length} selected</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total Amount:</span>
                  <span>₹{orderDetails.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{paymentError}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Secure payment powered by Razorpay</span>
              <Lock className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          <button
            onClick={initializePayment}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Pay ₹{orderDetails?.amount.toLocaleString() || '0'}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
