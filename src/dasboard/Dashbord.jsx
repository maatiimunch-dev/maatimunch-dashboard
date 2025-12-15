import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import "./Dashbord.css";

const Dashbord = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Sidebar closes on mobile
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.replace("/", "");
    return path.charAt(0).toUpperCase() + path.slice(1) || "Home";
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div
        className={`sidebar-left ${isSidebarOpen ? "open" : "closed"} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <div
        className={`main-content-area ${
          isMobile && isSidebarOpen ? "hide-mobile-content" : ""
        }`}
      >
        {/* Overlay for Mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Header */}
        <div className="dashboard-header d-flex align-items-center px-3 py-2">
          {isSidebarOpen ? (
            <FaArrowLeft
              className="me-2 cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : (
            <FaBars
              className="me-2 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />
          )}
          <h5 className="mb-0">
            <span className="d-none d-md-inline">Dashboard - </span>
            {getPageTitle()}
          </h5>
        </div>

        {/* Page Body */}
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
