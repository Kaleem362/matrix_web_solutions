/* ========================================================================
   AD SERVICE - Frontend API for advertisement management
   ========================================================================
   This service provides functions to:
   - Get all ads (admin)
   - Get active ads for public website
   - Create, update, delete ads
   - Toggle ad status
   - Track views and clicks

   All functions use axios and include error handling
   ======================================================================== */

import axios from "axios";

const getBaseUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ========================================================================
   Function: getAllAds
   Description: Fetches all ads from the database (for admin)
   Returns: Array of ad objects
   ======================================================================== */
export const getAllAds = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/ads`, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching all ads:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch ads",
    };
  }
};

/* ========================================================================
   Function: getPublicAds
   Description: Fetches only active ads (for public website)
   Returns: Array of active ad objects
   ======================================================================== */
export const getPublicAds = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/ads/public`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching public ads:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch ads",
    };
  }
};

/* ========================================================================
   Function: getAdById
   Description: Fetches a single ad by ID
   Parameters: id - Ad ID
   Returns: Ad object
   ======================================================================== */
export const getAdById = async (id) => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/ads/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching ad:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch ad",
    };
  }
};

/* ========================================================================
   Function: createAd
   Description: Creates a new advertisement
   Parameters: adData - Object containing ad details
   Returns: Created ad object
   ======================================================================== */
export const createAd = async (adData) => {
  try {
    const response = await axios.post(
      `${getBaseUrl()}/api/ads`,
      adData,
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating ad:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create ad",
    };
  }
};

/* ========================================================================
   Function: updateAd
   Description: Updates an existing advertisement
   Parameters:
     - id: Ad ID to update
     - adData: Object containing updated fields
   Returns: Updated ad object
   ======================================================================== */
export const updateAd = async (id, adData) => {
  try {
    const response = await axios.put(
      `${getBaseUrl()}/api/ads/${id}`,
      adData,
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating ad:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update ad",
    };
  }
};

/* ========================================================================
   Function: toggleAdStatus
   Description: Toggles an ad between active/inactive
   Parameters: id - Ad ID
   Returns: Updated ad object with new status
   ======================================================================== */
export const toggleAdStatus = async (id) => {
  try {
    const response = await axios.put(
      `${getBaseUrl()}/api/ads/${id}/toggle`,
      {},
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error toggling ad status:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to toggle status",
    };
  }
};

/* ========================================================================
   Function: deleteAd
   Description: Deletes an advertisement
   Parameters: id - Ad ID to delete
   Returns: Success status
   ======================================================================== */
export const deleteAd = async (id) => {
  try {
    await axios.delete(`${getBaseUrl()}/api/ads/${id}`, {
      withCredentials: true,
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting ad:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete ad",
    };
  }
};

/* ========================================================================
   Function: trackAdView
   Description: Increments view count for an ad (public)
   Parameters: id - Ad ID
   ======================================================================== */
export const trackAdView = async (id) => {
  try {
    await axios.put(`${getBaseUrl()}/api/ads/${id}/view`);
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};

/* ========================================================================
   Function: trackAdClick
   Description: Increments click count and returns ad link
   Parameters: id - Ad ID
   Returns: Ad link for redirect
   ======================================================================== */
export const trackAdClick = async (id) => {
  try {
    const response = await axios.put(`${getBaseUrl()}/api/ads/${id}/click`);
    return {
      success: true,
      link: response.data.data?.link,
    };
  } catch (error) {
    console.error("Error tracking click:", error);
    return {
      success: false,
    };
  }
};

/* ========================================================================
   Function: getAdAnalytics
   Description: Get detailed analytics for an ad
   Parameters: id - Ad ID
   Returns: Analytics data including daily stats
   ======================================================================== */
export const getAdAnalytics = async (id) => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/ads/${id}/analytics`, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch analytics",
    };
  }
};

export default {
  getAllAds,
  getPublicAds,
  getAdById,
  createAd,
  updateAd,
  toggleAdStatus,
  deleteAd,
  trackAdView,
  trackAdClick,
  getAdAnalytics,
};