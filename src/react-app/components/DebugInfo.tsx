import { useUser } from '@/react-app/hooks/useUser';
import { useSubscription } from '@/react-app/hooks/useSubscription';

export default function DebugInfo() {
  const { user } = useUser();
  const { hasActiveSubscription, subscribedServices, isLoading } = useSubscription();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div><strong>User:</strong> {user ? `${user.name} (${user.id})` : 'None'}</div>
        <div><strong>Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Has Subscription:</strong> {hasActiveSubscription ? 'Yes' : 'No'}</div>
        <div><strong>Services:</strong> {subscribedServices.join(', ') || 'None'}</div>
        <div><strong>Demo User:</strong> {user?.id === 'demo-user-123' ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}
