import { useEffect, useState } from "react";



import {
  fetchAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../../services/testimonialAdmin.service.js";
import AdminLayout from "../../layout/AdminLayout.jsx";
import TestimonialsSkeleton from "./TestimonialsSkeleton.jsx";

/*
  Ab ye component REAL kaam karta hai:

  - API se testimonials fetch
  - Approve → backend call
  - Delete → backend call
  - Loading → skeleton
*/

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================
  // Fetch testimonials
  // ========================
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetchAllTestimonials();
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // ========================
  // Approve handler
  // ========================
  const handleApprove = async (id) => {
    try {
      await approveTestimonial(id);
      // UI ko refresh karne ke liye dobara fetch
      loadTestimonials();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  // ========================
  // Delete handler
  // ========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTestimonial(id);
      loadTestimonials();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Testimonials
      </h1>

      {/* ===== LOADING STATE ===== */}
      {loading && <TestimonialsSkeleton />}

      {/* ===== DATA TABLE ===== */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-left">Message</th>
                <th className="px-5 py-3 text-left">Rating</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {testimonials.map((t) => (
                <tr
                  key={t._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">
                      {t.role}
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-md text-gray-600">
                    {t.message}
                  </td>

                  <td className="px-5 py-4">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </td>

                  <td className="px-5 py-4">
                    {t.approved ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right space-x-2">
                    {!t.approved && (
                      <button
                        onClick={() => handleApprove(t._id)}
                        className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {testimonials.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No testimonials found.
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default Testimonials;
