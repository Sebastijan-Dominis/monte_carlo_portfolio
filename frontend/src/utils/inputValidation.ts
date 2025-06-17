export const validate = function (
  initialAmount: number,
  tickers: Array<string>,
  distributionType: string,
  distribution: Array<number>
) {
  if (initialAmount <= 0) {
    alert("Initial amount needs to be higher than 0.");
    return false;
  }
  if (tickers.length <= 0) {
    alert("At least one ticker needed.");
    return false;
  }
  if (distributionType === "exact" && distribution.length !== tickers.length) {
    alert(
      "When using exact distribution type, the length of tickers and distribution need to match."
    );
    return false;
  }
  return true;
};
