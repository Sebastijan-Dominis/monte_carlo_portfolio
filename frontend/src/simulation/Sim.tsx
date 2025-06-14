import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Spinner from "../spinner/Spinner";

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
  const [distributions, setDistributions] = useState<Array<number>>([]);

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
    setDistributions((distributions) => [
      ...distributions,
      Number(distributionInput),
    ]);
    setDistributionInput("");
  }

  function handleDeleteDistribution() {
    setDistributions([]);
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
      distributions.length !== tickers.length
    ) {
      alert(
        "When using exact distribution type, the length of tickers and distributions need to match."
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
        }
      );
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
      distribution: distributions,
      distribution_type: distributionType,
      initial_portfolio: initialAmount,
    };

    simulate(settings);
  };

  return (
    <>
      {!url && !simulating && !error && (
        <div className="text-[#d2d2d2]">
          <div className="mt-4 flex items-center justify-center">
            <p>How to use:</p>
            <Link
              className="ml-4 h-6 w-6 rounded-full bg-[#d2d2d2] text-center text-[#1e1e1e]"
              to={"/instructions"}
            >
              ?
            </Link>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center">
            <h2>Initial amount</h2>
            <input
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
            <p>Distributions:</p>
            <p>{distributions.join(", ")}</p>
            <h2>Add distribution</h2>
            <input
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
              Delete distributions
            </button>
          </div>
          <button
            className="mx-auto mt-8 block w-40 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center font-bold text-[#1e1e1e]"
            onClick={run_monte_carlo}
          >
            Simulate
          </button>
        </div>
      )}
      {url && (
        <>
          <button className="ml-2 text-[#d2d2d2]" onClick={() => setUrl("")}>
            &larr; Back
          </button>
          <div className="flex flex-col items-center gap-6 text-[#d2d2d2]">
            <h1 className="font-bold">Results:</h1>
            <img
              src={url}
              alt="Monte Carlo simulation result"
              className="w-[75dvw]"
            />
          </div>
        </>
      )}
      {simulating && <Spinner />}
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
    </>
  );
}

export default Sim;
