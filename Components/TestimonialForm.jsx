import React, { useState } from "react";
import axios from "axios";
import { useStore } from "../src/Context/UseStore";

const TestimonialForm = () => {

  const {theme} = useStore(useStore);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
    image: "", // ✅ STRING (URL)
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/testimonials";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        API_URL,
        {
          name: formData.name,
          role: formData.role,
          message: formData.message,
          rating: Number(formData.rating),
          image: formData.image, // ✅ STRING
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setSuccess(
        "Thank you for your feedback! Your testimonial will be reviewed before publishing.",
      );
      setTimeout(() => {
        setSuccess("");
      }, 5000);

      setFormData({
        name: "",
        role: "",
        message: "",
        rating: 5,
        image: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`w-full px-4 sm:px-8 lg:px-16 py-16 ${
        theme === "dark"
          ? "bg-linear-to-b from-black via-indigo-950 to-indigo-900 text-white"
          : "bg-linear-to-b from-indigo-400 to-white text-white"
      }`}>
      <div
  className={`
    max-w-2xl mx-auto rounded-2xl shadow-xl
    p-5 sm:p-6 md:p-8
    transition-colors duration-300

    ${
                  theme === "dark"
                    ? " bg-indigo-400/30  border-white border"
                    : "bg-indigo-50 border-indigo-200"
                }
  `}
>
  {/* Heading */}
  <h2
    className={`
      text-2xl sm:text-3xl font-bold mb-2
      ${theme === "dark" ? "text-white" : "text-indigo-900"}
    `}
  >
    Share Your Experience
  </h2>

  {/* Description */}
  <p
    className={`
      mb-6 text-sm sm:text-base
      ${theme === "dark" ? "text-indigo-100" : "text-gray-600"}
    `}
  >
    Your feedback helps us improve. All testimonials are reviewed before being
    published.
  </p>

  {/* Success Message */}
  {success && (
    <div
      className={`
        mb-5 rounded-lg p-4 text-sm
        ${
          theme === "dark"
            ? "bg-white/10 border border-indigo-600 text-indigo-100"
            : "bg-indigo-50 border border-indigo-600 text-indigo-900"
        }
      `}
    >
      {success}
    </div>
  )}

  {/* Error Message */}
  {error && (
    <div className="mb-5 rounded-lg p-4 text-sm border border-red-300 bg-red-50 text-red-700">
      {error}
    </div>
  )}

  {/* Form */}
  <form onSubmit={handleSubmit} className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className={`
          w-full rounded-lg px-4 py-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-600
          ${
            theme === "dark"
              ? "bg-indigo-900/60  border border-white text-white placeholder-white/80"
              : "bg-white border border-indigo-600 text-indigo-900 placeholder-indigo-400"
          }
        `}
      />

      <input
        type="text"
        name="role"
        placeholder="Role / Company"
        value={formData.role}
        onChange={handleChange}
        required
        className={`
          w-full rounded-lg px-4 py-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-600
          ${
            theme === "dark"
              ? "bg-indigo-900/60  border border-white text-white placeholder-white/80"
              : "bg-white border border-indigo-600 text-indigo-900 placeholder-indigo-400"
          }
        `}
      />
    </div>

    <textarea
      name="message"
      placeholder="Write your experience with us..."
      value={formData.message}
      onChange={handleChange}
      rows="4"
      required
      className={`
        w-full rounded-lg px-4 py-3 resize-none text-sm sm:text-base
        focus:outline-none focus:ring-2 focus:ring-indigo-600
        ${
          theme === "dark"
            ? "bg-indigo-900/60  border border-white text-white placeholder-white/80"
            : "bg-white border border-indigo-600 text-indigo-900 placeholder-indigo-400"
        }
      `}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <select
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        className={`
          w-full rounded-lg px-4 py-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-600
          ${
            theme === "dark"
              ? "bg-indigo-900/60  border border-white text-white placeholder-white/80"
              : "bg-white border border-indigo-600 text-indigo-900 placeholder-indigo-400"
          }
        `}
      >
        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
        <option value={4}>⭐⭐⭐⭐ Very Good</option>
        <option value={3}>⭐⭐⭐ Good</option>
        <option value={2}>⭐⭐ Fair</option>
        <option value={1}>⭐ Poor</option>
      </select>

      <input
        type="text"
        name="image"
        placeholder="Image URL (optional)"
        value={formData.image}
        onChange={handleChange}
        className={`
          w-full rounded-lg px-4 py-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-600
          ${
            theme === "dark"
              ? "bg-indigo-900/60  border border-white text-white placeholder-white/80"
              : "bg-white border border-indigo-600 text-indigo-900 placeholder-indigo-400"
          }
        `}
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className={`
        w-full rounded-full py-3 font-semibold transition
        disabled:opacity-60
        ${
          theme === "dark"
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-indigo-900 hover:bg-white border hover:text-indigo-900 hover:border-indigo-700 hover:border text-white"
        }
      `}
    >
      {loading ? "Submitting..." : "Submit Testimonial"}
    </button>
  </form>
</div>

    </section>
  );
};

export default TestimonialForm;
