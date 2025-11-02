'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';

// Dynamically import chart components to prevent SSR hydration issues
const StockChart = dynamic(() => import('./StockChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-pulse text-gray-500">Loading chart...</div>
      </div>
    </div>
  )
});

const TrendComparison = dynamic(() => import('./TrendComparison'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-pulse text-gray-500">Loading trends...</div>
      </div>
    </div>
  )
});

interface HistoricalDataPoint {
  date: string;
  price: number;
  volume?: number;
  ma50?: number | null;
  ma100?: number | null;
  ma200?: number | null;
  ma20?: number | null;
}

interface TrendData {
  direction: string;
  slope: number;
  avg_price: number;
  volatility: number;
}

interface PredictionResult {
  symbol: string;
  predictions: number[];
  historical_data: HistoricalDataPoint[];
  forecast_dates: string[];
  metrics: {
    current_price: number;
    predicted_price: number;
    change: number;
    change_percent: number;
    avg_prediction: number;
    max_prediction: number;
    min_prediction: number;
    confidence_interval_upper: number;
    confidence_interval_lower: number;
  };
  trend_comparison: {
    historical_trend_30d: TrendData;
    historical_trend_60d: TrendData;
    historical_trend_90d: TrendData;
    predicted_trend: TrendData;
    comparison: {
      trend_consistency: string;
      volatility_change: number;
      momentum_shift: number;
    };
  };
  moving_averages: {
    ma50: number | null;
    ma100: number | null;
    ma200: number | null;
    current_vs_ma50: number | null;
    current_vs_ma100: number | null;
    current_vs_ma200: number | null;
  };
}

export default function PredictionForm() {
  const [symbol, setSymbol] = useState('');
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/predict/`, {
        symbol: symbol.toUpperCase(),
        days: days,
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., AAPL, TSLA, TCS.NS"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Forecast Days: {days}
              </label>
              <input
                type="range"
                id="days"
                min="5"
                max="60"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 days</span>
                <span>60 days</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Prediction...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Predict Stock Price
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Price Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Current Price"
              value={`$${result.metrics.current_price.toFixed(2)}`}
              color="blue"
            />
            <MetricCard
              title="Predicted Price"
              value={`$${result.metrics.predicted_price.toFixed(2)}`}
              color="green"
            />
            <MetricCard
              title="Change"
              value={`${result.metrics.change >= 0 ? '+' : ''}$${result.metrics.change.toFixed(2)}`}
              color={result.metrics.change >= 0 ? 'green' : 'red'}
            />
            <MetricCard
              title="Change %"
              value={`${result.metrics.change_percent >= 0 ? '+' : ''}${result.metrics.change_percent.toFixed(2)}%`}
              color={result.metrics.change_percent >= 0 ? 'green' : 'red'}
            />
            <MetricCard
              title="Avg Prediction"
              value={`$${result.metrics.avg_prediction.toFixed(2)}`}
              color="purple"
            />
          </div>

          {/* Confidence Interval */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-indigo-600 dark:text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
                95% Confidence Interval
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Lower Bound</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  ${result.metrics.confidence_interval_lower.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Predicted</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  ${result.metrics.predicted_price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Upper Bound</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  ${result.metrics.confidence_interval_upper.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-indigo-700 dark:text-indigo-300 text-center">
              We can be 95% confident that the actual price will fall within this range
            </p>
          </div>

          {/* Stock Chart with Moving Averages */}
          <StockChart
            historicalData={result.historical_data}
            predictions={result.predictions}
            forecastDates={result.forecast_dates}
            symbol={result.symbol}
          />

          {/* Trend Comparison */}
          <TrendComparison
            trendComparison={result.trend_comparison}
            movingAverages={result.moving_averages}
          />

          {/* Additional Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Prediction Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatItem
                label="Maximum Predicted"
                value={`$${result.metrics.max_prediction.toFixed(2)}`}
                color="green"
              />
              <StatItem
                label="Minimum Predicted"
                value={`$${result.metrics.min_prediction.toFixed(2)}`}
                color="red"
              />
              <StatItem
                label="Price Range"
                value={`$${(result.metrics.max_prediction - result.metrics.min_prediction).toFixed(2)}`}
                color="blue"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  };

  return (
    <div className={`rounded-lg p-6 border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium opacity-75 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </p>
    </div>
  );
}