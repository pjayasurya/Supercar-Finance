import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const creditApi = {
  // Submit soft-pull application
  submitApplication: (data: any) =>
    api.post('/api/credit/apply', data),
  
  // Get pre-approval results
  getPreApprovals: (applicationId: string) =>
    api.get(`/api/credit/pre-approvals/${applicationId}`),
  
  // Get credit score and factors
  getCreditAnalysis: (applicationId: string) =>
    api.get(`/api/credit/analysis/${applicationId}`),
};

export const vehicleApi = {
  // Get vehicles filtered by loan amount
  getVehicles: (maxPrice?: number, filters?: any) =>
    api.get('/api/vehicles', { params: { maxPrice, ...filters } }),
  
  // Get single vehicle details
  getVehicle: (vehicleId: string) =>
    api.get(`/api/vehicles/${vehicleId}`),
  
  // Get vehicle inventory
  getInventory: (dealerId?: string) =>
    api.get('/api/vehicles/inventory', { params: { dealerId } }),
};

export const applicationApi = {
  // Create user application
  createApplication: (data: any) =>
    api.post('/api/applications', data),
  
  // Get application status
  getApplication: (applicationId: string) =>
    api.get(`/api/applications/${applicationId}`),
  
  // Export to lender
  exportToLender: (applicationId: string, lenderId: string) =>
    api.post(`/api/applications/${applicationId}/export`, { lenderId }),
  
  // Complete application
  completeApplication: (applicationId: string, data: any) =>
    api.put(`/api/applications/${applicationId}`, data),
};

export const authApi = {
  // Register user
  register: (email: string, password: string, data: any) =>
    api.post('/api/auth/register', { email, password, ...data }),
  
  // Sign in user
  signIn: (email: string, password: string) =>
    api.post('/api/auth/signin', { email, password }),
  
  // Verify email
  verifyEmail: (token: string) =>
    api.post('/api/auth/verify', { token }),
};

export default api;
