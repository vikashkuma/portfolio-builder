# 🚀 Portfolio Builder - Quick Start Guide

## ✅ What's New

The project has been **completely simplified**! No more complex setup or port conflicts.

## 🎯 One Command to Run Everything

### Mac/Linux:
```bash
./start.sh
```

### Windows:
```cmd
start.bat
```

## 🛑 One Command to Stop Everything

### Mac/Linux:
```bash
./stop.sh
```

### Windows:
```cmd
stop.bat
```

## 🎉 What the Script Does

The startup script automatically:
- ✅ **Frees ports** - Kills any existing processes on ports 3000, 3001, 3002
- ✅ **Installs dependencies** - Runs `npm install` for both main app and AI server
- ✅ **Configures environment** - Sets up all necessary environment files
- ✅ **Starts AI server** - Runs the MCP server on port 3001
- ✅ **Starts portfolio builder** - Runs Next.js on port 3000
- ✅ **Waits for readiness** - Ensures both servers are fully loaded
- ✅ **Provides feedback** - Shows clear status messages

## 🔧 Troubleshooting

### If something doesn't work:
1. **Stop everything**: `./stop.sh` (or `stop.bat` on Windows)
2. **Start again**: `./start.sh` (or `start.bat` on Windows)

### If you get permission errors:
```bash
chmod +x start.sh stop.sh
```

## 📱 Access Your Application

- **Portfolio Builder**: http://localhost:3000
- **AI Server**: http://localhost:3001

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Click "Create My Portfolio"
3. Fill in your information
4. Use AI to generate content
5. Download your portfolio!

---

**That's it!** The complex setup is now handled automatically. 🎉 