import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Factory, Loader2, ArrowRight } from 'lucide-react';
import { mfrAuthApi } from '../api';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await mfrAuthApi.login(username, password);
      navigate('/manufacturer/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <div className="hidden lg:flex w-1/2 border-r border-slate-800 p-12 flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 mb-8 text-sm text-slate-300">
            <Factory size={16} /> Lumiio Manufacturer Console
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Superadmin Access for
            <br />
            Device Fleet Operations
          </h1>
          <p className="text-slate-400 mt-4 max-w-md">
            Manage serial lifecycle, issue and return workflows, and cross-tenant usage analytics.
          </p>
        </div>
        <div className="text-xs text-slate-500">Restricted access. Authorized superadmin users only.</div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white text-slate-900">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <ShieldCheck size={16} /> Manufacturer Login
          </div>
          <h2 className="text-3xl font-bold">Superadmin Sign In</h2>
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
