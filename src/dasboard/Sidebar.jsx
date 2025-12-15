import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaHome, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      // Remove token and user data from storage
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      
      // Close sidebar if mobile
      if (isMobile) {
        setIsSidebarOpen(false);
      }
      
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <div
      className={`sidebar bg-light ${
        isSidebarOpen ? "open" : "closed"
      } ${isMobile ? "mobile-sidebar" : ""}`}
    >
      {/* Header */}
      <div className="sidebar-header p-3">
        <h5 className="fw-bold m-0">{isSidebarOpen ? "Dashboard" : ""}</h5>
        {isMobile && (
          <FaTimes
            className="text-dark close-icon"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Nav links */}
      <Nav className="flex-column">
        <Nav.Item>
          <Link
            to="/"
            className={`nav-link d-flex align-items-center py-2 px-3 ${
              location.pathname === "/home" ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            <FaHome className="me-2" />
            {isSidebarOpen && <span>Home</span>}
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/products"
            className={`nav-link d-flex align-items-center px-3 py-2 ${
              location.pathname === "/products" ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            <FaBox className="me-2" />
            {isSidebarOpen && <span>Add Product</span>}
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/orders"
            className={`nav-link d-flex align-items-center px-3 py-2 ${
              location.pathname === "/orders" ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            <FaShoppingCart className="me-2" />
            {isSidebarOpen && <span>Orders</span>}
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/users"
            className={`nav-link d-flex align-items-center px-3 py-2 ${
              location.pathname === "/users" ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            <FaUsers className="me-2" />
            {isSidebarOpen && <span>Users</span>}
          </Link>
        </Nav.Item>

        {/* Logout */}
        <Nav.Item className="mb-1">
          <Link
            to="/logout"
            className={`nav-link d-flex align-items-center py-2 px-3 ${
              location.pathname === "/logout" ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            <FaSignOutAlt className="me-2" />
            {isSidebarOpen && <span>Log Out</span>}
          </Link>
        </Nav.Item>
      </Nav>

      {/* Desktop Toggle */}
      {!isMobile && (
        <div className="p-3 mt-auto">
          <p
            className="sidebar-toggle-icon small text-muted mb-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
