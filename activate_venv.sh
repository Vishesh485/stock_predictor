#!/bin/bash
# Activation script for the Python 3.12 virtual environment

echo "Activating Python 3.12 virtual environment..."
source venv/bin/activate

echo "✓ Virtual environment activated!"
echo "Python version: $(python --version)"
echo ""
echo "To deactivate, run: deactivate"
