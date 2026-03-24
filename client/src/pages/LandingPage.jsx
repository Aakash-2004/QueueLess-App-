import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function LandingPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 drop-shadow-sm">
          {t('hero_title')}<br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            {t('hero_subtitle')}
          </span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-500 max-w-3xl mb-12 font-medium">
          {t('hero_desc')}
        </p>
        <div className="flex space-x-4 animate-fade-in delay-200">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            {t('join_btn')}
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4">
            {t('signin_btn')}
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">The ultimate service experience Demo.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass-card bg-gray-50/50 p-10 flex flex-col items-center text-center transform transition-transform duration-500 hover:scale-[1.03]">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Save Time</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Generate your token remotely and arrive exactly when it's your turn. No more endless waiting rooms.</p>
            </div>
            
            <div className="glass-card bg-gray-50/50 p-10 flex flex-col items-center text-center transform transition-transform duration-500 hover:scale-[1.03]">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Track Live</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Watch the queue progress in real-time. We'll update your estimated waiting time automatically.</p>
            </div>

            <div className="glass-card bg-gray-50/50 p-10 flex flex-col items-center text-center transform transition-transform duration-500 hover:scale-[1.03]">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Resolve Issues</h3>
              <p className="text-gray-500 font-medium leading-relaxed">File complaints instantly directly to the department and track the resolution progress seamlessly.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-100 mt-auto">
        <p>&copy; 2026 QueueLess. All rights reserved.</p>
        <Link to="/admin-login" className="text-gray-300 hover:text-gray-500 text-xs mt-2 inline-block">Admin Portal</Link>
      </footer>
    </div>
  );
}

export default LandingPage;
