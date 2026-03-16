import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    fullName: '', 
    phoneNumber: '', 
    address: '', 
    ebConnectionNumber: '', 
    gasConnectionNumber: '', 
    propertyPhoneNumber: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.fullName);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 flex items-center justify-center bg-[#fbfbfd]">
      <div className="glass-card w-full max-w-xl p-10 animate-fade-in my-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">Join QueueLess for a seamless experience.</p>
        
        {error && <div className="mb-4 text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="fullName" type="text" placeholder="Full Name" className="apple-input" value={formData.fullName} onChange={handleChange} required />
            <input name="phoneNumber" type="tel" placeholder="Phone Number" className="apple-input" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          
          <input name="address" type="text" placeholder="Full Address" className="apple-input" value={formData.address} onChange={handleChange} required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="ebConnectionNumber" type="text" placeholder="EB Connection Number" className="apple-input" value={formData.ebConnectionNumber} onChange={handleChange} required />
            <input name="gasConnectionNumber" type="text" placeholder="Gas Connection Number" className="apple-input" value={formData.gasConnectionNumber} onChange={handleChange} required />
          </div>
          
          <input name="propertyPhoneNumber" type="tel" placeholder="Property Contact Number" className="apple-input" value={formData.propertyPhoneNumber} onChange={handleChange} required />
          
          <input name="password" type="password" placeholder="Create Password" className="apple-input" value={formData.password} onChange={handleChange} required />
          
          <button type="submit" className="btn-primary w-full py-3 mt-6" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
