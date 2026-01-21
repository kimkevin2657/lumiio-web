// src/data.js

export const EXAM_LIST = [
  { id: 'CBC-2025-001', date: '2025-03-18 09:42', flag: true, approved: true },
  { id: 'CBC-2025-002', date: '2025-04-01 10:05', flag: false, approved: true },
  { id: 'CBC-2025-003', date: '2025-07-22 10:37', flag: true, approved: false },
  { id: 'CBC-2025-004', date: '2025-07-23 11:00', flag: false, approved: false }, // Extra for UI fill
];

export const PATIENT_INFO = {
  id: 'P-000873',
  name: '홍길동',
  gender: '남',
  examDate: '2025-03-18 09:42',
  note: 'WBC 증가, 과립구 비율 상승'
};

export const CBC_DATA = [
  { item: 'RBC', result: 5.02, unit: '10⁶/µL', range: '4.50-6.00', flag: '' },
  { item: 'HGB', result: 15.3, unit: 'g/dL', range: '14.0-18.1', flag: '' },
  { item: 'HCT', result: 45.1, unit: '%', range: '41.0-49.0', flag: '' },
  { item: 'MCV', result: 89.8, unit: 'fL', range: '81-98', flag: '' },
  { item: 'MCH', result: 30.5, unit: 'pg', range: '27.0-32.0', flag: '' },
  { item: 'MCHC', result: 34.1, unit: 'g/dL', range: '31-35', flag: '' },
  { item: 'RDW-CV', result: 14.8, unit: '%', range: '11.1-14.3', flag: 'H' },
  { item: 'RDW-SD', result: 46.2, unit: 'fL', range: '37.4-52.4', flag: '' },
  // Spacer for UI logic if needed, simplified for brevity
  { item: 'WBC', result: 7.6, unit: '10³/µL', range: '3.9-10.7', flag: '' },
  { item: 'GRA', result: 5.6, unit: '10³/µL', range: '1.5-8.5', flag: '' },
  { item: 'LYM', result: 1.4, unit: '10³/µL', range: '1.1-3.5', flag: '' },
  { item: 'MON', result: 0.6, unit: '10³/µL', range: '0.3-1.1', flag: '' },
  { item: 'GRA%', result: 76.0, unit: '%', range: '35.0-75.0', flag: 'H' },
  { item: 'LYM%', result: 17.0, unit: '%', range: '15.0-49.0', flag: '' },
  { item: 'MON%', result: 7.0, unit: '%', range: '3.5-12.0', flag: '' },
  { item: 'PLT', result: 392, unit: '10³/µL', range: '135-371', flag: 'H' },
  { item: 'MPV', result: 11.1, unit: 'fL', range: '9.3-12.8', flag: '' },
  { item: 'PCT', result: 0.27, unit: '%', range: '0.14-0.28', flag: '' },
  { item: 'PDW', result: 44.0, unit: '%', range: '39.3-64.7', flag: '' },
];

export const CELL_SUMMARY = {
  wbc: 73,
  gra: 45,
  lym: 18,
  mon: 7,
  uncertain: 3,
  rbc: 2041,
  rbc_normal: 2039,
  rbc_abnormal: 2,
  plt: 60,
  plt_normal: 60,
  plt_abnormal: 0
};