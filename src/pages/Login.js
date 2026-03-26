import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, ArrowRight, ShieldCheck, Loader2, UserPlus } from 'lucide-react';
import { authApi } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await authApi.register(username, password, displayName || username);
      } else {
        await authApi.login(username, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  const inputClass = (field) =>
    `w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all duration-200 ${
      focused === field ? 'border-blue-600 ring-4 ring-blue-50 bg-white' : 'border-slate-200 hover:border-slate-300'
    }`;

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left: Brand / Hero Section */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Lumiio</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Next Generation <br /> <span className="text-blue-400">Hematology Analysis</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            AI-powered precision for clinical diagnostics. Experience the future of blood analysis today.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck size={16} /> Secure Clinical Environment
        </div>
      </div>

      {/* Right: Login / Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500">
              {isRegister
                ? 'Create a new account to get started with Lumiio.'
                : 'Please enter your credentials to access the workspace.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Dr. Park"
                  className={inputClass('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">User ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass('id')}
                onFocus={() => setFocused('id')}
                onBlur={() => setFocused(null)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass('pw')}
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold p-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRegister ? (
                <><UserPlus size={18} /> Create Account</>
              ) : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? (
              <>Already have an account?{' '}
                <button onClick={toggleMode} className="text-blue-600 font-medium hover:underline">Sign In</button>
              </>
            ) : (
              <>Don't have an account?{' '}
                <button onClick={toggleMode} className="text-blue-600 font-medium hover:underline">Create Account</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
