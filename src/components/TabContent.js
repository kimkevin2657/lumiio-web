import React, { useState, useRef, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip, ReferenceLine, Label, ComposedChart 
} from 'recharts';
import { ZoomIn, Maximize, Check, ChevronDown, ChevronRight, AlertCircle, Play, Scan } from 'lucide-react';
import { CBC_DATA } from '../data';

// --- Shared Components ---
const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

// --- 1. CBC Tab (Kept with Axis Labels & RDW Annotations) ---
export const CBCTab = () => {
  const rbcData = Array.from({ length: 120 }, (_, i) => {
    const x = i + 40; 
    const mean = 92;
    const stdDev = 14;
    const value = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) * 5000;
    return { name: x, value: value };
  });

  return (
    <div className="grid grid-cols-12 gap-6 h-full fade-in">
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

      <div className="col-span-4 flex flex-col gap-6">
        <Card className="p-4 flex-1 flex flex-col">
            <h4 className="text-sm font-bold text-slate-700 mb-2">RBC Distribution</h4>
            <div className="flex-1 min-h-[180px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={rbcData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorRbc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{fontSize: 10}} interval={20} type="number" domain={[40, 150]}>
                            <Label value="Mean cell volume (fL)" position="insideBottom" offset={-10} style={{ fontSize: '11px', fontWeight: 600, fill: '#64748b' }} />
                        </XAxis>
                        <YAxis tick={false}>
                             <Label value="Frequency (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '11px', fontWeight: 600, fill: '#64748b' }} />
                        </YAxis>
                        <Tooltip />
                        <ReferenceLine segment={[{ x: 78, y: 85 }, { x: 106, y: 85 }]} stroke="#f59e0b" strokeWidth={2} />
                        <ReferenceLine y={85} stroke="none"><Label value="Histogram width / MCV = RDW-CV" position="top" offset={5} fill="#f59e0b" fontSize={10} fontWeight="bold"/></ReferenceLine>
                        <ReferenceLine segment={[{ x: 68, y: 28 }, { x: 116, y: 28 }]} stroke="#ef4444" strokeWidth={2} />
                        <ReferenceLine y={28} stroke="none"><Label value="RDW-SD (20% Level)" position="right" offset={100} fill="#ef4444" fontSize={10} fontWeight="bold" /></ReferenceLine>
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRbc)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
        
        <Card className="p-4 flex-1 flex flex-col">
            <h4 className="text-sm font-bold text-slate-700 mb-2">PLT Distribution</h4>
            <div className="flex-1 min-h-[150px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rbcData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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

