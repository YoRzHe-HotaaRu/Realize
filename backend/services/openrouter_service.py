"""
OpenRouter API service for RealiZe
Integrates with minimax/minimax-m2:free model for NLP analysis
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

import os
import json
import requests
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class OpenRouterService:
    """Service for interacting with OpenRouter API"""
    
    def __init__(self):
        self.api_key = os.environ.get('OPENROUTER_API_KEY')
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = "minimax/minimax-m2:free"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://realize-app.com",
            "X-Title": "RealiZe"
        }
        
        if not self.api_key:
            logger.warning("OpenRouter API key not found. Some features will be limited.")
    
    def _make_request(self, messages: list, max_tokens: int = 1000) -> Optional[str]:
        """
        Make a request to OpenRouter API
        
        Args:
            messages: List of message dictionaries
            max_tokens: Maximum tokens for response
            
        Returns:
            Response text or None if request fails
        """
        try:
            data = {
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.3,
                "top_p": 0.9
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                return None
                
        except requests.RequestException as e:
            logger.error(f"Network error with OpenRouter API: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error with OpenRouter API: {str(e)}")
            return None
    
    def analyze_resume_skills(self, resume_text: str) -> Dict[str, Any]:
        """
        Analyze skills from resume text
        
        Args:
            resume_text: Text content of the resume
            
        Returns:
            Dictionary containing skill analysis
        """
        if not self.api_key:
            return self._fallback_skill_analysis(resume_text)
        
        messages = [
            {
                "role": "system",
                "content": """You are a professional IT skills analyst. Analyze the following resume text and extract:

1. Programming Languages (with proficiency levels)
2. Frameworks and Libraries
3. Databases
4. Cloud Platforms
5. Development Tools
6. Certifications
7. Soft Skills
8. Experience Level Assessment

