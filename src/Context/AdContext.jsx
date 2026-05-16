/* ========================================================================
   AD CONTEXT - Manages advertisement state for public website
   ========================================================================
   This context provides:
   - Active ads fetched from the server
   - Functions to track views and clicks
   - Ad display configuration

   Usage:
   const { ads, loading, trackAdView, trackAdClick } = useAdContext();
   ======================================================================== */

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getPublicAds, trackAdView, trackAdClick } from "../Admin/services/adService";

const AdContext = createContext();

/* ========================================================================
   Ad Provider Component
   Wraps the app to provide ad functionality
   ======================================================================== */
export const AdProvider = ({ children }) => {
  // State for ads
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ========================================================================
     Function: fetchAds
     Fetches active ads from the API
     ======================================================================== */
  const fetchAds = useCallback(async () => {
    setLoading(true);
    const result = await getPublicAds();
    if (result.success) {
      setAds(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch ads on mount
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  /* ========================================================================
     Function: handleTrackView
     Records when an ad is viewed
     ======================================================================== */
  const handleTrackView = async (adId) => {
    await trackAdView(adId);
  };

  /* ========================================================================
     Function: handleTrackClick
     Records when an ad is clicked and returns the link
     ======================================================================== */
  const handleTrackClick = async (adId) => {
    const result = await trackAdClick(adId);
    return result.link;
  };

  /* ========================================================================
     Helper: Get ads by position
     Returns ads filtered by position (header, sidebar, inline, popup, footer)
     ======================================================================== */
  const getAdsByPosition = (position) => {
    return ads.filter((ad) => ad.position === position);
  };

  /* ========================================================================
     Helper: Get active popup ad
     Returns the highest priority popup ad
     ======================================================================== */
  const getPopupAd = () => {
    const popups = ads.filter((ad) => ad.position === "popup");
    if (popups.length === 0) return null;
    return popups[0]; // Already sorted by priority from API
  };

  // Context value
  const value = {
    ads,
    loading,
    error,
    fetchAds,
    trackAdView: handleTrackView,
    trackAdClick: handleTrackClick,
    getAdsByPosition,
    getPopupAd,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};

/* ========================================================================
   Custom Hook: useAdContext
   Easy access to ad context in any component
   Usage: const { ads } = useAdContext();
   ======================================================================== */
export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useAdContext must be used within an AdProvider");
  }
  return context;
};

export default AdContext;