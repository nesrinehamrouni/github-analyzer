# GitHub Portfolio Analyzer

A comprehensive web application that analyzes GitHub profiles and repositories to provide AI-powered insights, visualizations, and professional portfolio summaries for recruiters.

## 🚀 What This Website Is Useful For


- **Portfolio Analysis**: Get detailed insights about GitHub activities, coding patterns, and project contributions
- **AI-Powered Insights**: Receive intelligent analysis of technical strengths, growth opportunities, and community impact
- **Visual Analytics**: View repository statistics, language distribution, and activity patterns through interactive charts
- **Professional Summary**: Generate clean, professional PDF summaries
- **Repository Insights**: Get AI-generated summaries for individual repositories explaining their purpose and value


## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization library

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **GitHub REST API** - Fetching user and repository data
- **Google Gemini AI** - AI-powered analysis and insights
- **Node.js** - JavaScript runtime

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Class Variance Authority** - Component variant management
- **Zod** - Schema validation

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local
   ```
   Add your Google API key:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 How It Works

1. **Enter GitHub Username**: Simply input any GitHub username
2. **Data Fetching**: The app fetches public repository data and user information
3. **Analysis**: AI processes the data to generate insights and recommendations
4. **Visualization**: Data is presented through interactive charts and metrics
5. **Export**: Generate professional PDF summaries for sharing

## 🔧 API Endpoints

- `/api/github/user` - Fetch GitHub user data
- `/api/github/repos` - Fetch repository information
- `/api/github/contributions` - Get contribution data
- `/api/ai/analyze` - Generate AI portfolio analysis
- `/api/ai/repository-summary` - AI repository summaries
- `/api/ai/recruiter-analysis` - Recruiter-focused insights

## 🔒 Privacy & Security

- Only public GitHub data is accessed
- No personal access tokens required
- No data is stored permanently
- All analysis happens in real-time
- Secure API communication
