import React, { useEffect, useState } from 'react';
import { mfrDevicesApi } from '../../api';

const CONNECTIONS = ['Online', 'Offline', 'Maintenance', 'Decommissioned'];

const DevicesPanel = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      const res = await mfrDevicesApi.list(q.toString());
      setItems(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const setStatus = async (deviceId, status) => {
    await mfrDevicesApi.updateStatus(deviceId, status);
    await load();
  };

  const openDetails = async (deviceId) => {
    const detail = await mfrDevicesApi.get(deviceId);
    setSelected(detail);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search devices" className="flex-1 p-2 border border-slate-200 rounded-lg" />
        <button onClick={load} className="px-4 bg-blue-600 text-white rounded-lg">Search</button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading ? (
        <div className="text-sm text-slate-500">Loading devices...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left py-2">Device ID</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Owner</th>
                <th className="text-left py-2">Serial</th>
                <th className="text-left py-2">Connection</th>
                <th className="text-left py-2">Last Sync</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="py-2">{d.id}</td>
                  <td className="py-2">{d.name}</td>
                  <td className="py-2">{d.owner?.displayName || d.owner?.username || '-'}</td>
                  <td className="py-2">{d.serial}</td>
                  <td className="py-2">
                    <select value={d.connection} onChange={(e) => setStatus(d.id, e.target.value)} className="border rounded px-2 py-1">
                      {CONNECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2">{d.lastSync || '-'}</td>
                  <td className="py-2">
                    <button onClick={() => openDetails(d.id)} className="text-blue-600 hover:underline">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Device Detail</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400">Close</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm mt-3">
            <div><span className="text-slate-500">Device ID:</span> {selected.id}</div>
            <div><span className="text-slate-500">Name:</span> {selected.name}</div>
            <div><span className="text-slate-500">Model:</span> {selected.model}</div>
            <div><span className="text-slate-500">Serial:</span> {selected.serial}</div>
            <div><span className="text-slate-500">Owner:</span> {selected.owner?.displayName || selected.owner?.username}</div>
            <div><span className="text-slate-500">Exam Count:</span> {selected.examCount}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPanel;
