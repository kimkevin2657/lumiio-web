const API_BASE = process.env.REACT_APP_API_URL || '/api';
const USER_TOKEN_KEY = 'lumiio_token';
const SUPERADMIN_TOKEN_KEY = 'lumiio_superadmin_token';

function getTokenByKey(key) {
  return localStorage.getItem(key) || '';
}

function setTokenByKey(key, token) {
  if (token) localStorage.setItem(key, token);
  else localStorage.removeItem(key);
}

async function requestWithToken(path, options = {}, tokenKey, unauthorizedRedirectPath, authBypassMatchers = []) {
  const url = `${API_BASE}${path}`;
  const token = getTokenByKey(tokenKey);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const bypass = authBypassMatchers.some((matcher) => path.includes(matcher));
  if (res.status === 401 && !bypass) {
    setTokenByKey(tokenKey, null);
    if (unauthorizedRedirectPath) window.location.href = unauthorizedRedirectPath;
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res;
}

const request = (path, options = {}) =>
  requestWithToken(path, options, USER_TOKEN_KEY, '/login', ['/auth/login', '/auth/register']);

const requestSuperadmin = (path, options = {}) =>
  requestWithToken(path, options, SUPERADMIN_TOKEN_KEY, '/manufacturer/login', ['/manufacturer/auth/login', '/manufacturer/auth/setup']);

async function downloadBlob(path, filename) {
  const url = `${API_BASE}${path}`;
  const token = getTokenByKey(USER_TOKEN_KEY);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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
    setTokenByKey(USER_TOKEN_KEY, data.token);
    return data;
  },

  register: async (username, password, displayName) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, displayName }),
    });
    setTokenByKey(USER_TOKEN_KEY, data.token);
    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch { }
    setTokenByKey(USER_TOKEN_KEY, null);
  },

  me: () => request('/auth/me'),

  isLoggedIn: () => !!getTokenByKey(USER_TOKEN_KEY),
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

// ─── Manufacturer Auth + APIs ─────────────────────────────────────────
export const superadminApi = {
  isLoggedIn: () => !!getTokenByKey(SUPERADMIN_TOKEN_KEY),
  clearToken: () => setTokenByKey(SUPERADMIN_TOKEN_KEY, null),
};

export const mfrAuthApi = {
  setup: (username, password, displayName, setupKey) =>
    requestSuperadmin('/manufacturer/auth/setup', {
      method: 'POST',
      headers: { 'X-Setup-Key': setupKey || '' },
      body: JSON.stringify({ username, password, displayName }),
    }),

  login: async (username, password) => {
    const data = await requestSuperadmin('/manufacturer/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setTokenByKey(SUPERADMIN_TOKEN_KEY, data.token);
    return data;
  },

  logout: async () => {
    try {
      await requestSuperadmin('/manufacturer/auth/logout', { method: 'POST' });
    } catch { }
    setTokenByKey(SUPERADMIN_TOKEN_KEY, null);
  },

  me: () => requestSuperadmin('/manufacturer/auth/me'),
};

export const mfrSerialsApi = {
  list: (query = '') => requestSuperadmin(`/manufacturer/serials${query ? `?${query}` : ''}`),
  create: (payload) => requestSuperadmin('/manufacturer/serials', { method: 'POST', body: JSON.stringify(payload) }),
  createBatch: (payload) => requestSuperadmin('/manufacturer/serials/batch', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id, status) => requestSuperadmin(`/manufacturer/serials/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => requestSuperadmin(`/manufacturer/serials/${id}`, { method: 'DELETE' }),
};

export const mfrDevicesApi = {
  list: (query = '') => requestSuperadmin(`/manufacturer/devices${query ? `?${query}` : ''}`),
  get: (deviceId) => requestSuperadmin(`/manufacturer/devices/${deviceId}`),
  updateStatus: (deviceId, status) => requestSuperadmin(`/manufacturer/devices/${deviceId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const mfrStatsApi = {
  overview: () => requestSuperadmin('/manufacturer/stats/overview'),
  registrations: (query = '') => requestSuperadmin(`/manufacturer/stats/registrations${query ? `?${query}` : ''}`),
  usage: () => requestSuperadmin('/manufacturer/stats/usage'),
  models: () => requestSuperadmin('/manufacturer/stats/models'),
};

export const mfrIssuesApi = {
  list: (query = '') => requestSuperadmin(`/manufacturer/issues${query ? `?${query}` : ''}`),
  create: (payload) => requestSuperadmin('/manufacturer/issues', { method: 'POST', body: JSON.stringify(payload) }),
  get: (id) => requestSuperadmin(`/manufacturer/issues/${id}`),
  update: (id, payload) => requestSuperadmin(`/manufacturer/issues/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  addComment: (id, content) => requestSuperadmin(`/manufacturer/issues/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  remove: (id) => requestSuperadmin(`/manufacturer/issues/${id}`, { method: 'DELETE' }),
};

export const mfrReturnsApi = {
  list: (query = '') => requestSuperadmin(`/manufacturer/returns${query ? `?${query}` : ''}`),
  create: (payload) => requestSuperadmin('/manufacturer/returns', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => requestSuperadmin(`/manufacturer/returns/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  get: (id) => requestSuperadmin(`/manufacturer/returns/${id}`),
};

export const mfrUsersApi = {
  list: (query = '') => requestSuperadmin(`/manufacturer/users${query ? `?${query}` : ''}`),
  get: (id) => requestSuperadmin(`/manufacturer/users/${id}`),
};
