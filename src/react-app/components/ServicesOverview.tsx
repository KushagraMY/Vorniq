import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  Shield, 
  Calculator, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    id: 1,
    name: "CRM",
    title: "Customer Relationship Management",
    description: "Manage customer interactions, track leads, and boost sales performance",
    icon: Users,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "HRM",
    title: "Human Resource Management",
    description: "Streamline HR processes, manage employee data, and optimize workforce productivity",
    icon: UserCheck,
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Sales & Inventory",
    title: "Sales & Inventory Management",
    description: "Track sales, manage inventory, and optimize supply chain operations",
    icon: ShoppingCart,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 4,
    name: "User Roles & Access",
    title: "User Roles & Access Control",
    description: "Secure your business with role-based permissions and access management",
    icon: Shield,
    color: "from-red-500 to-red-600"
  },
  {
    id: 5,
    name: "Accounting & Finance",
    title: "Accounting & Finance (Basic)",
    description: "Track income & expenses, manage P&L statements, GST calculations, and bank reconciliation",
    icon: Calculator,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 6,
    name: "Dashboard & Reports",
    title: "Dashboard & Reports",
    description: "Get comprehensive insights with customizable dashboards and detailed analytics",
    icon: BarChart3,
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function ServicesOverview() {
  const handleServiceClick = (serviceId: number) => {
    // Navigate to individual service pages
    switch (serviceId) {
      case 1:
        window.location.href = '/crm';
        break;
      case 2:
        window.location.href = '/hrm';
        break;
      case 3:
        window.location.href = '/sim';
        break;
      case 4:
        window.location.href = '/roles';
        break;
      case 5:
        window.location.href = '/accounting';
        break;
      case 6:
        window.location.href = '/dashboard';
        break;
      default:
        // For other services, scroll to the services section for now
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Comprehensive Business Solutions
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Transform your business operations with our integrated suite of management tools. 
            Each service is designed to work seamlessly together, providing you with a complete business ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-background to-background-dark hover:from-background-light hover:to-background border border-gray-200 hover:border-primary-200 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={28} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center text-primary font-medium group-hover:text-primary-600 transition-colors duration-300">
                    <span className="mr-2">Explore Service</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg">
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-background-light text-primary px-8 py-3 rounded-full font-semibold hover:bg-background transition-colors duration-200 flex items-center gap-2"
            >
              Get Started with Our Services
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
