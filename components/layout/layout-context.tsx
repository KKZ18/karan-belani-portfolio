"use client";
import React, { useContext } from "react";

interface LayoutState {
  theme: { color: string; darkMode: string };
  globalSettings: any;
  pageData: any;
  setGlobalSettings: (v: any) => void;
  setPageData: (v: any) => void;
}

const defaultState: LayoutState = {
  theme: { color: "blue", darkMode: "default" },
  globalSettings: undefined,
  pageData: undefined,
  setGlobalSettings: () => {},
  setPageData: () => {},
};

const LayoutContext = React.createContext<LayoutState>(defaultState);

export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
  children: React.ReactNode;
  globalSettings?: any;
  pageData?: any;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  globalSettings,
  pageData,
}) => (
  <LayoutContext.Provider
    value={{
      theme: globalSettings?.theme ?? defaultState.theme,
      globalSettings,
      pageData,
      setGlobalSettings: () => {},
      setPageData: () => {},
    }}
  >
    {children}
  </LayoutContext.Provider>
);
