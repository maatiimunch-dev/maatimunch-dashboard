import React, { useState, useEffect } from 'react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://maatimunch-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user has admin role
        if (data.user && data.user.role === 'admin') {
          // Store token and user data in localStorage (matching Orders component)
          localStorage.setItem('token', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          
          // Also store in sessionStorage for backup
          sessionStorage.setItem('adminToken', data.token);
          sessionStorage.setItem('adminUser', JSON.stringify(data.user));
          
          // Show success message
          alert('Login successful! Redirecting to dashboard...');
          
          // Redirect to dashboard
          window.location.href = '/';
        } else {
          setError('Access denied. Admin privileges required.');
        }
      }else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // If user is logged in, show success message instead of form
//   if (isLoggedIn) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-md-6 col-lg-4">
//               <div className="card shadow">
//                 <div className="card-body p-4 text-center">
//                   <div className="text-success mb-3">
//                     <div className="display-1">✓</div>
//                   </div>
//                   <h3 className="h4 text-success mb-2">Login Successful!</h3>
//                   <p className="text-muted mb-4">You have been successfully logged in as admin.</p>
//                   <button 
//                     className="btn btn-primary"
//                     onClick={() => setIsLoggedIn(false)}
//                   >
//                     Back to Login
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 text-dark mb-2">Admin Login</h2>
                  <p className="text-muted">Sign in to your dashboard</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-muted text-decoration-none">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;