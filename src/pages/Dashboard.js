import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  FileText, User, Bell, ChevronDown, ChevronUp, Search,
  ChevronsUpDown, Pencil, Check, X, Monitor, FileBarChart,
  Settings, HelpCircle, LogOut, UserCircle, Wifi, WifiOff,
  RefreshCw, Download, CheckCircle2, Clock, AlertTriangle, Info,
  Loader2, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examsApi, devicesApi, notificationsApi, authApi } from '../api';
import { CBCTab, CellTab, ViewerTab } from '../components/TabContent';

// ─── Dropdown wrapper (closes on outside click) ─────────────────────────
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

// ─── Notification Panel ─────────────────────────────────────────────────
const NotificationPanel = ({ notifications, open, onClose, onMarkAllRead, onMarkRead }) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  if (!open) return null;

  const iconMap = {
    flag: <AlertTriangle size={14} className="text-red-500" />,
    approval: <CheckCircle2 size={14} className="text-green-500" />,
    sync: <RefreshCw size={14} className="text-blue-500" />,
    info: <Info size={14} className="text-slate-400" />,
  };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">알림</h3>
        <span onClick={onMarkAllRead} className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">모두 읽음 처리</span>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.read && onMarkRead(n.id)}
            className={`px-4 py-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/40' : ''}`}
          >
            <div className="mt-0.5 flex-shrink-0">{iconMap[n.type] || iconMap.info}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 truncate">{n.title}</span>
                {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">알림이 없습니다</div>
        )}
      </div>
    </div>
  );
};

// ─── Profile Dropdown ───────────────────────────────────────────────────
const ProfileDropdown = ({ open, onClose, user, onLogout }) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="font-bold text-slate-800 text-sm">{user?.displayName || 'User'}</div>
        <div className="text-xs text-slate-400">{user?.role || 'Staff'} · Lumiio</div>
      </div>
      <div className="py-1">
        {[
          { icon: <UserCircle size={15} />, label: '프로필 정보' },
          { icon: <Settings size={15} />, label: '계정 설정' },
        ].map((item, i) => (
          <button key={i} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            {item.icon} {item.label}
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 py-1">
        <button onClick={onLogout} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={15} /> 로그아웃
        </button>
      </div>
    </div>
  );
};

// ─── Top-bar Menu Dropdown ──────────────────────────────────────────────
const MenuDropdown = ({ open, onClose, children }) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  if (!open) return null;
  return (
    <div ref={ref} className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden min-w-[340px]">
      {children}
    </div>
  );
};

