/* ========================================================================
   ADS COMPONENT - Admin panel for advertisement management
   ========================================================================
   Features:
   - View all ads with status, views, clicks
   - Create new ads with form
   - Edit existing ads
   - Toggle ad status (active/inactive)
   - Delete ads with confirmation modal
   - View analytics (views/clicks)

   Layout: Card-based grid with actions
   ======================================================================== */

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { getAllAds, createAd, updateAd, toggleAdStatus, deleteAd } from "../services/adService";
import { connectAdSocket, disconnectAdSocket, onAdViewed, onAdClicked } from "../services/socketService";
import Loader from "./Loader/Loader";
import { HiOutlineSearch } from "react-icons/hi";
import { BsMegaphone } from "react-icons/bs";
import { FaEye, FaMousePointer, FaToggleOn, FaToggleOff, FaEdit, FaTrash, FaUpload, FaBell } from "react-icons/fa";

const getApiBase = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ads = () => {
  // State management
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [liveStats, setLiveStats] = useState({ views: 0, clicks: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    position: "inline",
    status: "inactive",
    priority: 0,
    adType: "general",
    startDate: "",
    endDate: "",
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  /* ========================================================================
     Function: handleImageUpload
     Uploads image to server and returns URL
     ======================================================================== */
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${getApiBase()}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data?.data?.url) {
        return response.data.data.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  /* ========================================================================
     Function: handleImageChange
     Handles image file selection and preview
     ======================================================================== */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Store file for upload when form is submitted
      setFormData({ ...formData, imageFile: file, image: "" });
    }
  };

  /* ========================================================================
     Function: fetchAds
     Fetches all ads from the API
     ======================================================================== */
  const fetchAds = useCallback(async () => {
    setLoading(true);
    const result = await getAllAds();
    if (result.success) {
      setAds(result.data);
      setError("");
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Real-time socket connection for ad analytics
  useEffect(() => {
    // Connect to socket
    connectAdSocket();

    // Listen for ad views
    onAdViewed((data) => {
      setLiveStats(prev => ({ ...prev, views: prev.views + 1 }));
      setRecentActivity(prev => [
        { type: "view", adId: data.adId, title: data.title, time: new Date() },
        ...prev.slice(0, 9) // Keep last 10 activities
      ]);
      toast.success(`👁 New view: ${data.title}`, { icon: "👁", duration: 2000 });
      // Refresh ads to get updated view count
      fetchAds();
    });

    // Listen for ad clicks
    onAdClicked((data) => {
      setLiveStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
      setRecentActivity(prev => [
        { type: "click", adId: data.adId, title: data.title, time: new Date() },
        ...prev.slice(0, 9)
      ]);
      toast.success(`🖱 New click: ${data.title}`, { icon: "🖱", duration: 2000 });
      fetchAds();
    });

    // Cleanup on unmount
    return () => {
      disconnectAdSocket();
    };
  }, [fetchAds]);

  /* ========================================================================
     Function: handleCreateAd
     Creates a new ad
     ======================================================================== */
  const handleCreateAd = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.link) {
      toast.error("Title and Link are required");
      return;
    }

    // Check if image is provided (either URL or file)
    if (!formData.image && !formData.imageFile) {
      toast.error("Please upload an image or provide an image URL");
      return;
    }

    let imageUrl = formData.image;

    // Upload image if file is selected
    if (formData.imageFile) {
      toast.loading("Uploading image...", { id: "upload" });
      imageUrl = await handleImageUpload(formData.imageFile);
      toast.dismiss("upload");

      if (!imageUrl) {
        toast.error("Failed to upload image");
        return;
      }
    }

    const result = await createAd({
      ...formData,
      image: imageUrl,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    });

    if (result.success) {
      toast.success("Ad created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchAds();
    } else {
      toast.error(result.error || "Failed to create ad");
    }
  };

  /* ========================================================================
     Function: handleUpdateAd
     Updates an existing ad
     ======================================================================== */
  const handleUpdateAd = async (e) => {
    e.preventDefault();

    let imageUrl = formData.image;

    // Upload new image if file is selected
    if (formData.imageFile) {
      toast.loading("Uploading image...", { id: "upload" });
      imageUrl = await handleImageUpload(formData.imageFile);
      toast.dismiss("upload");

      if (!imageUrl) {
        toast.error("Failed to upload image");
        return;
      }
    }

    const result = await updateAd(selectedAd._id, {
      ...formData,
      image: imageUrl,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    });

    if (result.success) {
      toast.success("Ad updated successfully!");
      setShowEditModal(false);
      setSelectedAd(null);
      resetForm();
      fetchAds();
    } else {
      toast.error(result.error || "Failed to update ad");
    }
  };

  /* ========================================================================
     Function: handleToggleStatus
     Toggles ad status between active/inactive
     ======================================================================== */
  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const result = await toggleAdStatus(id);
      if (result.success) {
        toast.success(`Ad ${result.data.status === "active" ? "activated" : "deactivated"}!`);
        // Update the ad in the list directly instead of fetching all
        setAds(prev => prev.map(ad =>
          ad._id === id ? { ...ad, status: result.data.status } : ad
        ));
      } else {
        toast.error(result.error || "Failed to toggle status");
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  /* ========================================================================
     Function: handleDeleteConfirm
     Opens delete confirmation modal
     ======================================================================== */
  const handleDeleteConfirm = (ad) => {
    setSelectedAd(ad);
    setShowDeleteModal(true);
  };

  /* ========================================================================
     Function: handleDeleteAd
     Deletes the selected ad
     ======================================================================== */
  const handleDeleteAd = async () => {
    const result = await deleteAd(selectedAd._id);
    if (result.success) {
      toast.success("Ad deleted successfully!");
      setShowDeleteModal(false);
      setSelectedAd(null);
      fetchAds();
    } else {
      toast.error(result.error || "Failed to delete ad");
    }
  };

  /* ========================================================================
     Function: openEditModal
     Opens edit modal with selected ad data
     ======================================================================== */
  const openEditModal = (ad) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title || "",
      description: ad.description || "",
      image: ad.image || "",
      link: ad.link || "",
      position: ad.position || "inline",
      status: ad.status || "inactive",
      priority: ad.priority || 0,
      adType: ad.adType || "general",
      startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
      endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  /* ========================================================================
     Function: resetForm
     Resets form data to default values
     ======================================================================== */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      link: "",
      position: "inline",
      status: "inactive",
      priority: 0,
      adType: "general",
      startDate: "",
      endDate: "",
    });
  };

  /* ========================================================================
     Filter ads based on search
     ======================================================================== */
  const filteredAds = useMemo(() => {
    if (!search.trim()) return ads;
    const query = search.toLowerCase();
    return ads.filter(
      (ad) =>
        ad.title?.toLowerCase().includes(query) ||
        ad.description?.toLowerCase().includes(query) ||
        ad.position?.toLowerCase().includes(query)
    );
  }, [ads, search]);

  /* ========================================================================
     Helper: Get status badge color
     ======================================================================== */
  const getStatusBadge = (status) => {
    if (status === "active") {
      return "bg-green-100 text-green-700 ring-green-200";
    }
    return "bg-gray-100 text-gray-600 ring-gray-200";
  };

  /* ========================================================================
     Helper: Get ad type badge color
     ======================================================================== */
  const getTypeBadge = (type) => {
    const types = {
      mobile_app: "bg-purple-100 text-purple-700 ring-purple-200",
      promotion: "bg-orange-100 text-orange-700 ring-orange-200",
      announcement: "bg-blue-100 text-blue-700 ring-blue-200",
      general: "bg-gray-100 text-gray-600 ring-gray-200",
    };
    return types[type] || types.general;
  };

  return (
    <>
      <section className="min-h-screen px-1 py-2 sm:px-2">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <BsMegaphone className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Advertisement Management
              </h2>
              <p className="text-sm text-gray-500">
                Create and manage website advertisements
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Create New Ad
          </button>
        </div>

        {/* Real-time Stats Banner */}
        {liveStats.views > 0 || liveStats.clicks > 0 ? (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-4 animate-pulse">
            <FaBell className="text-green-600 text-lg" />
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                Live Views: <span className="text-lg font-bold">{liveStats.views}</span>
              </span>
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                Live Clicks: <span className="text-lg font-bold">{liveStats.clicks}</span>
              </span>
            </div>
            <span className="text-xs text-green-600 ml-auto">Real-time updates active</span>
          </div>
        ) : null}

        {/* Search Bar */}
        <div className="mb-6 relative w-full sm:max-w-sm">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ads..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAds.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <BsMegaphone className="mb-3 text-5xl text-gray-200" />
            <p className="text-base font-semibold text-gray-400">
              No ads found
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {search ? "Try a different search term." : "Create your first advertisement!"}
            </p>
          </div>
        )}

        {/* Ads Grid */}
        {!loading && !error && filteredAds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAds.map((ad) => (
              <div
                key={ad._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Ad Preview Image */}
                <div className="h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full object-cover hidden items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                </div>

                {/* Ad Info */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-800 truncate">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {ad.description}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getStatusBadge(ad.status)}`}>
                    {ad.status}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${getTypeBadge(ad.adType)}`}>
                    {ad.adType?.replace("_", " ")}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                    {ad.position}
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaEye className="text-xs" />
                    {ad.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMousePointer className="text-xs" />
                    {ad.clicks || 0} clicks
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    {ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : 0}%
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleStatus(ad._id)}
                    disabled={togglingId === ad._id}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                      ad.status === "active"
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    } ${togglingId === ad._id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {togglingId === ad._id ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      ad.status === "active" ? <FaToggleOn /> : <FaToggleOff />
                    )}
                    {ad.status === "active" ? "Active" : "Inactive"}
                  </button>

                  <button
                    onClick={() => openEditModal(ad)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteConfirm(ad)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================
            CREATE AD MODAL
            ================================================================ */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Create New Ad</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ad title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ad description (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Image *
                  </label>

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mb-3 relative rounded-lg overflow-hidden h-32 bg-gray-100">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "", imageFile: null });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600">
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload className="text-lg" />
                          <span>Click to upload image</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  {/* OR divider */}
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value, imageFile: null });
                      setImagePreview("");
                    }}
                    placeholder="Paste image URL here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="inline">Inline (Content)</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="header">Header</option>
                      <option value="popup">Popup</option>
                      <option value="footer">Footer</option>
                      <option value="floating">Floating (Overlay)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Type
                    </label>
                    <select
                      value={formData.adType}
                      onChange={(e) => setFormData({ ...formData, adType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="mobile_app">Mobile App</option>
                      <option value="promotion">Promotion</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (0-100)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Create Ad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================
            EDIT AD MODAL
            ================================================================ */}
        {showEditModal && selectedAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Edit Ad</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateAd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Image *
                  </label>
                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mb-3 relative rounded-lg overflow-hidden h-32 bg-gray-100">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "", imageFile: null });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {/* Upload Button */}
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                    {uploadingImage ? (
                      <span className="text-indigo-600">Uploading...</span>
                    ) : (
                      <span className="text-gray-600">Click to upload image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {/* OR Divider */}
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  {/* URL Fallback */}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value, imageFile: null });
                      setImagePreview("");
                    }}
                    placeholder="Paste image URL here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="inline">Inline</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="header">Header</option>
                      <option value="popup">Popup</option>
                      <option value="footer">Footer</option>
                      <option value="floating">Floating (Overlay)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Type
                    </label>
                    <select
                      value={formData.adType}
                      onChange={(e) => setFormData({ ...formData, adType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="mobile_app">Mobile App</option>
                      <option value="promotion">Promotion</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Update Ad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================
            DELETE CONFIRMATION MODAL
            ================================================================ */}
        {showDeleteModal && selectedAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Ad?</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete "{selectedAd.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAd}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Ads;