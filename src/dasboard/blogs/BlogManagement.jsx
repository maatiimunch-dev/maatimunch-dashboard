import React from "react";
import { Outlet } from "react-router-dom";

function BlogManagement() {
  return (
    <div className="blog-management-container">
      <Outlet />
    </div>
  );
}

export default BlogManagement;