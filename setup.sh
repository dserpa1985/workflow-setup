#!/bin/bash

# Example Setup Script
# This script demonstrates a basic setup workflow

set -e  # Exit on error
set -u  # Exit on undefined variable

echo "================================"
echo "Starting Setup Script"
echo "================================"
echo ""

# Display environment info
echo "Environment Information:"
echo "  OS: $(uname -s)"
echo "  Arch: $(uname -m)"
echo "  User: $(whoami)"
echo "  Working Directory: $(pwd)"
echo ""

# Check for required commands
echo "Checking for required tools..."
for cmd in git bash; do
    if command -v "$cmd" &> /dev/null; then
        echo "  ✓ $cmd is installed"
    else
        echo "  ✗ $cmd is NOT installed"
        exit 1
    fi
done
echo ""

# Example: Create necessary directories
echo "Setting up directories..."
mkdir -p logs
mkdir -p build
echo "  ✓ Directories created"
echo ""

# Example: Install dependencies (customize as needed)
echo "Installing dependencies..."
echo "  (Add your dependency installation commands here)"
echo "  ✓ Dependencies ready"
echo ""

# Example: Run build or configuration steps
echo "Running configuration..."
echo "  (Add your configuration commands here)"
echo "  ✓ Configuration complete"
echo ""

echo "================================"
echo "✓ Setup Complete!"
echo "================================"
