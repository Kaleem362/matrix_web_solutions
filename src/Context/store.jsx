/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const StoreContext = createContext();

export const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <StoreContext.Provider value={{ theme, setTheme }}>
      {children}
    </StoreContext.Provider>
  );
};