// --- 2. Cell Classification (Kept with Collapsible logic) ---
export const CellTab = () => {
  const [cells, setCells] = useState([
      ...Array.from({ length: 45 }, (_, i) => ({ id: `g-${i}`, type: 'Granulocyte', conf: 0.98 })),
      ...Array.from({ length: 18 }, (_, i) => ({ id: `l-${i}`, type: 'Lymphocyte', conf: 0.95 })),
      ...Array.from({ length: 7 }, (_, i) => ({ id: `m-${i}`, type: 'Monocyte', conf: 0.92 })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: `u-${i}`, type: 'Uncertain', conf: 0.45 })),
  ]);

  const [expandedSections, setExpandedSections] = useState({
      Granulocyte: true,
      Lymphocyte: false,
      Monocyte: true,
      Uncertain: true
  });

  const [selectedCellId, setSelectedCellId] = useState(null);

  const toggleSection = (type) => {
      setExpandedSections(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getCount = (type) => cells.filter(c => c.type === type).length;
  const totalWBC = cells.length;

  const BloodCell = ({ type, isSelected, onClick }) => {
    let color = 'bg-purple-100/50';
    let core = 'bg-purple-600/80';
    if(type === 'Uncertain') { color = 'bg-amber-100/50'; core = 'bg-amber-600/80'; }

    return (
        <div 
            onClick={onClick}
            className={`w-16 h-16 rounded-full relative overflow-hidden shadow-inner group cursor-pointer transition-all duration-200 
            ${isSelected ? 'ring-4 ring-blue-400 scale-110 z-10' : 'hover:scale-105'}`}
        >
            <div className={`absolute inset-0 ${color}`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] ${core} rounded-full blur-[2px] shadow-lg`}></div>
            <div className="absolute top-2 right-2 w-1/3 h-1/3 bg-white/30 rounded-full blur-md"></div>
        </div>
    );
  };

  const categories = ['Granulocyte', 'Lymphocyte', 'Monocyte', 'Uncertain'];
  const selectedCellData = cells.find(c => c.id === selectedCellId) || cells[0];

  return (
    <div className="flex flex-col h-full gap-6 fade-in">
        <div className="flex gap-4">
             <Card className="flex-[2] p-5 flex flex-col justify-center relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">WBC Count</div>
                        <div className="text-3xl font-bold text-slate-800">{totalWBC}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full font-bold border border-green-100">High Confidence</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-sm font-medium text-slate-600">
                        <span className="font-bold text-slate-900">WBC Count {totalWBC}</span>
                        <div className="mt-1 text-slate-500">
                            GRA {getCount('Granulocyte')} / LYM {getCount('Lymphocyte')} / MON {getCount('Monocyte')} / Uncertain {getCount('Uncertain')}
                        </div>
                    </div>
                </div>
             </Card>
             <Card className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="text-xs text-slate-500 font-bold uppercase">RBC Count</div>
                    <span className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full font-bold">Normal</span>
                </div>
                <div className="text-3xl font-bold text-slate-800">2041</div>
             </Card>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            <Card className="col-span-8 p-6 overflow-y-auto scrollbar-hide">
                {categories.map((type) => {
                    const typeCells = cells.filter(c => c.type === type);
                    const isExpanded = expandedSections[type];
                    const visibleCells = isExpanded ? typeCells : typeCells.slice(0, 6);
                    
                    return (
                        <div key={type} className="mb-8">
                            <div onClick={() => toggleSection(type)} className="flex justify-between items-center mb-4 cursor-pointer group select-none">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-700 text-lg">{type}</h4>
                                    <div className="p-1 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
                                        <Play size={12} className={`text-slate-500 group-hover:text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} fill="currentColor" />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{typeCells.length} cells found</span>
                            </div>
                            <div className="grid grid-cols-6 gap-4 pl-2">
                                {visibleCells.map((cell) => (
                                    <div key={cell.id} className="flex flex-col items-center gap-2 fade-in">
                                        <BloodCell type={cell.type} isSelected={selectedCellId === cell.id} onClick={() => setSelectedCellId(cell.id)} />
                                        <span className={`text-[10px] ${cell.type === 'Uncertain' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>{cell.conf}</span>
                                    </div>
                                ))}
                            </div>
                            {!isExpanded && typeCells.length > 6 && (
                                <div onClick={() => toggleSection(type)} className="text-center mt-2 text-xs text-blue-500 cursor-pointer hover:underline">
                                    + {typeCells.length - 6} more cells...
                                </div>
                            )}
                        </div>
                    );
                })}
            </Card>

            <div className="col-span-4 flex flex-col gap-6">
                <Card className="p-6 flex flex-col items-center flex-1 sticky top-0">
                    <h4 className="text-sm font-bold text-slate-700 w-full mb-6 flex items-center gap-2">
                        <ZoomIn size={16} /> Cell Inspector
                    </h4>
                    <div className="w-56 h-56 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center mb-6 relative group">
                         <div className={`w-40 h-40 rounded-full relative blur-[1px] transition-all duration-300 ${selectedCellData.type === 'Uncertain' ? 'bg-amber-200/50' : 'bg-purple-200/50'}`}>
                             <div className={`absolute inset-0 rounded-full animate-pulse ${selectedCellData.type === 'Uncertain' ? 'bg-amber-600/20' : 'bg-purple-600/20'}`}></div>
                             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-20 rounded-full blur-[4px] ${selectedCellData.type === 'Uncertain' ? 'bg-amber-700' : 'bg-purple-700'}`}></div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                             <div className="w-full h-[1px] bg-slate-900"></div>
                             <div className="h-full w-[1px] bg-slate-900 absolute"></div>
                         </div>
                    </div>
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-slate-500">Selected Class</span>
                            <span className={`font-bold ${selectedCellData.type === 'Uncertain' ? 'text-amber-600' : 'text-blue-700'}`}>{selectedCellData.type}</span>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Re-classify</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map(l => (
                                    <button key={l} onClick={() => {
                                            const newCells = cells.map(c => c.id === selectedCellData.id ? {...c, type: l} : c);
                                            setCells(newCells);
                                        }}
                                        className={`py-2 text-xs font-medium border rounded transition-colors ${selectedCellData.type === l ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                                        {l === 'Granulocyte' ? 'GRA' : l === 'Lymphocyte' ? 'LYM' : l === 'Monocyte' ? 'MON' : 'UNC'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 mt-2 shadow-sm shadow-blue-200">
                            <Check size={16} /> Confirm
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

// --- 3. Viewer Tab (Rewritten for Pan & Mini-map Logic) ---
export const ViewerTab = () => {
    // 1. Setup Virtual "High Res" Slide Dimensions
    // We simulate a slide that is 3x wider/taller than the viewport
    const VIRTUAL_WIDTH = 3000;
    const VIRTUAL_HEIGHT = 2000;
    const MAP_SCALE = 0.15; // The mini-map is 15% the size of reality

    // 2. Viewport Ref to calculate current window size
    const viewportRef = useRef(null);
    const [viewportSize, setViewportSize] = useState({ w: 800, h: 600 });
    
    // 3. Pan State (Coordinate of the Top-Left of the Viewport relative to Virtual Slide)
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    // 4. Update viewport size on mount
    useEffect(() => {
        if(viewportRef.current) {
            setViewportSize({ 
                w: viewportRef.current.offsetWidth, 
                h: viewportRef.current.offsetHeight 
            });
        }
    }, []);

    // 5. Generate Scattered Cells (Fixed positions)
    const [scatteredCells] = useState(() => Array.from({length: 40}).map((_, i) => ({
        id: i,
        x: Math.random() * VIRTUAL_WIDTH,
        y: Math.random() * VIRTUAL_HEIGHT,
        color: i % 5 === 0 ? 'bg-amber-500' : 'bg-purple-600'
    })));

    // 6. Interaction Handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        // Panning logic: dragging mouse RIGHT moves the viewport LEFT (simulating moving paper)
        // Or "Google Maps" style: dragging mouse RIGHT moves the MAP RIGHT (seeing what's on the left)
        // Implementation: Dragging moves the `translate` value directly
        
        const newX = pan.x + e.movementX;
        const newY = pan.y + e.movementY;

        // Constraint: Don't pan past the edges
        // Max X is 0 (left edge aligned)
        // Min X is -(VIRTUAL_WIDTH - viewportSize.w) (right edge aligned)
        
        const minX = -(VIRTUAL_WIDTH - viewportSize.w);
        const minY = -(VIRTUAL_HEIGHT - viewportSize.h);

        setPan({
            x: Math.max(minX, Math.min(0, newX)),
            y: Math.max(minY, Math.min(0, newY))
        });
    };

    // 7. Mini-map Calculations
    // Convert current negative pan offset to positive mini-map coordinates
    const mapW = 200; // Fixed pixel width for mini-map
    const ratio = mapW / VIRTUAL_WIDTH; // How much to shrink
    const mapH = VIRTUAL_HEIGHT * ratio;

    // The Red Box represents the Viewport
    const redBox = {
        w: viewportSize.w * ratio,
        h: viewportSize.h * ratio,
        x: Math.abs(pan.x) * ratio,
        y: Math.abs(pan.y) * ratio
    };

    // Visual Styles
    const slidePattern = {
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#f8fafc',
        width: `${VIRTUAL_WIDTH}px`,
        height: `${VIRTUAL_HEIGHT}px`,
        transform: `translate(${pan.x}px, ${pan.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
    };

    return (
        <div className="h-full flex gap-6 fade-in">
            {/* Thumbnails (Visual only) */}
            <div className="w-32 flex flex-col gap-3 h-full overflow-y-auto pr-1">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${i===1 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="w-full h-full bg-slate-100 relative opacity-70 flex items-center justify-center">
                            <span className="text-xs text-slate-400 font-bold">Slide {i}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Canvas Area */}
            <Card className="flex-1 relative overflow-hidden group border-slate-300 select-none">
                
                {/* Viewport (The Window) */}
                <div 
                    ref={viewportRef}
                    className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} relative`}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {/* The Huge Slide Layer */}
                    <div style={slidePattern} className="absolute top-0 left-0 border border-slate-200 origin-top-left">
                        {/* Scattered Cells on Big Slide */}
                        {scatteredCells.map((cell) => (
                            <div 
                                key={cell.id}
                                className={`absolute rounded-full blur-[2px] opacity-60 ${cell.color}`}
                                style={{
                                    left: cell.x,
                                    top: cell.y,
                                    width: '24px', 
                                    height: '24px'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* --- The Mini-map (Navigator) --- */}
                <div 
                    className="absolute bottom-4 left-4 bg-white border-2 border-blue-500 shadow-xl z-20 overflow-hidden"
                    style={{ width: mapW, height: mapH }}
                >
                    {/* Label */}
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 z-10 font-bold">
                        100x
                    </div>

                    {/* Mini representation of content */}
                    <div className="w-full h-full bg-slate-50 relative">
                        {scatteredCells.map((cell) => (
                            <div 
                                key={cell.id}
                                className={`absolute rounded-full ${cell.color}`}
                                style={{
                                    left: cell.x * ratio,
                                    top: cell.y * ratio,
                                    width: '3px', 
                                    height: '3px'
                                }}
                            />
                        ))}
                    </div>

                    {/* The Red Indicator Box (Moving Viewport) */}
                    <div 
                        className="absolute border-2 border-red-500 bg-red-500/10 shadow-[0_0_0_9999px_rgba(255,255,255,0.4)]"
                        style={{
                            width: redBox.w,
                            height: redBox.h,
                            left: redBox.x,
                            top: redBox.y,
                            pointerEvents: 'none' // Let clicks pass through if needed
                        }}
                    >
                        {/* Center Dot for precision */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                {/* Floating Controls (Zoom Slider - Visual) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-full shadow-lg flex gap-4 z-20">
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ZoomIn size={20} className="text-slate-600"/></button>
                    <div className="w-[1px] bg-slate-300 h-full"></div>
                    <input type="range" className="w-32 accent-blue-600 cursor-pointer" />
                    <div className="w-[1px] bg-slate-300 h-full"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-full"><Scan size={20} className="text-slate-600"/></button>
                </div>
            </Card>
        </div>
    );
};