# Python 3.12 Virtual Environment Setup - Complete! ✅

## Summary

Successfully set up Python 3.12 with a virtual environment and installed all dependencies including TensorFlow/Keras for full ML model functionality.

## Installed Packages

- **FastAPI 0.120.4** - Web framework
- **TensorFlow 2.20.0** - Deep learning framework ✅
- **Keras 3.12.0** - High-level neural networks API ✅
- **Pandas 2.3.3** - Data manipulation
- **NumPy 1.26.4** - Numerical computing
- **scikit-learn 1.7.2** - Machine learning utilities
- **yfinance 0.2.66** - Stock data fetching
- **Uvicorn 0.38.0** - ASGI server
- And all other dependencies...

## How to Use

### Activate Virtual Environment

```bash
# Option 1: Use the helper script
source activate_venv.sh

# Option 2: Activate directly
source venv/bin/activate
```

### Verify Installation

```bash
python --version  # Should show Python 3.12.12
python -c "import tensorflow as tf; print(f'TensorFlow: {tf.__version__}')"
```

### Run the Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Deactivate Virtual Environment

```bash
deactivate
```

## Important Notes

1. **Always activate the virtual environment** before running Python commands
2. The virtual environment is located in `/home/harsh/Desktop/stock-price-predictor/venv/`
3. TensorFlow is CPU-only (no CUDA drivers detected, but works fine for this project)
4. The environment uses Python 3.12.12, which is fully compatible with all required packages

## Installing Additional Packages

```bash
# With venv activated
pip install <package-name>

# Update requirements.txt
pip freeze > backend/requirements.txt
```

## Troubleshooting

If you encounter issues:
1. Make sure the virtual environment is activated (you should see `(#venv)` in your prompt)
2. Check Python version: `python --version`
3. Reinstall packages: `pip install -r backend/requirements.txt`

## Next Steps

You're ready to:
- ✅ Train ML models with TensorFlow/Keras
- ✅ Run the FastAPI backend server
- ✅ Make predictions with the LSTM model
- ✅ Fetch real-time stock data with yfinance
