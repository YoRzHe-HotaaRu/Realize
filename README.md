# RealiZe - Powerful & Quick Resume Analyzer using NLP and LLM

## 🚀 Project Overview

A powerful and quick resume analyzer using NLP and LLM technology, built with Flask backend and beautiful HTML/CSS/JS frontend. This application uses advanced NLP techniques and OpenRouter AI to provide detailed analysis of IT resumes including skills detection, experience assessment, career guidance, and job matching capabilities.

## ✨ Key Features

### 🎯 Core Analysis Features
- **PDF Resume Processing** - Extract and analyze text from PDF resumes
- **Skills Detection** - Identify programming languages, frameworks, databases, tools, and certifications
- **Experience Assessment** - Determine experience levels and career progression
- **Comprehensive Scoring** - Technical skills, experience, completeness, and overall scores

### 🤖 AI-Powered Analysis
- **OpenRouter Integration** - Uses minimax/minimax-m2:free model for advanced NLP
- **Smart Skill Categorization** - Automatically classifies skills by type and proficiency
- **Career Path Suggestions** - Personalized recommendations based on skills and experience
- **Job Description Comparison** - Match resume skills with specific job requirements

### 📊 Professional UI/UX
- **Light Theme Design** - Clean, professional interface with beautiful animations
- **Interactive Charts** - Visual representation of skills and experience data
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Real-time Feedback** - Loading states, progress indicators, and smooth transitions

### 💡 Advanced Features
- **Learning Recommendations** - Specific suggestions for skill development
- **Market Analysis** - Compare skills with current market demand
- **Career Roadmap** - Visual career progression paths
- **Export Functionality** - Download analysis results as JSON

## 🏗️ Technology Stack

### Backend
- **Flask** - Web framework for API endpoints
- **PyPDF2** - PDF text extraction
- **OpenRouter API** - AI-powered resume analysis
- **Python-dotenv** - Environment variable management

### Frontend
- **HTML5/CSS3** - Modern responsive design
- **JavaScript (ES6+)** - Interactive functionality
- **Chart.js** - Data visualization and charts
- **Font Awesome** - Professional iconography
- **Inter Font** - Modern typography

### AI & NLP
- **OpenRouter API** - minimax/minimax-m2:free model
- **Natural Language Processing** - Text analysis and skill extraction
- **Pattern Matching** - Intelligent keyword detection

## 📁 Project Structure

```
Resume_Analyzer/
├── app.py                     # Main Flask application
├── requirements.txt           # Python dependencies
├── .env                      # Environment variables
├── backend/                  # Backend modules
│   ├── __init__.py
│   ├── utils/               # Utility functions
│   │   ├── __init__.py
│   │   └── pdf_processor.py # PDF text extraction
│   ├── services/            # Core services
│   │   ├── __init__.py
│   │   ├── openrouter_service.py  # OpenRouter API integration
│   │   └── analyzer.py      # Main analysis engine
│   └── models/              # Data models
│       ├── __init__.py
│       └── skill_database.py # Comprehensive skills database
├── templates/               # HTML templates
│   └── index.html          # Main application page
└── static/                 # Static assets
    ├── css/               # Stylesheets
    │   ├── main.css       # Main styles
    │   ├── components.css # Component styles
    │   └── animations.css # Animation effects
    └── js/               # JavaScript modules
        ├── main.js        # Core functionality
        ├── analyzer.js    # Analysis features
        └── charts.js      # Data visualization
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone or extract the project**
   ```bash
   cd resume_analyzer
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   - Edit the `.env` file
   - Add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   SECRET_KEY=your_flask_secret_key_here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   - Open your browser and go to: `http://localhost:5000`
   - Upload a PDF resume and start analyzing!

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Flask Configuration
SECRET_KEY=your_flask_secret_key_here
FLASK_ENV=development

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads

# Logging Configuration
LOG_LEVEL=INFO
```

### Getting OpenRouter API Key
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## 📋 Usage Guide

### Basic Resume Analysis
1. **Upload Resume** - Click "Choose File" or drag & drop your PDF resume
2. **Optional Job Comparison** - Paste a job description for skill matching
3. **Analyze** - Click "Analyze Resume" to start the AI analysis
4. **View Results** - Explore comprehensive analysis with charts and insights
5. **Export** - Download your analysis results as JSON

### Job Comparison Feature
- Paste any job description alongside your resume
- Get detailed matching scores and missing skills
- Receive specific recommendations for improvement
- Priority gap analysis with actionable steps

### Career Suggestions
- Click "Get Career Suggestions" for personalized paths
- View recommended career progressions
- Follow learning roadmaps for skill development
- Access market insights and salary expectations

## 🎨 UI Components

### Main Sections
- **Hero Section** - Overview and statistics
- **Analysis Section** - File upload and processing
- **Features Section** - Application capabilities
- **About Section** - Technical information

### Interactive Elements
- **Drag & Drop Upload** - Intuitive file selection
- **Loading States** - Visual feedback during processing
- **Animated Results** - Smooth reveal animations
- **Interactive Charts** - Hover effects and tooltips

### Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Easy interaction on tablets/phones
- **Progressive Enhancement** - Works without JavaScript

## 📊 Analysis Output

### Skills Analysis
- **Programming Languages** - With proficiency levels
- **Frameworks & Libraries** - Technology stack overview
- **Databases** - Database experience and knowledge
- **Cloud Platforms** - Cloud technology proficiency
- **Development Tools** - Tooling and workflow expertise
- **Certifications** - Professional credentials
- **Soft Skills** - Interpersonal and professional skills

### Experience Assessment
- **Years of Experience** - Estimated from resume content
- **Experience Level** - Junior, Mid-Level, or Senior
- **Leadership Indicators** - Management and mentoring experience
- **Technical Depth** - Advanced technical competencies

### Scoring System
- **Overall Score** (0-100) - Comprehensive assessment
- **Technical Skills Score** - Programming and tool proficiency
- **Experience Score** - Years and level assessment
- **Completeness Score** - Resume quality and detail level

### Job Comparison
- **Match Score** (0-100) - Overall job fit percentage
- **Strong Matches** - Skills that align with requirements
- **Missing Skills** - Gaps to address for better fit
- **Recommendations** - Specific improvement suggestions
- **Priority Gaps** - Most important skills to develop

## 🔍 API Endpoints

### Core Endpoints
- `GET /` - Serve main application
- `GET /health` - Health check
- `POST /api/analyze-resume` - Main analysis endpoint
- `POST /api/compare-job` - Job comparison analysis
- `POST /api/career-suggestions` - Career path recommendations
- `GET /api/skills-database` - Retrieve skills database

### Request/Response Examples

**Analyze Resume**
```bash
POST /api/analyze-resume
Content-Type: multipart/form-data

