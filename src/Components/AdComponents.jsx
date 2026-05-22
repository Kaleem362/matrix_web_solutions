/* ========================================================================
   AD COMPONENTS - Display advertisements on public website
   ========================================================================
   These components display ads in different positions:
   - InlineAd: Between content sections
   - SidebarAd: In sidebar area
   - HeaderAd: At the top of pages
   - PopupAd: As modal overlay

   Each component tracks views and clicks automatically
   ======================================================================== */

import React, { useState, useEffect } from "react";
import { useAdContext } from "../Context/AdContext";
import { useStore } from "../Context/UseStore";

/* ========================================================================
   INLINE AD COMPONENT
   Displays ads between content (e.g., between sections)
   ======================================================================== */
export const InlineAd = () => {
  const { getAdsByPosition, trackAdView, trackAdClick } = useAdContext();
  const { theme } = useStore();

  const ads = getAdsByPosition("inline");
  const ad = ads.length > 0 ? ads[0] : null;

  // Track view - use useEffect unconditionally
  useEffect(() => {
    if (ad && ad._id) {
      trackAdView(ad._id);
    }
  }, [ad?._id]);

  const handleClick = async () => {
    if (!ad) return;
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (!ad) return null;

  return (
    <div className="my-8">
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-4">
          <div>
            <h4 className="text-white font-semibold text-lg">{ad.title}</h4>
            {ad.description && (
              <p className="text-white/80 text-sm line-clamp-1">{ad.description}</p>
            )}
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
          Ad
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   SIDEBAR AD COMPONENT
   Displays ads in sidebar area
   ======================================================================== */
export const SidebarAd = () => {
  const { getAdsByPosition, trackAdView, trackAdClick } = useAdContext();

  const ads = getAdsByPosition("sidebar");

  if (ads.length === 0) return null;

  const ad = ads[0];

  useEffect(() => {
    trackAdView(ad._id);
  }, []);

  const handleClick = async () => {
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="mb-6">
      <div
        className="rounded-lg overflow-hidden cursor-pointer group relative"
        onClick={handleClick}
      >
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-3">
          <div>
            <h5 className="text-white font-semibold text-sm">{ad.title}</h5>
          </div>
        </div>
        <div className="absolute top-1 right-1 bg-white/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">
          Ad
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   HEADER AD COMPONENT
   Displays ads at the top of pages (banner style)
   ======================================================================== */
export const HeaderAd = () => {
  const { getAdsByPosition, trackAdView, trackAdClick } = useAdContext();

  const ads = getAdsByPosition("header");

  if (ads.length === 0) return null;

  const ad = ads[0];

  useEffect(() => {
    trackAdView(ad._id);
  }, []);

  const handleClick = async () => {
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="w-full">
      <div
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-16 md:h-20 object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute top-1 right-1 bg-white/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">
          Advertisement
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   POPUP AD COMPONENT
   Displays ads as a modal/overlay (with close button)
   ======================================================================== */
export const PopupAd = () => {
  const { getPopupAd, trackAdView, trackAdClick } = useAdContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const ad = getPopupAd();

  // Show popup after a delay
  useEffect(() => {
    if (!ad || isClosed) return;

    const timer = setTimeout(() => {
      trackAdView(ad._id);
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, [ad, isClosed]);

  if (!ad || isClosed) return null;

  const handleClick = async () => {
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true); // Don't show again in this session
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-w-lg w-full rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ad content */}
        <div className="cursor-pointer" onClick={handleClick}>
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-48 md:h-64 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Ad info bar */}
        <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between">
          <span className="text-white text-sm">{ad.title}</span>
          <span className="text-white/60 text-xs">Advertisement</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   FOOTER AD COMPONENT
   Displays ads at the bottom of pages
   ======================================================================== */
export const FooterAd = () => {
  const { getAdsByPosition, trackAdView, trackAdClick } = useAdContext();

  const ads = getAdsByPosition("footer");

  if (ads.length === 0) return null;

  const ad = ads[0];

  useEffect(() => {
    trackAdView(ad._id);
  }, []);

  const handleClick = async () => {
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="mt-8">
      <div
        className="rounded-lg overflow-hidden cursor-pointer relative"
        onClick={handleClick}
      >
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-24 object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute top-1 right-1 bg-white/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded">
          Ad
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   FLOATING AD COMPONENT
   Displays a floating ad that overlays the website (with close button)
   Position: Fixed at bottom-right
   ======================================================================== */
export const FloatingAd = () => {
  const { getAdsByPosition, trackAdView, trackAdClick } = useAdContext();
  const [isVisible, setIsVisible] = useState(true);

  // Get ads first - call hook unconditionally
  const ads = getAdsByPosition("floating");
  const ad = ads.length > 0 ? ads[0] : null;

  // Track view only once - use useEffect unconditionally
  useEffect(() => {
    if (ad && ad._id) {
      trackAdView(ad._id);
    }
  }, [ad?._id]);

  const handleClick = async () => {
    if (!ad) return;
    const link = await trackAdClick(ad._id);
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Early returns after all hooks
  if (!ad || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 md:w-80">
      <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ad Content */}
        <div className="cursor-pointer" onClick={handleClick}>
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Ad Info Bar */}
        <div className="bg-indigo-600 px-3 py-2 flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">{ad.title}</span>
          <span className="text-white/60 text-xs">Ad</span>
        </div>
      </div>
    </div>
  );
};

export default {
  InlineAd,
  SidebarAd,
  HeaderAd,
  PopupAd,
  FooterAd,
  FloatingAd,
};