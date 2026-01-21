import React, { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ZoomIn, Maximize, Edit3, Save, Check } from 'lucide-react';
import { CBC_DATA, CELL_SUMMARY } from '../data';

// --- Shared Components ---
const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

// --- 1. CBC Tab (Clean Table & Charts) ---
export const CBCTab = () => {
  const rbcData = Array.from({ length: 40 }, (_, i) => ({ name: i, value: Math.exp(-Math.pow(i - 20, 2) / 40) * 1000 }));
  
  return (
    <div className="grid grid-cols-12 gap-6 h-full fade-in">
      {/* Table */}
      <Card className="col-span-8 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Test Item</th>
                        <th className="px-6 py-3 font-semibold">Result</th>
                        <th className="px-6 py-3 font-semibold">Unit</th>
                        <th className="px-6 py-3 font-semibold">Ref. Range</th>
                        <th className="px-6 py-3 font-semibold text-center">Flag</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {CBC_DATA.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-2.5 font-medium text-slate-700">{row.item}</td>
                            <td className="px-6 py-2.5 font-bold text-slate-800">{row.result}</td>
                            <td className="px-6 py-2.5 text-slate-400 text-xs">{row.unit}</td>
                            <td className="px-6 py-2.5 text-slate-500">{row.range}</td>
                            <td className="px-6 py-2.5 text-center">
                                {row.flag && (
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                        row.flag === 'H' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {row.flag}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

      {/* Histograms */}
      <div className="col-span-4 flex flex-col gap-6">
        <Card className="p-5 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">RBC Distribution</h4>
            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rbcData}>
                        <defs>
                            <linearGradient id="colorRbc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRbc)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card className="p-5 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PLT Distribution</h4>
            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rbcData}> {/* Reusing mock data for visual */}
                        <defs>
                            <linearGradient id="colorPlt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis hide /> <YAxis hide />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorPlt)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};

// --- 2. Cell Classification (Gallery Style) ---
export const CellTab = () => {
  // CSS Magic to make divs look like blood cells
  const BloodCell = ({ size = "md" }) => {
    const s = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
    return (
        <div className={`${s} rounded-full relative overflow-hidden shadow-inner group cursor-pointer transition-transform hover:scale-105`}>
            {/* Cytoplasm */}
            <div className="absolute inset-0 bg-purple-100/50"></div>
            {/* Nucleus (Simulated) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600/80 rounded-full blur-[2px] shadow-lg"></div>
            {/* Highlight */}
            <div className="absolute top-2 right-2 w-1/3 h-1/3 bg-white/30 rounded-full blur-md"></div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-6 fade-in">
        {/* Header Stats */}
        <div className="flex gap-4">
            {[
                { label: 'WBC Count', val: CELL_SUMMARY.wbc, sub: 'High Confidence' },
                { label: 'RBC Count', val: CELL_SUMMARY.rbc, sub: 'Normal Range' },
                { label: 'PLT Count', val: CELL_SUMMARY.plt, sub: 'Check Morphology' }
            ].map((stat, i) => (
                <Card key={i} className="flex-1 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">{stat.label}</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{stat.val}</div>
                    </div>
                    <div className="text-right">
                         <span className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">{stat.sub}</span>
                    </div>
                </Card>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            {/* Gallery */}
            <Card className="col-span-8 p-6 overflow-y-auto">
                {['Granulocyte', 'Lymphocyte', 'Monocyte'].map((type) => (
                    <div key={type} className="mb-8">
                        <div className="flex justify-between items-end mb-3 border-b border-slate-100 pb-2">
                            <h4 className="font-bold text-slate-700">{type}</h4>
                            <span className="text-xs text-slate-400">18 cells found</span>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <BloodCell />
                                    <span className="text-[10px] text-slate-400">0.98</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Card>

            {/* Inspector */}
            <div className="col-span-4 flex flex-col gap-6">
                <Card className="p-6 flex flex-col items-center flex-1">
                    <h4 className="text-sm font-bold text-slate-700 w-full mb-6 flex items-center gap-2">
                        <ZoomIn size={16} /> Cell Inspector
                    </h4>
                    
                    <div className="w-48 h-48 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center mb-6 relative">
                         {/* Large detailed cell */}
                         <div className="w-32 h-32 bg-purple-200/50 rounded-full relative blur-[1px]">
                             <div className="absolute inset-0 bg-purple-600/20 rounded-full animate-pulse"></div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-16 bg-purple-700 rounded-full blur-[4px]"></div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-16 bg-purple-700 rounded-full blur-[4px] rotate-45"></div>
                         </div>
                         {/* Crosshair */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                             <div className="w-full h-[1px] bg-slate-900"></div>
                             <div className="h-full w-[1px] bg-slate-900 absolute"></div>
                         </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-slate-500">AI Confidence</span>
                            <span className="font-bold text-slate-800">92.4%</span>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Re-classify</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['GRA', 'LYM', 'MON', 'ART'].map(l => (
                                    <button key={l} className="py-2 text-sm border border-slate-200 rounded hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full bg-slate-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-900 flex items-center justify-center gap-2">
                            <Check size={16} /> Confirm Classification
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

// --- 3. Viewer Tab (The Microscope) ---
export const ViewerTab = () => {
    // This style simulates a high-res microscope slide background
    const slideStyle = {
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#f8fafc'
    };

    return (
        <div className="h-full flex gap-6 fade-in">
            {/* Thumbnails */}
            <div className="w-32 flex flex-col gap-3 h-full overflow-y-auto pr-1">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${i===1 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="w-full h-full bg-slate-100 relative opacity-70" style={slideStyle}>
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-500/50 rounded-full blur-[1px]"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Canvas */}
            <Card className="flex-1 relative overflow-hidden group">
                <div className="absolute inset-0 cursor-crosshair" style={slideStyle}>
                    {/* Simulated scattered cells */}
                    {Array.from({length: 20}).map((_, i) => (
                        <div key={i} 
                            className="absolute w-4 h-4 bg-purple-600/40 rounded-full blur-[1px]"
                            style={{ top: `${Math.random()*90}%`, left: `${Math.random()*90}%` }}
                        ></div>
                    ))}
                    
                    {/* Viewport Rect (The "Zoomed" area) */}
                    <div className="absolute top-1/3 left-1/3 w-64 h-48 border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(255,255,255,0.5)] pointer-events-none">
                        <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-1">100x</div>
                    </div>
                </div>

                {/* Floating Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-full shadow-lg flex gap-4">
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ZoomIn size={20} className="text-slate-600"/></button>
                    <div className="w-[1px] bg-slate-300 h-full"></div>
                    <input type="range" className="w-32 accent-blue-600" />
                    <div className="w-[1px] bg-slate-300 h-full"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-full"><Maximize size={20} className="text-slate-600"/></button>
                </div>
            </Card>
        </div>
    );
};