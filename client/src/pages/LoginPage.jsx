import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.fullName);
      
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-[#fbfbfd]">
      <div className="glass-card w-full max-w-md p-10 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-2">Sign In</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">Access your QueueLess portal.</p>
        
        {error && <div className="mb-4 text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input 
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
              className="apple-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input 
              name="password"
              type="password"
              placeholder="Password"
              className="apple-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          New to QueueLess? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
