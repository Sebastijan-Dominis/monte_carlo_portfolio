import { useEffect, useState } from "react";
import axios from "axios";

import Spinner from "../spinner/Spinner";
import { useSettings } from "../settings_mc_context/SettingsContext";
import { validate } from "../utils/inputValidation";
import ErrorDisplay from "../components/ErrorDisplay";
import MainForm from "../components/MainForm";

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
    const valid = validate(
      initialAmount,
      tickers,
      distributionType,
      distribution
    );
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
          handleMainEvent={run_monte_carlo}
          mainBtnText="Simulate"
          purpose="sim"
        />
      )}
      {url && (
        <>
          <button
            className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
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
      {error && <ErrorDisplay error={error} setError={setError} />}
    </div>
  );
}

export default Sim;
