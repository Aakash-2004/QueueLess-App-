import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminAnalytics from '../components/AdminAnalytics';

const DEPT_ICONS = {
  'Electricity Service': '⚡',
  'Gas Service': '🔥',
  'Water Service': '💧',
  'Property Service': '🏠',
  'Municipal Service': '🏛️',
};

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTokens: 0, totalComplaints: 0, activeTokens: 0, resolvedComplaints: 0, serviceUsage: [], complaintStats: [] });
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [queue, setQueue] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Read admin's department from localStorage (set at login)
  const adminDept = localStorage.getItem('adminDepartment') || '';
  const userName = localStorage.getItem('userName') || 'Admin';

  useEffect(() => {
    fetchStats();
    fetchServices();
  }, []);

  // Once services are loaded, auto-select the admin's department
  useEffect(() => {
    if (services.length > 0 && adminDept) {
      const match = services.find(s => s.serviceName === adminDept);
      if (match) {
        setSelectedServiceId(match._id);
        fetchQueue(match._id);
        fetchComplaints(match.serviceName);
      }
    }
  }, [services, adminDept]);

  useEffect(() => {
    if (selectedServiceId) fetchQueue(selectedServiceId);
  }, [selectedServiceId]);

  const fetchStats = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      
      setStats({
        totalUsers: statsRes.data.totalUsers || 0, // Keep existing stats fields
        totalTokens: statsRes.data.totalTokens || 0,
        totalComplaints: statsRes.data.totalComplaints || 0,
        activeTokens: statsRes.data.activeTokens || 0,
        resolvedComplaints: statsRes.data.resolvedComplaints || 0,
        serviceUsage: statsRes.data.serviceUsage || [],
        complaintStats: statsRes.data.complaintStats || []
      });
    } catch (err) { console.error(err); }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (err) { console.error(err); }
  };

  const fetchQueue = async (serviceId) => {
    try {
      const { data } = await api.get(`/token/service/${serviceId}`);
      setQueue(data);
    } catch (err) { console.error(err); }
  };

  const fetchComplaints = async (serviceType) => {
    try {
      const { data } = await api.get(`/complaints/admin?serviceType=${encodeURIComponent(serviceType || adminDept)}`);
      setComplaints(data);
    } catch (err) { console.error(err); }
  };

  const updateTokenStatus = async (tokenId, status) => {
    try {
      await api.put(`/token/update/${tokenId}`, { status });
      fetchQueue(selectedServiceId);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const updateComplaintStatus = async (compId, status) => {
    try {
      await api.put(`/complaints/update/${compId}`, { status });
      fetchComplaints(adminDept);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const deptIcon = DEPT_ICONS[adminDept] || '🏢';

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{deptIcon}</span>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{adminDept}</h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">Welcome, {userName} · Department Admin</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center glass-card px-5 py-3">
            <div className="text-2xl font-bold text-blue-600">{queue.length}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Active Queue</div>
          </div>
          <div className="text-center glass-card px-5 py-3">
            <div className="text-2xl font-bold text-red-500">{complaints.filter(c => c.status === 'OPEN').length}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Open Issues</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 animate-fade-in delay-100 overflow-x-auto pb-2">
        {['overview', 'queue', 'complaints'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium capitalize transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'queue' ? 'Live Queue' : 'Complaints'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in delay-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
              <h3 className="text-4xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-indigo-500 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Tokens</p>
              <h3 className="text-4xl font-bold text-gray-900">{stats.totalTokens}</h3>
              <p className="text-xs text-indigo-600 mt-2 font-medium">{stats.activeTokens} Currently Queued</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-red-500 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Complaints</p>
              <h3 className="text-4xl font-bold text-gray-900">{stats.totalComplaints}</h3>
              <p className="text-xs text-green-600 mt-2 font-medium">{stats.resolvedComplaints} Resolved</p>
            </div>
          </div>
          
          {/* Global Analytics Dashboard Component */}
          <AdminAnalytics stats={stats} />
        </div>
      )}

      {/* QUEUE TAB */}
      {activeTab === 'queue' && (
        <div className="glass-card p-6 animate-fade-in delay-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Queue — {adminDept}</h2>
              <p className="text-sm text-gray-500 mt-1">{queue.length} citizens waiting</p>
            </div>
            {/* Allow switching service only if needed */}
            <select
              className="apple-input py-2 px-4 max-w-xs text-sm"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              {services.map(s => <option key={s._id} value={s._id}>{s.serviceName}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Pos</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Token</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Citizen</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.length === 0 && (
                  <tr><td colSpan="5" className="py-12 text-center text-gray-400">No active tokens in queue for this department.</td></tr>
                )}
                {queue.map(t => (
                  <tr key={t._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm flex items-center justify-center">{t.queuePosition}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600 text-lg">{t.tokenNumber}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-semibold text-gray-900">{t.userId?.fullName}</div>
                      <div className="text-xs text-gray-400">{t.userId?.phoneNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'SERVING' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      {t.status === 'WAITING' && (
                        <button onClick={() => updateTokenStatus(t._id, 'SERVING')} className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-colors border border-blue-200">
                          📣 Call
                        </button>
                      )}
                      {t.status === 'SERVING' && (
                        <button onClick={() => updateTokenStatus(t._id, 'COMPLETED')} className="text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 px-4 py-1.5 rounded-lg transition-colors border border-green-200">
                          ✅ Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div className="glass-card p-6 animate-fade-in delay-200 overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Complaints — {adminDept}</h2>
            <p className="text-sm text-gray-500 mt-1">Only complaints raised for your department are shown</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Citizen</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider w-1/3">Issue</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 && (
                  <tr><td colSpan="5" className="py-12 text-center text-gray-400">No complaints for this department.</td></tr>
                )}
                {complaints.map(c => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-4">
                      <div className="text-sm font-semibold text-gray-900">{c.userId?.fullName}</div>
                      <div className="text-xs text-gray-400">{c.userId?.phoneNumber}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{c.complaintText}</td>
                    <td className="py-4 px-4 text-xs text-gray-400 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : c.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      {c.status === 'OPEN' && (
                        <button onClick={() => updateComplaintStatus(c._id, 'IN_PROGRESS')} className="text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
                          🔍 Investigate
                        </button>
                      )}
                      {c.status === 'IN_PROGRESS' && (
                        <button onClick={() => updateComplaintStatus(c._id, 'RESOLVED')} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                          ✅ Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
