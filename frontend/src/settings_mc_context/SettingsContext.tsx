import { useState, type ReactNode } from "react";
import { createContext, useContext } from "react";

type CurrentSettings = {
  initial_portfolio: number;
  distribution_type: string;
  tickers: Array<string>;
  distribution: Array<number>;
};

interface SettingsContextType {
  currentSettings: CurrentSettings;
  setCurrentSettings: React.Dispatch<React.SetStateAction<CurrentSettings>>;
  currentId: number | null;
  setCurrentId: React.Dispatch<React.SetStateAction<number | null>>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = function ({ children }: SettingsProviderProps) {
  const [currentSettings, setCurrentSettings] = useState<CurrentSettings>({
    initial_portfolio: 0,
    distribution_type: "random",
    tickers: [],
    distribution: [],
  });

  const [currentId, setCurrentId] = useState<number | null>(null);

  return (
    <SettingsContext.Provider
      value={{ currentSettings, setCurrentSettings, currentId, setCurrentId }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings used outside of the SettingsProvider");
  }
  return context;
}

export { useSettings };
