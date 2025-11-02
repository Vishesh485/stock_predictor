'use client';

import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface TrendData {
    direction: string;
    slope: number;
    avg_price: number;
    volatility: number;
}

interface TrendComparisonProps {
    trendComparison: {
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
    movingAverages: {
        ma50: number | null;
        ma100: number | null;
        ma200: number | null;
        current_vs_ma50: number | null;
        current_vs_ma100: number | null;
        current_vs_ma200: number | null;
    };
}

export default function TrendComparison({ trendComparison, movingAverages }: TrendComparisonProps) {
    const { historical_trend_30d, historical_trend_60d, historical_trend_90d, predicted_trend, comparison } = trendComparison;

    const getTrendIcon = (direction: string) => {
        return direction === 'upward' ? (
            <TrendingUp className="text-green-500" size={24} />
        ) : (
            <TrendingDown className="text-red-500" size={24} />
        );
    };

    const getTrendColor = (direction: string) => {
        return direction === 'upward' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    const getConsistencyBadge = (consistency: string) => {
        const isConsistent = consistency === 'consistent';
        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${isConsistent
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}
            >
                {isConsistent ? 'Consistent Trend' : 'Divergent Trend'}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Trend Comparison Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-blue-500" size={28} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Trend Analysis & Comparison
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 30-Day Historical Trend */}
                    <TrendCard
                        title="Past 30 Days"
                        trend={historical_trend_30d}
                        icon={getTrendIcon(historical_trend_30d.direction)}
                        isHistorical={true}
                    />

                    {/* 60-Day Historical Trend */}
                    <TrendCard
                        title="Past 60 Days"
                        trend={historical_trend_60d}
                        icon={getTrendIcon(historical_trend_60d.direction)}
                        isHistorical={true}
                    />

                    {/* 90-Day Historical Trend */}
                    <TrendCard
                        title="Past 90 Days"
                        trend={historical_trend_90d}
                        icon={getTrendIcon(historical_trend_90d.direction)}
                        isHistorical={true}
                    />

                    {/* Predicted Trend */}
                    <TrendCard
                        title="Predicted Trend"
                        trend={predicted_trend}
                        icon={getTrendIcon(predicted_trend.direction)}
                        isHistorical={false}
                    />
                </div>
            </div>

            {/* Comparison Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-purple-500" size={28} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Comparative Insights
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* Trend Consistency */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                Trend Consistency
                            </span>
                            {getConsistencyBadge(comparison.trend_consistency)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            The predicted trend is{' '}
                            <span className={getTrendColor(predicted_trend.direction)}>
                                {predicted_trend.direction}
                            </span>
                            {comparison.trend_consistency === 'consistent'
                                ? ', matching the recent historical trend pattern.'
                                : ', diverging from the recent historical trend pattern.'}
                        </p>
                    </div>

                    {/* Volatility Analysis */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                Volatility Change
                            </span>
                            <span
                                className={`font-bold ${comparison.volatility_change > 0
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                    }`}
                            >
                                {comparison.volatility_change > 0 ? '+' : ''}
                                {comparison.volatility_change.toFixed(2)}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {Math.abs(comparison.volatility_change) < 1
                                ? 'Expected volatility remains stable.'
                                : comparison.volatility_change > 0
                                    ? 'Predicted period shows increased volatility - higher price fluctuations expected.'
                                    : 'Predicted period shows decreased volatility - more stable prices expected.'}
                        </p>
                    </div>

                    {/* Momentum Shift */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                Momentum Shift
                            </span>
                            <span
                                className={`font-bold ${comparison.momentum_shift > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}
                            >
                                {comparison.momentum_shift > 0 ? '↑' : '↓'}{' '}
                                {Math.abs(comparison.momentum_shift).toFixed(4)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {Math.abs(comparison.momentum_shift) < 0.01
                                ? 'Momentum remains relatively unchanged.'
                                : comparison.momentum_shift > 0
                                    ? 'Positive momentum shift detected - acceleration in upward movement.'
                                    : 'Negative momentum shift detected - deceleration or reversal in trend.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Moving Averages Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Moving Averages Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MovingAverageCard
                        period="50-Day MA"
                        value={movingAverages.ma50}
                        percentage={movingAverages.current_vs_ma50}
                    />
                    <MovingAverageCard
                        period="100-Day MA"
                        value={movingAverages.ma100}
                        percentage={movingAverages.current_vs_ma100}
                    />
                    <MovingAverageCard
                        period="200-Day MA"
                        value={movingAverages.ma200}
                        percentage={movingAverages.current_vs_ma200}
                    />
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Interpretation:</strong> When the current price is above a moving average, it
                        suggests bullish sentiment. When below, it suggests bearish sentiment. The 200-day MA
                        is often considered the most significant long-term trend indicator.
                    </p>
                </div>
            </div>
        </div>
    );
}

function TrendCard({
    title,
    trend,
    icon,
    isHistorical,
}: {
    title: string;
    trend: TrendData;
    icon: React.ReactNode;
    isHistorical: boolean;
}) {
    return (
        <div
            className={`p-4 rounded-lg border-2 ${isHistorical
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                {icon}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Price:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        ${trend.avg_price.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        ${trend.volatility.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Slope:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {trend.slope.toFixed(4)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function MovingAverageCard({
    period,
    value,
    percentage,
}: {
    period: string;
    value: number | null;
    percentage: number | null;
}) {
    if (value === null || percentage === null) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{period}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Insufficient data</p>
            </div>
        );
    }

    const isAbove = percentage > 0;

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{period}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${value.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
                {isAbove ? (
                    <TrendingUp className="text-green-500" size={16} />
                ) : (
                    <TrendingDown className="text-red-500" size={16} />
                )}
                <span
                    className={`text-sm font-semibold ${isAbove ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                >
                    {isAbove ? '+' : ''}
                    {percentage.toFixed(2)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">vs current</span>
            </div>
        </div>
    );
}
