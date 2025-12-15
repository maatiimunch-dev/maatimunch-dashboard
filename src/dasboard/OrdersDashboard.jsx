import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit3,
  Users,
  TrendingUp,
  X
} from 'lucide-react';

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRole, setUserRole] = useState('admin'); // Set to admin for demo
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 50,
    pages: 5
  });
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: ''
  });

  // Mock data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customer: { name: 'John Doe', email: 'john@example.com' },
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 2999 },
        { name: 'Phone Case', quantity: 2, price: 499 }
      ],
      totalAmount: 3997,
      status: 'confirmed',
      paymentStatus: 'completed',
      createdAt: '2024-07-14T10:30:00Z',
      shippingAddress: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2024-002',
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
      items: [
        { name: 'Laptop Stand', quantity: 1, price: 1999 }
      ],
      totalAmount: 1999,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-07-14T09:15:00Z',
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2024-003',
      customer: { name: 'Mike Johnson', email: 'mike@example.com' },
      items: [
        { name: 'Gaming Mouse', quantity: 1, price: 3499 },
        { name: 'Mouse Pad', quantity: 1, price: 599 }
      ],
      totalAmount: 4098,
      status: 'shipped',
      paymentStatus: 'completed',
      createdAt: '2024-07-13T16:45:00Z',
      shippingAddress: {
        street: '789 Pine Rd',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2024-004',
      customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
      items: [
        { name: 'Bluetooth Speaker', quantity: 1, price: 2499 }
      ],
      totalAmount: 2499,
      status: 'delivered',
      paymentStatus: 'completed',
      createdAt: '2024-07-13T14:20:00Z',
      shippingAddress: {
        street: '321 Elm St',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India'
      }
    },
    {
      id: 'ORD-2024-005',
      customer: { name: 'David Brown', email: 'david@example.com' },
      items: [
        { name: 'Keyboard', quantity: 1, price: 4999 }
      ],
      totalAmount: 4999,
      status: 'cancelled',
      paymentStatus: 'failed',
      createdAt: '2024-07-12T11:00:00Z',
      shippingAddress: {
        street: '654 Maple Dr',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001',
        country: 'India'
      }
    }
  ];

  const mockStats = {
    overview: {
      totalOrders: 150,
      totalRevenue: 485000,
      completedOrders: 120,
      pendingOrders: 25
    }
  };

  // Initialize with mock data
  useEffect(() => {
    setOrders(mockOrders);
    setStats(mockStats);
  }, []);

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !filters.search || 
      order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // Update order status (admin only)
  const updateOrderStatus = (orderId, newStatus) => {
    if (userRole !== 'admin') return;
    
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    setSelectedOrder(null);
    alert('Order status updated successfully!');
  };

  // Status badge component
  const StatusBadge = ({ status, type = 'status' }) => {
    const getStatusConfig = () => {
      if (type === 'payment') {
        switch (status) {
          case 'completed':
            return { color: 'success', icon: CheckCircle };
          case 'pending':
            return { color: 'warning', icon: Clock };
          case 'failed':
            return { color: 'danger', icon: XCircle };
          default:
            return { color: 'secondary', icon: AlertCircle };
        }
      } else {
        switch (status) {
          case 'confirmed':
            return { color: 'success', icon: CheckCircle };
          case 'pending':
            return { color: 'warning', icon: Clock };
          case 'shipped':
            return { color: 'info', icon: Package };
          case 'delivered':
            return { color: 'success', icon: CheckCircle };
          case 'cancelled':
            return { color: 'danger', icon: XCircle };
          default:
            return { color: 'secondary', icon: AlertCircle };
        }
      }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        config.color === 'success' ? 'bg-green-100 text-green-800' :
        config.color === 'warning' ? 'bg-yellow-100 text-yellow-800' :
        config.color === 'danger' ? 'bg-red-100 text-red-800' :
        config.color === 'info' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Order Details Modal
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Status:</strong> <StatusBadge status={order.status} /></p>
                    <p><strong>Payment:</strong> <StatusBadge status={order.paymentStatus} type="payment" /></p>
                    <p><strong>Total:</strong> {formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {order.customer.name}</p>
                    <p><strong>Email:</strong> {order.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Admin Actions */}
                {userRole === 'admin' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={order.status === 'confirmed'}
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={order.status === 'shipped' || order.status === 'delivered'}
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        disabled={order.status === 'delivered'}
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <div className="text-red-800">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {userRole === 'admin' ? 'Admin Orders Dashboard' : 'My Orders'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'admin' ? 'Manage all orders across the platform' : 'View and track your orders'}
        </p>
      </div>

      {/* Statistics Cards - Admin Only */}
      {userRole === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-blue-500 mr-3">
                <Package size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-green-500 mr-3">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-green-500 mr-3">
                <CheckCircle size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-yellow-500 mr-3">
                <Clock size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.paymentStatus}
              onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={() => setFilters({ status: '', paymentStatus: '', search: '' })}
            >
              <Filter size={16} className="inline mr-1" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye size={16} />
                    </button>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.page === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrdersDashboard;