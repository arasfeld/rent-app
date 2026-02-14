import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  AuthResponse,
  CreatePropertyDto,
  CreateTenantDto,
  CreateLeaseDto,
  CreatePaymentDto,
  DashboardStats,
  LoginDto,
  CreateUserDto,
  PaginatedResponse,
  Payment,
  PaymentSummary,
  Property,
  Tenant,
  UpdatePropertyDto,
  UpdateTenantDto,
  UpdateLeaseDto,
  UpdatePaymentDto,
  User,
} from '@repo/shared';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Property', 'Tenant', 'Lease', 'Payment', 'Dashboard'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<AuthResponse, Omit<CreateUserDto, 'phone'>>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/me',
    }),

    // Properties
    getProperties: builder.query<
      PaginatedResponse<Property>,
      Record<string, string> | void
    >({
      query: (params) => {
        const query = params
          ? `?${new URLSearchParams(params).toString()}`
          : '';
        return `/properties${query}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Property' as const,
                id,
              })),
              { type: 'Property', id: 'LIST' },
            ]
          : [{ type: 'Property', id: 'LIST' }],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<Property, CreatePropertyDto>({
      query: (body) => ({ url: '/properties', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Property', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateProperty: builder.mutation<
      Property,
      { id: string; data: UpdatePropertyDto }
    >({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Property', id },
        { type: 'Property', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Property', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Tenants
    getTenants: builder.query<
      PaginatedResponse<Tenant>,
      Record<string, string> | void
    >({
      query: (params) => {
        const query = params
          ? `?${new URLSearchParams(params).toString()}`
          : '';
        return `/tenants${query}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Tenant' as const,
                id,
              })),
              { type: 'Tenant', id: 'LIST' },
            ]
          : [{ type: 'Tenant', id: 'LIST' }],
    }),
    createTenant: builder.mutation<Tenant, CreateTenantDto>({
      query: (body) => ({ url: '/tenants', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tenant', id: 'LIST' }, { type: 'Dashboard' }],
    }),
    updateTenant: builder.mutation<
      Tenant,
      { id: string; data: UpdateTenantDto }
    >({
      query: ({ id, data }) => ({
        url: `/tenants/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tenant', id },
        { type: 'Tenant', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteTenant: builder.mutation<void, string>({
      query: (id) => ({ url: `/tenants/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Tenant', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // Leases
    getLeases: builder.query<
      PaginatedResponse<any>,
      Record<string, string> | void
    >({
      query: (params) => {
        const query = params
          ? `?${new URLSearchParams(params).toString()}`
          : '';
        return `/leases${query}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({
                type: 'Lease' as const,
                id,
              })),
              { type: 'Lease', id: 'LIST' },
            ]
          : [{ type: 'Lease', id: 'LIST' }],
    }),
    createLease: builder.mutation<any, CreateLeaseDto>({
      query: (body) => ({ url: '/leases', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Lease', id: 'LIST' },
        { type: 'Property', id: 'LIST' },
        { type: 'Tenant', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateLease: builder.mutation<any, { id: string; data: UpdateLeaseDto }>({
      query: ({ id, data }) => ({
        url: `/leases/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lease', id },
        { type: 'Lease', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteLease: builder.mutation<void, string>({
      query: (id) => ({ url: `/leases/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Lease', id: 'LIST' },
        { type: 'Property', id: 'LIST' },
        { type: 'Tenant', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),

    // Payments
    getPayments: builder.query<
      PaginatedResponse<Payment>,
      Record<string, string> | void
    >({
      query: (params) => {
        const query = params
          ? `?${new URLSearchParams(params).toString()}`
          : '';
        return `/payments${query}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Payment' as const,
                id,
              })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),
    createPayment: builder.mutation<Payment, CreatePaymentDto>({
      query: (body) => ({ url: '/payments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, { type: 'Dashboard' }],
    }),
    updatePayment: builder.mutation<
      Payment,
      { id: string; data: UpdatePaymentDto }
    >({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Payment', id },
        { type: 'Payment', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({ url: `/payments/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, { type: 'Dashboard' }],
    }),
    getPaymentSummary: builder.query<PaymentSummary, void>({
      query: () => '/payments/summary',
      providesTags: [{ type: 'Payment', id: 'SUMMARY' }],
    }),

    // Dashboard
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: [{ type: 'Dashboard' }],
    }),
    getRecentActivity: builder.query<any, number | void>({
      query: (limit) => {
        const query = limit ? `?limit=${limit}` : '';
        return `/dashboard/recent-activity${query}`;
      },
      providesTags: [{ type: 'Dashboard' }],
    }),
    getFinancialSummary: builder.query<any, void>({
      query: () => '/dashboard/financial-summary',
      providesTags: [{ type: 'Dashboard' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useGetLeasesQuery,
  useCreateLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentSummaryQuery,
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetFinancialSummaryQuery,
} = api;
