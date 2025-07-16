import Header from '@/react-app/components/Header';
import ServicesOverview from '@/react-app/components/ServicesOverview';
import Services from '@/react-app/components/Services';
import DemoRequest from '@/react-app/components/DemoRequest';
import { useSubscription } from '@/react-app/hooks/useSubscription';

export default function Home() {
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const isSubscribed = hasActiveSubscription && subscribedServices.length === 6;

  if (isSubscribed) {
    // Subscribed user main page (full access, no preview)
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 py-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center shadow-2xl rounded-b-3xl mb-12 overflow-hidden">
          <div className="max-w-3xl mx-auto z-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-text-primary mb-4 drop-shadow-lg">
              <span>Welcome </span>
              <span
                className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent relative inline-block shiny-gradient"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                VorniQ
                <span className="shine-effect" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                  mixBlendMode: 'screen',
                  animation: 'shine 2.5s infinite linear',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-accent font-semibold mb-4">
              You have full access to all services!
            </p>
            <p className="text-lg sm:text-xl text-text-secondary mb-6 leading-relaxed">
              Explore all features and manage your business with ease.<br/>
              Thank you for subscribing to <span className="font-semibold text-primary">VorniQ</span>.
            </p>
          </div>
        </section>
        <ServicesOverview />
        <Services />
        <DemoRequest />
      </div>
    );
  }

  // Non-subscriber main page (with preview/upsell)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Overlay: Meet VorniQ */}
      <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 py-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center shadow-2xl rounded-b-3xl mb-12 overflow-hidden">
        <div className="max-w-3xl mx-auto z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-text-primary mb-4 drop-shadow-lg">
            <span>Meet </span>
            <span
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent relative inline-block shiny-gradient"
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                position: 'relative',
                zIndex: 1
              }}
            >
              VorniQ
              <span className="shine-effect" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                mixBlendMode: 'screen',
                animation: 'shine 2.5s infinite linear',
                pointerEvents: 'none',
                zIndex: 2
              }} />
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl text-accent font-semibold mb-4">
            The World's Simplest Business ERP
          </p>
          <p className="text-lg sm:text-xl text-text-secondary mb-6 leading-relaxed">
            Finally, a business management system that doesn't require a PhD to operate.<br/>
            VorniQ is designed for <span className="font-semibold text-primary">startups and growing businesses</span> who need powerful features without the complexity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-xl mx-auto">
            <div className="bg-background px-6 py-3 rounded-xl text-base font-medium text-text-primary border border-primary-100 shadow-sm">🚀 Start in Minutes, Not Months</div>
            <div className="bg-background px-6 py-3 rounded-xl text-base font-medium text-text-primary border border-primary-100 shadow-sm">✨ Zero Learning Curve - Just Results</div>
            <div className="bg-background px-6 py-3 rounded-xl text-base font-medium text-text-primary border border-primary-100 shadow-sm">🎯 Built for Startups, By Entrepreneurs</div>
            <div className="bg-background px-6 py-3 rounded-xl text-base font-medium text-text-primary border border-primary-100 shadow-sm">⚡ Simple Yet Powerful - Perfect Balance</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#services" className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2 transition-colors shadow-lg">
              Get Started Free
            </a>
            <a href="#demo" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg">
              Watch Demo
            </a>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tr from-accent-50 to-primary-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3 z-0" />
      </section>
      <ServicesOverview />
      <Services />
      <DemoRequest />
    </div>
  );
}
