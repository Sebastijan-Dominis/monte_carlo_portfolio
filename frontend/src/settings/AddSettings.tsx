import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
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

function AddSettings() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [distributionType, setDistributionType] = useState("random");
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState<Array<string>>([]);
  const [distributionInput, setDistributionInput] = useState("");
  const [distribution, setDistribution] = useState<Array<number>>([]);

  const [addingSettings, setAddingSettings] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  async function handleAddSettings() {
    const valid = validate(
      initialAmount,
      tickers,
      distributionType,
      distribution
    );
    if (!valid) return;

    const newSettings: Settings = {
      initial_portfolio: initialAmount,
      tickers: tickers,
      distribution_type: distributionType,
      distribution: distribution,
    };

    if (!isLoggedIn) return;
    setAddingSettings(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/portfolio_settings/add`,
        newSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );
      if (response.status !== 201) {
        throw new Error("Error adding new settings.");
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
      setAddingSettings(false);
    }
  }

  return (
    <div className="md:text-lg lg:text-xl">
      {!error && !addingSettings && isLoggedIn && (
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
            handleMainEvent={handleAddSettings}
            mainBtnText="Add"
            purpose="settings"
          />
        </>
      )}
      {addingSettings && <Spinner />}
      {error && <ErrorDisplay error={error} setError={setError} />}
      {/* This should not happen anyway, but just in case... */}
      {!isLoggedIn && <SettingsException purpose="loggedOut" />}
    </div>
  );
}

export default AddSettings;
