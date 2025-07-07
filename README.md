# 🎨 Portfolio Builder with AI - Complete Guide

A beautiful portfolio builder that uses local AI to generate professional content without any external API costs. Perfect for students, developers, and anyone who wants to create stunning portfolios!

## 🎯 What You'll Get

- **✨ Beautiful Portfolio Builder**: Create professional portfolios with a step-by-step wizard
- **🤖 Local AI Assistant**: Generate content using AI that runs on your computer (no API costs!)
- **🎨 Multiple Themes**: Choose from different visual styles
- **📱 Responsive Design**: Looks great on desktop, tablet, and mobile
- **💾 Export Options**: Download as HTML or JSON
- **🔒 Privacy First**: All AI processing happens locally on your machine

## 🚀 Quick Start (2 Minutes!)

### Prerequisites

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **At least 4GB RAM** (for AI models)

### One-Command Setup & Run

#### On Mac/Linux:
```bash
# 1. Download the project
git clone <your-repo-url>
cd portfolio-builder/portfolio-builder

# 2. Run everything with one command!
./start.sh
```

#### On Windows:
```cmd
# 1. Download the project
git clone <your-repo-url>
cd portfolio-builder\portfolio-builder

# 2. Run everything with one command!
start.bat
```

That's it! The script will:
- ✅ Install all dependencies automatically
- ✅ Configure ports and environment
- ✅ Start the AI server
- ✅ Start the portfolio builder
- ✅ Open your browser to `http://localhost:3000`

### Stop the Application

#### On Mac/Linux:
```bash
# To stop all servers and free ports
./stop.sh
```

#### On Windows:
```cmd
# To stop all servers and free ports
stop.bat
```

## 🎨 Using Your Portfolio Builder

1. **Open your browser** and go to: `http://localhost:3000`
2. **Click "Create My Portfolio"**
3. **Fill in each section** with your information
4. **Use AI to generate content** by clicking "Generate with AI" buttons
5. **Preview your portfolio** in real-time
6. **Download your portfolio** when finished

## 🛠️ Manual Setup (Advanced)

If you prefer to run servers manually:

### Start AI Server
```bash
cd mcp-server
npm run start:http
```

### Start Portfolio Builder (in new terminal)
```bash
npm run dev
```

## 🔧 Troubleshooting

### "Permission denied: ./start.sh"
```bash
chmod +x start.sh
./start.sh
```

### "Port already in use"
The start script automatically handles this, but if you need to manually free ports:
```bash
./stop.sh
```

### "AI server not available"
1. Make sure you ran `./start.sh` (not manual commands)
2. Check that both servers are running
3. Restart with `./stop.sh && ./start.sh`

## ✅ Success Checklist

When everything is working, you should have:

- ✅ **Portfolio Builder**: Running at `http://localhost:3000`
- ✅ **AI Server**: Running at `http://localhost:3001`
- ✅ **AI Features**: "Generate with AI" buttons working
- ✅ **Clean Shutdown**: `./stop.sh` frees all ports

## 🆘 Need Help?

### Common Questions

**Q: Do I need to be a programmer?**
A: No! Just run `./start.sh` and you're ready to go.

**Q: What if something doesn't work?**
A: Run `./stop.sh` then `./start.sh` again.

**Q: Can I use this offline?**
A: Yes! Once set up, everything works without internet.

**Q: Is this safe?**
A: Yes! All AI processing happens on your computer.

**Q: How do I stop the application?**
A: Press `Ctrl+C` in the terminal or run `./stop.sh`

## 🎯 Next Steps

1. **Create your portfolio** using the step-by-step wizard
2. **Customize themes** to match your style
3. **Generate AI content** for each section
4. **Export your portfolio** as HTML or JSON
5. **Share your work** with the world!

## 🎨 Using the Portfolio Builder

### 1. Create Your Portfolio

1. **Open**: `http://localhost:3000`
2. **Click**: "Create My Portfolio"
3. **Follow the steps**:
   - **About**: Your name, role, and bio
   - **Experience**: Work history and achievements
   - **Education**: Academic background
   - **Skills**: Technical abilities and proficiency levels
   - **Awards**: Recognition and achievements
   - **Testimonials**: Client or colleague feedback
   - **Contact**: How people can reach you

### 2. Using AI Features

#### AI Model Status Panel
- Look for the "AI Model Status" panel on the right side
- Shows which AI models are available:
  - 🦙 **Ollama** (Recommended): Free, runs on your computer
  - 🎭 **Mock**: Always available, predefined responses
  - 🤖 **OpenAI**: Requires API key (paid)

#### Generate Content with AI
1. **Fill in basic information** in any section
2. **Click "Generate with AI"** button
3. **Review the suggestions** provided by AI
4. **Save the content** you like
5. **Edit and customize** as needed

#### Example: Skills Section
1. Enter your current skills: "React (Expert), Python (Intermediate)"
2. Click "Generate with AI"
3. AI suggests additional skills: "TypeScript, Node.js, Docker, AWS"
4. Select the skills you want to add
5. Choose proficiency levels for each

### 3. Customize Your Portfolio

#### Themes
- **Light Theme**: Clean, professional look
- **Dark Theme**: Modern, sleek appearance
- **Custom Colors**: Adjust to match your brand

#### Layout Options
- **Single Page**: Everything on one page
- **Multi-Page**: Separate pages for each section

#### Export Options
- **HTML**: Complete website file
- **JSON**: Data backup
- **PDF**: Print-friendly version

## 🤖 AI Models Explained

### 🦙 Ollama (Recommended for Students)
- **Cost**: Completely free
- **Setup**: One-time installation
- **Speed**: Fast (runs on your computer)
- **Privacy**: All data stays on your machine
- **Quality**: Good for most use cases

### 🎭 Mock Model
- **Cost**: Free
- **Setup**: No setup required
- **Speed**: Instant
- **Quality**: Predefined professional responses
- **Use Case**: Testing and development

### 🤖 OpenAI
- **Cost**: ~$0.002 per 1,000 words
- **Setup**: Requires API key
- **Speed**: Depends on internet
- **Quality**: High quality
- **Use Case**: Production use

## 📁 Project Structure

```
portfolio-builder/
├── app/                          # Portfolio builder application
│   ├── components/builder/       # UI components
│   ├── utils/ai.ts              # AI integration
│   └── ...
├── mcp-server/                   # AI server
│   ├── src/
│   │   ├── models/              # AI model implementations
│   │   └── http-server.ts       # API server
│   └── ...
└── README.md                     # This file
```

## 🎯 Tips for Best Results

### For Better AI Suggestions
1. **Be specific**: Instead of "developer", write "Full Stack React Developer"
2. **Include context**: Mention your experience level and industry
3. **Use keywords**: Include relevant technologies and skills
4. **Provide examples**: Give AI something to work with

### For Better Portfolio
1. **Start with basics**: Fill in name, role, and basic info first
2. **Use AI for enhancement**: Let AI suggest improvements
3. **Customize everything**: Edit AI suggestions to match your voice
4. **Add real examples**: Include actual projects and achievements
5. **Keep it updated**: Regularly update your portfolio

## 🎉 Success!

You now have a complete portfolio builder with local AI that:
- ✅ Works without any external costs
- ✅ Respects your privacy
- ✅ Provides professional AI suggestions
- ✅ Is perfect for students and developers
- ✅ Can be used offline

**Happy portfolio building!** 🚀

---

*Made with ❤️ for students and developers who want to create amazing portfolios without breaking the bank!*
