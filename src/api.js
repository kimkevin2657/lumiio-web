const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (res.status === 401 && !path.includes('/auth/')) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res;
}

// ─── Auth ────────────────────────────────────────────────────────────
export const authApi = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  me: () => request('/auth/me'),
};

// ─── Exams ───────────────────────────────────────────────────────────
export const examsApi = {
  list: () => request('/exams'),

  get: (examId) => request(`/exams/${examId}`),

  create: (data) =>
    request('/exams', { method: 'POST', body: JSON.stringify(data) }),

  updateNote: (examId, note) =>
    request(`/exams/${examId}/note`, {
      method: 'PATCH',
      body: JSON.stringify({ note }),
    }),

  toggleApprove: (examId, approved) =>
    request(`/exams/${examId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    }),

  toggleFlag: (examId, flag) =>
    request(`/exams/${examId}/flag`, {
      method: 'PATCH',
      body: JSON.stringify({ flag }),
    }),

  exportCsv: (examId) => {
    const url = `${API_BASE}/exams/${examId}/report/csv`;
    window.open(url, '_blank');
  },
};

// ─── Cells ───────────────────────────────────────────────────────────
export const cellsApi = {
  reclassify: (examId, cellId, type) =>
    request(`/exams/${examId}/cells/${cellId}/reclassify`, {
      method: 'PATCH',
      body: JSON.stringify({ type }),
    }),

  updateComment: (examId, cellId, comment) =>
    request(`/exams/${examId}/cells/${cellId}/comment`, {
      method: 'PATCH',
      body: JSON.stringify({ comment }),
    }),
};

// ─── Devices ─────────────────────────────────────────────────────────
export const devicesApi = {
  list: () => request('/devices'),

  create: (data) =>
    request('/devices', { method: 'POST', body: JSON.stringify(data) }),

  remove: (deviceId) =>
    request(`/devices/${deviceId}`, { method: 'DELETE' }),

  sync: (deviceId) =>
    request(`/devices/${deviceId}/sync`, { method: 'POST' }),
};

// ─── Notifications ───────────────────────────────────────────────────
export const notificationsApi = {
  list: () => request('/notifications'),

  markRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllRead: () =>
    request('/notifications/read-all', { method: 'PATCH' }),
};
