import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime as dt
import yfinance as yf

import io
import base64

def monte_carlo(requested_data):
    ticks = requested_data.ticks
    distribution = requested_data.distribution
    distribution_type = requested_data.distribution_type
    initial_portfolio = requested_data.initial_portfolio

    end_date = dt.datetime.now()
    start_date = end_date - dt.timedelta(days=1000)

    # Fetching data
    def get_data(ticks, start_date, end_date):
        closing_data = yf.download(ticks, start_date, end_date)["Close"]
        returns = closing_data.pct_change()
        mean_returns = returns.mean()
        cov_matrix = returns.cov()
        return mean_returns, cov_matrix

    mean_returns, cov_matrix = get_data(ticks, start_date, end_date)

    # The distribution of a received portfolio
    weights = None
    if distribution_type == "random":
        weights = np.random.random(len(mean_returns))
        weights /= np.sum(weights)
    elif distribution_type == "equal":
        weights = [1/len(ticks) for _ in range(len(ticks))]
    elif distribution_type == "exact":
        weights = np.array(distribution)
        weights = weights/weights.sum()

    # Monte Carlo Method

    # Number of simulations
    mc_sims = 10000

    # Timeframe for which we make predictions
    T = 100

    mean_matrix = np.full(shape=(T, len(ticks)), fill_value=mean_returns)
    mean_matrix = mean_matrix.T

    portfolio_sims = np.full(shape=(T, mc_sims), fill_value=0.0)

    for m in range(mc_sims):
        # MC loops
        Z = np.random.normal(size=(T, len(ticks)))
        L = np.linalg.cholesky(cov_matrix)
        daily_returns = mean_matrix + np.inner(L, Z)
        portfolio_sims[:,m] = np.cumprod(np.inner(weights, daily_returns.T) + 1) * initial_portfolio

    plt.plot(portfolio_sims)

    average_portfolio = portfolio_sims.mean(axis=1)
    plt.plot(average_portfolio, color="black", linewidth=2, label="Average")

    plt.ylabel("Portfolio Value ($)")
    plt.xlabel("Days")
    plt.title("MC simulation of a portfolio")

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return buf
