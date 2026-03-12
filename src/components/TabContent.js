import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip, ReferenceLine, Label, ComposedChart
} from 'recharts';
import {
  ZoomIn, ZoomOut, Check, Play, Scan, MessageSquare, X,
  AlertTriangle, Tag, Eye, Maximize2, Send
} from 'lucide-react';

// --- Shared Card ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════════
// 1. CBC Tab — now receives cbcData prop, grouped by section
// ═══════════════════════════════════════════════════════════════════════
export const CBCTab = ({ cbcData = [] }) => {
  const rbcData = Array.from({ length: 120 }, (_, i) => {
    const x = i + 40;
    const mean = 92;
    const stdDev = 14;
    const value =
      (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) *
      5000;
    return { name: x, value };
  });

  // Group by section
  const sections = useMemo(() => {
    const map = new Map();
    cbcData.forEach((row) => {
      const sec = row.section || 'Other';
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec).push(row);
    });
    return Array.from(map.entries());
  }, [cbcData]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full fade-in">
      <Card className="col-span-8 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">항목</th>
                <th className="px-6 py-3 font-semibold">결과</th>
                <th className="px-6 py-3 font-semibold">단위</th>
                <th className="px-6 py-3 font-semibold">정상범위</th>
                <th className="px-6 py-3 font-semibold text-center">플래그</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(([sectionName, rows]) => (
                <React.Fragment key={sectionName}>
                  <tr>
                    <td colSpan={5} className="px-6 py-2 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider border-y border-slate-100">
                      {sectionName}
                    </td>
                  </tr>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-2.5 font-medium text-slate-700">{row.item}</td>
                      <td className={`px-6 py-2.5 font-bold ${row.flag ? (row.flag === 'H' ? 'text-red-600' : 'text-blue-600') : 'text-slate-800'}`}>
                        {row.result}
                      </td>
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
                </React.Fragment>
              ))}
              {cbcData.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">데이터가 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Distribution charts */}
      <div className="col-span-4 flex flex-col gap-6">
        <Card className="p-4 flex-1 flex flex-col">
          <h4 className="text-sm font-bold text-slate-700 mb-2">RBC Distribution</h4>
          <div className="flex-1 min-h-[180px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rbcData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRbc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={20} type="number" domain={[40, 150]}>
                  <Label value="Mean cell volume (fL)" position="insideBottom" offset={-10} style={{ fontSize: '11px', fontWeight: 600, fill: '#64748b' }} />
                </XAxis>
                <YAxis tick={false}>
                  <Label value="Frequency (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '11px', fontWeight: 600, fill: '#64748b' }} />
                </YAxis>
                <Tooltip />
                <ReferenceLine segment={[{ x: 78, y: 85 }, { x: 106, y: 85 }]} stroke="#f59e0b" strokeWidth={2} />
                <ReferenceLine y={85} stroke="none">
                  <Label value="Histogram width / MCV = RDW-CV" position="top" offset={5} fill="#f59e0b" fontSize={10} fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine segment={[{ x: 68, y: 28 }, { x: 116, y: 28 }]} stroke="#ef4444" strokeWidth={2} />
                <ReferenceLine y={28} stroke="none">
                  <Label value="RDW-SD (20% Level)" position="right" offset={100} fill="#ef4444" fontSize={10} fontWeight="bold" />
                </ReferenceLine>
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
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis hide /><YAxis hide />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorPlt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 2. Cell Classification Tab — enhanced with comments, AI info, overlay
// ═══════════════════════════════════════════════════════════════════════
export const CellTab = ({ examId, cellData }) => {
  // Initialise cell state from props (re-init when exam changes)
  const [cells, setCells] = useState([]);
  useEffect(() => {
    if (cellData?.wbc) {
      setCells(cellData.wbc.map(c => ({ ...c })));
    }
  }, [examId, cellData]);

  const rbcMorphology = cellData?.rbcMorphology || [];
  const pltMorphology = cellData?.pltMorphology || [];

  const [expandedSections, setExpandedSections] = useState({
    Granulocyte: true,
    Lymphocyte: false,
    Monocyte: true,
    Uncertain: true,
  });

  const [selectedCellId, setSelectedCellId] = useState(null);
  const [pendingType, setPendingType] = useState(null);

  // Comment editing
  const [commentDraft, setCommentDraft] = useState('');
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const toggleSection = (type) => setExpandedSections((p) => ({ ...p, [type]: !p[type] }));
  const getCount = (type) => cells.filter((c) => c.type === type).length;
  const totalWBC = cells.length;

  const selectedCellData = cells.find((c) => c.id === selectedCellId) || cells[0];
  const displayedType = pendingType && selectedCellId ? pendingType : selectedCellData?.type;

  const handleCellSelect = (cellId) => {
    setSelectedCellId(cellId);
    setPendingType(null);
    const cell = cells.find(c => c.id === cellId);
    setCommentDraft(cell?.comment || '');
    setIsCommentOpen(false);
  };

  const handleReclassifyClick = (type) => {
    if (type === selectedCellData?.type && !pendingType) {
      setPendingType(null);
    } else {
      setPendingType(type);
    }
  };

  const handleConfirm = () => {
    if (pendingType && selectedCellId) {
      setCells((prev) =>
        prev.map((c) =>
          c.id === selectedCellId ? { ...c, type: pendingType, reclassified: true } : c
        )
      );
      setPendingType(null);
    }
  };

  const handleCommentSave = () => {
    if (selectedCellId) {
      setCells(prev => prev.map(c => c.id === selectedCellId ? { ...c, comment: commentDraft } : c));
      setIsCommentOpen(false);
    }
  };

  // Mark as abnormal
  const handleMarkAbnormal = () => {
    if (selectedCellId) {
      setPendingType('Uncertain');
    }
  };

  // Blood cell visual
  const BloodCell = ({ cell, isSelected, onClick }) => {
    const isUncertain = cell.type === 'Uncertain';
    const wasReclassified = cell.reclassified;
    const hasComment = !!cell.comment;
    const color = isUncertain ? 'bg-amber-100/50' : 'bg-purple-100/50';
    const core = isUncertain ? 'bg-amber-600/80' : 'bg-purple-600/80';

    return (
      <div
        onClick={onClick}
        className={`w-16 h-16 rounded-full relative overflow-hidden shadow-inner group cursor-pointer transition-all duration-200 
          ${isSelected ? 'ring-4 ring-blue-400 scale-110 z-10' : 'hover:scale-105'}`}
      >
        <div className={`absolute inset-0 ${color}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] ${core} rounded-full blur-[2px] shadow-lg`} />
        <div className="absolute top-2 right-2 w-1/3 h-1/3 bg-white/30 rounded-full blur-md" />
        {/* Indicators */}
        {wasReclassified && (
          <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border border-white flex items-center justify-center z-10">
            <Tag size={7} className="text-white" />
          </div>
        )}
        {hasComment && (
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border border-white flex items-center justify-center z-10">
            <MessageSquare size={7} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  const categories = ['Granulocyte', 'Lymphocyte', 'Monocyte', 'Uncertain'];

  if (!cellData || cells.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm fade-in">
        셀 분류 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 fade-in">
      {/* Summary cards */}
      <div className="flex gap-4">
        {/* WBC Count */}
        <Card className="flex-1 p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-bold uppercase mb-3">WBC Count</div>
          <div className="flex items-start gap-5">
            <div className="text-3xl font-bold text-slate-800 leading-none pt-1">{totalWBC}</div>
            <div className="flex-1 min-w-0 space-y-1.5">
              {['Granulocyte', 'Lymphocyte', 'Monocyte'].map((t) => (
                <div key={t} className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">{t}</span>
                  <span className="font-bold text-slate-700">{getCount(t)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-1.5">
                <span className="text-amber-600 font-medium">Uncertain</span>
                <span className="font-bold text-amber-600">{getCount('Uncertain')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* RBC Count */}
        <Card className="flex-1 p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-bold uppercase mb-3">RBC Count</div>
          <div className="flex items-start gap-5">
            <div className="text-3xl font-bold text-slate-800 leading-none pt-1">
              {rbcMorphology.reduce((s, r) => s + r.value, 0)}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              {rbcMorphology.map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className={highlight ? 'text-green-600 font-medium' : 'text-slate-500'}>{label}</span>
                  <span className={`font-bold ${highlight ? 'text-green-600' : 'text-slate-400'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* PLT Count */}
        <Card className="flex-1 p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-bold uppercase mb-3">PLT Count</div>
          <div className="flex items-start gap-5">
            <div className="text-3xl font-bold text-slate-800 leading-none pt-1">
              {pltMorphology.reduce((s, r) => s + r.value, 0)}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              {pltMorphology.map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className={highlight ? 'text-green-600 font-medium' : 'text-slate-500'}>{label}</span>
                  <span className={`font-bold ${highlight ? 'text-green-600' : 'text-slate-400'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Cell gallery + Inspector */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Cell Gallery */}
        <Card className="col-span-8 p-6 overflow-y-auto scrollbar-hide">
          {categories.map((type) => {
            const typeCells = cells.filter((c) => c.type === type);
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
                      <BloodCell cell={cell} isSelected={selectedCellId === cell.id} onClick={() => handleCellSelect(cell.id)} />
                      <span className={`text-[10px] ${cell.type === 'Uncertain' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {cell.conf}
                      </span>
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

        {/* ─── Cell Inspector (Enhanced) ─── */}
        <div className="col-span-4 flex flex-col gap-4 overflow-y-auto">
          <Card className="p-6 flex flex-col items-center flex-1 sticky top-0">
            <h4 className="text-sm font-bold text-slate-700 w-full mb-4 flex items-center gap-2">
              <ZoomIn size={16} /> Cell Inspector
            </h4>

            {/* Zoomed cell view with overlay icons */}
            <div className="w-52 h-52 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center mb-4 relative group">
              <div className={`w-36 h-36 rounded-full relative blur-[1px] transition-all duration-300 ${
                selectedCellData?.type === 'Uncertain' ? 'bg-amber-200/50' : 'bg-purple-200/50'
              }`}>
                <div className={`absolute inset-0 rounded-full animate-pulse ${
                  selectedCellData?.type === 'Uncertain' ? 'bg-amber-600/20' : 'bg-purple-600/20'
                }`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-20 rounded-full blur-[4px] ${
                  selectedCellData?.type === 'Uncertain' ? 'bg-amber-700' : 'bg-purple-700'
                }`} />
              </div>
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-full h-[1px] bg-slate-900" />
                <div className="h-full w-[1px] bg-slate-900 absolute" />
              </div>

              {/* ── Overlay tool buttons (visible on hover) ── */}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={handleMarkAbnormal}
                  title="Mark as abnormal"
                  className="w-7 h-7 rounded-md bg-white/90 shadow border border-slate-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <AlertTriangle size={13} />
                </button>
                <button
                  onClick={() => setIsCommentOpen(!isCommentOpen)}
                  title="Add comment"
                  className="w-7 h-7 rounded-md bg-white/90 shadow border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare size={13} />
                </button>
                <button
                  title="Zoom in"
                  className="w-7 h-7 rounded-md bg-white/90 shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {/* Reclassified badge overlay */}
              {selectedCellData?.reclassified && (
                <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10 flex items-center gap-0.5">
                  <Tag size={8} /> 재분류됨
                </div>
              )}
            </div>

            {/* Info rows */}
            <div className="w-full space-y-3">
              {/* AI Prediction */}
              <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5"><Eye size={13} /> AI 예측</span>
                <span className="font-bold text-slate-700">{selectedCellData?.aiPrediction || '—'}</span>
              </div>

              {/* Selected class */}
              <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Selected Class</span>
                <span className={`font-bold ${displayedType === 'Uncertain' ? 'text-amber-600' : 'text-blue-700'}`}>
                  {displayedType || '—'}
                  {pendingType && <span className="text-[10px] text-slate-400 ml-1">(pending)</span>}
                </span>
              </div>

              {/* AI Confidence */}
              <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">AI Confidence</span>
                <span className={`font-bold ${
                  (selectedCellData?.conf || 0) >= 0.8 ? 'text-green-600'
                    : (selectedCellData?.conf || 0) >= 0.6 ? 'text-amber-600'
                    : 'text-red-600'
                }`}>
                  {selectedCellData ? (selectedCellData.conf * 100).toFixed(0) + '%' : '—'}
                </span>
              </div>

              {/* Re-classify buttons */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Re-classify</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((l) => {
                    const isCurrentOrPending = pendingType
                      ? pendingType === l
                      : selectedCellData?.type === l;
                    return (
                      <button
                        key={l}
                        onClick={() => handleReclassifyClick(l)}
                        className={`py-2 text-xs font-medium border rounded transition-colors ${
                          isCurrentOrPending
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {l === 'Granulocyte' ? 'GRA' : l === 'Lymphocyte' ? 'LYM' : l === 'Monocyte' ? 'MON' : 'UNC'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!pendingType}
                className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  pendingType
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check size={16} /> Confirm
              </button>

              {/* ─── Comment Section ─── */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <MessageSquare size={12} /> Comment
                  </label>
                  {!isCommentOpen && (
                    <button
                      onClick={() => { setCommentDraft(selectedCellData?.comment || ''); setIsCommentOpen(true); }}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      {selectedCellData?.comment ? '수정' : '+ 추가'}
                    </button>
                  )}
                </div>

                {isCommentOpen ? (
                  <div className="space-y-2">
                    <textarea
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                      placeholder="이 혈구에 대한 코멘트를 입력하세요..."
                      className="w-full text-xs border border-blue-300 ring-1 ring-blue-100 rounded-lg p-2.5 outline-none resize-none leading-relaxed"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCommentSave}
                        className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
                      >
                        <Send size={11} /> 저장
                      </button>
                      <button
                        onClick={() => setIsCommentOpen(false)}
                        className="px-3 py-1.5 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : selectedCellData?.comment ? (
                  <p className="text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg p-2.5 leading-relaxed">
                    {selectedCellData.comment}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">코멘트 없음</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 3. Viewer Tab — unchanged except minor cleanups
// ═══════════════════════════════════════════════════════════════════════

const generateSlideCells = (slideIndex, virtualW, virtualH) => {
  const cells = [];
  const seed = (slideIndex + 1) * 1337;
  for (let i = 0; i < 40; i++) {
    const s1 = Math.abs(Math.sin(seed + i * 7.13) * 10000) % 1;
    const s2 = Math.abs(Math.sin(seed + i * 13.37) * 10000) % 1;
    const s3 = Math.abs(Math.sin(seed + i * 3.71) * 10000) % 1;
    cells.push({
      id: i,
      x: s1 * virtualW,
      y: s2 * virtualH,
      color: s3 < 0.2 ? 'bg-amber-500' : 'bg-purple-600',
    });
  }
  return cells;
};

export const ViewerTab = () => {
  const VIRTUAL_WIDTH = 3000;
  const VIRTUAL_HEIGHT = 2000;
  const TOTAL_SLIDES = 4;

  const viewportRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ w: 800, h: 600 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const allSlideCells = useMemo(
    () => Array.from({ length: TOTAL_SLIDES }, (_, i) => generateSlideCells(i, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)),
    []
  );

  const scatteredCells = allSlideCells[activeSlide];

  useEffect(() => {
    const updateSize = () => {
      if (viewportRef.current) {
        setViewportSize({ w: viewportRef.current.offsetWidth, h: viewportRef.current.offsetHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => { setPan({ x: 0, y: 0 }); }, [activeSlide]);

  const clampPan = useCallback(
    (newX, newY, currentZoom) => {
      const scaledW = VIRTUAL_WIDTH * currentZoom;
      const scaledH = VIRTUAL_HEIGHT * currentZoom;
      const minX = Math.min(0, -(scaledW - viewportSize.w));
      const minY = Math.min(0, -(scaledH - viewportSize.h));
      return {
        x: Math.max(minX, Math.min(0, newX)),
        y: Math.max(minY, Math.min(0, newY)),
      };
    },
    [viewportSize]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan((prev) => clampPan(prev.x + e.movementX, prev.y + e.movementY, zoom));
  };

  const handleZoomChange = (newZoom) => {
    const clamped = Math.max(0.3, Math.min(3, newZoom));
    setZoom(clamped);
    setPan((prev) => clampPan(prev.x, prev.y, clamped));
  };

  const handleZoomIn = () => handleZoomChange(zoom + 0.2);
  const handleZoomOut = () => handleZoomChange(zoom - 0.2);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.3, Math.min(3, zoom + delta));
      setZoom(newZoom);
      setPan((prev) => clampPan(prev.x, prev.y, newZoom));
    },
    [zoom, clampPan]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const mapW = 200;
  const ratio = mapW / VIRTUAL_WIDTH;
  const mapH = VIRTUAL_HEIGHT * ratio;

  const redBox = {
    w: (viewportSize.w / zoom) * ratio,
    h: (viewportSize.h / zoom) * ratio,
    x: (Math.abs(pan.x) / zoom) * ratio,
    y: (Math.abs(pan.y) / zoom) * ratio,
  };

  const slidePattern = {
    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    backgroundColor: '#f8fafc',
    width: `${VIRTUAL_WIDTH}px`,
    height: `${VIRTUAL_HEIGHT}px`,
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0',
    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
  };

  const sliderValue = ((zoom - 0.3) / (3 - 0.3)) * 100;
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    handleZoomChange(0.3 + (val / 100) * (3 - 0.3));
  };

  return (
    <div className="h-full flex gap-6 fade-in">
      {/* Slide strip */}
      <div className="w-32 flex flex-col gap-3 h-full overflow-y-auto pr-1">
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <div
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
              activeSlide === i ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="w-full h-full bg-slate-50 relative">
              {allSlideCells[i].slice(0, 15).map((cell) => (
                <div
                  key={cell.id}
                  className={`absolute rounded-full ${cell.color}`}
                  style={{
                    left: `${(cell.x / VIRTUAL_WIDTH) * 100}%`,
                    top: `${(cell.y / VIRTUAL_HEIGHT) * 100}%`,
                    width: '4px',
                    height: '4px',
                    opacity: 0.6,
                  }}
                />
              ))}
              <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-bold">
                Slide {i + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Viewport */}
      <Card className="flex-1 relative overflow-hidden group border-slate-300 select-none">
        <div
          ref={viewportRef}
          className="w-full h-full relative"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div style={slidePattern} className="absolute top-0 left-0 border border-slate-200 origin-top-left">
            {scatteredCells.map((cell) => (
              <div
                key={cell.id}
                className={`absolute rounded-full blur-[2px] opacity-60 ${cell.color}`}
                style={{ left: cell.x, top: cell.y, width: '24px', height: '24px' }}
              />
            ))}
          </div>
        </div>

        {/* Minimap */}
        <div
          className="absolute bottom-4 left-4 bg-white border-2 border-blue-500 shadow-xl z-20 overflow-hidden"
          style={{ width: mapW, height: mapH }}
        >
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 z-10 font-bold">
            {Math.round(zoom * 100)}x
          </div>
          <div className="w-full h-full bg-slate-50 relative">
            {scatteredCells.map((cell) => (
              <div
                key={cell.id}
                className={`absolute rounded-full ${cell.color}`}
                style={{ left: cell.x * ratio, top: cell.y * ratio, width: '3px', height: '3px' }}
              />
            ))}
          </div>
          <div
            className="absolute border-2 border-red-500 bg-red-500/10 shadow-[0_0_0_9999px_rgba(255,255,255,0.4)]"
            style={{
              width: Math.min(redBox.w, mapW),
              height: Math.min(redBox.h, mapH),
              left: Math.min(redBox.x, mapW - redBox.w),
              top: Math.min(redBox.y, mapH - redBox.h),
              pointerEvents: 'none',
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-full shadow-lg flex items-center gap-3 z-20">
          <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Zoom out">
            <ZoomOut size={20} className="text-slate-600" />
          </button>
          <div className="w-[1px] bg-slate-300 h-6" />
          <input type="range" min="0" max="100" value={sliderValue} onChange={handleSliderChange} className="w-32 accent-blue-600 cursor-pointer" />
          <span className="text-[10px] text-slate-500 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
          <div className="w-[1px] bg-slate-300 h-6" />
          <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Zoom in">
            <ZoomIn size={20} className="text-slate-600" />
          </button>
          <div className="w-[1px] bg-slate-300 h-6" />
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Reset view">
            <Scan size={20} className="text-slate-600" />
          </button>
        </div>
      </Card>
    </div>
  );
};