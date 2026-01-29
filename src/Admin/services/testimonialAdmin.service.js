import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/*
  Ye saare ADMIN routes hain
*/

// ALL testimonials (approved + pending)
export const fetchAllTestimonials = () =>
  API.get("/testimonials/all");

// Approve testimonial
export const approveTestimonial = (id) =>
  API.patch(`/testimonials/${id}/approve`);

// Delete testimonial
export const deleteTestimonial = (id) =>
  API.delete(`/testimonials/${id}`);
