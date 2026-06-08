import { createClient } from '../utils/supabase/client';

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
  recentProperties: any[];
  recentLeads: any[];
};

const supabase = createClient();

export async function fetchProperties(filters: PropertyFilter = {}) {
  let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
  
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.transactionType) query = query.eq('transaction_type', filters.transactionType);
  if (filters.status) query = query.eq('status', filters.status);
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  // Transform snake_case to camelCase for the frontend
  return data.map(p => ({
    ...p,
    transactionType: p.transaction_type,
    imageUrls: p.image_urls,
    createdAt: p.created_at,
  }));
}

export async function fetchProperty(id: string) {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return {
    ...data,
    transactionType: data.transaction_type,
    imageUrls: data.image_urls,
    createdAt: data.created_at,
  };
}

export async function submitContactLead(data: { name: string; email: string; phone: string; propertyId: string; }) {
  const { data: lead, error } = await supabase.from('contacts').insert([{
    name: data.name,
    email: data.email,
    phone: data.phone,
    property_id: data.propertyId,
  }]).select().single();
  
  if (error) throw new Error(error.message);
  return lead;
}

export async function loginAdmin(payload: { email: string; password: string; }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });
  
  if (error) throw new Error(error.message);
  return { token: data.session?.access_token, user: data.user };
}

export async function createProperty(data: any, token?: string) {
  const payload = {
    title: data.title,
    description: data.description,
    category: data.category,
    transaction_type: data.transactionType,
    price: data.price,
    image_urls: data.imageUrls || [],
    status: data.status || 'ACTIVE'
  };
  const { data: prop, error } = await supabase.from('properties').insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return prop;
}

export async function updateProperty(id: string, data: any, token?: string) {
  const payload: any = {};
  if (data.title) payload.title = data.title;
  if (data.description) payload.description = data.description;
  if (data.category) payload.category = data.category;
  if (data.transactionType) payload.transaction_type = data.transactionType;
  if (data.price) payload.price = data.price;
  if (data.imageUrls) payload.image_urls = data.imageUrls;
  if (data.status) payload.status = data.status;

  const { data: prop, error } = await supabase.from('properties').update(payload).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return prop;
}

export async function deleteProperty(id: string, token?: string) {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function fetchContactLeads(token?: string) {
  const { data, error } = await supabase.from('contacts').select('*, property:properties(title)').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((l: any) => ({
    ...l,
    propertyId: l.property_id,
    createdAt: l.created_at,
  }));
}

export async function updateLeadStatus(id: string, payload: { status?: string; notes?: string }, token?: string) {
  const { data, error } = await supabase.from('contacts').update(payload).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLead(id: string, token?: string) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function uploadImage(file: File) {
  const ext = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${ext}`;
  const { data, error } = await supabase.storage.from('property-images').upload(fileName, file);
  if (error) throw new Error(error.message);
  
  const { data: publicUrl } = supabase.storage.from('property-images').getPublicUrl(fileName);
  return publicUrl.publicUrl;
}

export async function createPropertyMultipart(formData: FormData, token?: string) {
  // First upload all images
  const files = formData.getAll('images') as File[];
  const imageUrls = await Promise.all(files.map(f => uploadImage(f)));
  
  const payload = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    transactionType: formData.get('transactionType'),
    price: Number(formData.get('price')),
    status: formData.get('status'),
    imageUrls,
  };
  
  return createProperty(payload);
}

export async function updatePropertyMultipart(id: string, formData: FormData, token?: string) {
  const files = formData.getAll('images') as File[];
  let newImageUrls: string[] = [];
  if (files.length > 0) {
    newImageUrls = await Promise.all(files.map(f => uploadImage(f)));
  }
  
  const existingImages = formData.getAll('existingImages') as string[];
  const imageUrls = [...existingImages, ...newImageUrls];

  const payload: any = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    transactionType: formData.get('transactionType'),
    price: Number(formData.get('price')),
    status: formData.get('status'),
  };
  
  if (imageUrls.length > 0) {
    payload.imageUrls = imageUrls;
  }
  
  return updateProperty(id, payload);
}

export async function fetchDashboardStats(token?: string): Promise<DashboardStats> {
  const [{ count: propsCount }, { count: leadsCount }, { data: recentProps }, { data: recentLeads }] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('contacts').select('*, property:properties(title)').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    totalProperties: propsCount || 0,
    totalLeads: leadsCount || 0,
    totalUsers: 1, // Supabase Auth manages users, we just fake this stat for the dashboard
    activeProperties: propsCount || 0, // Simplified for now
    saleProperties: propsCount || 0,
    rentProperties: 0,
    recentProperties: (recentProps || []).map((p: any) => ({ ...p, createdAt: p.created_at })),
    recentLeads: (recentLeads || []).map((l: any) => ({ ...l, createdAt: l.created_at, propertyId: l.property_id })),
  };
}

export async function fetchUsers(token?: string) {
  return []; // Supabase Auth users shouldn't be fully exposed here normally
}

export async function fetchTransactions(token?: string) {
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createTransaction(data: any, token?: string) {
  const { data: tx, error } = await supabase.from('transactions').insert([{
    property_id: data.propertyId,
    amount: data.amount,
    status: data.status,
    date: data.date,
  }]).select().single();
  if (error) throw new Error(error.message);
  return tx;
}

export async function updateTransaction(id: string, data: any, token?: string) {
  const { data: tx, error } = await supabase.from('transactions').update({
    property_id: data.propertyId,
    amount: data.amount,
    status: data.status,
    date: data.date,
  }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return tx;
}

export async function deleteTransaction(id: string, token?: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}
