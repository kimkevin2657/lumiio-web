// ============================================================
// Lumiio — Centralized Data Store
// ============================================================

// --- Per-exam database keyed by exam ID ---
export const EXAMS_DATABASE = {
  'CBC-2025-001': {
    exam: {
      id: 'CBC-2025-001',
      date: '2025-03-18 09:42',
      flag: true,
      approved: true,
    },
    patient: {
      id: 'P-000873',
      name: '홍길동',
      gender: '남',
      age: 45,
      note: 'WBC 증가, 과립구 비율 상승',
    },
    cbcData: [
      // RBC Indices
      { section: 'RBC Indices', item: 'RBC',    result: '5.02', unit: '10⁶/μL', range: '4.50–6.00', flag: '' },
      { section: 'RBC Indices', item: 'HGB',    result: '15.3', unit: 'g/dL',   range: '14.0–18.1', flag: '' },
      { section: 'RBC Indices', item: 'HCT',    result: '45.1', unit: '%',      range: '41.0–49.0', flag: '' },
      { section: 'RBC Indices', item: 'MCV',    result: '89.8', unit: 'fL',     range: '81–98',     flag: '' },
      { section: 'RBC Indices', item: 'MCH',    result: '30.5', unit: 'pg',     range: '27.0–32.0', flag: '' },
      { section: 'RBC Indices', item: 'MCHC',   result: '34.1', unit: 'g/dL',   range: '31–35',     flag: '' },
      { section: 'RBC Indices', item: 'RDW-CV', result: '14.8', unit: '%',      range: '11.1–14.3', flag: 'H' },
      { section: 'RBC Indices', item: 'RDW-SD', result: '46.2', unit: 'fL',     range: '37.4–52.4', flag: '' },
      // WBC Indices
      { section: 'WBC Indices', item: 'WBC',    result: '7.6',  unit: '10³/μL', range: '3.9–10.7',  flag: '' },
      { section: 'WBC Indices', item: 'GRA',    result: '5.6',  unit: '10³/μL', range: '1.5–8.5',   flag: '' },
      { section: 'WBC Indices', item: 'LYM',    result: '1.4',  unit: '10³/μL', range: '1.1–3.5',   flag: '' },
      { section: 'WBC Indices', item: 'MON',    result: '0.6',  unit: '10³/μL', range: '0.3–1.1',   flag: '' },
      { section: 'WBC Indices', item: 'GRA%',   result: '76.0', unit: '%',      range: '35.0–75.0', flag: 'H' },
      { section: 'WBC Indices', item: 'LYM%',   result: '17.0', unit: '%',      range: '15.0–49.0', flag: '' },
      { section: 'WBC Indices', item: 'MON%',   result: '7.0',  unit: '%',      range: '3.5–12.0',  flag: '' },
      // Platelet Indices
      { section: 'Platelet Indices', item: 'PLT', result: '392',  unit: '10³/μL', range: '135–371',  flag: 'H' },
      { section: 'Platelet Indices', item: 'MPV', result: '11.1', unit: 'fL',     range: '9.3–12.8', flag: '' },
      { section: 'Platelet Indices', item: 'PCT', result: '0.27', unit: '%',      range: '0.14–0.28',flag: '' },
      { section: 'Platelet Indices', item: 'PDW', result: '44.0', unit: '%',      range: '39.3–64.7',flag: '' },
    ],
    // Cell classification data for this exam
    cellData: {
      wbc: [
        ...Array.from({ length: 45 }, (_, i) => ({ id: `g-${i}`, type: 'Granulocyte', conf: 0.98, aiPrediction: 'Granulocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 18 }, (_, i) => ({ id: `l-${i}`, type: 'Lymphocyte', conf: 0.95, aiPrediction: 'Lymphocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 7 }, (_, i) => ({ id: `m-${i}`, type: 'Monocyte', conf: 0.92, aiPrediction: 'Monocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 3 }, (_, i) => ({ id: `u-${i}`, type: 'Uncertain', conf: 0.45, aiPrediction: 'Uncertain', reclassified: false, comment: '' })),
      ],
      rbcMorphology: [
        { label: 'Normal', value: 2041, highlight: true },
        { label: 'Macrocytosis', value: 0 },
        { label: 'Microcytosis', value: 0 },
        { label: 'Schistocyte', value: 0 },
        { label: 'Teardrop cell', value: 0 },
      ],
      pltMorphology: [
        { label: 'Normal', value: 248, highlight: true },
        { label: 'Clumping', value: 0 },
        { label: 'Large/Giant', value: 0 },
        { label: 'Activated', value: 0 },
      ],
    },
  },

  'CBC-2025-002': {
    exam: {
      id: 'CBC-2025-002',
      date: '2025-04-01 10:05',
      flag: false,
      approved: true,
    },
    patient: {
      id: 'P-000890',
      name: '김철수',
      gender: '남',
      age: 52,
      note: '',
    },
    cbcData: [
      // RBC Indices
      { section: 'RBC Indices', item: 'RBC',    result: '4.67', unit: '10⁶/μL', range: '4.50–6.00', flag: '' },
      { section: 'RBC Indices', item: 'HGB',    result: '15.3', unit: 'g/dL',   range: '14.0–18.1', flag: '' },
      { section: 'RBC Indices', item: 'HCT',    result: '45.7', unit: '%',      range: '41.0–49.0', flag: '' },
      { section: 'RBC Indices', item: 'MCV',    result: '87.2', unit: 'fL',     range: '81–98',     flag: '' },
      { section: 'RBC Indices', item: 'MCH',    result: '31.0', unit: 'pg',     range: '27.0–32.0', flag: '' },
      { section: 'RBC Indices', item: 'MCHC',   result: '33.9', unit: 'g/dL',   range: '31–35',     flag: '' },
      { section: 'RBC Indices', item: 'RDW-CV', result: '13.3', unit: '%',      range: '11.1–14.3', flag: '' },
      { section: 'RBC Indices', item: 'RDW-SD', result: '47.5', unit: 'fL',     range: '37.4–52.4', flag: '' },
      // WBC Indices
      { section: 'WBC Indices', item: 'WBC',    result: '7.5',  unit: '10³/μL', range: '3.9–10.7',  flag: '' },
      { section: 'WBC Indices', item: 'GRA',    result: '5.0',  unit: '10³/μL', range: '1.5–8.5',   flag: '' },
      { section: 'WBC Indices', item: 'LYM',    result: '1.6',  unit: '10³/μL', range: '1.1–3.5',   flag: '' },
      { section: 'WBC Indices', item: 'MON',    result: '0.9',  unit: '10³/μL', range: '0.3–1.1',   flag: '' },
      { section: 'WBC Indices', item: 'GRA%',   result: '65.0', unit: '%',      range: '35.0–75.0', flag: '' },
      { section: 'WBC Indices', item: 'LYM%',   result: '25.0', unit: '%',      range: '15.0–49.0', flag: '' },
      { section: 'WBC Indices', item: 'MON%',   result: '10.0', unit: '%',      range: '3.5–12.0',  flag: '' },
      // Platelet Indices
      { section: 'Platelet Indices', item: 'PLT', result: '260',  unit: '10³/μL', range: '135–371',  flag: '' },
      { section: 'Platelet Indices', item: 'MPV', result: '11.8', unit: 'fL',     range: '9.3–12.8', flag: '' },
      { section: 'Platelet Indices', item: 'PCT', result: '0.21', unit: '%',      range: '0.14–0.28',flag: '' },
      { section: 'Platelet Indices', item: 'PDW', result: '48.3', unit: '%',      range: '39.3–64.7',flag: '' },
    ],
    cellData: {
      wbc: [
        ...Array.from({ length: 40 }, (_, i) => ({ id: `g-${i}`, type: 'Granulocyte', conf: 0.97, aiPrediction: 'Granulocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 20 }, (_, i) => ({ id: `l-${i}`, type: 'Lymphocyte', conf: 0.94, aiPrediction: 'Lymphocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 8 }, (_, i) => ({ id: `m-${i}`, type: 'Monocyte', conf: 0.91, aiPrediction: 'Monocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 2 }, (_, i) => ({ id: `u-${i}`, type: 'Uncertain', conf: 0.42, aiPrediction: 'Uncertain', reclassified: false, comment: '' })),
      ],
      rbcMorphology: [
        { label: 'Normal', value: 1876, highlight: true },
        { label: 'Macrocytosis', value: 0 },
        { label: 'Microcytosis', value: 0 },
        { label: 'Schistocyte', value: 0 },
        { label: 'Teardrop cell', value: 0 },
      ],
      pltMorphology: [
        { label: 'Normal', value: 260, highlight: true },
        { label: 'Clumping', value: 0 },
        { label: 'Large/Giant', value: 0 },
        { label: 'Activated', value: 0 },
      ],
    },
  },

  'CBC-2025-003': {
    exam: {
      id: 'CBC-2025-003',
      date: '2025-07-22 10:37',
      flag: true,
      approved: false,
    },
    patient: {
      id: 'P-000423',
      name: '이영희',
      gender: '여',
      age: 38,
      note: '빈혈',
    },
    cbcData: [
      // RBC Indices — female reference ranges
      { section: 'RBC Indices', item: 'RBC',    result: '4.67', unit: '10⁶/μL', range: '4.00–5.50', flag: '' },
      { section: 'RBC Indices', item: 'HGB',    result: '10.8', unit: 'g/dL',   range: '11.8–16.0', flag: 'L' },
      { section: 'RBC Indices', item: 'HCT',    result: '34.7', unit: '%',      range: '36.0–43.0', flag: 'L' },
      { section: 'RBC Indices', item: 'MCV',    result: '87.0', unit: 'fL',     range: '81–98',     flag: '' },
      { section: 'RBC Indices', item: 'MCH',    result: '28.4', unit: 'pg',     range: '27.0–32.0', flag: '' },
      { section: 'RBC Indices', item: 'MCHC',   result: '32.2', unit: 'g/dL',   range: '31–35',     flag: '' },
      { section: 'RBC Indices', item: 'RDW-CV', result: '13.5', unit: '%',      range: '11.1–14.3', flag: '' },
      { section: 'RBC Indices', item: 'RDW-SD', result: '44.4', unit: 'fL',     range: '37.4–52.4', flag: '' },
      // WBC Indices
      { section: 'WBC Indices', item: 'WBC',    result: '7.1',  unit: '10³/μL', range: '3.9–10.7',  flag: '' },
      { section: 'WBC Indices', item: 'GRA',    result: '5.2',  unit: '10³/μL', range: '1.5–8.5',   flag: '' },
      { section: 'WBC Indices', item: 'LYM',    result: '1.1',  unit: '10³/μL', range: '1.1–3.5',   flag: '' },
      { section: 'WBC Indices', item: 'MON',    result: '0.8',  unit: '10³/μL', range: '0.3–1.1',   flag: '' },
      { section: 'WBC Indices', item: 'GRA%',   result: '70.8', unit: '%',      range: '35.0–75.0', flag: '' },
      { section: 'WBC Indices', item: 'LYM%',   result: '20.2', unit: '%',      range: '15.0–49.0', flag: '' },
      { section: 'WBC Indices', item: 'MON%',   result: '9.0',  unit: '%',      range: '3.5–12.0',  flag: '' },
      // Platelet Indices
      { section: 'Platelet Indices', item: 'PLT', result: '251',  unit: '10³/μL', range: '135–371',  flag: '' },
      { section: 'Platelet Indices', item: 'MPV', result: '10.7', unit: 'fL',     range: '9.3–12.8', flag: '' },
      { section: 'Platelet Indices', item: 'PCT', result: '0.25', unit: '%',      range: '0.15–0.31',flag: '' },
      { section: 'Platelet Indices', item: 'PDW', result: '46.0', unit: '%',      range: '39.3–64.7',flag: '' },
    ],
    cellData: {
      wbc: [
        ...Array.from({ length: 42 }, (_, i) => ({ id: `g-${i}`, type: 'Granulocyte', conf: 0.96, aiPrediction: 'Granulocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 15 }, (_, i) => ({ id: `l-${i}`, type: 'Lymphocyte', conf: 0.93, aiPrediction: 'Lymphocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 6 }, (_, i) => ({ id: `m-${i}`, type: 'Monocyte', conf: 0.90, aiPrediction: 'Monocyte', reclassified: false, comment: '' })),
        ...Array.from({ length: 4 }, (_, i) => ({ id: `u-${i}`, type: 'Uncertain', conf: 0.38, aiPrediction: 'Uncertain', reclassified: false, comment: '' })),
      ],
      rbcMorphology: [
        { label: 'Normal', value: 1650, highlight: true },
        { label: 'Macrocytosis', value: 3 },
        { label: 'Microcytosis', value: 12 },
        { label: 'Schistocyte', value: 0 },
        { label: 'Teardrop cell', value: 2 },
      ],
      pltMorphology: [
        { label: 'Normal', value: 240, highlight: true },
        { label: 'Clumping', value: 0 },
        { label: 'Large/Giant', value: 2 },
        { label: 'Activated', value: 0 },
      ],
    },
  },
};

// --- Flat exam list derived from database ---
export const EXAM_LIST = Object.values(EXAMS_DATABASE).map((entry) => ({
  id: entry.exam.id,
  date: entry.exam.date,
  flag: entry.exam.flag,
  approved: entry.exam.approved,
  patientName: entry.patient.name,
  patientId: entry.patient.id,
}));

// --- Helper: get full record by exam ID ---
export const getExamRecord = (examId) => EXAMS_DATABASE[examId] || null;

// --- Default patient info (fallback / legacy compat) ---
export const PATIENT_INFO = EXAMS_DATABASE['CBC-2025-001'].patient;

// --- Default CBC_DATA (fallback / legacy compat) ---
export const CBC_DATA = EXAMS_DATABASE['CBC-2025-001'].cbcData;

// --- Notifications (mock) ---
export const NOTIFICATIONS = [
  { id: 1, type: 'flag', title: 'CBC-2025-003 이상 플래그', message: 'HGB, HCT 수치가 참고 범위 이하입니다.', time: '2분 전', read: false },
  { id: 2, type: 'approval', title: 'CBC-2025-001 승인 완료', message: 'Dr. Kim이 결과를 승인하였습니다.', time: '1시간 전', read: false },
  { id: 3, type: 'sync', title: '장비 동기화 완료', message: 'Sysmex XN-1000 동기화가 완료되었습니다.', time: '3시간 전', read: true },
  { id: 4, type: 'info', title: '시스템 업데이트', message: 'v2.1.0 업데이트가 적용되었습니다.', time: '1일 전', read: true },
];

// --- Device data (mock) ---
export const DEVICES = [
  {
    id: 'dev-001',
    name: 'Sysmex XN-1000',
    model: 'XN-1000',
    serial: 'SN-2024-00412',
    connection: 'Online',
    lastSync: '2025-07-22 10:30',
    syncSchedule: 'Hourly',
  },
  {
    id: 'dev-002',
    name: 'CellaVision DC-1',
    model: 'DC-1',
    serial: 'CV-2023-00987',
    connection: 'Online',
    lastSync: '2025-07-22 09:15',
    syncSchedule: 'Daily @ 09:00',
  },
];