/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import sun from "../../Elements/images/sun.png";  
import moon from "../../Elements/images/cresent.png";  
export const StoreContext = createContext();

export const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const themeChanger = () =>{
    if(theme === "dark"){
      setTheme("light")
    }
    else{
      setTheme("dark")
    }
    
  }

  return (
    <StoreContext.Provider value={{ theme, setTheme, themeChanger, sun, moon }}>
      {children}
    </StoreContext.Provider>
  );
};
