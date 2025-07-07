# 🚀 Portfolio Builder Setup Guide - Step by Step

This guide will help you set up the Portfolio Builder with AI in just a few minutes. No technical knowledge required!

## 📋 What You'll Need

- **Computer** with at least 4GB RAM
- **Internet connection** (only for initial setup)
- **About 5GB free disk space**

## 🎯 Step-by-Step Setup

### Step 1: Install Required Software

#### Install Node.js
1. **Go to**: [nodejs.org](https://nodejs.org/)
2. **Click**: The big green "LTS" button
3. **Download and install** the file
4. **Restart your computer** after installation

#### Verify Installation
1. **Open Terminal/Command Prompt**:
   - **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
   - **Windows**: Press `Win + R`, type "cmd", press Enter
   - **Linux**: Press `Ctrl + Alt + T`

2. **Type this command**:
   ```bash
   node --version
   ```
   You should see something like `v18.17.0` or higher.

### Step 2: Download the Project

1. **Open Terminal/Command Prompt**
2. **Navigate to your Documents folder**:
   ```bash
   cd ~/Documents
   ```

3. **Download the project** (replace with your actual repository URL):
   ```bash
   git clone <your-repo-url>
   cd portfolio-builder/portfolio-builder
   ```

### Step 3: Install Dependencies

1. **Install portfolio builder dependencies**:
   ```bash
   npm install
   ```

2. **Navigate to AI server folder**:
   ```bash
   cd mcp-server
   ```

3. **Install AI server dependencies**:
   ```bash
   npm install
   ```

### Step 4: Setup AI Server

1. **Run the automated setup**:
   ```bash
   ./setup.sh
   ```

   **This will take 10-15 minutes** and will:
   - ✅ Check your system
   - ✅ Install AI dependencies
   - ✅ Download AI models
   - ✅ Test everything

2. **Wait for completion** - you'll see "Setup completed successfully!"

### Step 5: Configure Environment

1. **Go back to main project folder**:
   ```bash
   cd ..
   ```

2. **Create environment file**:
   ```bash
   echo "NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002" > .env.local
   ```

## 🚀 Running the Application

### Start AI Server (Terminal 1)

1. **Open a new Terminal/Command Prompt**
2. **Navigate to AI server**:
   ```bash
   cd ~/Documents/portfolio-builder/portfolio-builder/mcp-server
   ```

3. **Start the server**:
   ```bash
   npm run start:http
   ```

4. **You should see**:
   ```
   MCP HTTP Server running on port 3002
   Health check: http://localhost:3002/health
   ```

5. **Keep this terminal open!** (Don't close it)

### Start Portfolio Builder (Terminal 2)

1. **Open another Terminal/Command Prompt**
2. **Navigate to main project**:
   ```bash
   cd ~/Documents/portfolio-builder/portfolio-builder
   ```

3. **Start the portfolio builder**:
   ```bash
   npm run dev
   ```

4. **You should see**:
   ```
   Local: http://localhost:3001
   ```

## 🎨 Using Your Portfolio Builder

1. **Open your web browser**
2. **Go to**: `http://localhost:3001`
3. **Click**: "Create My Portfolio"
4. **Fill in your information** in each section
5. **Use AI to generate content** by clicking "Generate with AI" buttons
6. **Preview and download** your portfolio

## 🔧 Troubleshooting

### "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### "Permission denied: ./setup.sh"
**Solution**:
```bash
chmod +x setup.sh
./setup.sh
```

### "Port already in use"
**Solution**:
```bash
# Find what's using the port
lsof -i :3001
lsof -i :3002

# Kill the process (replace XXXX with the number shown)
kill -9 XXXX
```

### "AI server not available"
**Solution**:
1. Make sure AI server is running in Terminal 1
2. Check the URL in `.env.local`
3. Restart portfolio builder: `npm run dev`

### "Ollama not available"
**Solution**:
1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Download model: `ollama pull llama2`

## ✅ Success Checklist

When everything is working, you should have:

- ✅ **Terminal 1**: AI server running on port 3002
- ✅ **Terminal 2**: Portfolio builder running on port 3001
- ✅ **Browser**: Portfolio builder working at `http://localhost:3001`
- ✅ **AI Features**: "Generate with AI" buttons working
- ✅ **AI Model Status**: Shows available models in the right panel

## 🆘 Need Help?

### Common Issues

**Q: Do I need to be a programmer?**
A: No! The setup script handles everything automatically.

**Q: What if something doesn't work?**
A: Check the troubleshooting section above, or restart both servers.

**Q: Can I use this offline?**
A: Yes! Once set up, everything works without internet.

**Q: Is this safe?**
A: Yes! All AI processing happens on your computer.

### Getting Support

1. **Check this guide** first
2. **Look at the troubleshooting section**
3. **Check the terminal** for error messages
4. **Restart both servers** if needed

## 🎉 You're Done!

Congratulations! You now have a complete portfolio builder with AI that:
- ✅ Works without any external costs
- ✅ Respects your privacy
- ✅ Provides professional AI suggestions
- ✅ Is perfect for students and developers
- ✅ Can be used offline

**Happy portfolio building!** 🚀

---

*This guide is designed to be simple and reliable. If you follow these steps, everything should work perfectly!* 