// ─── Devices Panel Content ──────────────────────────────────────────────
const DevicesPanel = ({ devices, onSync, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', model: '', serial: '', syncSchedule: 'Manual' });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!form.name || !form.model || !form.serial) return;
    setSubmitting(true);
    try {
      await onCreate(form);
      setForm({ name: '', model: '', serial: '', syncSchedule: 'Manual' });
      setShowForm(false);
    } catch { }
    setSubmitting(false);
  };

  return (
    <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">장비 상태</h4>
      {devices.map((dev) => (
        <div key={dev.id} className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm text-slate-800">{dev.name}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              dev.connection === 'Online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {dev.connection === 'Online' ? <Wifi size={10} /> : <WifiOff size={10} />}
              {dev.connection}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="text-slate-400">모델</div><div className="text-slate-700">{dev.model}</div>
            <div className="text-slate-400">시리얼</div><div className="text-slate-700">{dev.serial}</div>
          </div>
          <div className="border-t border-slate-50 pt-2 mt-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="text-slate-400">마지막 동기화</div><div className="text-slate-700">{dev.lastSync || '—'}</div>
              <div className="text-slate-400">스케줄</div><div className="text-slate-700">{dev.syncSchedule}</div>
            </div>
            <button
              onClick={() => onSync(dev.id)}
              className="mt-2 w-full py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw size={12} /> 지금 동기화
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <div className="border border-blue-200 rounded-lg p-3 space-y-2 bg-blue-50/30">
          <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="장비명" className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none" />
          <input value={form.model} onChange={(e) => setForm(f => ({ ...f, model: e.target.value }))}
            placeholder="모델" className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none" />
          <input value={form.serial} onChange={(e) => setForm(f => ({ ...f, serial: e.target.value }))}
            placeholder="시리얼 번호" className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none" />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={submitting}
              className="flex-1 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
              {submitting ? '등록 중...' : '등록'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              취소
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
          <Plus size={12} /> 새 장비 페어링
        </button>
      )}
    </div>
  );
};

// ─── Report Panel Content ───────────────────────────────────────────────
const ReportPanel = ({ selectedExamId }) => {
  const [sections, setSections] = useState({ cbcSummary: true, classification: false, comments: false });
  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">CBC Report (PDF)</h4>
        <div className="space-y-2 text-sm">
          <div className="text-xs text-slate-400 mb-1">포함 섹션</div>
          {Object.entries({ cbcSummary: 'CBC Summary', classification: 'Classification Summary', comments: 'Comments' }).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded transition-colors">
              <input
                type="checkbox"
                checked={sections[key]}
                onChange={() => setSections(p => ({ ...p, [key]: !p[key] }))}
                className="accent-blue-600 w-3.5 h-3.5"
              />
              <span className="text-slate-700 text-xs">{label}</span>
            </label>
          ))}
          <button className="w-full mt-2 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
            <Download size={13} /> PDF 생성
          </button>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">CBC Table (CSV)</h4>
        <button
          onClick={() => examsApi.exportCsv(selectedExamId)}
          className="w-full py-2 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Download size={13} /> .csv 다운로드
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// Dashboard
// ═══════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cbc');

  // Data from API
  const [examList, setExamList] = useState([]);
  const [examRecord, setExamRecord] = useState(null);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedExam, setSelectedExam] = useState(null);

  // Exam search
  const [examSearch, setExamSearch] = useState('');

  // Sort
  const [sortConfig, setSortConfig] = useState({ column: 'id', direction: 'asc' });

  // Note editing
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState('');

  // Top-bar dropdown states
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = useCallback((menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }, []);
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  // ── Initial data load ──────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [user, exams, devs, notifs] = await Promise.all([
          authApi.me(),
          examsApi.list(),
          devicesApi.list(),
          notificationsApi.list(),
        ]);
        if (cancelled) return;
        setCurrentUser(user.user);
        setExamList(exams);
        setDevices(devs);
        setNotifications(notifs);
        if (exams.length > 0) {
          setSelectedExam(exams[0].id);
        }
      } catch {
        navigate('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  // ── Load exam record when selection changes ────
  useEffect(() => {
    if (!selectedExam) return;
    let cancelled = false;
    (async () => {
      try {
        const record = await examsApi.get(selectedExam);
        if (!cancelled) setExamRecord(record);
      } catch { }
    })();
    return () => { cancelled = true; };
  }, [selectedExam]);

  // ── Derived data ─────────────────────────────
  const patientInfo = examRecord?.patient || { id: '', name: '—', gender: '', age: 0, note: '' };
  const cbcData = examRecord?.cbcData || [];
  const cellData = examRecord?.cellData || null;

  const currentNote = patientInfo.note || '';

  const handleNoteEdit = () => { setDraftNote(currentNote); setIsEditingNote(true); };
  const handleNoteSave = async () => {
    try {
      await examsApi.updateNote(selectedExam, draftNote);
      setExamRecord(prev => prev ? { ...prev, patient: { ...prev.patient, note: draftNote } } : prev);
    } catch { }
    setIsEditingNote(false);
  };
  const handleNoteCancel = () => { setIsEditingNote(false); };

  useEffect(() => { setIsEditingNote(false); }, [selectedExam]);

  // ── Notification handlers ──────────────────────
  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { }
  };

  // ── Device handlers ────────────────────────────
  const handleDeviceSync = async (deviceId) => {
    try {
      const updated = await devicesApi.sync(deviceId);
      setDevices(prev => prev.map(d => d.id === deviceId ? updated : d));
    } catch { }
  };

  const handleDeviceCreate = async (form) => {
    const created = await devicesApi.create(form);
    setDevices(prev => [...prev, created]);
  };

  // ── Logout ─────────────────────────────────────
  const handleLogout = async () => {
    try { await authApi.logout(); } catch { }
    navigate('/login');
  };

  // ── Sorting ──────────────────────────────────
  const handleSort = (column) => {
    setSortConfig((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
  };

  const sortedExams = useMemo(() => {
    const q = examSearch.toLowerCase();
    const filtered = examList.filter(
      (exam) =>
        exam.id.toLowerCase().includes(q) ||
        (exam.patientName && exam.patientName.toLowerCase().includes(q)) ||
        (exam.patientId && exam.patientId.toLowerCase().includes(q))
    );
    const sorted = [...filtered];
    const { column, direction } = sortConfig;
    sorted.sort((a, b) => {
      let valA, valB;
      if (column === 'id') { valA = a.id; valB = b.id; }
      else if (column === 'date') { valA = a.date; valB = b.date; }
      else if (column === 'flag') { valA = a.flag ? 1 : 0; valB = b.flag ? 1 : 0; }
      else if (column === 'approved') { valA = a.approved ? 1 : 0; valB = b.approved ? 1 : 0; }
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, examSearch, examList]);

  const SortIcon = ({ column }) => {
    const isActive = sortConfig.column === column;
    if (!isActive) return <ChevronsUpDown size={12} className="text-slate-300 ml-1 inline-block" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={12} className="text-blue-600 ml-1 inline-block" />
      : <ChevronDown size={12} className="text-blue-600 ml-1 inline-block" />;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Cell reclassify/comment callbacks for CellTab ──
  const handleCellReclassify = async (cellId, newType) => {
    const updated = await import('../api').then(m => m.cellsApi.reclassify(selectedExam, cellId, newType));
    setExamRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cellData: {
          ...prev.cellData,
          wbc: prev.cellData.wbc.map(c => c.id === cellId ? updated : c),
        },
      };
    });
    return updated;
  };

  const handleCellComment = async (cellId, comment) => {
    const updated = await import('../api').then(m => m.cellsApi.updateComment(selectedExam, cellId, comment));
    setExamRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cellData: {
          ...prev.cellData,
          wbc: prev.cellData.wbc.map(c => c.id === cellId ? updated : c),
        },
      };
    });
    return updated;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* ===== 1. Top Navigation Bar ===== */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 shadow-sm flex-shrink-0">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Lumiio</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
            <button className="px-3 py-1.5 rounded-md text-slate-900 bg-slate-100 font-semibold">Analysis</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-slate-50 hover:text-slate-800 transition-colors">Patients</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-slate-50 hover:text-slate-800 transition-colors">History</button>

            <div className="w-px h-5 bg-slate-200 mx-2" />

            {/* Devices menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('devices')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${openMenu === 'devices' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <Monitor size={14} /> Devices
              </button>
              <MenuDropdown open={openMenu === 'devices'} onClose={closeMenu}>
                <DevicesPanel devices={devices} onSync={handleDeviceSync} onCreate={handleDeviceCreate} />
              </MenuDropdown>
            </div>

            {/* Report menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('report')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${openMenu === 'report' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <FileBarChart size={14} /> Report
              </button>
              <MenuDropdown open={openMenu === 'report'} onClose={closeMenu}>
                <ReportPanel selectedExamId={selectedExam} />
              </MenuDropdown>
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('settings')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${openMenu === 'settings' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <Settings size={14} /> Settings
              </button>
              <MenuDropdown open={openMenu === 'settings'} onClose={closeMenu}>
                <div className="p-8 text-center text-sm text-slate-400">
                  <Settings size={24} className="mx-auto mb-2 text-slate-300" />
                  기획 중입니다
                </div>
              </MenuDropdown>
            </div>

            {/* Help */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('help')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${openMenu === 'help' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <HelpCircle size={14} /> Help
              </button>
              <MenuDropdown open={openMenu === 'help'} onClose={closeMenu}>
                <div className="p-8 text-center text-sm text-slate-400">
                  <HelpCircle size={24} className="mx-auto mb-2 text-slate-300" />
                  기획 중입니다
                </div>
              </MenuDropdown>
            </div>
          </nav>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('notifications')}
              className={`p-2 rounded-full transition-all relative ${
                openMenu === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              notifications={notifications}
              open={openMenu === 'notifications'}
              onClose={closeMenu}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkRead}
            />
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-1" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('profile')}
              className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors"
            >
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(currentUser?.displayName || 'U').substring(0, 2).toUpperCase()}
              </div>
              <div className="text-xs text-left">
                <div className="font-bold text-slate-700">{currentUser?.displayName || 'User'}</div>
                <div className="text-slate-400">{currentUser?.role || 'Staff'}</div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <ProfileDropdown open={openMenu === 'profile'} onClose={closeMenu} user={currentUser} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* ===== 2. Main Workspace ===== */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">

        {/* ── Left Sidebar ── */}
        <aside className="w-80 flex flex-col gap-4 flex-shrink-0">

          {/* Exam List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">Exam List</h3>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{examList.length}</span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <Search size={13} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="환자명 / 환자ID / 검사ID 검색..."
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
                <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 pl-4 cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort('id')}>
                      <span className="inline-flex items-center">ID <SortIcon column="id" /></span>
                    </th>
                    <th className="p-2.5 cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort('date')}>
                      <span className="inline-flex items-center">Date <SortIcon column="date" /></span>
                    </th>
                    <th className="p-2.5 text-center cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort('flag')}>
                      <span className="inline-flex items-center justify-center">Flag <SortIcon column="flag" /></span>
                    </th>
                    <th className="p-2.5 text-center cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort('approved')}>
                      <span className="inline-flex items-center justify-center">승인 <SortIcon column="approved" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedExams.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-xs text-slate-400">검색 결과가 없습니다</td></tr>
                  ) : (
                    sortedExams.map((exam) => (
                      <tr
                        key={exam.id}
                        onClick={() => setSelectedExam(exam.id)}
                        className={`text-xs cursor-pointer transition-colors ${selectedExam === exam.id ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                      >
                        <td className={`p-2.5 pl-4 font-medium ${selectedExam === exam.id ? 'text-blue-700' : 'text-slate-700'}`}>
                          {exam.id}
                        </td>
                        <td className="p-2.5 text-slate-500">
                          {exam.date.split(' ')[0]}
                          <div className="text-[10px] text-slate-400">{exam.date.split(' ')[1]}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${exam.flag ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-slate-300'}`} />
                        </td>
                        <td className="p-2.5 text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${exam.approved ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-300'}`} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">Patient Info</div>
                <div className="font-bold text-slate-800">{patientInfo.name}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">ID</span>
                <span className="font-medium text-slate-700">{patientInfo.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Gender / Age</span>
                <span className="font-medium text-slate-700">{patientInfo.gender} / {patientInfo.age}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">검사일시</span>
                <span className="font-medium text-slate-700">{examRecord?.exam.date || '—'}</span>
              </div>
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-xs uppercase">Clinical Note</span>
                  {!isEditingNote ? (
                    <button onClick={handleNoteEdit} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-600 transition-colors">
                      <Pencil size={11} /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button onClick={handleNoteSave} className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700 font-medium">
                        <Check size={11} /> Save
                      </button>
                      <span className="text-slate-300 text-xs">|</span>
                      <button onClick={handleNoteCancel} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500">
                        <X size={11} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                {isEditingNote ? (
                  <textarea
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    className="w-full text-slate-700 bg-white border border-blue-300 ring-1 ring-blue-200 p-2 rounded text-xs leading-relaxed resize-none outline-none focus:border-blue-400"
                    rows={3}
                    autoFocus
                  />
                ) : (
                  <p className={`text-slate-700 p-2 rounded text-xs leading-relaxed ${currentNote ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-slate-100 text-slate-400 italic'}`}>
                    {currentNote || '메모 없음'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right Content Area ── */}
        <main className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          {/* Tab Bar */}
          <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 bg-white shrink-0">
            {['CBC Result', 'Cell Classification', 'Slide Viewer'].map((label) => {
              const key = label === 'CBC Result' ? 'cbc' : label === 'Cell Classification' ? 'cell' : 'viewer';
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-4 text-sm font-medium transition-all relative ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_6px_rgba(37,99,235,0.3)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Viewport */}
          <div className="flex-1 overflow-hidden relative bg-slate-50/50">
            <div className="absolute inset-0 p-6 overflow-auto">
              {activeTab === 'cbc' && <CBCTab cbcData={cbcData} />}
              {activeTab === 'cell' && (
                <CellTab
                  examId={selectedExam}
                  cellData={cellData}
                  onReclassify={handleCellReclassify}
                  onCommentSave={handleCellComment}
                />
              )}
              {activeTab === 'viewer' && <ViewerTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
