import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Spinner from "../spinner/Spinner";
import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings_mc_context/SettingsContext";
import SettingsBtn from "./SettingsBtn";
import SettingsException from "./SettingsException";
import ErrorDisplay from "../components/ErrorDisplay";

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
  const { setCurrentSettings, setCurrentId, currentId } = useSettings();

  const navigate = useNavigate();

  const handleSelect = (s: SettingsType) => {
    setCurrentId(s.id);
    setCurrentId(s.id);
    const newSettings = {
      tickers: s.tickers,
      distribution_type: s.distribution_type,
      distribution: s.distribution,
      initial_portfolio: s.initial_portfolio,
    };
    setCurrentSettings(newSettings);
  };

  const usingSettings = useRef(false);

  const handleUse = () => {
    if (!currentId) {
      alert("Please select which settings to use by clicking.");
      return;
    }
    usingSettings.current = true;
    navigate("/");
  };

  const handleAdd = () => {
    navigate("/settings/add");
  };

  const handleEdit = () => {
    if (!currentId) {
      alert("Please select which settings to use by clicking.");
      return;
    }
    usingSettings.current = true;
    navigate("/settings/edit");
  };

  const handleDelete = async () => {
    if (!isLoggedIn) return;
    if (!currentId) {
      alert("Please select which settings you want to delete first.");
      return;
    }
    setFetchingSettings(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/portfolio_settings/${currentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );
      if (response.status !== 204) {
        throw new Error("Error deleting settings.");
      }
      navigate("/settings");
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

  useEffect(() => {
    return () => {
      if (!usingSettings.current) {
        setCurrentSettings({
          initial_portfolio: 0,
          distribution_type: "random",
          tickers: [],
          distribution: [],
        });
        setCurrentId(null);
      }
    };
  }, [usingSettings, setCurrentSettings, setCurrentId]);

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
        if (response.status !== 200) {
          throw new Error("Error fetching settings.");
        }
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
          <div className="mb-4 mt-2 flex justify-evenly md:mb-8 md:mt-6 lg:mb-12 lg:mt-10 xl:mt-14">
            <SettingsBtn onClick={handleAdd}>Add</SettingsBtn>
            <SettingsBtn onClick={handleUse}>Use</SettingsBtn>
            <SettingsBtn onClick={handleEdit}>Edit</SettingsBtn>
            <SettingsBtn onClick={handleDelete}>Delete</SettingsBtn>
          </div>
          <ul className="justify-self-center">
            {settings?.map((s) => (
              <li key={s.id}>
                <div
                  onClick={() => handleSelect(s)}
                  className={`mb-4 flex flex-col items-center rounded-xl px-4 py-2 md:mb-4 lg:mb-8 ${
                    currentId === s.id
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
      {error && <ErrorDisplay error={error} setError={setError} />}
      {!fetchingSettings && !error && isLoggedIn && settings?.length === 0 && (
        <SettingsException purpose="noSettings" />
      )}
      {!isLoggedIn && <SettingsException purpose="loggedOut" />}
    </>
  );
}

export default Settings;
