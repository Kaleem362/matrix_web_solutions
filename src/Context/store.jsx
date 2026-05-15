/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import sun from "../../Elements/images/sun.png";
import moon from "../../Elements/images/cresent.png";
import designlogo from "../../Elements/images/icons/designicon.png";
import webdev from "../../Elements/images/icons/webdev.png";
import seo from "../../Elements/images/icons/seo.png";
import thumbnaildesign from "../../Elements/images/icons/thumbnaildesign.png";
import cv from "../../Elements/images/icons/cv.png";
import close from "../../Elements/images/icons/close.png";
import fastdel from "../../Elements/images/icons/fastdel.png";
import appdev from "../../Elements/images/icons/appdev.png";
import whatsappicon from "../../Elements/images/icons/whatsappicon.png";
import gmail from "../../Elements/images/icons/gmail.png";
import github from "../../Elements/images/github.png";
import logouticon from "../../Elements/images/logouticon.png";
import logo from "../assets/MatrixLogo.png";
import callIcon from "../../Elements/images/icons/call.png";
import location from "../../Elements/images/icons/location.png";
import linkedin from "../../Elements/images/icons/linkedin.png";
import instagram from "../../Elements/images/icons/instagram.png";
import facebook from "../../Elements/images/icons/facebook.png";
import send from "../../Elements/images/icons/send.png";

export const StoreContext = createContext();

// Exchange rates (global website prices in USD → PKR conversion)
const USD_TO_PKR = 280; // Approximate rate - adjust as needed
const PKR_PRICES = {
  basic: { usd: 35, pkr: 9999 },
  standard: { usd: 70, pkr: 19999 },
  premium: { usd: 140, pkr: 39999 },
};
const SERVICE_PRICES_USD = {
  website: 35,
  app: 140,
  seo: 50,
  logo: 10,
  thumbnail: 2,
  cv: 5,
};

export const convertPrice = (priceObj, currency) => {
  if (currency === "PKR") {
    return `${priceObj.pkr.toLocaleString()} PKR`;
  }
  return `$${priceObj.usd} USD`;
};

export const getServicePriceUSD = (serviceId) => SERVICE_PRICES_USD[serviceId] || 50;
export const getServicePricePKR = (serviceId) => {
  const usd = getServicePriceUSD(serviceId);
  return usd * USD_TO_PKR;
};

export const ContextProvider = ({ children }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [userCountry, setUserCountry] = useState(() => localStorage.getItem("userCountry") || null);
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || null); // 'PKR' or 'USD'
  const [locationRequested, setLocationRequested] = useState(() => localStorage.getItem("locationRequested") === "true");

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // Save to localStorage helper
  const saveLocationData = (country, curr) => {
    setUserCountry(country);
    setCurrency(curr);
    localStorage.setItem("userCountry", country);
    localStorage.setItem("currency", curr);
  };

  // Detect user location on first load
  const detectUserLocation = () => {
    if (locationRequested) return; // Already requested
    setLocationRequested(true);
    localStorage.setItem("locationRequested", "true");

    // First, check timezone - most reliable for Pakistan
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("User timezone:", timeZone);
    if (timeZone === "Asia/Karachi" || timeZone === "Asia/Kolkata" || timeZone.includes("Karachi") || timeZone.includes("Lahore") || timeZone.includes("Islamabad")) {
      saveLocationData("Pakistan", "PKR");
      return;
    }

    // Also check browser language for Pakistan
    const lang = navigator.language || navigator.userLanguage;
    console.log("Browser language:", lang);
    if (lang.toLowerCase().includes("ur") || lang.toLowerCase().includes("pk")) {
      saveLocationData("Pakistan", "PKR");
      return;
    }

    // Then try ipapi.co
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const country = data.country_name || data.country;
        console.log("Detected country:", country);
        if (country === "Pakistan") {
          saveLocationData("Pakistan", "PKR");
        } else {
          saveLocationData(country, "USD");
        }
      })
      .catch(() => {
        // Fallback: Try free ip-api endpoint
        fetch("https://ip-api.com/json/")
          .then((res) => res.json())
          .then((data) => {
            const country = data.country;
            console.log("Fallback detected country:", country);
            if (country === "Pakistan") {
              saveLocationData("Pakistan", "PKR");
            } else {
              saveLocationData(country, "USD");
            }
          })
          .catch(() => {
            // Default to PKR if all detection fails (assuming Pakistani users)
            saveLocationData("Pakistan", "PKR");
          });
      });
  };

  const themeChanger = () => {
    // ❌ theme dependency causes loop

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const services = [
    {
      title: "Website Design",
      bgImage:
        "https://img.freepik.com/free-vector/web-design-illustration-with-icons-concept-creating-websites-creating-logos-more_613284-492.jpg",
    },
    {
      title: "Website Development",
      bgImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "App Design",
      bgImage:
        "https://images.unsplash.com/photo-1767449441925-737379bc2c4d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "App Development",
      bgImage:
        "https://img.freepik.com/free-photo/representation-user-experience-interface-design_23-2150169853.jpg",
    },
    {
      title: "Logo Designing",
      bgImage:
        "https://images.unsplash.com/photo-1569154078462-cb772ab90f97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Search Engine Optimization",
      bgImage:
        "https://img.freepik.com/free-photo/seo-search-engine-optimization-internet-digital-concept_53876-138498.jpg?t=st=1768810419~exp=1768814019~hmac=3d4236b9cad4028306d9358f4a784e2ea1bc02a4a0aacac5c40f01487eb613d5&w=1480",
    },
    {
      title: "Digital Marketing",
      bgImage:
        "https://img.freepik.com/free-photo/social-media-marketing-concept-marketing-with-applications_23-2150063166.jpg?t=st=1768810482~exp=1768814082~hmac=9a11c5164012d53b47665cbb00ef8acab67359a6cf9affff36330abb9ed49330",
    },
  ];

  return (
    <StoreContext.Provider
      value={{
        contacts,
        setContacts,
        theme,
        setTheme,
        themeChanger,
        sun,
        cv,
        moon,
        services,
        designlogo,
        thumbnaildesign,
        webdev,
        fastdel,
        seo,
        whatsappicon,
        logo,
        appdev,
        isQuoteOpen,
        setIsQuoteOpen,
        gmail,
        setActiveService,
        setIsServiceOpen,
        activeService,
        isServiceOpen,
        github,
        logouticon,
        close,
        callIcon,
        location,
        linkedin,
        instagram,
        facebook,
        send,
        loading,
        setLoading,
        error,
        setError,
        success,
        setSuccess,
        userCountry,
        currency,
        setCurrency,
        detectUserLocation,
        locationRequested,
        setLocationRequested,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
