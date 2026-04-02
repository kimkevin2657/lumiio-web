import React, { useEffect, useState } from 'react';
import { mfrUsersApi } from '../../api';

const UsersPanel = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    const res = await mfrUsersApi.list(q.toString());
    setItems(res.items || []);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const open = async (id) => setSelected(await mfrUsersApi.get(id));

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="flex-1 p-2 border rounded-lg" />
        <button onClick={load} className="bg-blue-600 text-white rounded-lg px-4">Search</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">Username</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Role</th>
              <th className="text-right py-2">Devices</th>
              <th className="text-right py-2">Exams</th>
              <th className="text-left py-2">Last Active</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="py-2">{u.username}</td>
                <td className="py-2">{u.displayName}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2 text-right">{u.deviceCount}</td>
                <td className="py-2 text-right">{u.examCount}</td>
                <td className="py-2">{u.lastActive || '-'}</td>
                <td className="py-2"><button onClick={() => open(u.id)} className="text-blue-600 hover:underline">Detail</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <h3 className="font-semibold">User Detail</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400">Close</button>
          </div>
          <div className="text-sm">
            <div><span className="text-slate-500">Name:</span> {selected.user.displayName}</div>
            <div><span className="text-slate-500">Username:</span> {selected.user.username}</div>
            <div><span className="text-slate-500">Role:</span> {selected.user.role}</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h4 className="text-sm font-semibold mb-2">Devices</h4>
              <ul className="text-sm space-y-1">
                {(selected.devices || []).map((d) => <li key={d.id}>{d.id} - {d.name} ({d.serial})</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent Exams</h4>
              <ul className="text-sm space-y-1">
                {(selected.recentExams || []).map((e) => <li key={e.id}>{e.id} - {e.date}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
