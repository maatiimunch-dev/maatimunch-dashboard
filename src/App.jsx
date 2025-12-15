import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashbord from "./dasboard/Dashbord";
import AddProductForm from "./dasboard/AddProductForm";
import Orders from "./dasboard/Orders";
import DashbordProduct from "./dasboard/DashbordProduct";
import User from "./dasboard/User";
import AdminLogin from "../auth/Login"; // Import your login component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('adminToken');
  const adminUser = sessionStorage.getItem('adminUser');
  
  // Check if token exists and user has admin role
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminUser) {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      // Clear invalid session and redirect to login
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem('adminToken');
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          } 
        />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashbord />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route path="products" element={<DashbordProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<User />} />
          <Route path="addproduct" element={<AddProductForm />} />
          
        </Route>
        
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;