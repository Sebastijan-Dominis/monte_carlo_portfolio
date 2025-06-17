import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings_mc_context/SettingsContext";
import Spinner from "../spinner/Spinner";
import MainForm from "../components/MainForm";
import SettingsException from "./SettingsException";
import ErrorDisplay from "../components/ErrorDisplay";
import { validate } from "../utils/inputValidation";

type Settings = {
  tickers: Array<string>;
  distribution: Array<number>;
  distribution_type: string;
  initial_portfolio: number;
};

function EditSettings() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [distributionType, setDistributionType] = useState("random");
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState<Array<string>>([]);
  const [distributionInput, setDistributionInput] = useState("");
  const [distribution, setDistribution] = useState<Array<number>>([]);

  const [editingSettings, setEditingSettings] = useState(false);
  const [error, setError] = useState("");

  const { isLoggedIn, logout } = useAuth();
  const { currentId, currentSettings } = useSettings();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentSettings.initial_portfolio) {
      alert(`Failed to load settings.`);
      navigate("/settings");
    }

    setInitialAmount(currentSettings.initial_portfolio);
    setTickers(currentSettings.tickers);
    setDistributionType(currentSettings.distribution_type);
    setDistribution(currentSettings.distribution);
  }, [
    currentSettings.initial_portfolio,
    currentSettings.tickers,
    currentSettings.distribution_type,
    currentSettings.distribution,
    navigate,
  ]);

  const handleEdit = async function () {
    const valid = validate(
      initialAmount,
      tickers,
      distributionType,
      distribution
    );
    if (!valid) return;

    const updatedSettings: Settings = {
      initial_portfolio: initialAmount,
      tickers: tickers,
      distribution_type: distributionType,
      distribution: distribution,
    };

    if (!isLoggedIn) return;
    setEditingSettings(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/portfolio_settings/update/${currentId}`,
        updatedSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );
      if (response.status !== 204) {
        throw new Error("Error editing settings.");
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
      setEditingSettings(false);
    }
  };

  return (
    <div className="md:text-lg lg:text-xl">
      {!editingSettings && !error && isLoggedIn && (
        <>
          <MainForm
            initialAmount={initialAmount}
            setInitialAmount={setInitialAmount}
            distributionType={distributionType}
            setDistributionType={setDistributionType}
            tickerInput={tickerInput}
            setTickerInput={setTickerInput}
            tickers={tickers}
            setTickers={setTickers}
            distributionInput={distributionInput}
            setDistributionInput={setDistributionInput}
            distribution={distribution}
            setDistribution={setDistribution}
            handleMainEvent={handleEdit}
            mainBtnText="Edit"
            purpose="settings"
          />
        </>
      )}
      {editingSettings && <Spinner />}
      {error && <ErrorDisplay error={error} setError={setError} />}
      {/* This should not happen anyway, but just in case... */}
      {!isLoggedIn && (
        <SettingsException purpose="loggedOut"></SettingsException>
      )}
    </div>
  );
}

export default EditSettings;
