import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './useUser';
import { supabase } from '../supabaseClient';

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
      if (!user) {
        setHasActiveSubscription(false);
        setSubscribedServices([]);
        return;
      }
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, using demo mode');
        setHasActiveSubscription(false);
        setSubscribedServices([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('service_ids, status, expires_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setHasActiveSubscription(false);
        setSubscribedServices([]);
        return;
      }
      const isActive = data.status === 'active' && (!data.expires_at || new Date(data.expires_at) > new Date());
      const ids = (data.service_ids || '')
        .split(',')
        .map((s: string) => parseInt(s.trim(), 10))
        .filter((n: number) => !Number.isNaN(n));
      setHasActiveSubscription(isActive);
      setSubscribedServices(ids);
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
