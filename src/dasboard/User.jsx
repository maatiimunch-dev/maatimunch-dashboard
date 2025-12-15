import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://shubhammusicalplacebackend.onrender.com/api/auth/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data.data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        // If single user object
        setUsers([data]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container-fluid px-2 px-md-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2">
        <h5 className="mb-2 mb-md-0 d-none d-md-block">Users Management</h5>
        <div className="w-100 w-md-auto text-end">
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={fetchUsers} 
            disabled={loading}
            className="w-100 w-md-auto"
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 small">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <Alert variant="info" className="mt-2">
          No users found.
        </Alert>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="d-block d-md-none mt-5">
            {users.map((user, index) => (
              <div key={user._id || user.id || index} className="card mb-3 shadow-sm">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-12 mb-2">
                      <strong className="text-dark">{user.name || user.fullName || 'N/A'}</strong>
                    </div>
                    <div className="col-12 mb-2">
                      <small className="text-muted">Email:</small><br />
                      <span className="text-primary fw-bold">{user.email}</span>
                    </div>
                    <div className="col-12 mb-2">
                      <small className="text-muted">Registered:</small><br />
                      <span className="small">{formatDate(user.createdAt || user.registeredAt)}</span>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-success flex-fill fw-bold">Edit</button>
                        <button className="btn btn-sm btn-outline-danger flex-fill fw-bold">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="table-responsive mt-3 d-none d-md-block">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th style={{ minWidth: '150px' }}>Name</th>
                  <th style={{ minWidth: '200px' }}>Email</th>
                  <th style={{ minWidth: '120px' }}>Registered</th>
                  <th style={{ minWidth: '140px' }}>Action</th>
                </tr>
              </thead>
              <tbody className="fw-bold">
                {users.map((user, index) => (
                  <tr key={user._id || user.id || index}>
                    <td>{user.name || user.fullName || 'N/A'}</td>
                    <td className="text-primary">{user.email}</td>
                    <td>{formatDate(user.createdAt || user.registeredAt)}</td>
                    <td>
                      <span className="btn btn-sm text-success me-2 fw-bold">Edit</span>
                      <span className="btn btn-sm text-danger fw-bold">Delete</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {users.length > 0 && (
        <div className="mt-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <small className="text-muted mb-2 mb-md-0">
            Total Users: <strong>{users.length}</strong>
          </small>
          <small className="text-muted">
            Last updated: {new Date().toLocaleTimeString()}
          </small>
        </div>
      )}
    </div>
  );
};

export default User;