import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './useUser';

interface SubscriptionContextType {
  hasActiveSubscription: boolean;
  subscribedServices: number[];
  isLoading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscribedServices, setSubscribedServices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      let url = '/api/subscription/status';
      if (user && user.email) {
        url += `?email=${encodeURIComponent(user.email)}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('DEBUG: Subscription API result', data);
        setHasActiveSubscription(data.hasActiveSubscription);
        setSubscribedServices(data.subscribedServices || []);
      } else {
        setHasActiveSubscription(false);
        setSubscribedServices([]);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setHasActiveSubscription(false);
      setSubscribedServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = () => {
    checkSubscriptionStatus();
  };

  useEffect(() => {
    if (user && user.email) {
      checkSubscriptionStatus();
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      hasActiveSubscription,
      subscribedServices,
      isLoading,
      checkSubscriptionStatus,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
