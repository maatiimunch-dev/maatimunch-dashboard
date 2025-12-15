import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlogDetail.css";
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaClock, 
  FaEdit,
  FaTrash,
  FaShareAlt
} from "react-icons/fa";

function BlogDetail() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maatimunch-backend.onrender.com/api/blogs/single/${blogId}`
      );
      
      if (response.data.success) {
        setBlog(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to fetch blog details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(
          `https://maatimunch-backend.onrender.com/api/blogs/delete/${blogId}`
        );
        alert("Blog deleted successfully!");
        navigate('/blogs');
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description.substring(0, 100) + "...",
        url: window.location.href,
      }).catch(err => console.log("Error sharing:", err));
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="loading-detail">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <div className="error-container">
          <h3>Blog not found</h3>
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Header Actions */}
      <div className="detail-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft /> Back to Blogs
        </button>
        
        <div className="action-buttons">
          <button className="action-btn share-btn" onClick={handleShare}>
            <FaShareAlt /> Share
          </button>
          <button className="action-btn delete-btn" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="blog-detail-content">
        {/* Featured Image */}
        <div className="featured-image-container">
          <img 
            src={blog.image?.url || "https://via.placeholder.com/1200x600"} 
            alt={blog.title}
            className="featured-image"
          />
          <div className="image-gradient"></div>
        </div>

        {/* Article Content */}
        <article className="article-content">
          <h1 className="article-title">{blog.title}</h1>
          
          {/* Meta Information */}
          <div className="article-meta">
            <span className="meta-item">
              <FaCalendar />
              <span>Published: {formatDate(blog.createdAt)}</span>
            </span>
            {blog.updatedAt !== blog.createdAt && (
              <span className="meta-item">
                <FaClock />
                <span>Updated: {formatDate(blog.updatedAt)}</span>
              </span>
            )}
          </div>

          {/* Blog Description/Content */}
          <div className="article-body">
            <p>{blog.description}</p>
          </div>

          {/* Tags or Categories can be added here */}
          {blog.slug && (
            <div className="article-footer">
              <div className="slug-badge">
                <span>Slug: {blog.slug}</span>
              </div>
            </div>
          )}
        </article>
      </div>

     
    </div>
  );
}

export default BlogDetail;