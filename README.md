# LLM Knowledge Extractor

A full-stack application that uses Large Language Models to extract structured insights from unstructured text. Built with Next.js, FastAPI, PostgreSQL, and containerized with Docker.

## Quick Setup & Run

### Prerequisites
- Docker and Docker Compose
- Optional: Node.js 18+ and Python 3.11+ for local development

### 🚀 Start the Application

**Option 1: One-Click Start (Recommended)**
```bash
# Windows
docker-start.bat

# Unix/Mac/Linux
chmod +x docker-start.sh
./docker-start.sh
```

**Option 2: Manual Docker Setup**
```bash
# 1. Create environment file (optional - works with defaults)
cp env.example .env

# 2. Add your OpenAI API key to .env (optional - uses mock by default)
# OPENAI_API_KEY="your_key_here"

# 3. Start all services
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

### 🧪 Test the Application
1. Open http://localhost:3000
2. Paste any text in the input area
3. Click "Analyze Text" to see AI-extracted insights
4. Use the "Search Results" tab to filter previous analyses

## Design Choices & Architecture

I structured this application using **Clean Architecture** principles to ensure scalability and maintainability. The backend follows a layered approach with Controllers (HTTP), Services (Business Logic), Repositories (Data Access), and Domain Models, making it easy to test, modify, and extend. I chose **Next.js with App Router** for the frontend because it provides excellent developer experience with built-in API routes, and **FastAPI** for the backend due to its automatic API documentation, type safety, and high performance. **PostgreSQL** was selected for robust relational data storage with advanced features like array fields for topics/keywords, while **Docker Compose** ensures consistent environments across development and production.

## Trade-offs Made Due to Time Constraints

Due to time limitations, I made several pragmatic trade-offs: implemented a **simplified in-memory fallback** for database operations instead of a full repository pattern with interfaces, used **basic client-side filtering** for multiple topic searches rather than optimizing the database queries, and created **comprehensive but not exhaustive** test coverage focusing on core business logic rather than edge cases. I also chose to use **Shadcn/ui components** directly rather than building a custom design system, and implemented **basic error handling** with user-friendly messages rather than a sophisticated error management system with retry logic and detailed logging.

## Features

- **Text Analysis**: Extract summaries, topics, sentiment, and keywords from any text
- **Structured Data**: Get consistent JSON output with title, topics, sentiment, and keywords  
- **Search & Filter**: Find previous analyses by keyword, sentiment, or topic with partial matching
- **Multi-Select Topics**: Advanced topic filtering with searchable dropdown
- **Modern UI**: Responsive design built with Tailwind CSS and Shadcn/ui components
- **LLM Integration**: Supports OpenAI API or mock responses for development
- **Database Storage**: PostgreSQL with optimized queries and indexing
- **Containerized**: Full Docker setup with health checks and monitoring

## Tech Stack

### Frontend
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling with **Shadcn/ui** components
- **Responsive Design** optimized for all devices
- **Real-time Search** with debounced filtering

### Backend (Clean Architecture)
- **FastAPI** with automatic OpenAPI documentation
- **Python 3.11** with full async/await support
- **Layered Architecture**: Controllers → Services → Repositories → Models
- **Type Safety**: Pydantic models throughout
- **OpenAI API** integration with intelligent fallbacks

### Database & DevOps
- **PostgreSQL 17** with advanced indexing and array fields
- **Docker Compose** with health checks and networking
- **Environment-based** configuration management
- **Async Database** connections with connection pooling
