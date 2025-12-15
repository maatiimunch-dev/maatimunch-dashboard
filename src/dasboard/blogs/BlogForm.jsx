import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlogForm.css";
import { FaTimes, FaImage, FaArrowLeft } from "react-icons/fa";

function BlogForm({ isOpen, closeForm, blog, onSuccess }) {
  const { blogId } = useParams();
  const navigate = useNavigate();
  
  // Check if it's being used as a route or modal
  const isRoute = !isOpen && blogId !== undefined;
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    // If used as route and has blogId, fetch blog data
    if (isRoute && blogId) {
      fetchBlogData();
    } else if (blog) {
      // If used as modal with blog prop
      setFormData({
        title: blog.title || "",
        description: blog.description || ""
      });
      if (blog.image?.url) {
        setImagePreview(blog.image.url);
      }
    } else if (!isRoute) {
      // Reset form for new blog in modal
      setFormData({ title: "", description: "" });
      setImage(null);
      setImagePreview(null);
    }
  }, [blog, isOpen, blogId, isRoute]);

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maatimunch-backend.onrender.com/api/blogs/single/${blogId}`
      );
      if (response.data.success) {
        const blogData = response.data.data;
        setFormData({
          title: blogData.title || "",
          description: blogData.description || ""
        });
        if (blogData.image?.url) {
          setImagePreview(blogData.image.url);
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to fetch blog details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }
    
    const editingBlog = isRoute ? blogId : blog;
    
    if (!editingBlog && !image) {
      alert("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title.trim());
    formDataToSend.append("description", formData.description.trim());
    
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      if (editingBlog) {
        // Update existing blog
        const id = isRoute ? blogId : blog._id;
        await axios.put(
          `https://maatimunch-backend.onrender.com/api/blogs/edit/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Blog updated successfully!");
      } else {
        // Create new blog
        await axios.post(
          "https://maatimunch-backend.onrender.com/api/blogs/add",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Blog created successfully!");
      }
      
      if (isRoute) {
        navigate('/blogs');
      } else {
        if (onSuccess) onSuccess();
        closeForm();
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert(error.response?.data?.message || "Failed to submit blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isRoute) {
      navigate('/blogs');
    } else if (!isSubmitting) {
      closeForm();
    }
  };

  // If used as a route, render full page
  if (isRoute) {
    if (loading) {
      return (
        <div className="blog-form-page">
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading blog...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="blog-form-page">
        <div className="page-header">
          <button className="back-btn" onClick={handleClose}>
            <FaArrowLeft /> Back to Blogs
          </button>
          <h2>{blogId ? "Edit Blog" : "Create New Blog"}</h2>
        </div>

        <div className="blog-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Blog Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Enter blog title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows="8"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <div className="image-upload-container">
                <input
                  id="blog-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={isSubmitting}
                />
                <label htmlFor="blog-image-input" className="image-upload-label">
                  {imagePreview ? (
                    <div className="image-preview-box">
                      <img src={imagePreview} alt="Preview" />
                      <div className="image-overlay">
                        <FaImage size={30} />
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="image-placeholder-box">
                      <FaImage size={50} />
                      <span>Click to upload image</span>
                      <small>JPG, PNG or GIF (Max 10MB)</small>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {blogId ? "Updating..." : "Creating..."}
                </>
              ) : (
                blogId ? "Update Blog" : "Create Blog"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Otherwise render as modal (original behavior)

  return (
    <div 
      className={`blog-form-container ${isOpen ? "open" : ""}`} 
      onClick={handleClose}
    >
      <div className="blog-form" onClick={(e) => e.stopPropagation()}>
        <div className="blog-form-header">
          <h2>{blog ? "Edit Blog" : "Create New Blog"}</h2>
          <FaTimes className="close-icon" onClick={handleClose} />
        </div>

        <div className="blog-form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Blog Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Enter blog title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows="8"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <div className="image-upload-container">
                <input
                  id="blog-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={isSubmitting}
                />
                <label htmlFor="blog-image-input" className="image-upload-label">
                  {imagePreview ? (
                    <div className="image-preview-box">
                      <img src={imagePreview} alt="Preview" />
                      <div className="image-overlay">
                        <FaImage size={30} />
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="image-placeholder-box">
                      <FaImage size={50} />
                      <span>Click to upload image</span>
                      <small>JPG, PNG or GIF (Max 10MB)</small>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {blog ? "Updating..." : "Creating..."}
                </>
              ) : (
                blog ? "Update Blog" : "Create Blog"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BlogForm;