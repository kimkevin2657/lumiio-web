import React, { useEffect, useState } from 'react';
import { mfrReturnsApi, mfrIssuesApi, mfrSerialsApi } from '../../api';

const statuses = ['Requested', 'Shipped', 'Received', 'Inspected', 'Completed'];

const ReturnsPanel = () => {
  const [items, setItems] = useState([]);
  const [issues, setIssues] = useState([]);
  const [serials, setSerials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ issue_id: '', serial_number_id: '', reason: '' });

  const load = async () => {
    const [r, i, s] = await Promise.all([mfrReturnsApi.list(), mfrIssuesApi.list(), mfrSerialsApi.list()]);
    setItems(r.items || []);
    setIssues(i.items || []);
    setSerials(s.items || []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const create = async () => {
    await mfrReturnsApi.create({
      issue_id: Number(form.issue_id),
      serial_number_id: Number(form.serial_number_id),
      reason: form.reason,
    });
    setForm({ issue_id: '', serial_number_id: '', reason: '' });
    await load();
  };

  const patch = async (id, payload) => {
    await mfrReturnsApi.update(id, payload);
    await load();
    if (selected?.id === id) {
      const detail = await mfrReturnsApi.get(id);
      setSelected(detail);
    }
  };

  const open = async (id) => setSelected(await mfrReturnsApi.get(id));

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <select value={form.issue_id} onChange={(e) => setForm((p) => ({ ...p, issue_id: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">Issue</option>
          {issues.map((i) => <option key={i.id} value={i.id}>#{i.id} {i.title}</option>)}
        </select>
        <select value={form.serial_number_id} onChange={(e) => setForm((p) => ({ ...p, serial_number_id: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">Serial</option>
          {serials.map((s) => <option key={s.id} value={s.id}>{s.serial}</option>)}
        </select>
        <input value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Return reason" className="p-2 border rounded-lg" />
        <button onClick={create} className="bg-emerald-600 text-white rounded-lg px-3 py-2 lg:col-span-3">Create Return Request</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Issue</th>
              <th className="text-left py-2">Serial</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Tracking</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="py-2">{r.id}</td>
                <td className="py-2">{r.issueId}</td>
                <td className="py-2">{r.serial}</td>
                <td className="py-2">
                  <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} className="border rounded px-2 py-1">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-2">
                  <input
                    defaultValue={r.trackingNumber}
                    onBlur={(e) => patch(r.id, { trackingNumber: e.target.value })}
                    className="border rounded px-2 py-1"
                    placeholder="Tracking"
                  />
                </td>
                <td className="py-2"><button onClick={() => open(r.id)} className="text-blue-600 hover:underline">Detail</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Return #{selected.id}</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400">Close</button>
          </div>
          <div className="mt-3 text-sm space-y-1">
            <div><span className="text-slate-500">Issue:</span> {selected.issueId}</div>
            <div><span className="text-slate-500">Serial:</span> {selected.serial}</div>
            <div><span className="text-slate-500">Status:</span> {selected.status}</div>
            <div><span className="text-slate-500">Reason:</span> {selected.reason}</div>
            <div><span className="text-slate-500">Tracking:</span> {selected.trackingNumber || '-'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsPanel;