Return your analysis as a JSON object with the following structure:
{
  "programming_languages": [{"name": "Python", "proficiency": "Advanced", "mentions": 3}],
  "frameworks": [{"name": "React", "proficiency": "Intermediate", "mentions": 2}],
  "databases": [{"name": "MySQL", "proficiency": "Advanced", "mentions": 1}],
  "cloud_platforms": [{"name": "AWS", "proficiency": "Intermediate", "mentions": 1}],
  "tools": [{"name": "Git", "proficiency": "Advanced", "mentions": 5}],
  "certifications": ["AWS Certified Developer", "Google Cloud Professional"],
  "soft_skills": ["Leadership", "Problem Solving", "Communication"],
  "experience_level": "Senior",
  "overall_score": 85
}"""
            },
            {
                "role": "user", 
                "content": f"Analyze this resume text:\n\n{resume_text}"
            }
        ]
        
        response = self._make_request(messages, max_tokens=1500)
        
        if response:
            try:
                # Try to extract JSON from response
                import re
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Could not parse JSON response", "raw_response": response}
            except json.JSONDecodeError:
                logger.error("Failed to parse JSON from OpenRouter response")
                return {"error": "Invalid JSON response from API", "raw_response": response}
        else:
            return {"error": "Failed to get response from OpenRouter API"}
    
    def compare_with_job(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Compare resume skills with job requirements
        
        Args:
            resume_text: Text from the resume
            job_description: Job description text
            
        Returns:
            Dictionary containing comparison analysis
        """
        if not self.api_key:
            return self._fallback_job_comparison(resume_text, job_description)
        
        messages = [
            {
                "role": "system",
                "content": """You are a professional recruitment analyst. Compare the following resume with a job description and provide:

1. Skills Match Score (0-100)
2. Missing Skills/Gaps
3. Strong Matches
4. Additional Recommendations
5. Overall Fit Assessment

Return as JSON:
{
  "match_score": 75,
  "strong_matches": ["Python", "React", "Problem Solving"],
  "missing_skills": ["Docker", "Kubernetes", "Microservices"],
  "recommendations": ["Consider learning Docker for containerization", "Add Kubernetes experience to improve cloud skills"],
  "overall_assessment": "Good fit with some skill gaps that can be addressed",
  "priority_gaps": ["Docker", "Kubernetes"]
}"""
            },
            {
                "role": "user",
                "content": f"""RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}"""
            }
        ]
        
        response = self._make_request(messages, max_tokens=1200)
        
        if response:
            try:
                import re
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Could not parse JSON response", "raw_response": response}
            except json.JSONDecodeError:
                return {"error": "Invalid JSON response from API", "raw_response": response}
        else:
            return {"error": "Failed to get response from OpenRouter API"}
    
    def generate_career_suggestions(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate career path suggestions based on resume analysis
        
        Args:
            resume_text: Text from the resume
            skills_analysis: Previously analyzed skills
            
        Returns:
            Dictionary containing career suggestions
        """
        if not self.api_key:
            return self._fallback_career_suggestions(resume_text, skills_analysis)
        
        messages = [
            {
                "role": "system",
                "content": """You are a career counselor specialized in IT careers. Based on the resume analysis, provide:

1. Career Path Recommendations (3-5 options)
2. Learning Roadmap for each path
3. Skills to Develop
4. Industry Trends to watch
5. Salary expectations range
6. Next steps action plan

Return as JSON:
{
  "career_paths": [
    {
      "title": "Senior Full Stack Developer",
      "match_percentage": 90,
      "description": "Leverage your Python and React skills",
      "learning_path": ["Advanced Python patterns", "System design", "Cloud architecture"]
    }
  ],
  "skills_to_develop": ["System Design", "Cloud Architecture", "DevOps"],
  "industry_trends": ["AI/ML Integration", "Serverless Computing", "Edge Computing"],
  "salary_range": {"min": 80000, "max": 120000},
  "action_plan": ["Complete a cloud certification", "Build a portfolio project", "Network with industry professionals"]
}"""
            },
            {
                "role": "user",
                "content": f"""RESUME:
{resume_text}

SKILLS ANALYSIS:
{json.dumps(skills_analysis, indent=2)}"""
            }
        ]
        
        response = self._make_request(messages, max_tokens=1500)
        
        if response:
            try:
                import re
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Could not parse JSON response", "raw_response": response}
            except json.JSONDecodeError:
                return {"error": "Invalid JSON response from API", "raw_response": response}
        else:
            return {"error": "Failed to get response from OpenRouter API"}
    
    def generate_ai_recommendations(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered recommendations based on resume analysis
        
        Args:
            resume_text: Text from the resume
            skills_analysis: Previously analyzed skills
            
        Returns:
            Dictionary containing AI recommendations
        """
        if not self.api_key:
            return self._fallback_ai_recommendations(resume_text, skills_analysis)
        
        messages = [
            {
                "role": "system",
                "content": """You are a professional career advisor specializing in IT. Based on the resume analysis provided, generate 3-5 specific, actionable recommendations for career improvement. Focus on:

1. Skill gaps to address
2. Experience areas to develop
3. Certifications to consider
4. Career advancement strategies
5. Industry trends to follow

Each recommendation should be:
- Specific and actionable
- Based on the actual resume content
- Tailored to IT industry standards
- Include a brief explanation of why it's important

Return as JSON:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed explanation and action steps",
      "priority": "High/Medium/Low",
      "category": "Skills/Certifications/Experience/Trends"
    }
  ]
}"""
            },
            {
                "role": "user",
                "content": f"""RESUME:
{resume_text}

SKILLS ANALYSIS:
{json.dumps(skills_analysis, indent=2)}"""
            }
        ]
        
        response = self._make_request(messages, max_tokens=1200)
        
        if response:
            try:
                import re
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Could not parse JSON response", "raw_response": response}
            except json.JSONDecodeError:
                return {"error": "Invalid JSON response from API", "raw_response": response}
        else:
            return {"error": "Failed to get response from OpenRouter API"}
    
    def generate_ai_resume_summary(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI summary of the complete resume
        
        Args:
            resume_text: Text from the resume
            skills_analysis: Previously analyzed skills
            
        Returns:
            Dictionary containing AI resume summary
        """
        if not self.api_key:
            return self._fallback_ai_summary(resume_text, skills_analysis)
        
        messages = [
            {
                "role": "system",
                "content": """You are a professional resume reviewer. Analyze the complete resume and provide a comprehensive summary including:

1. Overall assessment of the candidate
2. Key strengths and competitive advantages
3. Areas that need improvement
4. Career trajectory assessment
5. Market competitiveness analysis
6. Summary assessment (Brief overall evaluation)

Be honest, constructive, and specific. Focus on actionable insights.

Return as JSON:
{
  "overall_assessment": "Brief overall evaluation (1-2 sentences)",
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areas_for_improvement": ["Area 1", "Area 2"],
  "career_trajectory": "Assessment of career progression potential",
  "market_competitiveness": "How competitive the candidate is in current market",
  "summary": "Comprehensive 2-3 paragraph summary of the candidate"
}"""
            },
            {
                "role": "user",
                "content": f"""RESUME:
{resume_text}

SKILLS ANALYSIS:
{json.dumps(skills_analysis, indent=2)}"""
            }
        ]
        
        response = self._make_request(messages, max_tokens=1500)
        
        if response:
            try:
                import re
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Could not parse JSON response", "raw_response": response}
            except json.JSONDecodeError:
                return {"error": "Invalid JSON response from API", "raw_response": response}
        else:
            return {"error": "Failed to get response from OpenRouter API"}
    
    def _fallback_skill_analysis(self, resume_text: str) -> Dict[str, Any]:
        """Fallback skill analysis when API key is not available"""
        import re
        
        # Basic keyword matching for demonstration
        programming_languages = []
        frameworks = []
        skills_found = []
        
        # Common programming languages to check for
        prog_langs = ['Python', 'Java', 'JavaScript', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin']
        frameworks_list = ['React', 'Angular', 'Vue', 'Django', 'Flask', 'Spring', '.NET', 'Node.js', 'Express']
        tools = ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Jenkins']
        
        text_lower = resume_text.lower()
        
        for lang in prog_langs:
            if lang.lower() in text_lower:
                programming_languages.append({
                    "name": lang,
                    "proficiency": "Not specified",
                    "mentions": text_lower.count(lang.lower())
                })
        
        for fw in frameworks_list:
            if fw.lower() in text_lower:
                frameworks.append({
                    "name": fw,
                    "proficiency": "Not specified",
                    "mentions": text_lower.count(fw.lower())
                })
        
        for tool in tools:
            if tool.lower() in text_lower:
                skills_found.append({
                    "name": tool,
                    "proficiency": "Not specified",
                    "mentions": text_lower.count(tool.lower())
                })
        
        return {
            "programming_languages": programming_languages,
            "frameworks": frameworks,
            "databases": [],
            "cloud_platforms": [],
            "tools": skills_found,
            "certifications": [],
            "soft_skills": ["Analysis", "Problem Solving"],
            "experience_level": "Mid-Level",
            "overall_score": 60,
            "note": "Basic analysis - configure OpenRouter API for detailed analysis"
        }
    
    def _fallback_job_comparison(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Fallback job comparison when API key is not available"""
        return {
            "match_score": 50,
            "strong_matches": ["Basic technical skills found"],
            "missing_skills": ["Detailed analysis requires OpenRouter API"],
            "recommendations": ["Configure API key for detailed analysis"],
            "overall_assessment": "Basic comparison - API key required for full analysis",
            "priority_gaps": ["API Configuration needed"]
        }
    
    def _fallback_ai_recommendations(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback AI recommendations when API key is not available"""
        return {
            "recommendations": [
                {
                    "title": "Expand Technical Skill Set",
                    "description": "Consider learning additional modern frameworks and tools that are in high demand in the current market.",
                    "priority": "High",
                    "category": "Skills"
                },
                {
                    "title": "Obtain Relevant Certifications",
                    "description": "Professional certifications can significantly boost your marketability and validate your technical expertise.",
                    "priority": "Medium",
                    "category": "Certifications"
                },
                {
                    "title": "Build Portfolio Projects",
                    "description": "Create visible projects that demonstrate your skills and can be shared with potential employers.",
                    "priority": "High",
                    "category": "Experience"
                }
            ],
            "note": "Basic recommendations - configure OpenRouter API for personalized AI analysis"
        }
    
    def _fallback_ai_summary(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback AI summary when API key is not available"""
        return {
            "overall_assessment": "Candidate shows solid technical foundation with room for growth and specialization.",
            "key_strengths": ["Technical skills present", "Experience in development", "Problem-solving abilities"],
            "areas_for_improvement": ["Skill depth and specialization", "Modern frameworks", "Industry certifications"],
            "career_trajectory": "Good potential for advancement with focused skill development",
            "market_competitiveness": "Moderate competitiveness - needs targeted improvements",
            "summary": "This resume demonstrates a developing IT professional with foundational technical skills. While the candidate shows promise in programming and development areas, there are opportunities to deepen expertise in specific technologies and gain industry-recognized certifications. Focus on building a strong portfolio and staying current with industry trends will improve market competitiveness."
        }
    
    def _fallback_career_suggestions(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback career suggestions when API key is not available"""
        return {
            "career_paths": [
                {
                    "title": "IT Professional",
                    "match_percentage": 70,
                    "description": "Continue developing technical skills",
                    "learning_path": ["Advanced certifications", "Industry-specific training"]
                }
            ],
            "skills_to_develop": ["Technical Skills", "Communication", "Leadership"],
            "industry_trends": ["Cloud Computing", "AI/ML", "Cybersecurity"],
            "salary_range": {"min": 50000, "max": 100000},
            "action_plan": ["Update skills database", "Configure API for detailed analysis"],
            "note": "Basic suggestions - configure OpenRouter API for personalized recommendations"
        }