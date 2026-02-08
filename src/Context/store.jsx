/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import sun from "../../Elements/images/sun.png";
import moon from "../../Elements/images/cresent.png";
export const StoreContext = createContext();
import designlogo from "../../Elements/images/icons/designicon.png";
import webdev from "../../Elements/images/icons/webdev.png";
import seo from "../../Elements/images/icons/seo.png";
import thumbnaildesign from "../../Elements/images/icons/thumbnaildesign.png";
import cv from "../../Elements/images/icons/cv.png";

import fastdel from "../../Elements/images/icons/fastdel.png";
import appdev from "../../Elements/images/icons/appdev.png";
import whatsappicon from "../../Elements/images/icons/whatsappicon.png";
import gmail from "../../Elements/images/icons/gmail.png";
import github from "../../Elements/images/github.png";

import logo from "../assets/MatrixLogo.png";

export const ContextProvider = ({ children }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

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
        github
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
