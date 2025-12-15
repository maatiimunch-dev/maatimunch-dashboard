import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProductForm.css";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

function AddProductForm({ isOpen, closeForm, product }) {
  const [images, setImages] = useState([]);
  const [isChecked1, setIsChecked1] = useState(product?.bestSeller || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || ""
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description
      });
      setIsChecked1(product.bestSeller || false);
      if (product.images && product.images.length > 0) {
        setImages(product.images);
      }
    }
  }, [product]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const addImageSlot = () => {
    setImages([...images, null]);
  };

  const removeImageSlot = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("bestSeller", isChecked1);

    images.forEach((image) => {
      if (image) {
        formDataToSend.append("images", image);
      }
    });

    try {
      if (product) {
        await axios.put(`https://maatimunch-backend.onrender.com/api/products/edit/${product._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully");
      } else {
        await axios.post("https://maatimunch-backend.onrender.com/api/products/add", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully");
      }
      closeForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to submit product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`add-product-form-container ${isOpen ? "open" : ""}`} onClick={closeForm}>
      <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <FaTimes className="close-icon" onClick={closeForm} />
        </div>

        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter product name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                className="form-control" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00"
                min="0"
                step="0.01"
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
                placeholder="Enter product description"
                rows="4"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <div className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="bestSeller"
                  checked={isChecked1} 
                  onChange={(e) => setIsChecked1(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="bestSeller">Mark as Best Seller</label>
              </div>
            </div>

            <div className="images-section">
              <div className="images-section-header">
                <h3>Product Images</h3>
                <button 
                  type="button"
                  className="add-image-btn"
                  onClick={addImageSlot}
                  disabled={isSubmitting}
                >
                  <FaPlus /> Add Image
                </button>
              </div>

              <div className="images-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-upload-card">
                    {images.length > 1 && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImageSlot(index)}
                        disabled={isSubmitting}
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                    <label htmlFor={`file-input-${index}`} className="image-label">
                      <div className="image-preview">
                        {image ? (
                          <img 
                            src={
                              image instanceof File 
                                ? URL.createObjectURL(image) 
                                : image?.url || image
                            } 
                            alt={`Preview ${index + 1}`} 
                          />
                        ) : (
                          <div className="image-placeholder">
                            <FaPlus />
                            <span>Upload</span>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id={`file-input-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      style={{ display: "none" }}
                      disabled={isSubmitting}
                    />
                    <div className="image-number">Image {index + 1}</div>
                  </div>
                ))}
              </div>

              {images.length === 0 && (
                <div className="no-images-placeholder">
                  <FaPlus size={32} />
                  <p>No images added yet. Click "Add Image" to upload.</p>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {product ? "Updating..." : "Submitting..."}
                </>
              ) : (
                product ? "Update Product" : "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductForm;