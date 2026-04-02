import React, { useEffect, useState } from 'react';
import { mfrStatsApi } from '../../api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed'];

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <div className="text-xs uppercase text-slate-500 font-semibold">{label}</div>
    <div className="text-2xl font-bold text-slate-900 mt-2">{value}</div>
  </div>
);

const OverviewPanel = () => {
  const [overview, setOverview] = useState(null);
  const [regSeries, setRegSeries] = useState([]);
  const [usage, setUsage] = useState({ topDevices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const [o, r, u] = await Promise.all([
          mfrStatsApi.overview(),
          mfrStatsApi.registrations(),
          mfrStatsApi.usage(),
        ]);
        if (cancel) return;
        setOverview(o);
        setRegSeries(r.series || []);
        setUsage(u || { topDevices: [] });
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Loading overview...</div>;
  if (!overview) return <div className="text-sm text-red-500">Failed to load overview.</div>;

  const statusData = Object.entries(overview.serialsByStatus || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Serials" value={Object.values(overview.serialsByStatus || {}).reduce((a, b) => a + b, 0)} />
        <StatCard label="Active Devices" value={overview.devicesByConnection?.Online || 0} />
        <StatCard label="Open Issues" value={overview.openIssues || 0} />
        <StatCard label="Pending Returns" value={overview.pendingReturns || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Registration and Activation Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={regSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="registered" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="activated" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Serial Status Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Top Active Devices</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left py-2">Device</th>
                <th className="text-left py-2">Model</th>
                <th className="text-left py-2">Serial</th>
                <th className="text-right py-2">Exam Count</th>
              </tr>
            </thead>
            <tbody>
              {(usage.topDevices || []).map((d) => (
                <tr key={d.deviceId} className="border-t border-slate-100">
                  <td className="py-2">{d.name}</td>
                  <td className="py-2">{d.model}</td>
                  <td className="py-2">{d.serial}</td>
                  <td className="py-2 text-right font-semibold">{d.examCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
