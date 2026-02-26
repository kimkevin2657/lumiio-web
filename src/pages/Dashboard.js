import React, { useState, useMemo } from 'react';
import { FileText, User, Bell, ChevronDown, Search, ChevronsUpDown, ChevronUp, ChevronRight, Pencil, Check, X } from 'lucide-react';
import { EXAM_LIST, PATIENT_INFO } from '../data';
import { CBCTab, CellTab, ViewerTab } from '../components/TabContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('cell');
  const [selectedExam, setSelectedExam] = useState(EXAM_LIST[0].id);

  // Search state for exam list
  const [examSearch, setExamSearch] = useState('');

  // Sort state
  const [sortConfig, setSortConfig] = useState({ column: 'id', direction: 'asc' });

  // Note editing state
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(PATIENT_INFO.note);
  const [draftNote, setDraftNote] = useState(PATIENT_INFO.note);

  const handleNoteEdit = () => {
    setDraftNote(noteValue);
    setIsEditingNote(true);
  };

  const handleNoteSave = () => {
    setNoteValue(draftNote);
    setIsEditingNote(false);
  };

  const handleNoteCancel = () => {
    setDraftNote(noteValue);
    setIsEditingNote(false);
  };

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'asc' };
    });
  };

  const sortedExams = useMemo(() => {
    // First filter by search
    const filtered = EXAM_LIST.filter(exam => {
      const q = examSearch.toLowerCase();
      return (
        exam.id.toLowerCase().includes(q) ||
        (exam.patientName && exam.patientName.toLowerCase().includes(q))
      );
    });

    const sorted = [...filtered];
    const { column, direction } = sortConfig;
    sorted.sort((a, b) => {
      let valA, valB;
      if (column === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (column === 'date') {
        valA = a.date;
        valB = b.date;
      } else if (column === 'flag') {
        valA = a.flag ? 1 : 0;
        valB = b.flag ? 1 : 0;
      }
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, examSearch]);

  const SortIcon = ({ column }) => {
    const isActive = sortConfig.column === column;
    if (!isActive) {
      return <ChevronsUpDown size={12} className="text-slate-300 ml-1 inline-block" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={12} className="text-blue-600 ml-1 inline-block" />
      : <ChevronDown size={12} className="text-blue-600 ml-1 inline-block" />;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* 1. Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">Lumiio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <button className="text-slate-900">Analysis</button>
            <button className="hover:text-slate-800 transition-colors">Patients</button>
            <button className="hover:text-slate-800 transition-colors">History</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-3 py-2 rounded-lg flex items-center gap-2 text-slate-400 w-64">
            <Search size={16} />
            <input type="text" placeholder="Search Patient ID..." className="bg-transparent text-sm outline-none text-slate-700 w-full" />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs">DR</div>
            <div className="text-xs">
                <div className="font-bold text-slate-700">Dr. Kim</div>
                <div className="text-slate-400">Pathologist</div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Sidebar */}
        <aside className="w-80 flex flex-col gap-4 flex-shrink-0">
          
          {/* Exam List — always expanded, no collapse button */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600"/>
                <h3 className="font-bold text-slate-800">Exam List</h3>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{EXAM_LIST.length}</span>
            </div>

            {/* Search bar inside exam list */}
            <div className="px-3 py-2 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <Search size={13} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={examSearch}
                  onChange={e => setExamSearch(e.target.value)}
                  placeholder="환자명 또는 검사 ID 검색..."
                  className="bg-transparent text-xs outline-none text-slate-700 w-full placeholder-slate-400"
                />
                {examSearch && (
                  <button onClick={() => setExamSearch('')} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase sticky top-0 z-10">
                  <tr>
                    <th 
                      className="p-3 pl-4 cursor-pointer hover:text-slate-700 select-none transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <span className="inline-flex items-center">
                        ID <SortIcon column="id" />
                      </span>
                    </th>
                    <th 
                      className="p-3 cursor-pointer hover:text-slate-700 select-none transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <span className="inline-flex items-center">
                        Date <SortIcon column="date" />
                      </span>
                    </th>
                    <th 
                      className="p-3 text-center cursor-pointer hover:text-slate-700 select-none transition-colors"
                      onClick={() => handleSort('flag')}
                    >
                      <span className="inline-flex items-center justify-center">
                        St <SortIcon column="flag" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedExams.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-xs text-slate-400">검색 결과가 없습니다</td>
                    </tr>
                  ) : (
                    sortedExams.map((exam) => (
                      <tr 
                        key={exam.id} 
                        onClick={() => setSelectedExam(exam.id)}
                        className={`text-sm cursor-pointer transition-colors group ${selectedExam === exam.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <td className={`p-3 pl-4 font-medium ${selectedExam === exam.id ? 'text-blue-700' : 'text-slate-700'}`}>{exam.id}</td>
                        <td className="p-3 text-slate-500 text-xs">
                          {exam.date.split(' ')[0]}
                          <div className="text-[10px] text-slate-400">{exam.date.split(' ')[1]}</div>
                        </td>
                        <td className="p-3 text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${exam.flag ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-slate-300'}`}></div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-shrink-0">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={20} />
                </div>
                <div>
                    <div className="text-sm text-slate-400 font-medium">Patient Info</div>
                    <div className="font-bold text-slate-800">{PATIENT_INFO.name}</div>
                </div>
             </div>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">ID</span>
                    <span className="font-medium text-slate-700">{PATIENT_INFO.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Gender/Age</span>
                    <span className="font-medium text-slate-700">{PATIENT_INFO.gender} / 45</span>
                </div>
                <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-500 text-xs uppercase">Clinical Note</span>
                        {!isEditingNote ? (
                            <button
                                onClick={handleNoteEdit}
                                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                <Pencil size={11} /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleNoteSave}
                                    className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700 transition-colors font-medium"
                                >
                                    <Check size={11} /> Save
                                </button>
                                <span className="text-slate-300 text-xs">|</span>
                                <button
                                    onClick={handleNoteCancel}
                                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={11} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    {isEditingNote ? (
                        <textarea
                            value={draftNote}
                            onChange={e => setDraftNote(e.target.value)}
                            className="w-full text-slate-700 bg-white border border-blue-300 ring-1 ring-blue-200 p-2 rounded text-xs leading-relaxed resize-none outline-none focus:border-blue-400 transition-colors"
                            rows={3}
                            autoFocus
                        />
                    ) : (
                        <p className="text-slate-700 bg-amber-50 border border-amber-100 p-2 rounded text-xs leading-relaxed">
                            {noteValue}
                        </p>
                    )}
                </div>
             </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            
            {/* Custom Tab Bar */}
            <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 bg-white shrink-0">
                {['CBC Result', 'Cell Classification', 'Slide Viewer'].map((label) => {
                    const key = label === 'CBC Result' ? 'cbc' : label === 'Cell Classification' ? 'cell' : 'viewer';
                    const isActive = activeTab === key;
                    return (
                        <button 
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`pb-4 text-sm font-medium transition-all relative ${
                                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_6px_rgba(37,99,235,0.3)]"></span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Viewport */}
            <div className="flex-1 overflow-hidden relative bg-slate-50/50">
                <div className="absolute inset-0 p-6 overflow-auto">
                    {activeTab === 'cbc' && <CBCTab />}
                    {activeTab === 'cell' && <CellTab />}
                    {activeTab === 'viewer' && <ViewerTab />}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;