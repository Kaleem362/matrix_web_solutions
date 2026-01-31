import React, { useState } from "react";
import axios from "axios";

const TestimonialForm = () => {
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
        }
      );

      setSuccess(
        "Thank you for your feedback! Your testimonial will be reviewed before publishing."
      );

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
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold mb-2">Share Your Experience</h2>

        <p className="text-gray-600 mb-6 text-sm">
          Your feedback helps us improve. All testimonials are reviewed before
          being published.
        </p>

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-4 py-3"
            />

            <input
              type="text"
              name="role"
              placeholder="Role / Company"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-4 py-3"
            />
          </div>

          <textarea
            name="message"
            placeholder="Write your experience with us..."
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
            className="w-full rounded-md border px-4 py-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-3"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Very Good</option>
              <option value={3}>⭐⭐⭐ Good</option>
              <option value={2}>⭐⭐ Fair</option>
              <option value={1}>⭐ Poor</option>
            </select>

            {/* ✅ STRING IMAGE INPUT */}
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-3 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default TestimonialForm;
