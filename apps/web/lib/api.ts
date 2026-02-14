const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) => request<any>('/auth/me', { token }),
};

// Properties API
export const propertiesApi = {
  getAll: (token: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ data: any[]; meta: any }>(`/properties${query}`, {
      token,
    });
  },

  getOne: (token: string, id: string) =>
    request<any>(`/properties/${id}`, { token }),

  create: (token: string, data: any) =>
    request<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (token: string, id: string, data: any) =>
    request<any>(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: (token: string, id: string) =>
    request<any>(`/properties/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Tenants API
export const tenantsApi = {
  getAll: (token: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ data: any[]; meta: any }>(`/tenants${query}`, { token });
  },

  getOne: (token: string, id: string) =>
    request<any>(`/tenants/${id}`, { token }),

  create: (token: string, data: any) =>
    request<any>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (token: string, id: string, data: any) =>
    request<any>(`/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: (token: string, id: string) =>
    request<any>(`/tenants/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Leases API
export const leasesApi = {
  getAll: (token: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ data: any[]; meta: any }>(`/leases${query}`, { token });
  },

  getOne: (token: string, id: string) =>
    request<any>(`/leases/${id}`, { token }),

  create: (token: string, data: any) =>
    request<any>('/leases', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (token: string, id: string, data: any) =>
    request<any>(`/leases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: (token: string, id: string) =>
    request<any>(`/leases/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Payments API
export const paymentsApi = {
  getAll: (token: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ data: any[]; meta: any }>(`/payments${query}`, { token });
  },

  getOne: (token: string, id: string) =>
    request<any>(`/payments/${id}`, { token }),

  create: (token: string, data: any) =>
    request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (token: string, id: string, data: any) =>
    request<any>(`/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: (token: string, id: string) =>
    request<any>(`/payments/${id}`, {
      method: 'DELETE',
      token,
    }),

  recordPayment: (token: string, data: any) =>
    request<any>('/payments/record', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getSummary: (token: string) => request<any>('/payments/summary', { token }),
};

// Dashboard API
export const dashboardApi = {
  getStats: (token: string) => request<any>('/dashboard/stats', { token }),

  getRecentActivity: (token: string, limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return request<any>(`/dashboard/recent-activity${query}`, { token });
  },

  getFinancialSummary: (token: string) =>
    request<any>('/dashboard/financial-summary', { token }),
};
