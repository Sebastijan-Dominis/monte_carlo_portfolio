import monte_carlo_casino from "../assets/monte_carlo_casino.jpg";
import mc_example from "../assets/mc_example.png";
import ibm_logo from "../assets/ibm_logo.png";
import cash_illustration from "../assets/cash_illustration.png";

function About() {
  return (
    <div className="text-[#d2d2d2]">
      <h1 className="text-center text-xl">About</h1>
      <div className="grid grid-cols-2 place-items-center gap-x-4 gap-y-8 px-4 pt-8 text-sm">
        <img src={monte_carlo_casino} alt="Monte Carlo casino" />
        <p>
          The Monte Carlo simulation was named after the famous gambling
          destination in Monaco because chance and random outcomes are central
          to this modeling technique, as they are to games like roulette, dice,
          and slot machines.
        </p>
        <p>
          When faced with significant uncertainty in making a forecast or
          estimate, some methods replace the uncertain variable with a single
          average number. The Monte Carlo simulation instead uses multiple
          values and then averages the results.
        </p>
        <img src={mc_example} alt="An example of MC simulation" />
        <img src={ibm_logo} alt="IBM logo" />
        <p>
          Today, Monte Carlo simulations are increasingly being used in
          conjunction with new artificial intelligence (AI) models. For example,
          as IBM noted in 2024, many financial firms now use high performance
          computing systems to run Monte Carlo simulations and, "As the numbers
          of these simulations grow over ever-increasing portfolios of financial
          assets and instruments, the interpretation of these as an entirety
          becomes a growing challenge." That is where AI comes in. "The use of
          AI to assist a professional in their assessment of these simulations
          can both improve accuracy as well as deliver more timely insights. In
          a business where time-to-market is a key differentiator, this has
          direct business value," IBM says.
        </p>
        <p>
          This website allows you to run your own MC simulations on stocks, ETFs
          and cryptocurrencies of your choice, while also being able to
          distribute the percentage of your portfolio to each part of it as you
          wish. You can save your portfolio settings with an account, so you
          don't have to manually type them each time you run an MC simulation.
          Make sure to use the tickers that align with those from yahoo, which
          can be found{" "}
          <a href="https://www.finance.yahoo.com" className="underline">
            here
          </a>
          .
        </p>
        <img src={cash_illustration} alt="" />
      </div>
    </div>
  );
}

export default About;
