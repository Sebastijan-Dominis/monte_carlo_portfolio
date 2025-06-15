import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Spinner from "../spinner/Spinner";
import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings_mc_context/SettingsContext";

interface SettingsType {
  id: number;
  tickers: Array<string>;
  distribution_type: string;
  distribution: Array<number>;
  initial_portfolio: number;
  owner_id: number;
}

function Settings() {
  const { isLoggedIn, logout } = useAuth();
  const [fetchingSettings, setFetchingSettings] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Array<SettingsType> | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { setCurrentSettings } = useSettings();

  const navigate = useNavigate();

  const handleSelect = (s: SettingsType) => {
    setSelectedId(s.id);
    const newSettings = {
      tickers: s.tickers,
      distribution_type: s.distribution_type,
      distribution: s.distribution,
      initial_portfolio: s.initial_portfolio,
    };
    setCurrentSettings(newSettings);
  };

  const [usingSettings, setUsingSettings] = useState(false);

  const handleUse = () => {
    if (!selectedId) {
      alert("Please select which settings to use by clicking.");
      return;
    }
    setUsingSettings(true);
    navigate("/");
  };

  useEffect(() => {
    return () => {
      if (!usingSettings) {
        setCurrentSettings({
          initial_portfolio: 0,
          distribution_type: "random",
          tickers: [],
          distribution: [],
        });
      }
    };
  }, [usingSettings, setCurrentSettings]);

  useEffect(() => {
    const fetchSettings = async function () {
      if (!isLoggedIn) return;
      setFetchingSettings(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/portfolio_settings/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        );
        setSettings(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "API Error: ",
            error?.response?.data?.detail ?? error?.message
          );
          setError(error?.response?.data?.detail ?? error?.message);
          if (error?.response?.status === 401) {
            logout();
          }
        } else {
          console.error("Unknown Error: ", error);
        }
      } finally {
        setFetchingSettings(false);
      }
    };

    fetchSettings();
  }, [isLoggedIn, logout]);

  return (
    <>
      {!fetchingSettings && !error && isLoggedIn && (
        <>
          <div className="mb-4 mt-2 flex justify-evenly">
            <button className="w-14 rounded-lg bg-[#d2d2d2] px-2 py-1 text-sm">
              Add
            </button>
            <button
              className="w-14 rounded-lg bg-[#d2d2d2] px-2 py-1 text-sm"
              onClick={handleUse}
            >
              Use
            </button>
            <button className="w-14 rounded-lg bg-[#d2d2d2] px-2 py-1 text-sm">
              Edit
            </button>
            <button className="w-14 rounded-lg bg-[#d2d2d2] px-2 py-1 text-sm">
              Delete
            </button>
          </div>
          <ul className="justify-self-center">
            {settings?.map((s) => (
              <li key={s.id}>
                <div
                  onClick={() => handleSelect(s)}
                  className={`mb-4 flex flex-col items-center rounded-xl px-4 py-2 ${
                    selectedId === s.id
                      ? "bg-[#bbb] ring-4 ring-[#00D1B2]"
                      : "bg-[#d2d2d2]"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <p>initial amount: {s.initial_portfolio}</p>
                  <p>tickers: {s.tickers.join(", ")}</p>
                  <p>distribution type: {s.distribution_type}</p>
                  <p>distribution: {s.distribution.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {fetchingSettings && <Spinner />}
      {error && (
        <>
          <button className="ml-2 text-[#d2d2d2]" onClick={() => setError("")}>
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2]">
            <h1 className="text-lg">An error occured</h1>
            <p>{error}</p>
          </div>
        </>
      )}
      {!fetchingSettings && !error && isLoggedIn && settings?.length === 0 && (
        <p className="mt-4 text-center text-lg text-[#d2d2d2]">
          No settings found.
        </p>
      )}
      {!isLoggedIn && (
        <p className="mt-4 text-center text-lg text-[#d2d2d2]">
          You are not logged in.
        </p>
      )}
    </>
  );
}

export default Settings;
