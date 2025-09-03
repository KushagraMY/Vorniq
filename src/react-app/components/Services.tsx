import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  Shield, 
  Calculator, 
  BarChart3,
  Check,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router';
import { useUser } from '../hooks/useUser';

interface Service {
  id: number;
  name: string;
  description: string;
  price_monthly: number;
  icon: string;
  features: string;
}

const iconMap = {
  Users,
  UserCheck,
  ShoppingCart,
  Shield,
  Calculator,
  BarChart3,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      setServices((data || []) as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceCardClick = (serviceId: number) => {
    // Navigate to individual service pages (same as ServicesOverview)
    switch (serviceId) {
      case 1:
        navigate('/crm');
        break;
      case 2:
        navigate('/hrm');
        break;
      case 3:
        navigate('/sim');
        break;
      case 4:
        navigate('/roles');
        break;
      case 5:
        navigate('/accounting');
        break;
      case 6:
        navigate('/dashboard');
        break;
      default:
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateTotal = () => {
    if (selectedServices.length === 6) {
      return 1499; // Bundle price
    }
    return selectedServices.length * 299;
  };

  const handleSubscribe = async () => {
    if (selectedServices.length === 0) return;
    if (!user) {
      alert('Please log in to subscribe.');
      return;
    }

    try {
      const subscriptionType = selectedServices.length === 6 ? 'bundle' : 'individual';
      const totalPrice = calculateTotal();
      const serviceIdsText = selectedServices.join(',');

      const { error } = await supabase.from('subscriptions').insert([
        {
          user_id: user.id,
          service_ids: serviceIdsText,
          total_price: totalPrice,
          subscription_type: subscriptionType,
          status: 'active',
        },
      ]);

      if (error) throw error;

      alert('Subscription created successfully.');
      setSelectedServices([]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription.');
    }
  };

  const handlePaymentModalClose = () => {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Our Business Solutions
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the services that best fit your business needs. Select individual services or get all six for maximum value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            const isSelected = selectedServices.includes(service.id);
            
            return (
              <div 
                key={service.id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  isSelected 
                    ? 'border-primary bg-primary-50 shadow-lg' 
                    : 'border-gray-200 bg-background-light hover:border-primary-300'
                }`}
                onClick={() => handleServiceCardClick(service.id)}
                onDoubleClick={() => handleServiceToggle(service.id)}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-text-primary">{service.name}</h3>
                    <p className="text-primary font-medium">₹{service.price_monthly}/month</p>
                  </div>
                </div>
                
                <p className="text-text-secondary mb-4 text-sm">{service.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-text-primary text-sm">Key Features:</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {service.features.split(', ').map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={14} className="text-accent mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {selectedServices.length > 0 && (
          <div className="bg-background-light rounded-xl shadow-lg p-6 border-2 border-primary-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {selectedServices.length === 6 ? 'Complete Bundle Selected' : `${selectedServices.length} Services Selected`}
                </h3>
                <p className="text-text-secondary">
                  {selectedServices.length === 6 
                    ? 'You\'ve selected all services! Get the complete bundle at a discounted rate.' 
                    : 'Add more services or proceed with your current selection.'}
                </p>
                {selectedServices.length === 6 && (
                  <p className="text-accent font-medium mt-1">
                    Save ₹{(selectedServices.length * 299) - 1499} with the bundle!
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{calculateTotal()}</p>
                  <p className="text-sm text-text-secondary">per month</p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  Subscribe Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PaymentModal removed: Supabase flow directly inserts subscriptions */}
      </div>
    </section>
  );
}
