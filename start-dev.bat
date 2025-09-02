@echo off
echo 🚀 Starting LLM Knowledge Extractor Development Environment

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create environment files if they don't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env >nul
)

if not exist backend\.env (
    echo 📝 Creating backend\.env file...
    copy backend\env.example backend\.env >nul
)

echo 🐳 Starting services with Docker Compose...
docker-compose up --build

echo ✅ Development environment started!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
pause
