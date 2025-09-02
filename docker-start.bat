@echo off
REM =================================
REM LLM Knowledge Extractor - Docker Startup Script
REM =================================

echo 🚀 Starting LLM Knowledge Extractor with Docker
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy environment.example .env >nul
    echo ⚠️  Please edit .env file and add your OpenAI API key if you want to use real LLM
)

REM Stop any existing containers
echo 🛑 Stopping any existing containers...
docker-compose down

REM Build and start services
echo 🏗️  Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

REM Show logs
echo 📋 Showing recent logs...
docker-compose logs --tail=10

echo.
echo 🎉 LLM Knowledge Extractor is starting up!
echo ================================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 📊 Database: postgresql://postgres:password@localhost:5432/jouster_db
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo 🔄 To restart: docker-compose restart
pause
