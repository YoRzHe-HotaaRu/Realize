"""
RealiZe - Powerful & Quick Resume Analyzer using NLP and LLM
A Flask-based web application for analyzing IT resumes using NLP techniques
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import tempfile
import logging
from datetime import datetime
from dotenv import load_dotenv

# Import custom modules
from backend.utils.pdf_processor import PDFProcessor
from backend.services.openrouter_service import OpenRouterService
from backend.services.analyzer import ResumeAnalyzer
from backend.models.skill_database import SkillDatabase

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure app
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize services
pdf_processor = PDFProcessor()
openrouter_service = OpenRouterService()
resume_analyzer = ResumeAnalyzer()
skill_database = SkillDatabase()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Serve the main application page"""
    return render_template('index.html')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    """
    Main endpoint to analyze resume
    Expects: multipart/form-data with 'resume' file
    """
    try:
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file type
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Save file temporarily
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)
        
        try:
            # Extract text from PDF
            logger.info(f"Processing resume: {file.filename}")
            text_content = pdf_processor.extract_text(file_path)
            
            if not text_content or len(text_content.strip()) < 50:
                return jsonify({
                    'error': 'Unable to extract sufficient text from PDF. Please ensure the resume contains readable text.'
                }), 400
            
            # Analyze resume using NLP
            analysis_result = resume_analyzer.analyze(text_content)
            
            # Clean up temporary file
            os.remove(file_path)
            os.rmdir(temp_dir)
            
            return jsonify({
                'success': True,
                'analysis': analysis_result,
                'filename': file.filename
            })
            
        except Exception as e:
            # Clean up on error
            if os.path.exists(file_path):
                os.remove(file_path)
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir)
            raise e
            
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/compare-job', methods=['POST'])
def compare_with_job():
    """
    Compare resume with job description
    Expects: JSON with 'resume_text' and 'job_description'
    """
    try:
        data = request.get_json()
        
        if not data or 'resume_text' not in data or 'job_description' not in data:
            return jsonify({'error': 'Missing required fields: resume_text, job_description'}), 400
        
        resume_text = data['resume_text']
        job_description = data['job_description']
        
        if not resume_text.strip() or not job_description.strip():
            return jsonify({'error': 'Resume text and job description cannot be empty'}), 400
        
        # Perform comparison analysis
        comparison_result = resume_analyzer.compare_with_job(resume_text, job_description)
        
        return jsonify({
            'success': True,
            'comparison': comparison_result
        })
        
    except Exception as e:
        logger.error(f"Error comparing with job: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/career-suggestions', methods=['POST'])
def get_career_suggestions():
    """
    Get career path suggestions based on resume analysis
    Expects: JSON with 'resume_text' and 'skills_analysis'
    """
    try:
        data = request.get_json()
        
        if not data or 'resume_text' not in data:
            return jsonify({'error': 'Missing required field: resume_text'}), 400
        
        resume_text = data['resume_text']
        skills_analysis = data.get('skills_analysis', {})
        
        # Get career suggestions
        suggestions = resume_analyzer.generate_career_suggestions(resume_text, skills_analysis)
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
        
    except Exception as e:
        logger.error(f"Error generating career suggestions: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/skills-database')
def get_skills_database():
    """Get the skills database for frontend display"""
    try:
        skills_data = skill_database.get_all_skills()
        return jsonify({
            'success': True,
            'skills': skills_data
        })
    except Exception as e:
        logger.error(f"Error retrieving skills database: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check if OpenRouter API key is available
    if not os.environ.get('OPENROUTER_API_KEY'):
        logger.warning("OPENROUTER_API_KEY not found in environment variables")
        logger.warning("Set OPENROUTER_API_KEY in your .env file for full functionality")
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)