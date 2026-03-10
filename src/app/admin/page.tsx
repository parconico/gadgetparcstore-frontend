'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  ordersByStatus: { status: string; _count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin
      .dashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-cyan border-t-transparent" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Avg Order',
      value:
        stats && stats.totalOrders > 0
          ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}`
          : '$0.00',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-midnight">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-secondary text-sm">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="btn-primary text-sm">
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className="rounded-lg bg-gray-50 px-4 py-2">
                <span className="text-xs font-medium uppercase text-gray-500">{s.status}</span>
                <p className="text-lg font-bold text-gray-900">{s._count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-medium text-brand-cyan hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium uppercase text-gray-500">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{order.items?.length ?? 0}</td>
                    <td className="py-3 pr-4 text-right font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
