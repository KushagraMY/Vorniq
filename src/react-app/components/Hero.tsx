import { ArrowRight, Shield, Users, Package, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-accent-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Transform Your Business With{' '}
            <span className="text-primary">Intelligent Solutions</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Comprehensive ERP software for CRM, HRM, Sales, Inventory, Finance & More. 
            Streamline operations, boost productivity, and scale your business with VorniQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2 transition-colors">
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Users, title: 'CRM', description: 'Customer Relationship Management' },
            { icon: Shield, title: 'HRM', description: 'Human Resource Management' },
            { icon: Package, title: 'SIM', description: 'Sales & Inventory Management' },
            { icon: BarChart3, title: 'Analytics', description: 'Business Intelligence' },
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-background-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
