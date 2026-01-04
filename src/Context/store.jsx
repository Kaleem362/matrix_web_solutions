import { createContext, useState } from "react";

// create context
const StoreContext = createContext();

// provider
export const ContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const values = {
    theme,
    setTheme
  };

  return (
    <StoreContext.Provider value={values}>
      {children}
    </StoreContext.Provider>
  );
};


