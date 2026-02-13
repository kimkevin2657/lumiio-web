import React, { useState, useMemo } from 'react';
import { FileText, User, Bell, ChevronDown, ChevronUp, Search, ChevronsUpDown, ChevronRight } from 'lucide-react';
import { EXAM_LIST, PATIENT_INFO } from '../data';
import { CBCTab, CellTab, ViewerTab } from '../components/TabContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('cell');
  const [selectedExam, setSelectedExam] = useState(EXAM_LIST[0].id);

  // Exam list collapse state
  const [examListCollapsed, setExamListCollapsed] = useState(false);

  // Sort state: { column: 'id' | 'date' | 'flag', direction: 'asc' | 'desc' }
  const [sortConfig, setSortConfig] = useState({ column: 'id', direction: 'asc' });

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'asc' };
    });
  };

  const sortedExams = useMemo(() => {
    const sorted = [...EXAM_LIST];
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
  }, [sortConfig]);

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
          
          {/* Exam List */}
          <div className={`bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${examListCollapsed ? 'flex-shrink-0' : 'flex-1'}`}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setExamListCollapsed(!examListCollapsed)}>
                    <FileText size={18} className="text-blue-600"/>
                    <h3 className="font-bold text-slate-800">Exam List</h3>
                    <div className="p-0.5 rounded hover:bg-slate-100 transition-colors">
                        <ChevronRight 
                          size={16} 
                          className={`text-slate-400 transition-transform duration-200 ${examListCollapsed ? 'rotate-0' : 'rotate-90'}`} 
                        />
                    </div>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{EXAM_LIST.length}</span>
            </div>
            {!examListCollapsed && (
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
                          {sortedExams.map((exam) => (
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
                          ))}
                      </tbody>
                  </table>
              </div>
            )}
          </div>

          {/* Patient Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
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
                    <span className="text-slate-500 block mb-1 text-xs uppercase">Clinical Note</span>
                    <p className="text-slate-700 bg-amber-50 border border-amber-100 p-2 rounded text-xs leading-relaxed">
                        {PATIENT_INFO.note}
                    </p>
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
