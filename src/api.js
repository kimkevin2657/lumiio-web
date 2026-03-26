const API_BASE = process.env.REACT_APP_API_URL || '/api';

function getToken() {
  return localStorage.getItem('lumiio_token') || '';
}

function setToken(token) {
  if (token) {
    localStorage.setItem('lumiio_token', token);
  } else {
    localStorage.removeItem('lumiio_token');
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/register')) {
    setToken(null);
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

async function downloadBlob(path, filename) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ─── Auth ────────────────────────────────────────────────────────────
export const authApi = {
  login: async (username, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    return data;
  },

  register: async (username, password, displayName) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, displayName }),
    });
    setToken(data.token);
    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch { }
    setToken(null);
  },

  me: () => request('/auth/me'),

  isLoggedIn: () => !!getToken(),
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

  downloadCsv: (examId) =>
    downloadBlob(`/exams/${examId}/report/csv`, `${examId}.csv`),

  downloadPdf: (examId, sections = 'cbcSummary,classification,comments') =>
    downloadBlob(`/exams/${examId}/report/pdf?sections=${sections}`, `${examId}.pdf`),
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
