import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

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

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your credentials to access the workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">User ID</label>
              <input 
                type="text" 
                defaultValue="doctor123"
                className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${focused === 'id' ? 'border-blue-600 ring-4 ring-blue-50 bg-white' : 'border-slate-200 hover:border-slate-300'}`}
                onFocus={() => setFocused('id')}
                onBlur={() => setFocused(null)}
              />
            </div>
            
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                defaultValue="password"
                className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${focused === 'pw' ? 'border-blue-600 ring-4 ring-blue-50 bg-white' : 'border-slate-200 hover:border-slate-300'}`}
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-400">
            Forgot your password? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;