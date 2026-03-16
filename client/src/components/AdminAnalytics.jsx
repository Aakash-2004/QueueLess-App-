import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
const COMPLAINT_COLORS = { 'OPEN': '#ef4444', 'IN_PROGRESS': '#f59e0b', 'RESOLVED': '#10b981' };

function AdminAnalytics({ stats }) {
  if (!stats || !stats.serviceUsage) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in delay-200 mb-8 mt-6">
      
      {/* Service Usage Bar Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Service Usage Distribution</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.serviceUsage} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" name="Tokens Generated" radius={[6, 6, 0, 0]}>
                {stats.serviceUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complaint Status Pie Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Complaint Resolution Status</h3>
        <div className="h-80 w-full flex justify-center items-center">
          {stats.complaintStats && stats.complaintStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.complaintStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.complaintStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPLAINT_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 font-medium items-center justify-center flex h-full">No complaint data available</div>
          )}
        </div>
      </div>

    </div>
  );
}

export default AdminAnalytics;
