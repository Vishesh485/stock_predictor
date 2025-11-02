# Quick Start Guide - New Features

## Getting Started with Enhanced Analysis

### 1. Running the Application

#### Start Backend:
```bash
cd backend
python -m uvicorn main:app --reload
```

#### Start Frontend:
```bash
cd frontend
npm run dev
```

### 2. Using the New Features

#### Making a Prediction:
1. Open browser to `http://localhost:3000`
2. Enter a stock symbol (e.g., AAPL, GOOGL, MSFT, TCS.NS)
3. Adjust forecast days slider (5-60 days)
4. Click "Predict Stock Price"

#### Understanding the Results:

##### Price Metrics Dashboard:
- **Current Price**: Latest closing price
- **Predicted Price**: Forecasted price at end of period
- **Change**: Dollar amount change
- **Change %**: Percentage change
- **Avg Prediction**: Average of all predicted prices

##### Confidence Interval (95%):
```
Lower Bound ← Predicted Price → Upper Bound
```
The actual price has a 95% probability of falling within this range.

##### Stock Chart:
- **Blue Line**: Historical prices
- **Red Dashed Line**: Predicted prices
- **Purple Dashed Line**: 50-day moving average (MA50)
- **Orange Dashed Line**: 100-day moving average (MA100)
- **Pink Dashed Line**: 200-day moving average (MA200)

**Toggle Moving Averages**: Use the MA50, MA100, MA200 buttons to show/hide

##### Trend Analysis Cards:

**Past 30 Days** (Recent Trend):
- Shows short-term market direction
- High sensitivity to recent events

**Past 60 Days** (Medium Trend):
- Balances recent and historical data
- Good for swing trading analysis

**Past 90 Days** (Long Trend):
- Long-term market direction
- Better for position trading

**Predicted Trend**:
- Forecast trend direction
- Compare with historical trends

##### Comparative Insights:

**Trend Consistency**:
- ✅ **Consistent**: Prediction follows historical pattern (reliable)
- ⚠️ **Divergent**: Prediction differs from history (review carefully)

**Volatility Change**:
- **Positive (+)**: Expect higher price fluctuations
- **Negative (-)**: Expect more stable prices

**Momentum Shift**:
- **Positive (↑)**: Acceleration in trend
- **Negative (↓)**: Deceleration or reversal

##### Moving Averages Analysis:

**Price Position**:
- **Above MA**: Bullish sentiment
- **Below MA**: Bearish sentiment

**Percentage Difference**:
- Shows how far current price deviates from each MA
- Larger deviation = stronger trend

### 3. Trading Signals

#### Bullish Signals:
- ✅ Price above all moving averages
- ✅ Upward trend consistency
- ✅ Positive momentum shift
- ✅ MA50 > MA100 > MA200 (Golden alignment)

#### Bearish Signals:
- ❌ Price below all moving averages
- ❌ Downward trend consistency
- ❌ Negative momentum shift
- ❌ MA50 < MA100 < MA200 (Death alignment)

#### Neutral/Caution:
- ⚠️ Divergent trend consistency
- ⚠️ High volatility change
- ⚠️ Mixed MA signals
- ⚠️ Price between moving averages

### 4. Best Practices

#### For Day Trading:
- Focus on 20-day and 50-day MAs
- Check 30-day historical trend
- Monitor volatility closely
- Use shorter forecast periods (5-15 days)

#### For Swing Trading:
- Use 50-day and 100-day MAs
- Analyze 60-day historical trend
- Check trend consistency
- Forecast 15-30 days

#### For Long-Term Investment:
- Focus on 100-day and 200-day MAs
- Review 90-day historical trend
- Look for consistent trends
- Forecast 30-60 days

### 5. Example Interpretations

#### Example 1: Strong Buy Signal
```
Current Price: $150
MA50: $145 (Price 3.4% above)
MA100: $140 (Price 7.1% above)
MA200: $135 (Price 11.1% above)
Trend Consistency: ✅ Consistent
Predicted Trend: Upward
Momentum Shift: +0.0023 (Positive)
```
**Interpretation**: Strong upward trend with price above all MAs. Consistent prediction suggests reliable forecast. Consider buying.

#### Example 2: Caution Signal
```
Current Price: $150
MA50: $152 (Price 1.3% below)
MA100: $148 (Price 1.4% above)
MA200: $145 (Price 3.4% above)
Trend Consistency: ⚠️ Divergent
Predicted Trend: Downward
Momentum Shift: -0.0015 (Negative)
```
**Interpretation**: Mixed signals with price between MAs. Divergent prediction and negative momentum suggest potential reversal. Exercise caution.

#### Example 3: Bearish Signal
```
Current Price: $150
MA50: $155 (Price 3.2% below)
MA100: $157 (Price 4.5% below)
MA200: $160 (Price 6.3% below)
Trend Consistency: ✅ Consistent
Predicted Trend: Downward
Volatility Change: +1.5% (Increasing)
```
**Interpretation**: Price below all MAs with consistent downward prediction and increasing volatility. Consider selling or avoiding entry.

### 6. Tips & Tricks

#### Chart Analysis:
1. **Zoom**: Hover over chart for detailed values
2. **Toggle MAs**: Hide/show to reduce clutter
3. **Date Format**: Hover to see full date
4. **Compare Lines**: Look for MA crossovers

#### Understanding Volatility:
- **Low Volatility** (<2%): Stable, predictable
- **Medium Volatility** (2-5%): Normal fluctuation
- **High Volatility** (>5%): Risky, large swings

#### Confidence Intervals:
- **Narrow Range**: Higher confidence in prediction
- **Wide Range**: Lower confidence, more uncertainty
- **Upper Bound**: Best-case scenario
- **Lower Bound**: Worst-case scenario

### 7. Common Questions

**Q: Which moving average is most important?**
A: MA200 for long-term trend, MA50 for medium-term, MA20 for short-term.

**Q: What if trends are divergent?**
A: Exercise caution. Check news, market conditions, and other indicators.

**Q: How accurate are the predictions?**
A: Use confidence intervals. Accuracy varies based on market conditions and volatility.

**Q: What's the best forecast period?**
A: Depends on your strategy. Shorter periods (5-15 days) are generally more accurate.

**Q: Should I trade based solely on these predictions?**
A: No. Use as one tool among many. Consider fundamental analysis, news, and market sentiment.

### 8. Troubleshooting

**Issue**: "No data found for symbol"
- **Solution**: Check symbol spelling, ensure market is open, try different symbol

**Issue**: Moving averages not showing
- **Solution**: Need sufficient historical data (200+ days for MA200)

**Issue**: Divergent trends
- **Solution**: Not an error - indicates prediction differs from history. Review carefully.

**Issue**: High volatility in predictions
- **Solution**: Normal for volatile stocks. Check confidence intervals.

---

## Support

For issues or questions:
1. Check FEATURES_DOCUMENTATION.md for detailed explanations
2. Review the project README.md
3. Check API documentation at http://localhost:8000/docs

---

**Version**: 2.0.0
**Last Updated**: November 2, 2025
