'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    declinedApplications: 0,
    avgApprovalTime: 0,
    totalRevenue: 0,
  });

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResult = await db.query(
          `SELECT 
            COUNT(*) as total_applications,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_applications,
            SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined_applications,
            AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_approval_time
           FROM applications`,
        );

        const statsData = statsResult.rows[0];
        setStats({
          totalApplications: parseInt(statsData.total_applications) || 0,
          approvedApplications: parseInt(statsData.approved_applications) || 0,
          declinedApplications: parseInt(statsData.declined_applications) || 0,
          avgApprovalTime: Math.round(statsData.avg_approval_time || 0),
          totalRevenue: 0, // Calculate from pre_approvals
        });

        // Fetch recent applications
        const appsResult = await db.query(
          `SELECT id, email, first_name, last_name, annual_income, status, fico_score, created_at
           FROM applications
           ORDER BY created_at DESC
           LIMIT 50`,
        );

        setApplications(appsResult.rows);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>
      </nav>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: stats.totalApplications },
            { label: 'Approved', value: stats.approvedApplications },
            { label: 'Declined', value: stats.declinedApplications },
            { label: 'Avg Processing Time', value: `${Math.round(stats.avgApprovalTime / 60)}s` },
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}` },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-luxury-600">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Income
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      FICO Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${app.annual_income.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {app.fico_score || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Manage Lenders', action: 'view-lenders' },
            { title: 'Manage Vehicles', action: 'view-vehicles' },
            { title: 'Export Analytics', action: 'export-analytics' },
          ].map((item) => (
            <button
              key={item.action}
              className="rounded-lg border border-gray-300 bg-white p-4 text-left hover:border-luxury-500 hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1">Manage platform data</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
