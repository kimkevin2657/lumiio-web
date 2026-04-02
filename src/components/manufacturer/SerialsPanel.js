import React, { useEffect, useState } from 'react';
import { mfrSerialsApi } from '../../api';

const STATUS = ['manufactured', 'registered', 'activated', 'decommissioned'];

const SerialsPanel = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('');
  const [newSerial, setNewSerial] = useState({ serial: '', model: '', notes: '' });
  const [batchText, setBatchText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (model) q.set('model', model);
      if (status) q.set('status', status);
      const res = await mfrSerialsApi.list(q.toString());
      setItems(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load serials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const createSingle = async () => {
    await mfrSerialsApi.create({ ...newSerial, status: 'registered' });
    setNewSerial({ serial: '', model: '', notes: '' });
    await load();
  };

  const createBatch = async () => {
    const serials = batchText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [serial, parsedModel] = line.split(',').map((x) => x.trim());
        return { serial, model: parsedModel || newSerial.model || 'Unknown' };
      });
    await mfrSerialsApi.createBatch({ serials });
    setBatchText('');
    await load();
  };

  const updateStatus = async (id, nextStatus) => {
    await mfrSerialsApi.updateStatus(id, nextStatus);
    await load();
  };

  const deregister = async (id) => {
    await mfrSerialsApi.remove(id);
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search serial/model" className="p-2 border border-slate-200 rounded-lg" />
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model filter" className="p-2 border border-slate-200 rounded-lg" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border border-slate-200 rounded-lg">
          <option value="">All statuses</option>
          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={load} className="bg-blue-600 text-white rounded-lg px-4">Apply Filters</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Register Serial</h3>
          <input value={newSerial.serial} onChange={(e) => setNewSerial((p) => ({ ...p, serial: e.target.value }))} placeholder="Serial" className="w-full p-2 border rounded-lg" />
          <input value={newSerial.model} onChange={(e) => setNewSerial((p) => ({ ...p, model: e.target.value }))} placeholder="Model" className="w-full p-2 border rounded-lg" />
          <input value={newSerial.notes} onChange={(e) => setNewSerial((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="w-full p-2 border rounded-lg" />
          <button onClick={createSingle} className="bg-emerald-600 text-white rounded-lg px-3 py-2">Register</button>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Batch Register</h3>
          <p className="text-xs text-slate-500">Format: serial,model (one per line)</p>
          <textarea value={batchText} onChange={(e) => setBatchText(e.target.value)} rows={6} className="w-full p-2 border rounded-lg" />
          <button onClick={createBatch} className="bg-indigo-600 text-white rounded-lg px-3 py-2">Batch Upload</button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading ? (
        <div className="text-sm text-slate-500">Loading serials...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left py-2">Serial</th>
                <th className="text-left py-2">Model</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Device</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="py-2">{s.serial}</td>
                  <td className="py-2">{s.model}</td>
                  <td className="py-2">
                    <select value={s.status} onChange={(e) => updateStatus(s.id, e.target.value)} className="border rounded px-2 py-1">
                      {STATUS.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="py-2">{s.deviceId || '-'}</td>
                  <td className="py-2">
                    <button onClick={() => deregister(s.id)} className="text-red-600 hover:underline">Deregister</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SerialsPanel;
