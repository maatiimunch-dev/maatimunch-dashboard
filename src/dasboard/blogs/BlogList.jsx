// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./BlogList.css";
// import { 
//   FaPlus, 
//   FaSearch, 
//   FaEdit, 
//   FaTrash, 
//   FaEye,
//   FaCalendar,
//   FaClock 
// } from "react-icons/fa";

// function BlogList({ onViewBlog }) {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(6); // Blogs per page

//   useEffect(() => {
//     fetchBlogs();
//   }, [currentPage, searchTerm]);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://maatimunch-backend.onrender.com/api/blogs/fetch`,
//         {
//           params: {
//             search: searchTerm,
//             page: currentPage,
//             limit: limit,
//             sortBy: 'createdAt',
//             sortOrder: 'desc'
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setBlogs(response.data.data);
//         setTotalPages(response.data.pagination.totalPages);
//       }
//     } catch (error) {
//       console.error("Error fetching blogs:", error);
//       alert("Failed to fetch blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   const handleAddBlog = () => {
//     // Navigate to create page
//     navigate('/blogs/new');
//   };

//   const handleEditBlog = (blog) => {
//     // Navigate to edit page
//     navigate(`/blogs/edit/${blog._id}`);
//   };

//   const handleDeleteBlog = async (id) => {
//     if (window.confirm("Are you sure you want to delete this blog?")) {
//       try {
//         await axios.delete(
//           `https://maatimunch-backend.onrender.com/api/blogs/delete/${id}`
//         );
//         alert("Blog deleted successfully!");
//         fetchBlogs();
//       } catch (error) {
//         console.error("Error deleting blog:", error);
//         alert("Failed to delete blog");
//       }
//     }
//   };

//   const handleViewBlog = (blog) => {
//     // Navigate to blog detail page
//     navigate(`/blogs/${blog._id}`);
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const truncateText = (text, maxLength) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };

//   return (
//     <div className="blog-list-container">
//       {/* Header Section */}
//       <div className="blog-list-header">
//         <div className="header-content">
//           <h1>Blog Posts</h1>
//           <p className="subtitle">Manage and view all your blog posts</p>
//         </div>
//         <button className="add-blog-btn" onClick={handleAddBlog}>
//           <FaPlus /> Create Blog
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="search-container">
//         <div className="search-box">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search blogs by title or description..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="search-input"
//           />
//         </div>
//       </div>

//       {/* Blogs Grid */}
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Loading blogs...</p>
//         </div>
//       ) : blogs.length === 0 ? (
//         <div className="no-blogs-container">
//           <div className="no-blogs-content">
//             <FaSearch size={60} />
//             <h3>No Blogs Found</h3>
//             <p>
//               {searchTerm 
//                 ? "Try adjusting your search terms" 
//                 : "Start by creating your first blog post"}
//             </p>
//             {!searchTerm && (
//               <button className="create-first-btn" onClick={handleAddBlog}>
//                 <FaPlus /> Create Your First Blog
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="blogs-grid">
//             {blogs.map((blog) => (
//               <div key={blog._id} className="blog-card">
//                 <div className="blog-image-container">
//                   <img 
//                     src={blog.image?.url || "https://via.placeholder.com/400x250"} 
//                     alt={blog.title}
//                     className="blog-image"
//                   />
//                   <div className="blog-overlay">
//                     <button 
//                       className="overlay-btn view-btn"
//                       onClick={() => handleViewBlog(blog)}
//                       title="View Blog"
//                     >
//                       <FaEye />
//                     </button>
//                     <button 
//                       className="overlay-btn edit-btn"
//                       onClick={() => handleEditBlog(blog)}
//                       title="Edit Blog"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button 
//                       className="overlay-btn delete-btn"
//                       onClick={() => handleDeleteBlog(blog._id)}
//                       title="Delete Blog"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="blog-content">
//                   <h3 className="blog-title">{blog.title}</h3>
//                   <p className="blog-description">
//                     {truncateText(blog.description, 120)}
//                   </p>
                  
//                   <div className="blog-meta">
//                     <span className="meta-item">
//                       <FaCalendar />
//                       {formatDate(blog.createdAt)}
//                     </span>
//                     {blog.updatedAt !== blog.createdAt && (
//                       <span className="meta-item">
//                         <FaClock />
//                         Updated
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="pagination-container">
//               <button 
//                 className="page-btn"
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
              
//               <div className="page-numbers">
//                 {[...Array(totalPages)].map((_, index) => (
//                   <button
//                     key={index + 1}
//                     className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
//                     onClick={() => setCurrentPage(index + 1)}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
              
//               <button 
//                 className="page-btn"
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default BlogList;










import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlogList.css";
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCalendar,
  FaClock 
} from "react-icons/fa";

function BlogList({ onViewBlog }) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // Blogs per page

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maatimunch-backend.onrender.com/api/blogs/fetch`,
        {
          params: {
            search: searchTerm,
            page: currentPage,
            limit: limit,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }
        }
      );
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleAddBlog = () => {
    console.log('Navigating to /blogs/new'); // Debug log
    navigate('/blogs/new');
  };

  const handleEditBlog = (blog) => {
    console.log('Navigating to edit:', blog._id); // Debug log
    navigate(`/blogs/edit/${blog._id}`);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(
          `https://maatimunch-backend.onrender.com/api/blogs/delete/${id}`
        );
        alert("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  const handleViewBlog = (blog) => {
    // Navigate to blog detail page
    navigate(`/blogs/${blog._id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="blog-list-container">
      {/* Header Section */}
      <div className="blog-list-header">
        <div className="header-content">
          <h1>Blog Posts</h1>
          <p className="subtitle">Manage and view all your blog posts</p>
        </div>
        <button className="add-blog-btn" onClick={handleAddBlog}>
          <FaPlus /> Create Blog
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search blogs by title or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="no-blogs-container">
          <div className="no-blogs-content">
            <FaSearch size={60} />
            <h3>No Blogs Found</h3>
            <p>
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start by creating your first blog post"}
            </p>
            {!searchTerm && (
              <button className="create-first-btn" onClick={handleAddBlog}>
                <FaPlus /> Create Your First Blog
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <div className="blog-image-container">
                  <img 
                    src={blog.image?.url || "https://via.placeholder.com/400x250"} 
                    alt={blog.title}
                    className="blog-image"
                  />
                  <div className="blog-overlay">
                    <button 
                      className="overlay-btn view-btn"
                      onClick={() => handleViewBlog(blog)}
                      title="View Blog"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="overlay-btn edit-btn"
                      onClick={() => handleEditBlog(blog)}
                      title="Edit Blog"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="overlay-btn delete-btn"
                      onClick={() => handleDeleteBlog(blog._id)}
                      title="Delete Blog"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">
                    {truncateText(blog.description, 120)}
                  </p>
                  
                  <div className="blog-meta">
                    <span className="meta-item">
                      <FaCalendar />
                      {formatDate(blog.createdAt)}
                    </span>
                    {blog.updatedAt !== blog.createdAt && (
                      <span className="meta-item">
                        <FaClock />
                        Updated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlogList;