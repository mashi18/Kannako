const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kanakko_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const auth = {
  login: (phone, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),
  register: (name, phone, password, shopName) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, password, shopName }),
    }),
  getMe: () => request('/auth/me'),
};

export const transactions = {
  create: (data) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transactions${query ? `?${query}` : ''}`);
  },
  stats: () => request('/transactions/stats'),
  sync: (txns) =>
    request('/transactions/sync', {
      method: 'POST',
      body: JSON.stringify({ transactions: txns }),
    }),
};

export const ledger = {
  create: (data) =>
    request('/ledger', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  list: (search = '') =>
    request(`/ledger${search ? `?search=${search}` : ''}`),
  get: (id) => request(`/ledger/${id}`),
  update: (id, data) =>
    request(`/ledger/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/ledger/${id}`, { method: 'DELETE' }),
};
