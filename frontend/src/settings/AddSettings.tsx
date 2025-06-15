import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import Spinner from "../spinner/Spinner";

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

  async function handleAddSettings() {
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
    <>
      {!error && !addingSettings && isLoggedIn && (
        <>
          <button
            className="ml-2 text-[#d2d2d2]"
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
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e]"
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
                className="w-32 rounded-md px-2 py-1 text-[#1d1d1d]"
              >
                <option value="random">Random</option>
                <option value="equal">Equal</option>
                <option value="exact">Exact</option>
              </select>
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <p>Tickers:</p>
              <p>{tickers.join(", ")}</p>
              <h2>Add ticker</h2>
              <input
                id="ticker"
                type="text"
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e]"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
              />
              <button
                className="mt-2 w-24 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e]"
                onClick={handleAddTicker}
              >
                Add
              </button>
              <button
                className="mt-2 w-auto rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e]"
                onClick={handleDeleteTickers}
              >
                Delete tickers
              </button>
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <p>Distribution:</p>
              <p>{distribution.join(", ")}</p>
              <h2>Add distribution</h2>
              <input
                id="distribution"
                type="text"
                className="h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e]"
                value={distributionInput}
                onChange={(e) => setDistributionInput(e.target.value)}
              />
              <button
                className="mt-2 w-24 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e]"
                onClick={handleAddDistribution}
              >
                Add
              </button>
              <button
                className="mt-2 w-auto rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e]"
                onClick={handleDeleteDistribution}
              >
                Delete distribution
              </button>
            </div>
            <button
              className="mx-auto mt-8 block w-40 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center font-bold text-[#1e1e1e]"
              onClick={handleAddSettings}
            >
              Add
            </button>
          </div>
        </>
      )}
      {addingSettings && <Spinner />}
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
      {/* This should not happen anyway, but just in case... */}
      {!isLoggedIn && (
        <p className="mt-4 text-center text-lg text-[#d2d2d2]">
          You are not logged in.
        </p>
      )}
    </>
  );
}

export default AddSettings;
