
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
  XCircle
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: ''
  });

  const debounceTimeout = useRef();

  // Fetch orders from your API (using axios, with 429 retry logic)
  const fetchOrders = async (page = 1, limit = 10, retryCount = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://shubhammusicalplacebackend.onrender.com/api/payments/admin/orders', {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true // allow handling all status codes
      });
      if (response.status === 429) {
        if (retryCount < 3) {
          setError('Too many requests. Retrying in 3 seconds...');
          setTimeout(() => {
            fetchOrders(page, limit, retryCount + 1);
          }, 3000);
        } else {
          setError('Too many requests. Please try again later.');
        }
        return;
      }
      const data = response.data;
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single order details (using axios)
 
  useEffect(() => {
    fetchOrders();
  }, []);

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
      <span className={`badge bg-${config.color} d-inline-flex align-items-center`}>
        <Icon size={12} className="me-1" />
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

  // Handle page change with debounce
  const handlePageChange = (newPage) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchOrders(newPage, pagination.limit);
    }, 1000); // 1000ms debounce
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
    const matchesSearch = !filters.search || 
      order._id.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPaymentStatus && matchesSearch;
  });

  // Handle filter change with debounce
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchOrders(1, pagination.limit);
    }, 1000); // 1000ms debounce
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <AlertCircle size={20} className="me-2" />
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 mb-2">Orders Dashboard</h1>
          <p className="text-muted">Manage and track your orders</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="text-primary me-3">
                <Package size={32} />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Total Orders</h6>
                <h4 className="card-title mb-0">{pagination.total}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="text-success me-3">
                <CheckCircle size={32} />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Completed</h6>
                <h4 className="card-title mb-0">
                  {orders.filter(o => o.paymentStatus === 'completed').length}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="text-warning me-3">
                <Clock size={32} />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Pending</h6>
                <h4 className="card-title mb-0">
                  {orders.filter(o => o.paymentStatus === 'pending').length}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="text-info me-3">
                <DollarSign size={32} />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Total Revenue</h6>
                <h4 className="card-title mb-0">
                  {formatCurrency(orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0))}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by order ID or customer name"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
                />
              </div>
            </div>

            <div className="col-md-2">
              <label className="form-label">Order Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange({...filters, paymentStatus: e.target.value})}
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilters({ status: '', paymentStatus: '', search: '' })}
              >
                <Filter size={16} className="me-1" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                 <th>Action</th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <small className="fw-bold">#{order._id.slice(-8)}</small>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.shippingAddress.name}</div>
                        <small className="text-muted">{order.shippingAddress.phone}</small>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold">{formatCurrency(order.finalAmount)}</div>
                      <small className="text-muted">{order.items.length} item(s)</small>
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td>
                      <small>{formatDate(order.createdAt)}</small>
                    </td>
                   <td>
                     <button
                       type="button"
                       className="btn btn-sm btn-primary d-flex align-items-center"
                       onClick={() => setSelectedOrder(order)}
                       data-bs-toggle="modal"
                       data-bs-target="#orderModal"
                     >
                       <Eye size={16} className="me-1" /> View
                     </button>
                   </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Orders pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
              </li>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modern Responsive Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '18px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            padding: '28px 20px 20px 20px',
            position: 'relative',
            fontFamily: 'Inter, Arial, sans-serif',
            minHeight: '320px',
            overflowY: 'auto',
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#888',
                cursor: 'pointer',
                zIndex: 2
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, letterSpacing: 0.5 }}>
              Order Details - <span style={{ color: '#3b82f6' }}>#{selectedOrder._id.slice(-8)}</span>
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 18 }}>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Order Information</h4>
                <div style={{ fontSize: 14, marginBottom: 6 }}>
                  <span style={{ color: '#888' }}>Status:</span> <StatusBadge status={selectedOrder.status} />
                </div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>
                  <span style={{ color: '#888' }}>Payment:</span> <StatusBadge status={selectedOrder.paymentStatus} type="payment" />
                </div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>
                  <span style={{ color: '#888' }}>Order Date:</span> {formatDate(selectedOrder.createdAt)}
                </div>
                {selectedOrder.paidAt && (
                  <div style={{ fontSize: 14, marginBottom: 6 }}>
                    <span style={{ color: '#888' }}>Paid At:</span> {formatDate(selectedOrder.paidAt)}
                  </div>
                )}
              </div>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Shipping Address</h4>
                <div style={{ fontSize: 14, color: '#222', fontWeight: 500 }}>{selectedOrder.shippingAddress.name}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{selectedOrder.shippingAddress.phone}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{selectedOrder.shippingAddress.address}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{selectedOrder.shippingAddress.pincode}</div>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Order Items</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Product</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600 }}>Price</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600 }}>Quantity</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: '6px 8px', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>{formatCurrency(item.price)}</td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                <span style={{ color: '#888' }}>Subtotal:</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6, color: '#16a34a' }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                <span style={{ color: '#888' }}>Shipping:</span>
                <span>{formatCurrency(selectedOrder.shippingCharges)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 6 }}>
                <span>Total:</span>
                <span>{formatCurrency(selectedOrder.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;