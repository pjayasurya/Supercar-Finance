import axios from 'axios';
import { mockVehicles, mockPreApprovals, mockCreditAnalysis, mockApplication } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const USE_MOCK_DATA = false; // Switched to real backend

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

// Helper to simulate API delay
const mockResponse = <T>(data: T, delay = 800) =>
  new Promise<{ data: T }>((resolve) =>
    setTimeout(() => resolve({ data }), delay)
  );

export const creditApi = {
  // Submit soft-pull application
  submitApplication: (data: any) =>
    USE_MOCK_DATA
      ? mockResponse({ applicationId: 'app_123', status: 'pre_approved' })
      : api.post('/api/credit/apply', data),

  // Get pre-approval results
  getPreApprovals: (applicationId: string) =>
    USE_MOCK_DATA
      ? mockResponse(mockPreApprovals)
      : api.get(`/api/credit/pre-approvals/${applicationId}`),

  // Get credit score and factors
  getCreditAnalysis: (applicationId: string) =>
    USE_MOCK_DATA
      ? mockResponse(mockCreditAnalysis)
      : api.get(`/api/credit/analysis/${applicationId}`),
};

export const vehicleApi = {
  // Get vehicles filtered by loan amount
  getVehicles: (maxPrice?: number, filters?: any) =>
    USE_MOCK_DATA
      ? mockResponse(
        mockVehicles.filter(v => !maxPrice || v.price <= maxPrice)
      )
      : api.get('/api/vehicles', { params: { maxPrice, ...filters } }),

  // Get single vehicle details
  getVehicle: (vehicleId: string) =>
    USE_MOCK_DATA
      ? mockResponse(mockVehicles.find(v => v.id === vehicleId) || mockVehicles[0])
      : api.get(`/api/vehicles/${vehicleId}`),

  // Get vehicle inventory
  getInventory: (dealerId?: string) =>
    USE_MOCK_DATA
      ? mockResponse(mockVehicles)
      : api.get('/api/vehicles/inventory', { params: { dealerId } }),
};

export const applicationApi = {
  // Create user application
  createApplication: (data: any) =>
    USE_MOCK_DATA
      ? mockResponse(mockApplication)
      : api.post('/api/applications', data),

  // Get application status
  getApplication: (applicationId: string) =>
    USE_MOCK_DATA
      ? mockResponse(mockApplication)
      : api.get(`/api/applications/${applicationId}`),

  // Export to lender
  exportToLender: (applicationId: string, lenderId: string) =>
    USE_MOCK_DATA
      ? mockResponse({ success: true })
      : api.post(`/api/applications/${applicationId}/export`, { lenderId }),

  // Complete application
  completeApplication: (applicationId: string, data: any) =>
    USE_MOCK_DATA
      ? mockResponse({ ...mockApplication, status: 'completed' })
      : api.put(`/api/applications/${applicationId}`, data),
};

export const authApi = {
  // Register user
  register: (email: string, password: string, data: any) =>
    USE_MOCK_DATA
      ? mockResponse({ token: 'mock_token', user: { id: 'u1', email } })
      : api.post('/api/auth/register', { email, password, ...data }),

  // Sign in user
  signIn: (email: string, password: string) =>
    USE_MOCK_DATA
      ? mockResponse({ token: 'mock_token', user: { id: 'u1', email } })
      : api.post('/api/auth/signin', { email, password }),

  // Verify email
  verifyEmail: (token: string) =>
    USE_MOCK_DATA
      ? mockResponse({ success: true })
      : api.post('/api/auth/verify', { token }),
};

export default api;
