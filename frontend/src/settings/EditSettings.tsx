import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings_mc_context/SettingsContext";
import Spinner from "../spinner/Spinner";

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

  function handleAddTicker() {
    setTickers((tickers) => [...tickers, tickerInput]);
    setTickerInput("");
  }

  function handleDeleteTickers() {
    setTickers([]);
    setTickerInput("");
  }

  function handleAddDistribution() {
    setDistribution((distribution) => [
      ...distribution,
      Number(distributionInput),
    ]);
    setDistributionInput("");
  }

  function handleDeleteDistribution() {
    setDistribution([]);
    setDistributionInput("");
  }

  const handleEdit = async function () {
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
    <div className="md:mt-4 md:text-lg lg:mt-8 lg:text-xl xl:mt-12">
      {!editingSettings && !error && isLoggedIn && (
        <>
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
            onClick={() => navigate("/settings")}
          >
            &larr; Back
          </button>
          <div className="text-[#d2d2d2]">
            <div className="mt-4 flex flex-col items-center justify-center">
              <h2>Initial amount</h2>
              <input
                id="initial_portfolio"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
                placeholder="10000"
              />
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <h2>Distribution type</h2>
              <select
                id="distribution_type"
                name="distributionType"
                value={distributionType}
                onChange={(e) => setDistributionType(e.target.value)}
                className="w-32 rounded-md px-2 py-1 text-[#1d1d1d] sm:w-64 md:w-80 xl:w-96"
              >
                <option value="random">Random</option>
                <option value="equal">Equal</option>
                <option value="exact">Exact</option>
              </select>
            </div>
            <div className="mt-2 flex flex-col items-center justify-center md:mt-8 lg:mt-16">
              <p>Tickers:</p>
              <p>{tickers.join(", ")}</p>
              <h2>Add ticker</h2>
              <input
                id="ticker"
                type="text"
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:mt-2 md:w-80 lg:mt-4 xl:w-96"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
              />
              <button
                className="mt-2 w-24 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
                onClick={handleAddTicker}
              >
                Add
              </button>
              <button
                className="mt-2 w-auto rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
                onClick={handleDeleteTickers}
              >
                Delete tickers
              </button>
            </div>
            <div className="mt-2 flex flex-col items-center justify-center md:mt-8 lg:mt-16">
              <p>Distribution:</p>
              <p>{distribution.join(", ")}</p>
              <h2>Add distribution</h2>
              <input
                id="distribution"
                type="text"
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:mt-2 md:w-80 lg:mt-4 xl:w-96"
                value={distributionInput}
                onChange={(e) => setDistributionInput(e.target.value)}
              />
              <button
                className="mt-2 w-24 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
                onClick={handleAddDistribution}
              >
                Add
              </button>
              <button
                className="mt-2 w-auto rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
                onClick={handleDeleteDistribution}
              >
                Delete distribution
              </button>
            </div>
            <button
              className="mx-auto mt-8 block w-40 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center font-bold text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </>
      )}
      {editingSettings && <Spinner />}
      {error && (
        <div className="md:mt-4 md:text-lg lg:mt-8 lg:text-xl xl:mt-12 2xl:text-2xl">
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
            onClick={() => setError("")}
          >
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2]">
            <h1 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
              An error occured
            </h1>
            <p className="lg:mt-4 2xl:mt-8">{error}</p>
          </div>
        </div>
      )}
      {/* This should not happen anyway, but just in case... */}
      {!isLoggedIn && (
        <p className="mt-4 text-center text-lg text-[#d2d2d2] md:mt-8 md:text-xl lg:mt-12 lg:text-2xl xl:mt-16 xl:text-3xl">
          You are not logged in.
        </p>
      )}
    </div>
  );
}

export default EditSettings;
