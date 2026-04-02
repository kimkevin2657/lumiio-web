import React, { useEffect, useState } from 'react';
import { mfrIssuesApi, mfrSerialsApi } from '../../api';

const categories = ['Hardware', 'Software', 'Calibration', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

const IssuesPanel = () => {
  const [issues, setIssues] = useState([]);
  const [serials, setSerials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', search: '' });
  const [form, setForm] = useState({
    serial_number_id: '',
    category: 'Hardware',
    priority: 'Medium',
    title: '',
    description: '',
  });

  const load = async () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) query.set(k, v); });
    const [iRes, sRes] = await Promise.all([
      mfrIssuesApi.list(query.toString()),
      mfrSerialsApi.list(),
    ]);
    setIssues(iRes.items || []);
    setSerials(sRes.items || []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const create = async () => {
    await mfrIssuesApi.create({ ...form, serial_number_id: Number(form.serial_number_id) });
    setForm({ serial_number_id: '', category: 'Hardware', priority: 'Medium', title: '', description: '' });
    await load();
  };

  const open = async (id) => {
    const d = await mfrIssuesApi.get(id);
    setSelected(d);
  };

  const addComment = async () => {
    if (!selected || !comment.trim()) return;
    await mfrIssuesApi.addComment(selected.id, comment);
    setComment('');
    await open(selected.id);
    await load();
  };

  const patchIssue = async (id, payload) => {
    await mfrIssuesApi.update(id, payload);
    await load();
    if (selected?.id === id) await open(id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-5 gap-2">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search issues" className="p-2 border rounded-lg" />
        <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">All status</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">All category</option>{categories.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">All priority</option>{priorities.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={load} className="bg-blue-600 text-white rounded-lg px-4">Apply</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <select value={form.serial_number_id} onChange={(e) => setForm((p) => ({ ...p, serial_number_id: e.target.value }))} className="p-2 border rounded-lg">
          <option value="">Select serial</option>
          {serials.map((s) => <option key={s.id} value={s.id}>{s.serial} ({s.model})</option>)}
        </select>
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Issue title" className="p-2 border rounded-lg" />
        <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="p-2 border rounded-lg">
          {categories.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))} className="p-2 border rounded-lg">
          {priorities.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3} className="p-2 border rounded-lg lg:col-span-2" />
        <button onClick={create} className="bg-emerald-600 text-white rounded-lg px-4 py-2 lg:col-span-2">Create Issue</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Priority</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id} className="border-t border-slate-100">
                <td className="py-2">{i.id}</td>
                <td className="py-2">{i.title}</td>
                <td className="py-2">{i.category}</td>
                <td className="py-2">{i.priority}</td>
                <td className="py-2">
                  <select value={i.status} onChange={(e) => patchIssue(i.id, { status: e.target.value })} className="border rounded px-2 py-1">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-2"><button onClick={() => open(i.id)} className="text-blue-600 hover:underline">Detail</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Issue #{selected.id}</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400">Close</button>
          </div>
          <div className="text-sm text-slate-700">{selected.description}</div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Comments</h4>
            {(selected.comments || []).map((c) => (
              <div key={c.id} className="text-sm border border-slate-200 rounded-lg p-2">
                <div className="text-xs text-slate-500">{c.superAdminName}</div>
                {c.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment" className="flex-1 p-2 border rounded-lg" />
            <button onClick={addComment} className="bg-blue-600 text-white rounded-lg px-3">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesPanel;
