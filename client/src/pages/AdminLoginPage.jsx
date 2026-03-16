import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DEPARTMENTS = [
  { id: 'Electricity Service', label: '⚡ Electricity Service' },
  { id: 'Gas Service', label: '🔥 Gas Service' },
  { id: 'Water Service', label: '💧 Water Service' },
  { id: 'Property Service', label: '🏠 Property Service' },
  { id: 'Municipal Service', label: '🏛️ Municipal Service' },
];

function AdminLoginPage() {
  const navigate = useNavigate();
  // Step 1 = credentials, Step 2 = select department
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [selectedDept, setSelectedDept] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Authenticate admin credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin-login', formData);
      setAdminData(data);
      setStep(2); // Move to department selection
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select department and proceed to dashboard
  const handleDepartmentSelect = () => {
    if (!selectedDept) {
      setError('Please select a department to continue.');
      return;
    }
    localStorage.setItem('token', adminData.token);
    localStorage.setItem('role', adminData.role);
    localStorage.setItem('userId', adminData._id);
    localStorage.setItem('userName', adminData.fullName);
    localStorage.setItem('adminDepartment', selectedDept); // ← Save selected dept
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md p-10 animate-fade-in bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl">

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>1</div>
          <div className={`w-12 h-0.5 transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>2</div>
        </div>

        {/* Step 1: Credentials */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-center text-white mb-2">Admin Portal</h2>
            <p className="text-gray-400 text-center mb-8 font-medium">Enter your admin credentials</p>

            {error && <div className="mb-4 text-red-400 text-center text-sm bg-red-900/30 p-3 rounded-lg border border-red-800">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                name="username"
                type="text"
                placeholder="Admin Username"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue →'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Department Selection */}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-center text-white mb-2">Select Department</h2>
            <p className="text-gray-400 text-center mb-8 font-medium">Welcome, <span className="text-white font-semibold">{adminData?.fullName}</span>. Choose your department to manage.</p>

            {error && <div className="mb-4 text-red-400 text-center text-sm bg-red-900/30 p-3 rounded-lg border border-red-800">{error}</div>}

            <div className="space-y-3 mb-8">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`w-full px-5 py-4 rounded-2xl text-left font-semibold transition-all border-2 ${
                    selectedDept === dept.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-750'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleDepartmentSelect}
              className="btn-primary w-full py-3"
              disabled={!selectedDept}
            >
              Enter Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminLoginPage;
