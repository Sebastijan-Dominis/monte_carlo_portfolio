import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime as dt
import yfinance as yf

end_date = dt.datetime.now()
start_date = end_date - dt.timedelta(days=1000)
stocks = ["BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD"]

def get_data(stocks, start_date, end_date):
    closing_data = yf.download(stocks, start_date, end_date)["Close"]
    returns = closing_data.pct_change()
    mean_returns = returns.mean()
    cov_matrix = returns.cov()
    return mean_returns, cov_matrix

mean_returns, cov_matrix = get_data(stocks, start_date, end_date)

# only if we don't know the portfolio distribution
weights = np.random.random(len(mean_returns))
weights /= np.sum(weights)

# Monte Carlo Method

# Number of simulations
mc_sims = 10000

# Timeframe for which we make predictions
T = 100

mean_matrix = np.full(shape=(T, len(stocks)), fill_value=mean_returns)
mean_matrix = mean_matrix.T

portfolio_sims = np.full(shape=(T, mc_sims), fill_value=0.0)

initial_portfolio = 10000

for m in range(mc_sims):
    # MC loops
    Z = np.random.normal(size=(T, len(stocks)))
    L = np.linalg.cholesky(cov_matrix)
    daily_returns = mean_matrix + np.inner(L, Z)
    portfolio_sims[:,m] = np.cumprod(np.inner(weights, daily_returns.T) + 1) * initial_portfolio

plt.plot(portfolio_sims)

average_portfolio = portfolio_sims.mean(axis=1)
plt.plot(average_portfolio, color="black", linewidth=2, label="Average")

plt.ylabel("Portfolio Value ($)")
plt.xlabel("Days")
plt.title("MC simulation of a stock portfolio")
plt.show()