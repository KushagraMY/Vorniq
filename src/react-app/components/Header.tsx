import { useState } from 'react';
import { Menu, X, Users, Package, BarChart3, Settings, Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import { useUser } from '@/react-app/hooks/useUser';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const { user, logout } = useUser();

  // Service access logic
  const serviceAccess = {
    crm: hasActiveSubscription && (subscribedServices.includes(1) || subscribedServices.length === 6),
    hrm: hasActiveSubscription && (subscribedServices.includes(2) || subscribedServices.length === 6),
    sim: hasActiveSubscription && (subscribedServices.includes(3) || subscribedServices.length === 6),
    roles: hasActiveSubscription && (subscribedServices.includes(4) || subscribedServices.length === 6),
    accounting: hasActiveSubscription && (subscribedServices.includes(5) || subscribedServices.length === 6),
    dashboard: hasActiveSubscription && (subscribedServices.includes(6) || subscribedServices.length === 6),
  };

  type ServiceKey = keyof typeof serviceAccess;
  const navigation: Array<{ name: string; href: string; icon: React.ElementType; key?: ServiceKey }> = [
    { name: 'CRM', href: '/crm', icon: Users, key: 'crm' },
    { name: 'HRM', href: '/hrm', icon: Users, key: 'hrm' },
    { name: 'SIM', href: '/sim', icon: Package, key: 'sim' },
    { name: 'User Roles', href: '/roles', icon: Settings, key: 'roles' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, key: 'dashboard' },
    { name: 'Accounting', href: '/accounting', icon: Calculator, key: 'accounting' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: { key?: ServiceKey }) => {
    if (item.key && !serviceAccess[item.key]) {
      e.preventDefault();
      navigate(`/preview/${item.key === 'roles' ? 'roles' : item.key}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background-light shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" style={{ marginLeft: 0, paddingLeft: 0 }}>
              <img
                src="https://mocha-cdn.com/0197f346-0f36-7457-8bb2-456a9982a967/vorniq_logo.jpg"
                alt="VorniQ"
                style={{ height: 200, width: 200, objectFit: 'contain', marginLeft: -80, paddingLeft: 0 }}
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={e => handleNavClick(e, item)}
                >
                  <IconComponent size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="bg-white border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary hover:text-white"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name || user.email} className="w-8 h-8 rounded-full border-2 border-primary" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {user.name ? user.name[0] : user.email[0]}
                  </div>
                )}
                <span className="font-semibold text-text-primary text-sm">{user.name || user.email}</span>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-text-primary focus:outline-none focus:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-light border-t border-gray-200">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={e => handleNavClick(e, item)}
                >
                  <IconComponent size={18} />
                  {item.name}
                </Link>
              );
            })}
            {!user ? (
              <>
                <button
                  className="w-full text-left bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                >
                  Login
                </button>
                <button
                  className="w-full text-left bg-white border border-primary text-primary px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-primary hover:text-white"
                  onClick={() => { setIsMenuOpen(false); navigate('/signup'); }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 mt-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name || user.email} className="w-8 h-8 rounded-full border-2 border-primary" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {user.name ? user.name[0] : user.email[0]}
                  </div>
                )}
                <span className="font-semibold text-text-primary text-base">{user.name || user.email}</span>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => { setIsMenuOpen(false); logout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
