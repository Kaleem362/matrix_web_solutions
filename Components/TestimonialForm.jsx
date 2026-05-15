import React, { useState } from "react";
import axios from "axios";
import { useStore } from "../src/Context/UseStore";
import { getApiBase } from "../src/utils/api.js";
import { playTestimonialSound } from "../src/utils/notificationSound";

const TestimonialForm = () => {
  const { theme, loading, setLoading, success, setSuccess, error, setError } = useStore(useStore);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
    image: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const API_URL = `${getApiBase()}/api/testimonials`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, image: "" }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    const res = await axios.post(`${getApiBase()}/api/upload`, formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        setUploadProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    setUploadProgress(false);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await axios.post(
        API_URL,
        {
          name: formData.name,
          role: formData.role,
          message: formData.message,
          rating: Number(formData.rating),
          image: imageUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      playTestimonialSound();
      setTimeout(() => {
        setSuccess("Thank you for your feedback! Your testimonial will be reviewed before publishing.");
        setFormData({ name: "", role: "", message: "", rating: 5, image: "" });
        setImageFile(null);
        setPreviewUrl(null);
      }, 150);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  const getInitials = (name) => {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const starLabels = { 5: "Excellent", 4: "Very Good", 3: "Good", 2: "Fair", 1: "Poor" };

  const StarRating = ({ value, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange({ target: { name: "rating", value: star } })}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-150 ${
                star <= (hover || value) ? "text-amber-400 fill-amber-400" : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className={`ml-2 text-xs font-medium ${theme === "dark" ? "text-indigo-200" : "text-gray-600"}`}>
          {starLabels[hover || value]}
        </span>
      </div>
    );
  };

  return (
    <section className={`w-full px-4 sm:px-8 lg:px-16 py-12 ${
      theme === "dark" ? "bg-linear-to-b from-black via-indigo-950 to-indigo-900 text-white" : "bg-linear-to-b from-indigo-400 to-white text-white"
    }`}>
      <div className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 transition-all duration-300 ${
        theme === "dark" ? "bg-indigo-400/20 border border-white/20" : "bg-white/80 backdrop-blur-sm border border-indigo-200"
      }`}>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Share Your Experience
          </h2>
          <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-indigo-200" : "text-gray-500"}`}>
            Your feedback helps us improve. All testimonials are reviewed before being published.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className={`mb-5 rounded-xl p-3 text-sm flex items-start gap-2 ${
            theme === "dark" ? "bg-green-500/20 border border-green-500/30 text-green-200" : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-xl p-3 text-sm bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Avatar Upload Section */}
          <div className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
            dragging
              ? (theme === "dark" ? "border-indigo-400 bg-indigo-500/20" : "border-indigo-500 bg-indigo-50")
              : (theme === "dark" ? "border-white/20 bg-white/5" : "border-gray-200 bg-gray-50/50")
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                theme === "dark" ? "bg-indigo-900 text-white ring-2 ring-indigo-500/50" : "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
              }`}>
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full rounded-xl object-cover" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-all">
                      ×
                    </button>
                  </>
                ) : (
                  formData.name ? getInitials(formData.name) : "?"
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-indigo-200" : "text-gray-600"}`}>
                  Upload your photo (optional)
                </p>
                <p className={`text-xs mb-2 ${theme === "dark" ? "text-indigo-300/60" : "text-gray-400"}`}>
                  Drag & drop or click to browse. Max 5MB.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <svg className="w-3.5 h-3.5 inline-block mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-600 text-xs rounded-lg">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {uploadProgress}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-indigo-300" : "text-gray-500"}`}>
                Full Name *
              </label>
              <div className="relative">
                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required
                  className={`w-full rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all ${
                    theme === "dark" ? "bg-indigo-900/60 border border-white/20 text-white placeholder-white/50" : "bg-white border border-gray-200 text-indigo-900 placeholder-gray-400"
                  }`}
                />
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-white/50" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-indigo-300" : "text-gray-500"}`}>
                Role / Company
              </label>
              <div className="relative">
                <input type="text" name="role" placeholder="CEO at TechCorp" value={formData.role} onChange={handleChange}
                  className={`w-full rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all ${
                    theme === "dark" ? "bg-indigo-900/60 border border-white/20 text-white placeholder-white/50" : "bg-white border border-gray-200 text-indigo-900 placeholder-gray-400"
                  }`}
                />
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-white/50" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.08-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-indigo-300" : "text-gray-500"}`}>
              Your Experience *
            </label>
            <div className="relative">
              <textarea name="message" placeholder="Share your experience with us..." value={formData.message} onChange={handleChange} rows="3" required
                className={`w-full rounded-lg px-4 py-2.5 pl-10 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all ${
                  theme === "dark" ? "bg-indigo-900/60 border border-white/20 text-white placeholder-white/50" : "bg-white border border-gray-200 text-indigo-900 placeholder-gray-400"
                }`}
              />
              <svg className={`absolute left-3 top-3 w-4 h-4 ${theme === "dark" ? "text-white/50" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-indigo-300" : "text-gray-500"}`}>
              Rating
            </label>
            <StarRating value={Number(formData.rating)} onChange={handleChange} />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading || !formData.name || !formData.message}
            className={`w-full rounded-lg py-3 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white border-white/40 shadow-lg shadow-black/20 backdrop-blur-sm"
                : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-600/40 hover:shadow-indigo-700/50"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-[1.01] active:scale-[0.99]`}>
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9 2zm0 0v-8" />
                </svg>
                Submit Testimonial
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default TestimonialForm;
