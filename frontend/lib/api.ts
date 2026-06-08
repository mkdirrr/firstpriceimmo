const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export type PropertyFilter = {
  category?: string;
  transactionType?: string;
  status?: string;
};

export type DashboardStats = {
  totalProperties: number;
  totalLeads: number;
  totalUsers: number;
  activeProperties: number;
  saleProperties: number;
  rentProperties: number;
  recentProperties: {
    id: string;
    title: string;
    category: string;
    price: number;
    status: string;
    createdAt: string;
  }[];
  recentLeads: {
    id: string;
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    createdAt: string;
    property?: { title?: string };
  }[];
};

export async function fetchProperties(filters: PropertyFilter = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const url = `${API_BASE}/properties${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load properties');
  }

  return response.json();
}

export async function fetchProperty(id: string) {
  const response = await fetch(`${API_BASE}/properties/${id}`);
  if (!response.ok) {
    throw new Error('Property not found');
  }
  return response.json();
}

export async function submitContactLead(data: { name: string; email: string; phone: string; propertyId: string; }) {
  const response = await fetch(`${API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit lead');
  }

  return response.json();
}

export async function loginAdmin(payload: { email: string; password: string; }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error || data?.message || 'Login failed. Please try again.';
    throw new Error(errorMessage);
  }

  return data;
}

export async function createProperty(data: any, token: string) {
  const response = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create property');
  }

  return response.json();
}

export async function updateProperty(id: string, data: any, token: string) {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update property');
  }

  return response.json();
}

export async function deleteProperty(id: string, token: string) {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to delete property');
  }

  return response.json();
}

export async function fetchContactLeads(token: string) {
  const response = await fetch(`${API_BASE}/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to load leads');
  }

  return response.json();
}

export async function updateLeadStatus(id: string, payload: { status?: string; notes?: string }, token: string) {
  const response = await fetch(`${API_BASE}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update lead status or notes');
  }

  return response.json();
}

export async function deleteLead(id: string, token: string) {
  const response = await fetch(`${API_BASE}/contacts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }

  return response.json();
}

export async function createPropertyMultipart(formData: FormData, token: string) {
  const response = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = data?.error || (Array.isArray(data?.errors) ? data.errors.join(', ') : null) || 'Impossible de créer le bien.';
    throw new Error(msg);
  }

  return data;
}

export async function updatePropertyMultipart(id: string, formData: FormData, token: string) {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update property');
  }

  return response.json();
}

export async function fetchDashboardStats(token: string): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to load dashboard stats');
  }

  return response.json();
}

export async function fetchUsers(token: string) {
  const response = await fetch(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to load users');
  }

  return response.json();
}

export async function fetchTransactions(token: string) {
  const response = await fetch(`${API_BASE}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to load transactions');
  return response.json();
}

export async function createTransaction(data: any, token: string) {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create transaction');
  return response.json();
}

export async function updateTransaction(id: string, data: any, token: string) {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update transaction');
  return response.json();
}

export async function deleteTransaction(id: string, token: string) {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete transaction');
  return response.json();
}
