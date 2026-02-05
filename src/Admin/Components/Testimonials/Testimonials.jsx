import { React, useEffect, useState } from "react";

import axios from "axios";
import { socket } from "./../../../Socket.js";


const Testimonials = () => {
  // 🔹 Backend se aane wale SAARE testimonials (approved + unapproved)
  const [testimonialsData, setTestimonialsData] = useState([]);
  // 🔹 Loading state (API call ke dauran)
  const [loading, setLoading] = useState(false);
  // 🔹 Error state (agar API fail ho jaye)
  const [error, setError] = useState("");
  // 🔹 UI filter:
  // pending  => approved === false
  // approved => approved === true
  const [filter, setFilter] = useState("pending");

  // 🔹 Admin ke liye base API (NO query params)
  const GETALL_API_URL = "http://localhost:5000/api/testimonials/all";
  // const API_URL = "http://localhost:5000/api/testimonials/";
  const APP_testimonials_API_URL = "http://localhost:5000/api/testimonials/";

// =========================================
// 🔹 FETCH ALL TESTIMONIALS (ADMIN ONLY)
// =========================================
const fetchTestimonials = async () => {
  try {
    setLoading(true);
    const res = await axios.get(GETALL_API_URL);
    console.log(res.data.data); // checkpoint to console if the data is coming or not
    setTestimonialsData(res.data.data || []);
    setError("");
  } catch (err) {
    setError("Failed to fetch testimonials: " + err.message);
  } finally {
    setLoading(false);
  }
};

// =========================================
// 🔹 useEffect and Socket IO integration
// =========================================
useEffect(() => {
  // 🔹 Initial load (ONLY ONCE)
  fetchTestimonials();

  // 🔥 Socket listener for NEW testimonial submission
  socket.on("newTestimonialSubmitted", (newTestimonial) => {
    console.log("🟢 New testimonial received via socket:", newTestimonial);

    // 🔹 Direct state update (NO API refetch)
    setTestimonialsData((prev) => [
      newTestimonial,
      ...prev,
    ]);
  });

  // 🔹 Cleanup socket listener on unmount
  return () => {
    socket.off("newTestimonialSubmitted");
  };
}, []);


  // =========================================
  // 🔹 FRONTEND FILTERING (CORE LOGIC)
  // =========================================
  // UI ke filter (pending / approved) ko
  // database ke `approved: true/false` se map kar rahe hain
  const filteredTestimonials = testimonialsData.filter((item) =>
    filter === "approved" ? item.approved === true : item.approved === false,
  );

  // =========================================
  // 🔹 APPROVE TESTIMONIAL
  // =========================================
  const approveTestimonial = async (id) => {
    try {
      await axios.patch(`${APP_testimonials_API_URL}${id}/approve`);
      // UI update
      setTestimonialsData((prev) => prev.filter((item) => item._id !== id));

      alert("Testimonial approved successfully");
    } catch (err) {
      alert(
        "Approval failed: " +
          (err?.response?.status +
            " " +
            (err?.response?.data?.message || err.message)),
      );
    }
  };

  // =========================================
  // 🔹 DELETE TESTIMONIAL
  // =========================================
  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;

    try {
      await axios.delete(`${APP_testimonials_API_URL}${id}`);

      // 🔹 UI se bhi remove kar diya
      setTestimonialsData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // =========================================
  // 🔹 UI RENDER
  // =========================================
  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Testimonials Management</h2>

      {/* 🔹 FILTER TABS (UI ONLY) */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded border ${
            filter === "pending"
              ? "bg-indigo-900 text-white border-indigo-900"
              : "bg-white/50 text-gray-700"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded border ${
            filter === "approved"
              ? "bg-black text-white border-black"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Approved
        </button>
      </div>

      {/* 🔹 STATES */}
      {loading && <p className="text-gray-500">Loading testimonials...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && filteredTestimonials.length === 0 && (
        <p className="text-gray-500">No testimonials found.</p>
      )}

      {/* 🔹 TESTIMONIALS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 ">
        {filteredTestimonials.map((item) => (
          <div
            key={item._id}
            className="rounded-lg p-5 bg-white shadow-lg hover:bg-gray-100 shadow-gray-500"
          >
            <div className="mb-2">
              <h4 className="font-semibold text-lg">{item.name}</h4>
              <p className="text-sm text-gray-500">Rating: ⭐ {item.rating}</p>
            </div>

            <p className="text-gray-700 text-sm mb-4">{item.message}</p>

            <div className="flex gap-3">
              {/* 🔹 Approve button sirf pending testimonials ke liye */}
              {!item.approved && (
                <button onClick={() => approveTestimonial(item._id)} className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-transparent hover:text-indigo-900 border hover:border transition">
                  Approve
                </button>
              )}

              <button
                onClick={() => deleteTestimonial(item._id)}
                className="px-4 py-2 bg-red-600 text-white border hover:border-red-600 hover:border hover:bg-transparent hover:text-red-600 transition rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
