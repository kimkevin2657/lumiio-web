import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mfrAuthApi, superadminApi } from '../api';
import OverviewPanel from '../components/manufacturer/OverviewPanel';
import SerialsPanel from '../components/manufacturer/SerialsPanel';
import DevicesPanel from '../components/manufacturer/DevicesPanel';
import IssuesPanel from '../components/manufacturer/IssuesPanel';
import ReturnsPanel from '../components/manufacturer/ReturnsPanel';
import UsersPanel from '../components/manufacturer/UsersPanel';

const sections = [
  { key: 'overview', label: 'Overview' },
  { key: 'serials', label: 'Serial Numbers' },
  { key: 'devices', label: 'Devices' },
  { key: 'issues', label: 'Issues' },
  { key: 'returns', label: 'Returns' },
  { key: 'users', label: 'Users' },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!superadminApi.isLoggedIn()) {
      navigate('/manufacturer/login');
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const me = await mfrAuthApi.me();
        if (!cancel) setAdmin(me.superadmin || null);
      } catch {
        navigate('/manufacturer/login');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [navigate]);

  const content = useMemo(() => {
    if (active === 'overview') return <OverviewPanel />;
    if (active === 'serials') return <SerialsPanel />;
    if (active === 'devices') return <DevicesPanel />;
    if (active === 'issues') return <IssuesPanel />;
    if (active === 'returns') return <ReturnsPanel />;
    if (active === 'users') return <UsersPanel />;
    return null;
  }, [active]);

  const logout = async () => {
    try { await mfrAuthApi.logout(); } catch { }
    navigate('/manufacturer/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-200 p-4">
        <div className="text-lg font-bold mb-6">Manufacturer Console</div>
        <nav className="space-y-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                active === s.key ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="font-semibold text-slate-800">{sections.find((s) => s.key === active)?.label}</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">{admin?.displayName || admin?.username || 'Superadmin'}</div>
            <button onClick={logout} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50">
              Logout
            </button>
          </div>
        </header>
        <div className="p-6">{content}</div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
