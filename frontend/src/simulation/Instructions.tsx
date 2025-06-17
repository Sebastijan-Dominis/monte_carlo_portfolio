import { Link } from "react-router-dom";

function Instructions() {
  return (
    <>
      <div className="mx-8 flex flex-col items-center gap-2 text-start text-sm text-[#d2d2d2] md:mx-28 md:text-base lg:mx-40 lg:text-lg xl:mx-64 2xl:mx-96">
        <Link
          className="fixed left-2 outline-none focus:ring focus:ring-[#d2d2d2] focus:ring-offset-2 md:left-4 lg:left-8 xl:left-16 xl:text-xl 2xl:left-32"
          to={"/"}
        >
          &larr; Go back
        </Link>
        <h1 className="mt-4 text-lg font-bold md:text-xl lg:text-2xl xl:text-3xl">
          Instructions
        </h1>
        <p className="mt-2 self-start md:mt-4 lg:mt-8 xl:mt-16">
          Initial Portfolio = Your current portfolio evaluation
        </p>
        <p className="md:mt-2 lg:mt-4 xl:mt-8">
          Distribution type = random will assume a random distribution of the
          chosen stocks, ETFs and/or cryptocurrencies, equal will distribute
          them equally (e.g. 25% per each of the four, if four were chosen),
          exact will request you to determine the distribution yourself. If
          exact is not chosen, ignore the distribution part.
        </p>
        <p className="md:mt-2 lg:mt-4 xl:mt-8">
          Tickers = tickers used to represent the stock, ETF, or cryptocurrency
          of choice, according to Yahoo finance (e.g. TSLA for the Tesla stock).
          Non-American stocks may need a suffix. Find all tickers{" "}
          <a
            href="https://www.finance.yahoo.com"
            className="underline outline-none focus:ring focus:ring-[#d2d2d2] focus:ring-offset-2"
            target="_blank"
          >
            here
          </a>
          .
        </p>
        <p className="md:mt-2 lg:mt-4 xl:mt-8">
          Distributions = if exact was chosen as distribution type, you need to
          input the same number of elements here as the amount of tickers you
          have.
        </p>
      </div>
    </>
  );
}

export default Instructions;
