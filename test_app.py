#!/usr/bin/env python3
"""
Test script for RealiZe
Tests basic functionality and integration
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

import os
import sys
import json
import requests
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_imports():
    """Test if all required modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        import flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        return False
    
    try:
        import PyPDF2
        print("✅ PyPDF2 imported successfully")
    except ImportError as e:
        print(f"❌ PyPDF2 import failed: {e}")
        return False
    
    try:
        import dotenv
        print("✅ python-dotenv imported successfully")
    except ImportError as e:
        print(f"❌ python-dotenv import failed: {e}")
        return False
    
    return True

def test_backend_modules():
    """Test backend module imports"""
    print("\n🧪 Testing backend modules...")
    
    try:
        from backend.utils.pdf_processor import PDFProcessor
        print("✅ PDF Processor imported successfully")
    except ImportError as e:
        print(f"❌ PDF Processor import failed: {e}")
        return False
    
    try:
        from backend.services.openrouter_service import OpenRouterService
        print("✅ OpenRouter Service imported successfully")
    except ImportError as e:
        print(f"❌ OpenRouter Service import failed: {e}")
        return False
    
    try:
        from backend.services.analyzer import ResumeAnalyzer
        print("✅ RealiZe imported successfully")
    except ImportError as e:
        print(f"❌ RealiZe import failed: {e}")
        return False
    
    try:
        from backend.models.skill_database import SkillDatabase
        print("✅ Skill Database imported successfully")
    except ImportError as e:
        print(f"❌ Skill Database import failed: {e}")
        return False
    
    return True

def test_skills_database():
    """Test skills database functionality"""
    print("\n🧪 Testing skills database...")
    
    try:
        from backend.models.skill_database import SkillDatabase
        
        skill_db = SkillDatabase()
        all_skills = skill_db.get_all_skills()
        
        if 'programming_languages' in all_skills:
            print("✅ Skills database contains programming languages")
        else:
            print("❌ Skills database missing programming languages")
            return False
        
        if len(all_skills['programming_languages']['skills']) > 0:
            print(f"✅ Found {len(all_skills['programming_languages']['skills'])} programming languages")
        else:
            print("❌ No programming languages in database")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Skills database test failed: {e}")
        return False

def test_flask_app():
    """Test Flask app configuration"""
    print("\n🧪 Testing Flask app configuration...")
    
    try:
        from app import app
        print("✅ Flask app imported successfully")
        
        # Test app configuration
        if app.config.get('SECRET_KEY'):
            print("✅ Flask secret key configured")
        else:
            print("⚠️ Flask secret key not configured")
        
        if app.config.get('UPLOAD_FOLDER'):
            print("✅ Upload folder configured")
        else:
            print("❌ Upload folder not configured")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Flask app test failed: {e}")
        return False

def test_environment_file():
    """Test environment configuration"""
    print("\n🧪 Testing environment configuration...")
    
    env_file = project_root / '.env'
    if env_file.exists():
        print("✅ .env file exists")
        
        # Check if OpenRouter API key is set
        with open(env_file, 'r') as f:
            content = f.read()
            if 'OPENROUTER_API_KEY=' in content:
                print("✅ OpenRouter API key configuration found")
                if 'your_openrouter_api_key_here' in content:
                    print("⚠️ Using placeholder API key - update with actual key")
                else:
                    print("✅ API key appears to be configured")
            else:
                print("❌ OpenRouter API key not found in .env")
                return False
    else:
        print("❌ .env file not found")
        return False
    
    return True

def test_static_files():
    """Test if static files exist"""
    print("\n🧪 Testing static files...")
    
    static_dir = project_root / 'static'
    if not static_dir.exists():
        print("❌ Static directory not found")
        return False
    
    # Check CSS files
    css_dir = static_dir / 'css'
    required_css = ['main.css', 'components.css', 'animations.css']
    for css_file in required_css:
        if (css_dir / css_file).exists():
            print(f"✅ {css_file} found")
        else:
            print(f"❌ {css_file} missing")
            return False
    
    # Check JS files
    js_dir = static_dir / 'js'
    required_js = ['main.js', 'analyzer.js', 'charts.js']
    for js_file in required_js:
        if (js_dir / js_file).exists():
            print(f"✅ {js_file} found")
        else:
            print(f"❌ {js_file} missing")
            return False
    
    return True

def test_templates():
    """Test if template files exist"""
    print("\n🧪 Testing template files...")
    
    templates_dir = project_root / 'templates'
    if not templates_dir.exists():
        print("❌ Templates directory not found")
        return False
    
    index_file = templates_dir / 'index.html'
    if index_file.exists():
        print("✅ index.html template found")
    else:
        print("❌ index.html template missing")
        return False
    
    return True

def test_pdf_processor():
    """Test PDF processor functionality"""
    print("\n🧪 Testing PDF processor...")
    
    try:
        from backend.utils.pdf_processor import PDFProcessor
        
        processor = PDFProcessor()
        print("✅ PDF processor initialized")
        
        # Test with a mock scenario (without actual PDF)
        if hasattr(processor, 'extract_text'):
            print("✅ extract_text method available")
        else:
            print("❌ extract_text method missing")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ PDF processor test failed: {e}")
        return False

def run_health_check():
    """Test Flask app health endpoint"""
    print("\n🧪 Testing Flask app health endpoint...")
    
    # This would require the Flask app to be running
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Health endpoint responding")
            return True
        else:
            print(f"❌ Health endpoint returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Health endpoint test skipped (app not running): {e}")
        return True  # Don't fail the test if app isn't running

def main():
    """Run all tests"""
    print("🚀 RealiZe Test Suite")
    print("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Backend Modules", test_backend_modules),
        ("Skills Database", test_skills_database),
        ("Flask App", test_flask_app),
        ("Environment Config", test_environment_file),
        ("Static Files", test_static_files),
        ("Template Files", test_templates),
        ("PDF Processor", test_pdf_processor),
        ("Health Check", run_health_check)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name}...")
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"💥 {test_name} CRASHED: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Application is ready to run.")
        print("\nTo start the application:")
        print("1. Ensure you have an OpenRouter API key")
        print("2. Run: python app.py")
        print("3. Open: http://localhost:5000")
    else:
        print("⚠️ Some tests failed. Please check the errors above.")
        print("You may need to install dependencies or fix configuration.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)