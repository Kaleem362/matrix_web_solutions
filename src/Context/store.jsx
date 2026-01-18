/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import sun from "../../Elements/images/sun.png";  
import moon from "../../Elements/images/cresent.png";  
export const StoreContext = createContext();
import designlogo from "../../Elements/images/icons/designicon.png"
import webdev from "../../Elements/images/icons/webdev.png"
import fastdel from "../../Elements/images/icons/fastdel.png"
import seo from "../../Elements/images/icons/seo.png"
import whatsappicon from "../../Elements/images/icons/whatsappicon.png"

export const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);


  const themeChanger = () =>{
    if(theme === "dark"){
      setTheme("light")
    }
    else{
      setTheme("dark")
    }
    
  }
  const services = [
      {
        title: "Website Design",
        bgImage:
          "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Website Development",
        bgImage:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "App Design",
        bgImage:
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "App Development",
        bgImage:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Logo Designing",
        bgImage:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Search Engine Optimization",
        bgImage:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Digital Marketing",
        bgImage:
          "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1400&q=80",
      },
    ];

  return (
    <StoreContext.Provider value={{ theme, setTheme, themeChanger, sun, moon, services, designlogo,  webdev, fastdel,seo,whatsappicon, isQuoteOpen, setIsQuoteOpen }}>
      {children}
    </StoreContext.Provider>
  );
};
