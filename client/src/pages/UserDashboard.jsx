import { useState, useEffect } from 'react';
import api from '../services/api';

function UserDashboard() {
  const [services, setServices] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'tokens', 'complaints'
  
  // Complaint state
  const [complaintForm, setComplaintForm] = useState({ serviceType: '', complaintText: '' });
  const [complaintMsg, setComplaintMsg] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(''); // Added based on instruction
  const [prediction, setPrediction] = useState(null); // Added based on instruction

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchServices();
    fetchMyTokens();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (err) { console.error('Error fetching services', err); }
  };

  const fetchMyTokens = async () => {
    try {
      const { data } = await api.get(`/token/status/${userId}`);
      setMyTokens(data);
    } catch (err) { console.error('Error fetching tokens', err); }
  };

  const generateToken = async (serviceId) => {
    try {
      await api.post('/token/generate', { userId, serviceId });
      fetchMyTokens();
      
      // Fetch AI prediction for the service just booked
      const predRes = await api.get(`/token/predict/${serviceId}`);
      setPrediction(predRes.data);
      
      setActiveTab('tokens'); // Changed from 'status' to 'tokens' to match existing tab rendering
    } catch (err) { alert(err.response?.data?.message || 'Error generating token'); }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints/create', { userId, ...complaintForm });
      setComplaintMsg('Complaint submitted successfully');
      setComplaintForm({ serviceType: '', complaintText: '' });
      setTimeout(() => setComplaintMsg(''), 3000);
    } catch (err) { setComplaintMsg('Error submitting complaint'); }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {userName}</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your civic services intelligently.</p>
      </div>

      <div className="flex space-x-2 mb-8 animate-fade-in delay-100">
        <button onClick={() => setActiveTab('services')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'services' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Services</button>
        <button onClick={() => setActiveTab('tokens')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'tokens' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>My Tokens</button>
        <button onClick={() => setActiveTab('complaints')} className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'complaints' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Raise Complaint</button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
          {services.map(service => (
            <div key={service._id} className="glass-card p-6 flex flex-col justify-between hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.serviceName}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">{service.description}</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button onClick={() => generateToken(service._id)} className="w-full bg-blue-50 text-blue-700 font-semibold py-2.5 rounded-xl hover:bg-blue-100 transition-colors">Generate Token</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tokens Tab */}
      {activeTab === 'tokens' && (
        <div className="animate-fade-in delay-200">
          {myTokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium">You don't have any active tokens yet.</p>
              <button onClick={() => setActiveTab('services')} className="mt-4 text-blue-500 hover:text-blue-600 font-semibold transition-colors">
                Browse Services →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* AI Prediction Notice (shows if a token was just generated) */}
              {prediction && activeTab === 'tokens' && (
                <div className="bg-blue-50/50 backdrop-blur-md border border-blue-100 p-5 rounded-2xl mb-6 flex items-start gap-4">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <h4 className="font-bold text-blue-900 tracking-tight">AI Estimated Wait Time</h4>
                    <p className="text-sm text-blue-700 font-medium mt-1">Based on current queue length ({prediction.queueLength}) and historical service rates, your estimated wait time is <strong className="text-blue-900">{prediction.estimatedWaitText}</strong>.</p>
                  </div>
                </div>
              )}

              {myTokens.map(token => {
                const waitTime = token.queuePosition * 10; // 10 mins approx per person
                return (
                  <div key={token._id} className="glass-card p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start">
                    <div className="mb-4 sm:mb-0">
                      <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">{token.serviceId?.serviceName}</div>
                      <div className="text-4xl font-bold tracking-tight">{token.tokenNumber}</div>
                      <div className="text-gray-500 text-sm mt-2">Generated: {new Date(token.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex space-x-8 text-center bg-gray-50/80 p-4 rounded-2xl border border-gray-100 border-opacity-50">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{token.status}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Status</div>
                      </div>
                      {token.status === 'WAITING' && (
                        <>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{token.queuePosition}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Queue Pos</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">~{waitTime}m</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Wait Time</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="glass-card p-8 max-w-2xl mx-auto animate-fade-in delay-200">
          <h2 className="text-2xl font-bold mb-6">Raise a Complaint</h2>
          {complaintMsg && <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm">{complaintMsg}</div>}
          <form onSubmit={submitComplaint} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select 
                className="apple-input bg-white"
                value={complaintForm.serviceType}
                onChange={(e) => setComplaintForm({...complaintForm, serviceType: e.target.value})}
                required
              >
                <option value="">Select Service</option>
                {services.map(s => <option key={s._id} value={s.serviceName}>{s.serviceName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea 
                rows="4"
                className="apple-input bg-white resize-none"
                placeholder="Please describe the issue in detail..."
                value={complaintForm.complaintText}
                onChange={(e) => setComplaintForm({...complaintForm, complaintText: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-2">Submit Complaint</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
