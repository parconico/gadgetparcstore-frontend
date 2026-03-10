'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin
      .orders()
      .then((data) => {
        setOrders(data.orders);
        setTotal(data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const updated = await api.admin.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-cyan border-t-transparent" />
      </div>
    );
  }

  const STATUS_OPTIONS = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

  const statusColor = (s: string) => {
    switch (s) {
      case 'PAID':
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'PROCESSING':
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-midnight">Orders</h1>
        <p className="text-sm text-gray-500">{total} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-500">No orders yet. They will appear here once customers start purchasing.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.shippingName}</p>
                        <p className="text-xs text-gray-500">{order.shippingEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.items?.length ?? 0}</td>
                    <td className="px-4 py-3 font-medium">
                      ${order.total.toFixed(2)} {order.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.payment?.status === 'SUCCEEDED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.payment?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-cyan focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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
