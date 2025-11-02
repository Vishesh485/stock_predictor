'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalDataPoint {
  date: string;
  price: number;
  volume?: number;
  ma50?: number | null;
  ma100?: number | null;
  ma200?: number | null;
  ma20?: number | null;
}

interface StockChartProps {
  historicalData: HistoricalDataPoint[];
  predictions: number[];
  forecastDates: string[];
  symbol: string;
}

export default function StockChart({
  historicalData,
  predictions,
  forecastDates,
  symbol,
}: StockChartProps) {
  const [showMA50, setShowMA50] = useState(true);
  const [showMA100, setShowMA100] = useState(true);
  const [showMA200, setShowMA200] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Combine historical and predicted data
  const chartData = [
    ...historicalData.map((item) => ({
      date: item.date,
      historical: item.price,
      predicted: null,
      ma50: item.ma50,
      ma100: item.ma100,
      ma200: item.ma200,
    })),
    ...predictions.map((price, index) => ({
      date: forecastDates[index],
      historical: null,
      predicted: price,
      ma50: null,
      ma100: null,
      ma200: null,
    })),
  ];

  // Format date for display (client-side only to avoid hydration issues)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch {
      return dateString;
    }
  };

  // Prevent hydration mismatch by not rendering chart until mounted
  if (!isMounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {symbol} - Price Forecast with Moving Averages
          </h2>
        </div>
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-pulse text-gray-500">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {symbol} - Price Forecast with Moving Averages
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowMA50(!showMA50)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${showMA50
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            MA50
          </button>
          <button
            onClick={() => setShowMA100(!showMA100)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${showMA100
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            MA100
          </button>
          <button
            onClick={() => setShowMA200(!showMA200)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${showMA200
              ? 'bg-pink-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            MA200
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatDate}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any) => {
              if (value === null) return ['N/A', ''];
              return [`$${value?.toFixed(2)}`, ''];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />

          {/* Historical Price */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Historical Price"
          />

          {/* Predicted Price */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#ef4444"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            name="Predicted Price"
          />

          {/* Moving Averages */}
          {showMA50 && (
            <Line
              type="monotone"
              dataKey="ma50"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
              name="MA50"
              strokeDasharray="3 3"
            />
          )}

          {showMA100 && (
            <Line
              type="monotone"
              dataKey="ma100"
              stroke="#f97316"
              strokeWidth={1.5}
              dot={false}
              name="MA100"
              strokeDasharray="3 3"
            />
          )}

          {showMA200 && (
            <Line
              type="monotone"
              dataKey="ma200"
              stroke="#ec4899"
              strokeWidth={1.5}
              dot={false}
              name="MA200"
              strokeDasharray="3 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Chart Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500"></div>
            <span>Historical Prices (Past Data)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></div>
            <span>Predicted Prices (Forecast)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-purple-500 opacity-60 border-dashed border-t-2 border-purple-500"></div>
            <span>50-Day Moving Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-orange-500 opacity-60 border-dashed border-t-2 border-orange-500"></div>
            <span>100-Day Moving Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-pink-500 opacity-60 border-dashed border-t-2 border-pink-500"></div>
            <span>200-Day Moving Average</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Moving averages help identify trends and potential support/resistance levels. Toggle them on/off using the buttons above.
        </p>
      </div>
    </div>
  );
}