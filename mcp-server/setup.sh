#!/bin/bash

echo "🚀 Setting up Portfolio Builder MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MCP Server Configuration

# OpenAI Configuration (optional)
# OPENAI_API_KEY=your_openai_api_key_here

# Ollama Configuration (optional)
OLLAMA_HOST=http://localhost:11434

# Model Preferences (comma-separated list in order of preference)
PREFERRED_MODELS=ollama,mock

# Server Configuration
PORT=3001
LOG_LEVEL=info
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Check if Ollama is installed
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama is running"
        
        # Check if llama2 model is available
        if ollama list | grep -q "llama2"; then
            echo "✅ llama2 model is available"
        else
            echo "📥 Downloading llama2 model (this may take a while)..."
            ollama pull llama2
        fi
    else
        echo "⚠️  Ollama is installed but not running. Start it with: ollama serve"
    fi
else
    echo "⚠️  Ollama is not installed. You can install it from https://ollama.ai"
    echo "   The server will fall back to mock responses."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the server:"
echo "  npm run start:http"
echo ""
echo "To start in development mode:"
echo "  npm run dev"
echo ""
echo "The server will be available at: http://localhost:3001"
echo ""
echo "For your Portfolio Builder, add this to .env.local:"
echo "  NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001" 