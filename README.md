# RepoScope 🔍

An intelligent repository analytics and project planning tool that leverages AI to provide deep insights into your codebase, automate project planning, and enhance team productivity.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.2+-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-00C7B7.svg)

## 🚀 Features

### Core Functionality
- **📊 Project Planning**: Automatic plan generation based on git history with task and milestone suggestions
- **📈 Analytics & Insights**: Recent changes, trends, code metrics, and performance analysis
- **✅ Production Readiness**: Assess stability, highlight issues, and track testing coverage

### AI-Powered Features
- **🤖 Intelligent Analysis**: LLM-based analysis of commit messages using Gemini API
- **💡 Automated Suggestions**: AI-driven improvement recommendations
- **🔮 Predictive Analytics**: Bug prediction and risk assessment

### Team Collaboration
- **👥 Team Analytics**: Developer productivity metrics and collaboration patterns
- **📊 Code Health Metrics**: Track code complexity trends and security issues
- **🔄 Real-time Updates**: WebSocket-based live data synchronization

### Integrations
- **🔗 GitHub OAuth**: Secure repository access
- **🪝 Webhooks**: GitHub/GitLab/Bitbucket integration
- **📱 Notifications**: Slack/Discord alerts
- **📋 Task Tracking**: Jira integration support

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and task queue
- **Celery** - Background job processing
- **GitPython** - Repository analysis
- **Google Gemini API** - AI-powered insights

### Frontend
- **React 18** - UI framework
- **Bun** - JavaScript runtime
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Zustand** - State management

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+ or Bun 1.0+
- PostgreSQL 14+
- Redis 7+
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/arnesssr/RepoScope.git
cd RepoScope
```

### 2. Option A: Using PowerShell Scripts (Windows - Recommended)

Open two separate PowerShell windows:

**Window 1 - Backend:**
```powershell
cd C:\Users\user\RepoScope
.\start-backend.ps1
```

**Window 2 - Frontend:**
```powershell
cd C:\Users\user\RepoScope
.\start-frontend.ps1
```

These scripts will automatically:
- Set up virtual environments
- Install all dependencies
- Create .env files from templates
- Start both servers

### 2. Option B: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Required: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GEMINI_API_KEY

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies (using Bun)
bun install

# Or using npm
npm install

# Copy environment variables
cp .env.example .env

# Start development server
bun run dev
# Or
npm run dev
```

### 3. Option C: Using Docker Compose

```bash
docker-compose up
```

### 4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/auth/callback`
4. Copy Client ID and Client Secret to your `.env` file

### Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to your backend `.env` file

## 🏗️ Project Structure

```
RepoScope/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── tests/            # Backend tests
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── stores/       # Zustand stores
│   │   └── utils/        # Utilities
│   ├── tests/            # Frontend tests
│   └── package.json      # Node dependencies
├── docs/                 # Documentation
└── .github/              # GitHub Actions workflows
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app  # With coverage
```

### Frontend Tests
```bash
cd frontend
bun test
bun test:coverage  # With coverage
```

## 🚢 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Import project to Vercel
2. Configure build settings
3. Set environment variables
4. Deploy

## 📝 API Documentation

The API documentation is automatically generated and available at:
- Local: http://localhost:8000/docs
- Production: https://your-api-url.com/docs

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- The FastAPI and React communities
- All contributors and supporters

## 📞 Support

- Create an [issue](https://github.com/arnesssr/RepoScope/issues)
-