resume: [PDF file]
```

**Job Comparison**
```bash
POST /api/compare-job
Content-Type: application/json

{
  "resume_text": "Resume text content",
  "job_description": "Job requirements text"
}
```

**Career Suggestions**
```bash
POST /api/career-suggestions
Content-Type: application/json

{
  "resume_text": "Resume text",
  "skills_analysis": {...}
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] File upload with PDF resumes
- [ ] Text extraction and processing
- [ ] Skills detection and categorization
- [ ] Experience level assessment
- [ ] Job comparison functionality
- [ ] Career suggestions generation
- [ ] Chart rendering and interactivity
- [ ] Responsive design on different devices
- [ ] Error handling and user feedback
- [ ] Performance with large files

### Test Files
Create test PDF resumes with various:
- Programming languages
- Experience levels
- Skill combinations
- Professional formatting

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
For production deployment, consider:
- **Gunicorn** - WSGI server for Flask
- **Nginx** - Reverse proxy and static file serving
- **Docker** - Containerized deployment
- **Cloud Platforms** - AWS, Heroku, Railway, etc.

### Security Considerations
- Secure API key management
- File upload validation and limits
- Input sanitization
- Rate limiting
- HTTPS in production

## 🛠️ Troubleshooting

### Common Issues

**OpenRouter API Key Not Working**
- Verify the key is correct in `.env`
- Check API key permissions and limits
- Ensure internet connectivity

**PDF Processing Errors**
- Ensure PDF contains readable text (not scanned images)
- Check file size (max 16MB)
- Verify PDF is not password protected

**Chart Not Displaying**
- Check browser console for JavaScript errors
- Ensure Chart.js library is loading
- Verify analysis data structure

**Slow Performance**
- Optimize large PDF files
- Check OpenRouter API response times
- Monitor server resources

### Error Messages
- **"No file uploaded"** - Please select a PDF file
- **"Only PDF files are supported"** - Convert file to PDF
- **"File too large"** - Reduce file size under 16MB
- **"Unable to extract sufficient text"** - Ensure PDF has readable content

## 📈 Performance Optimization

### Frontend
- **Lazy Loading** - Load charts and visualizations on demand
- **Image Optimization** - Compressed icons and graphics
- **CSS/JS Minification** - Reduced file sizes
- **Browser Caching** - Static asset caching

### Backend
- **Async Processing** - Non-blocking file processing
- **Caching** - Store analysis results
- **Rate Limiting** - Prevent API abuse
- **Connection Pooling** - Efficient database connections

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a virtual environment
3. Install dependencies: `pip install -r requirements.txt`
4. Set up environment variables
5. Run tests and make changes
6. Submit pull request

### Code Style
- **Python**: PEP 8 compliance
- **JavaScript**: ES6+ with consistent formatting
- **CSS**: BEM methodology for class naming
- **Documentation**: Comprehensive inline comments

## 📄 License

This project is created for educational and professional use. Please ensure compliance with OpenRouter API terms of service.

## 🆘 Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review the code documentation
3. Test with sample data
4. Create detailed bug reports

## 🎯 Future Enhancements

### Potential Features
- **Multi-language Support** - International resume support
- **Industry Specialization** - Domain-specific analysis
- **Integration APIs** - Connect with job boards and ATS
- **Advanced Analytics** - Trend analysis and predictions
- **Team Analysis** - Compare multiple candidates
- **Custom Scoring** - Personalized evaluation criteria

### Technical Improvements
- **Database Integration** - Persistent data storage
- **Authentication** - User accounts and history
- **Advanced ML** - Custom-trained models
- **Real-time Processing** - WebSocket updates
- **Mobile App** - Native mobile applications

---

**Built with ❤️ for IT professionals seeking career advancement**

**Made by Amir Hafizi Bin Musa**
*UiTM Science Computer Student*

*RealiZe v1.0.0 - Powerful & Quick Resume Analyzer using NLP and LLM*