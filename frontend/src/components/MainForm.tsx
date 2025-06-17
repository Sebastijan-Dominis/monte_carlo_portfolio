import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// common styles
const addDelete =
  "mt-2 w-24 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96";
const innerContainer = "flex flex-col items-center justify-center";
const chooseArray =
  "h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:mt-2 md:w-80 lg:mt-4 xl:w-96";
const outlineElement =
  "outline-none focus:ring focus:ring-offset-2 focus:ring-[#d2d2d2]";

interface MainFormProps {
  initialAmount: number;
  setInitialAmount: React.Dispatch<React.SetStateAction<number>>;
  distributionType: string;
  setDistributionType: React.Dispatch<React.SetStateAction<string>>;
  tickerInput: string;
  setTickerInput: React.Dispatch<React.SetStateAction<string>>;
  tickers: Array<string>;
  setTickers: React.Dispatch<React.SetStateAction<Array<string>>>;
  distributionInput: string;
  setDistributionInput: React.Dispatch<React.SetStateAction<string>>;
  distribution: Array<number>;
  setDistribution: React.Dispatch<React.SetStateAction<Array<number>>>;
  handleMainEvent: () => void;
  mainBtnText: string;
  purpose: string;
}

function MainForm({
  initialAmount,
  setInitialAmount,
  distributionType,
  setDistributionType,
  tickerInput,
  setTickerInput,
  tickers,
  setTickers,
  distributionInput,
  setDistributionInput,
  distribution,
  setDistribution,
  handleMainEvent,
  mainBtnText,
  purpose,
}: MainFormProps) {
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

  function handleDeleteDistributions() {
    setDistribution([]);
    setDistributionInput("");
  }

  const navigate = useNavigate();

  return (
    <>
      {purpose === "settings" && (
        <button
          className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
          onClick={() => navigate("/settings")}
        >
          &larr; Back
        </button>
      )}
      {purpose === "sim" && (
        <div className="flex items-center justify-center text-[#d2d2d2]">
          <p>How to use:</p>
          <Link
            className={`ml-4 h-6 w-6 content-center rounded-full bg-[#d2d2d2] text-center text-[#1e1e1e] md:h-8 md:w-8 lg:h-10 lg:w-10 ${outlineElement}`}
            to={"/instructions"}
          >
            ?
          </Link>
        </div>
      )}
      <div className="text-[#d2d2d2]">
        <div className={`mt-4 ${innerContainer}`}>
          <h2>Initial amount</h2>
          <input
            id="initial_portfolio"
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className={`h-8 w-56 rounded-lg px-2 py-1 text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96 ${outlineElement}`}
            placeholder="10000"
          />
        </div>
        <div className={`mt-2 ${innerContainer}`}>
          <h2>Distribution type</h2>
          <select
            id="distribution_type"
            name="distributionType"
            value={distributionType}
            onChange={(e) => setDistributionType(e.target.value)}
            className={`w-32 rounded-md px-2 py-1 text-[#1d1d1d] sm:w-64 md:w-80 xl:w-96 ${outlineElement}`}
          >
            <option value="random">Random</option>
            <option value="equal">Equal</option>
            <option value="exact">Exact</option>
          </select>
        </div>
        <div className={`mt-2 ${innerContainer} md:mt-8 lg:mt-16`}>
          <p>Tickers:</p>
          <p>{tickers.join(", ")}</p>
          <h2>Add ticker</h2>
          <input
            id="ticker"
            type="text"
            className={`${chooseArray} ${outlineElement}`}
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
          />
          <button
            className={`${addDelete} ${outlineElement}`}
            onClick={handleAddTicker}
          >
            Add
          </button>
          <button
            className={`${addDelete} ${outlineElement}`}
            onClick={handleDeleteTickers}
          >
            Delete tickers
          </button>
        </div>
        <div className={`mt-2 ${innerContainer} md:mt-8 lg:mt-16`}>
          <p>Distribution:</p>
          <p>{distribution.join(", ")}</p>
          <h2>Add distribution</h2>
          <input
            id="distribution"
            type="text"
            className={`${chooseArray} ${outlineElement}`}
            value={distributionInput}
            onChange={(e) => setDistributionInput(e.target.value)}
          />
          <button
            className={`${addDelete} ${outlineElement}`}
            onClick={handleAddDistribution}
          >
            Add
          </button>
          <button
            className={`${addDelete} ${outlineElement}`}
            onClick={handleDeleteDistributions}
          >
            Delete distribution
          </button>
        </div>
        <button
          className={`mx-auto mt-8 block w-40 rounded-lg bg-[#d2d2d2] px-2 py-1 text-center font-bold text-[#1e1e1e] sm:w-64 md:w-80 xl:w-96 ${outlineElement}`}
          onClick={handleMainEvent}
        >
          {mainBtnText}
        </button>
      </div>
    </>
  );
}

export default MainForm;
