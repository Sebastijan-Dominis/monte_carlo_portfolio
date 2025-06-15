import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Spinner from "../spinner/Spinner";
import { useSettings } from "../settings_mc_context/SettingsContext";

type Settings = {
  tickers: Array<string>;
  distribution: Array<number>;
  distribution_type: string;
  initial_portfolio: number;
};

function Sim() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [distributionType, setDistributionType] = useState("random");
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState<Array<string>>([]);
  const [distributionInput, setDistributionInput] = useState("");
  const [distribution, setDistribution] = useState<Array<number>>([]);

  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

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

  const validate = function () {
    if (initialAmount <= 0) {
      alert("Initial amount needs to be higher than 0.");
      return false;
    }
    if (tickers.length <= 0) {
      alert("At least one ticker needed.");
      return false;
    }
    if (
      distributionType === "exact" &&
      distribution.length !== tickers.length
    ) {
      alert(
        "When using exact distribution type, the length of tickers and distribution need to match."
      );
      return false;
    }
    return true;
  };

  const simulate = async (settings: Settings) => {
    try {
      setSimulating(true);
      const response = await axios.post<Blob>(
        `${import.meta.env.VITE_API_URL}/simulations`,
        settings,
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );
      if (response.status !== 200) {
        throw new Error("Simulation Failed.");
      }
      setUrl(URL.createObjectURL(response.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error: ", error?.response?.data ?? error?.message);
        setError(error?.response?.data ?? error?.message);
      } else {
        console.error("Unknown Error: ", error);
      }
    } finally {
      setSimulating(false);
    }
  };

  const run_monte_carlo = function () {
    const valid = validate();
    if (!valid) return;

    const settings: Settings = {
      tickers: tickers,
      distribution: distribution,
      distribution_type: distributionType,
      initial_portfolio: initialAmount,
    };

    simulate(settings);
  };

  const { currentSettings } = useSettings();
  useEffect(() => {
    if (!currentSettings.initial_portfolio) return;
    setTickers(currentSettings.tickers);
    setDistribution(currentSettings.distribution);
    setDistributionType(currentSettings.distribution_type);
    setInitialAmount(currentSettings.initial_portfolio);
  }, [currentSettings]);

  return (
    <div className="md:text-lg lg:text-xl">
      {!url && !simulating && !error && (
        <div className="text-[#d2d2d2]">
          <div className="mt-4 flex items-center justify-center md:mt-6 lg:mt-8 xl:mt-12">
            <p>How to use:</p>
            <Link
              className="ml-4 h-6 w-6 content-center rounded-full bg-[#d2d2d2] text-center text-[#1e1e1e] md:h-8 md:w-8 lg:h-10 lg:w-10"
              to={"/instructions"}
            >
              ?
            </Link>
          </div>
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
              className="w-56 rounded-md px-2 py-1 text-[#1d1d1d] sm:w-64 md:w-80 xl:w-96"
            >
              <option value="random">Random</option>
              <option value="equal">Equal</option>
              <option value="exact">Exact</option>
            </select>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center md:mt-8 lg:mt-16">
            <p>Tickers:</p>
            <p className="max-w-[70dvw] text-center">{tickers.join(", ")}</p>
            <input
              id="ticker"
              type="text"
              className="mt-1 h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:mt-2 md:w-80 lg:mt-4 xl:w-96"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
            />
            <button
              className="mt-2 w-56 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
              onClick={handleAddTicker}
            >
              Add
            </button>
            <button
              className="mt-2 w-56 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
              onClick={handleDeleteTickers}
            >
              Delete tickers
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center md:mt-8 lg:mt-16">
            <p>Distribution:</p>
            <p className="max-w-[70dvw] text-center">
              {distribution.join(", ")}
            </p>
            <input
              id="distribution"
              type="text"
              className="mt-1 h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:mt-2 md:w-80 lg:mt-4 xl:w-96"
              value={distributionInput}
              onChange={(e) => setDistributionInput(e.target.value)}
            />
            <button
              className="mt-2 w-56 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
              onClick={handleAddDistribution}
            >
              Add
            </button>
            <button
              className="mt-2 w-56 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
              onClick={handleDeleteDistribution}
            >
              Delete distribution
            </button>
          </div>
          <button
            className="mx-auto mt-8 block w-56 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center font-bold text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96"
            onClick={run_monte_carlo}
          >
            Simulate
          </button>
        </div>
      )}
      {url && (
        <>
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 md:mt-6 lg:ml-8 lg:mt-8 xl:ml-10 xl:mt-12"
            onClick={() => setUrl("")}
          >
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-[#d2d2d2] md:gap-8 lg:gap-10 xl:gap-12">
            <h1 className="font-bold md:text-lg lg:text-xl xl:text-2xl">
              Results:
            </h1>
            <img
              src={url}
              alt="Monte Carlo simulation result"
              className="w-[75dvw] md:w-[65dvw] lg:w-[50dvw] xl:w-[40dvw]"
            />
          </div>
        </>
      )}
      {simulating && <Spinner />}
      {error && (
        <>
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 md:mt-6 lg:ml-8 lg:mt-8 xl:ml-10 xl:mt-12"
            onClick={() => setError("")}
          >
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2] md:mt-4 lg:mt-8 xl:mt-12">
            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
              An error occured
            </h1>
            <p className="lg:mt-4 xl:mt-8">{error}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Sim;
