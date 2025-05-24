import { createContext, useContext } from "react";

export const HeaderVisibilityContext = createContext({
  hideHeader: false,
  setHideHeader: () => {},
});

export const useHeaderVisibility = () => useContext(HeaderVisibilityContext);
