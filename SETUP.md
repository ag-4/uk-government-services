# UK Government Services - Complete Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher): [Download from nodejs.org](https://nodejs.org/)
- **pnpm** (Package Manager): Install globally with `npm install -g pnpm`
- **Git**: [Download from git-scm.com](https://git-scm.com/)

### Optional but Recommended
- **Visual Studio Code**: [Download from code.visualstudio.com](https://code.visualstudio.com/)
- **Postman** or **Insomnia**: For API testing

## Installation Guide

### 1. Clone and Setup Frontend

```bash
# Navigate to the project directory
cd uk-gov-services

# Install frontend dependencies
pnpm install

# Copy environment file
copy .env.local.example .env.local
# Edit .env.local with your API keys
```

### 2. Setup Backend Server

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
pnpm install

# Copy environment file
copy .env.example .env
# Edit .env with your configuration

# Build the backend
pnpm run build

# Start the development server
pnpm run dev
```

### 3. Environment Configuration

#### Frontend (.env.local)
```properties
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3001/api
VITE_PARLIAMENT_API_BASE=https://members-api.parliament.uk/api
```

#### Backend (.env)
```properties
PORT=3001
NODE_ENV=development
PARLIAMENT_API_KEY=your_parliament_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/uk_gov_services
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=12
PARLIAMENT_API_BASE=https://members-api.parliament.uk/api
NEWS_API_KEY=your_news_api_key_here
```

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd backend
pnpm run dev
```

#### Terminal 2 - Frontend Development Server
```bash
pnpm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

### Production Build

```bash
# Build frontend
pnpm run build

# Build backend
cd backend
pnpm run build

# Start production server
pnpm start
```

## Key Features Implemented

### ✅ Enhanced Infrastructure
1. **Windows-compatible build scripts**
2. **Secure environment variable handling**
3. **Comprehensive MP database with postal codes**
4. **Error boundaries for robust error handling**
5. **Backend API with Express.js**
6. **API service layer with fallback support**

### 🔧 Technical Improvements
- **TypeScript** throughout the codebase
- **Rate limiting** and security middleware
- **Caching** for improved performance
- **Offline support** with fallback data
- **Professional error handling**
- **API validation** and proper HTTP status codes

## API Endpoints

### MP Endpoints
- `GET /api/mps` - Get all MPs
- `GET /api/mps/search?q=query` - Search MPs
- `GET /api/mps/:id` - Get specific MP

### News Endpoints
- `GET /api/news` - Get latest political news

### Parliament Endpoints
- `GET /api/parliament/bills` - Get current bills

### System Endpoints
- `GET /health` - Health check

## Troubleshooting

### Common Issues

#### 1. Build Errors on Windows
```bash
# If you see Unix command errors, use:
pnpm run build
# Instead of the Unix version
```

#### 2. API Connection Issues
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check environment variables
echo $VITE_API_BASE_URL
```

---

For more detailed documentation, see the individual README files in each directory.
