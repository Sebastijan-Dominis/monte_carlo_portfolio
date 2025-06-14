import { Link } from "react-router-dom";

function Instructions() {
  return (
    <>
      <div className="mx-8 mt-4 flex flex-col items-center gap-2 text-center text-sm text-[#d2d2d2]">
        <Link className="fixed left-2" to={"/"}>
          &larr; Go back
        </Link>
        <h1 className="mt-4 text-lg font-bold">Instructions</h1>
        <p>Initial Portfolio = Your current portfolio evaluation</p>
        <p>
          Distribution type = random will assume a random distribution of the
          chosen stocks, ETFs and/or cryptocurrencies, equal will distribute
          them equally (e.g. 25% per each of the four, if four were chosen),
          exact will request you to determine the distribution yourself. If
          exact is not chosen, ignore the distribution part.
        </p>
        <p>
          Tickers = tickers used to represent the stock, ETF, or cryptocurrency
          of choice, according to Yahoo finance (e.g. TSLA for the Tesla stock).
          Non-American stocks may need a suffix. Find all tickers{" "}
          <a href="https://www.finance.yahoo.com" className="underline">
            here
          </a>
          .
        </p>
        <p>
          Distributions = if exact was chosen as distribution type, you need to
          input the same number of elements here as the amount of tickers you
          have.
        </p>
      </div>
    </>
  );
}

export default Instructions;
