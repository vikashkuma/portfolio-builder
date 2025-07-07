# 🤖 AI Server for Portfolio Builder - Simple Setup Guide

This is the AI server that powers your portfolio builder. It runs locally on your computer and provides AI suggestions without any external costs!

## 🎯 What This Does

- **Generates professional content** for your portfolio sections
- **Runs completely locally** - no internet needed after setup
- **Completely free** - no API costs or subscriptions
- **Privacy-focused** - all data stays on your computer
- **Multiple AI models** - choose what works best for you

## 🚀 Super Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
# Run this command in the mcp-server folder
npm install
```

### Step 2: Run Setup Script
```bash
# This will set everything up automatically
./setup.sh
```

### Step 3: Start the Server
```bash
# Start the AI server
npm run start:http
```

**That's it!** The server will be running on `http://localhost:3002`

## 📋 Detailed Setup (For Beginners)

### What You Need
- **Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose "LTS" version)
- **At least 4GB RAM** on your computer
- **About 5GB free disk space** for AI models

### Step-by-Step Instructions

#### 1. Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Click the big green "LTS" button to download
3. Run the installer and click "Next" through all steps
4. **Restart your computer** after installation

#### 2. Open Terminal/Command Prompt
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win + R`, type "cmd", press Enter
- **Linux**: Press `Ctrl + Alt + T`

#### 3. Navigate to the AI Server Folder
```bash
# If you're in the main portfolio-builder folder:
cd mcp-server

# You should see files like package.json, setup.sh, etc.
ls
```

#### 4. Install Dependencies
```bash
npm install
```
**Wait for this to finish** - you'll see a progress bar and lots of text.

#### 5. Run the Setup Script
```bash
./setup.sh
```
This will:
- ✅ Check if Node.js is installed
- ✅ Install AI dependencies
- ✅ Download AI models (this takes 10-15 minutes)
- ✅ Create configuration files
- ✅ Test everything works

#### 6. Start the Server
```bash
npm run start:http
```

**You should see:**
```
MCP HTTP Server running on port 3002
Health check: http://localhost:3002/health
Generate content: http://localhost:3002/generate
Available models: http://localhost:3002/models
```

**Keep this terminal window open!** The server needs to keep running.

## 🎮 How to Use

### Starting the Server
```bash
# Quick start
npm run start:http

# Development mode (auto-restarts when you make changes)
npm run dev
```

### Stopping the Server
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

### Checking if Server is Working
```bash
# Test the server
curl http://localhost:3002/health

# Should return something like:
# {"status":"ok","model":{"name":"llama2","provider":"ollama"}}
```

## 🤖 AI Models Explained

### 🦙 Ollama (Recommended)
- **What it is**: AI that runs on your computer
- **Cost**: Completely free
- **Speed**: Fast (no internet needed)
- **Privacy**: All data stays on your computer
- **Setup**: One-time download (about 4GB)

### 🎭 Mock Model
- **What it is**: Pre-written professional responses
- **Cost**: Free
- **Speed**: Instant
- **Setup**: No setup needed
- **Use case**: Testing and development

### 🤖 OpenAI
- **What it is**: Cloud-based AI (like ChatGPT)
- **Cost**: ~$0.002 per 1,000 words
- **Speed**: Depends on internet
- **Setup**: Requires API key
- **Use case**: If you want the highest quality

## 🔧 Troubleshooting

### "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### "Permission denied: ./setup.sh"
**Solution**: 
```bash
chmod +x setup.sh
./setup.sh
```

### "Port 3002 is already in use"
**Solution**:
```bash
# Find what's using the port
lsof -i :3002

# Kill the process (replace XXXX with the number you see)
kill -9 XXXX
```

### "Ollama not available"
**Solution**:
1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Download model: `ollama pull llama2`

### "Server won't start"
**Solution**:
1. Check if you're in the right folder: `ls` should show `package.json`
2. Try: `npm install` again
3. Check the error message and look it up online

### "AI generation not working"
**Solution**:
1. Make sure server is running: `curl http://localhost:3002/health`
2. Check the AI Model Status panel in your portfolio builder
3. Try switching to a different model
4. Restart the server: `Ctrl + C`, then `npm run start:http`

## 📁 What Each File Does

```
mcp-server/
├── package.json          # Lists all the software needed
├── setup.sh              # Automated setup script
├── src/
│   ├── http-server.ts    # The main server file
│   ├── models/           # Different AI models
│   │   ├── ollama.ts     # Local AI model
│   │   ├── mock.ts       # Pre-written responses
│   │   └── openai.ts     # Cloud AI model
│   └── prompts.ts        # Templates for AI requests
└── README.md             # This file
```

## 🎯 Tips for Best Performance

### For Faster AI Responses
1. **Use Ollama**: It's faster than cloud APIs
2. **Close other apps**: Free up RAM for AI models
3. **Use smaller models**: `llama2:7b` is faster than `llama2`

### For Better AI Suggestions
1. **Be specific**: "React Developer" instead of "Developer"
2. **Include context**: Mention your experience level
3. **Use keywords**: Include relevant technologies

## 🆘 Getting Help

### Common Questions

**Q: Do I need to understand AI to use this?**
A: No! The setup script handles everything automatically.

**Q: What if the setup script fails?**
A: Check the error message and try the manual setup steps above.

**Q: Can I use this without internet?**
A: Yes! Once set up, everything works offline.

**Q: Is this safe to use?**
A: Yes! All AI processing happens on your computer, no data is sent anywhere.

**Q: What if I get an error?**
A: Check the troubleshooting section above, or restart the server.

### Debug Mode
```bash
# Start server with detailed logs
DEBUG=* npm run dev
```

### Check Server Status
```bash
# Test if server is working
curl http://localhost:3002/health

# Check available models
curl http://localhost:3002/models
```

## 🎉 Success!

When everything is working, you should see:
- ✅ Server running on port 3002
- ✅ AI models available
- ✅ Portfolio builder can connect to the server
- ✅ AI generation working in your portfolio builder

**Your AI server is now ready to help create amazing portfolios!** 🚀

---

*This AI server is designed to be simple and reliable. If you follow the steps above, it should work perfectly!* 