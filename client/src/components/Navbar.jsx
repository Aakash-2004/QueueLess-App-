import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-card bg-white/70 backdrop-blur-xl border-b border-gray-200/50 rounded-none shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">QueueLess</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <select 
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
              onChange={handleLanguageChange}
              defaultValue={localStorage.getItem('language') || 'en'}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
            </select>

            {token ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                  {t('nav_dashboard')}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                  {t('signin_btn')}
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  {t('join_btn')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
