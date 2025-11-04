"""
Core resume analyzer service for RealiZe
Combines NLP processing with skill database matching
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

import logging
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

from backend.services.openrouter_service import OpenRouterService

logger = logging.getLogger(__name__)

class ResumeAnalyzer:
    """Main analyzer for resume content analysis"""
    
    def __init__(self):
        self.openrouter_service = OpenRouterService()
        self.skill_keywords = self._initialize_skill_keywords()
        
    def analyze(self, resume_text: str) -> Dict[str, Any]:
        """
        Perform comprehensive analysis of resume text
        
        Args:
            resume_text: Raw text content from resume
            
        Returns:
            Complete analysis results
        """
        try:
            logger.info("Starting comprehensive resume analysis")
            
            # Get detailed analysis from OpenRouter
            openrouter_analysis = self.openrouter_service.analyze_resume_skills(resume_text)
            
            # Get basic skill extraction
            basic_skills = self._extract_basic_skills(resume_text)
            
            # Analyze experience indicators
            experience_analysis = self._analyze_experience_indicators(resume_text)
            
            # Calculate overall scores
            scores = self._calculate_scores(openrouter_analysis, basic_skills, experience_analysis, resume_text)
            
            # Generate AI recommendations and summary
            ai_recommendations = self.openrouter_service.generate_ai_recommendations(resume_text, openrouter_analysis)
            ai_summary = self.openrouter_service.generate_ai_resume_summary(resume_text, openrouter_analysis)
            
            # Generate summary
            summary = self._generate_summary(resume_text, openrouter_analysis, basic_skills, experience_analysis)
            
            # Compile final result
            analysis_result = {
                'timestamp': datetime.now().isoformat(),
                'basic_info': {
                    'text_length': len(resume_text),
                    'word_count': len(resume_text.split()),
                    'sections_detected': self._detect_sections(resume_text)
                },
                'skills_analysis': openrouter_analysis,
                'basic_skills': basic_skills,
                'experience_analysis': experience_analysis,
                'scores': scores,
                'summary': summary,
                'ai_recommendations': ai_recommendations,
                'ai_summary': ai_summary,
                'recommendations': self._generate_recommendations(openrouter_analysis, basic_skills, experience_analysis)
            }
            
            logger.info("Resume analysis completed successfully")
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error in resume analysis: {str(e)}")
            return {
                'error': f'Analysis failed: {str(e)}',
                'timestamp': datetime.now().isoformat()
            }
    
    def compare_with_job(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Compare resume with job description
        
        Args:
            resume_text: Text from resume
            job_description: Job description text
            
        Returns:
            Comparison analysis results
        """
        try:
            logger.info("Starting job comparison analysis")
            
            comparison_result = self.openrouter_service.compare_with_job(resume_text, job_description)
            
            # Add additional analysis
            if 'error' not in comparison_result:
                job_skills = self._extract_basic_skills(job_description)
                resume_skills = self._extract_basic_skills(resume_text)
                
                # Calculate additional metrics
                additional_metrics = {
                    'keyword_density_match': self._calculate_keyword_density(resume_skills, job_skills),
                    'technical_depth_comparison': self._compare_technical_depth(resume_skills, job_skills),
                    'experience_alignment': self._assess_experience_alignment(resume_text, job_description)
                }
                
                comparison_result['additional_metrics'] = additional_metrics
            
            logger.info("Job comparison analysis completed")
            return comparison_result
            
        except Exception as e:
            logger.error(f"Error in job comparison: {str(e)}")
            return {
                'error': f'Comparison failed: {str(e)}',
                'timestamp': datetime.now().isoformat()
            }
    
    def generate_career_suggestions(self, resume_text: str, skills_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate career path suggestions
        
        Args:
            resume_text: Resume text
            skills_analysis: Previous skills analysis
            
        Returns:
            Career suggestions and recommendations
        """
        try:
            logger.info("Generating career suggestions")
            
            suggestions = self.openrouter_service.generate_career_suggestions(resume_text, skills_analysis)
            
            if 'error' not in suggestions:
                # Add market insights
                suggestions['market_insights'] = self._get_market_insights(skills_analysis)
                suggestions['learning_priorities'] = self._prioritize_learning_areas(skills_analysis)
            
            logger.info("Career suggestions generated")
            return suggestions
            
        except Exception as e:
            logger.error(f"Error generating career suggestions: {str(e)}")
            return {
                'error': f'Suggestion generation failed: {str(e)}',
                'timestamp': datetime.now().isoformat()
            }
    
    def _extract_basic_skills(self, text: str) -> Dict[str, List[Dict[str, Any]]]:
        """Extract basic skills using keyword matching"""
        text_lower = text.lower()
        skills = {
            'programming_languages': [],
            'frameworks': [],
            'databases': [],
            'cloud_platforms': [],
            'tools': [],
            'certifications': [],
            'soft_skills': []
        }
        
        # Programming languages
        for lang, patterns in self.skill_keywords['programming_languages'].items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    count = len(re.findall(pattern, text_lower))
                    skills['programming_languages'].append({
                        'name': lang,
                        'mentions': count,
                        'confidence': 'high' if count > 1 else 'medium'
                    })
                    break
        
        # Frameworks
        for framework, patterns in self.skill_keywords['frameworks'].items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    count = len(re.findall(pattern, text_lower))
                    skills['frameworks'].append({
                        'name': framework,
                        'mentions': count,
                        'confidence': 'high' if count > 1 else 'medium'
                    })
                    break
        
        # Continue for other skill categories...
        # (Similar logic for databases, cloud platforms, tools, etc.)
        
        return skills
    
    def _analyze_experience_indicators(self, text: str) -> Dict[str, Any]:
        """Analyze experience level indicators"""
        experience_indicators = {
            'years_pattern': None,
            'senior_level_terms': 0,
            'leadership_terms': 0,
            'management_terms': 0,
            'junior_level_terms': 0,
            'estimated_level': 'Unknown',
            'confidence': 'low'
        }
        
        text_lower = text.lower()
        
        # Years of experience patterns
        year_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
            r'(\d+)\+?\s*years?\s*(?:in|with)',
            r'over\s*(\d+)\s*years?',
            r'more\s*than\s*(\d+)\s*years?'
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                years = max([int(match) for match in matches])
                experience_indicators['years_pattern'] = years
                break
        
        # Senior level indicators
        senior_terms = ['senior', 'lead', 'principal', 'architect', 'expert', 'specialist']
        experience_indicators['senior_level_terms'] = sum(1 for term in senior_terms if term in text_lower)
        
        # Leadership indicators
        leadership_terms = ['lead', 'managed', 'managed team', 'supervised', 'mentored']
        experience_indicators['leadership_terms'] = sum(1 for term in leadership_terms if term in text_lower)
        
        # Management indicators
        management_terms = ['manager', 'director', 'head of', 'team lead']
        experience_indicators['management_terms'] = sum(1 for term in management_terms if term in text_lower)
        
        # Junior level indicators
        junior_terms = ['junior', 'entry', 'associate', 'intern', 'graduate']
        experience_indicators['junior_level_terms'] = sum(1 for term in junior_terms if term in text_lower)
        
        # Estimate experience level
        if experience_indicators['years_pattern']:
            years = experience_indicators['years_pattern']
            if years >= 8:
                experience_indicators['estimated_level'] = 'Senior'
                experience_indicators['confidence'] = 'high'
            elif years >= 4:
                experience_indicators['estimated_level'] = 'Mid-Level'
                experience_indicators['confidence'] = 'high'
            else:
                experience_indicators['estimated_level'] = 'Junior'
                experience_indicators['confidence'] = 'high'
        elif experience_indicators['senior_level_terms'] > 0:
            experience_indicators['estimated_level'] = 'Senior'
            experience_indicators['confidence'] = 'medium'
        elif experience_indicators['management_terms'] > 0:
            experience_indicators['estimated_level'] = 'Senior'
            experience_indicators['confidence'] = 'medium'
        elif experience_indicators['junior_level_terms'] > 0:
            experience_indicators['estimated_level'] = 'Junior'
            experience_indicators['confidence'] = 'medium'
        else:
            experience_indicators['estimated_level'] = 'Mid-Level'
            experience_indicators['confidence'] = 'low'
        
        return experience_indicators
    
    def _calculate_scores(self, openrouter_analysis: Dict, basic_skills: Dict, experience_analysis: Dict, resume_text: str = "") -> Dict[str, int]:
        """Calculate various scoring metrics"""
        scores = {
            'technical_skills_score': 0,
            'experience_score': 0,
            'completeness_score': 0,
            'overall_score': 0
        }
        
        # Technical skills score (0-100)
        total_skills = 0
        skill_categories = ['programming_languages', 'frameworks', 'databases', 'cloud_platforms', 'tools']
        
        for category in skill_categories:
            if category in basic_skills:
                total_skills += len(basic_skills[category])
        
        scores['technical_skills_score'] = min(100, total_skills * 10)  # 10 points per skill category
        
        # Experience score
        level = experience_analysis.get('estimated_level', 'Unknown')
        if level == 'Senior':
            scores['experience_score'] = 90
        elif level == 'Mid-Level':
            scores['experience_score'] = 70
        elif level == 'Junior':
            scores['experience_score'] = 50
        else:
            scores['experience_score'] = 30
        
        # Completeness score (based on resume length and structure)
        if resume_text:
            word_count = len(resume_text.split())
            if word_count >= 500:
                scores['completeness_score'] = 90
            elif word_count >= 300:
                scores['completeness_score'] = 70
            elif word_count >= 150:
                scores['completeness_score'] = 50
            else:
                scores['completeness_score'] = 30
        else:
            # Fallback: use sections detected as a proxy for completeness
            sections = self._detect_sections(resume_text if resume_text else "")
            section_count = len(sections)
            if section_count >= 8:
                scores['completeness_score'] = 90
            elif section_count >= 6:
                scores['completeness_score'] = 70
            elif section_count >= 4:
                scores['completeness_score'] = 50
            else:
                scores['completeness_score'] = 30
        
        # Overall score (weighted average)
        scores['overall_score'] = int(
            (scores['technical_skills_score'] * 0.4) +
            (scores['experience_score'] * 0.4) +
            (scores['completeness_score'] * 0.2)
        )
        
        return scores
    
    def _generate_summary(self, resume_text: str, openrouter_analysis: Dict, basic_skills: Dict, experience_analysis: Dict) -> Dict[str, str]:
        """Generate a summary of the analysis"""
        level = experience_analysis.get('estimated_level', 'Unknown')
        total_skills = sum(len(skills) for skills in basic_skills.values() if isinstance(skills, list))
        
        summary = {
            'overview': f"This resume shows {level.lower()} level experience with {total_skills} identified technical skills.",
            'strengths': "Strong technical foundation with relevant experience.",
            'areas_for_improvement': "Consider adding more specific project details and certifications.",
            'recommendation': "Good candidate for IT roles matching the identified skill set and experience level."
        }
        
        if 'error' not in openrouter_analysis:
            prog_langs = len(openrouter_analysis.get('programming_languages', []))
            frameworks = len(openrouter_analysis.get('frameworks', []))
            summary['overview'] = f"Experienced {level.lower()} IT professional with {prog_langs} programming languages and {frameworks} frameworks."
        
        return summary
    
    def _generate_recommendations(self, openrouter_analysis: Dict, basic_skills: Dict, experience_analysis: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Skill-based recommendations
        total_skills = sum(len(skills) for skills in basic_skills.values() if isinstance(skills, list))
        if total_skills < 10:
            recommendations.append("Consider expanding your technical skill set with additional tools and technologies.")
        
        # Experience-based recommendations
        level = experience_analysis.get('estimated_level', 'Unknown')
        if level == 'Junior':
            recommendations.append("Focus on building foundational skills and gaining practical project experience.")
        elif level == 'Senior':
            recommendations.append("Consider leadership roles and mentoring opportunities to leverage your experience.")
        
        # OpenRouter-based recommendations (if available)
        if 'error' not in openrouter_analysis:
            certifications = openrouter_analysis.get('certifications', [])
            if not certifications:
                recommendations.append("Consider obtaining relevant IT certifications to validate your skills.")
            
            soft_skills = openrouter_analysis.get('soft_skills', [])
            if not soft_skills:
                recommendations.append("Highlight soft skills like communication, leadership, and problem-solving abilities.")
        
        return recommendations
    
    def _initialize_skill_keywords(self) -> Dict[str, Dict[str, List[str]]]:
        """Initialize keyword patterns for skill detection"""
        return {
            'programming_languages': {
                'Python': [r'\bpython\b', r'\bpy\b'],
                'Java': [r'\bjava\b'],
                'JavaScript': [r'\bjavascript\b', r'\bjs\b', r'\becmascript\b'],
                'C#': [r'\bc#\b', r'\bcsharp\b', r'\b\.net\b'],
                'C++': [r'\bc\+\+\b', r'\bcpp\b'],
                'Go': [r'\bgolang\b', r'\bgo\b'],
                'Rust': [r'\brust\b'],
                'PHP': [r'\bphp\b'],
                'Ruby': [r'\bruby\b'],
                'Swift': [r'\bswift\b'],
                'Kotlin': [r'\bkotlin\b'],
                'TypeScript': [r'\btypescript\b', r'\bts\b'],
                'R': [r'\br\b'],
                'Scala': [r'\bscala\b'],
                'Dart': [r'\bdart\b']
            },
            'frameworks': {
                'React': [r'\breact\b', r'\breactjs\b'],
                'Angular': [r'\bangular\b', r'\bangularjs\b'],
                'Vue': [r'\bvue\b', r'\bvuesjs\b', r'\bnuxt\b'],
                'Django': [r'\bdjango\b'],
                'Flask': [r'\bflask\b'],
                'Spring': [r'\bspring\b', r'\bspringboot\b', r'\bspring boot\b'],
                'Express': [r'\bexpress\b',r'\bexpressjs\b'],
                'Node.js': [r'\bnode\.?js\b', r'\bnodejs\b', r'\bnode\b'],
                'ASP.NET': [r'\basp\.net\b', r'\baspnet\b'],
                'Laravel': [r'\blaravel\b'],
                'Ruby on Rails': [r'\bruby on rails\b', r'\brails\b']
            }
            # Add more categories as needed
        }
    
    def _detect_sections(self, text: str) -> List[str]:
        """Detect common resume sections"""
        sections = []
        text_lower = text.lower()
        
        common_sections = [
            'experience', 'work experience', 'employment history',
            'education', 'academic background', 'qualifications',
            'skills', 'technical skills', 'technical abilities',
            'certifications', 'certificates', 'licenses',
            'projects', 'personal projects', 'portfolio',
            'summary', 'profile', 'objective',
            'achievements', 'awards', 'recognition',
            'languages', 'interests', 'hobbies'
        ]
        
        for section in common_sections:
            if section in text_lower:
                sections.append(section.title())
        
        return sections
    
    def _calculate_keyword_density(self, resume_skills: Dict, job_skills: Dict) -> float:
        """Calculate keyword density match between resume and job"""
        resume_keywords = set()
        job_keywords = set()
        
        for category, skills in resume_skills.items():
            if isinstance(skills, list):
                for skill in skills:
                    if isinstance(skill, dict) and 'name' in skill:
                        resume_keywords.add(skill['name'].lower())
        
        for category, skills in job_skills.items():
            if isinstance(skills, list):
                for skill in skills:
                    if isinstance(skill, dict) and 'name' in skill:
                        job_keywords.add(skill['name'].lower())
        
        if not job_keywords:
            return 0.0
        
        matches = resume_keywords.intersection(job_keywords)
        return len(matches) / len(job_keywords) * 100
    
    def _compare_technical_depth(self, resume_skills: Dict, job_skills: Dict) -> Dict[str, Any]:
        """Compare technical depth between resume and job requirements"""
        return {
            'resume_depth': 'medium',  # Placeholder
            'job_depth_required': 'high',  # Placeholder
            'assessment': 'Resume has moderate technical depth but job requires advanced expertise'
        }
    
    def _assess_experience_alignment(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Assess how well experience aligns with job requirements"""
        return {
            'alignment_score': 75,  # Placeholder
            'key_alignment_areas': ['Technical Skills', 'Problem Solving'],
            'gaps': ['Specific domain experience', 'Leadership experience']
        }
    
    def _get_market_insights(self, skills_analysis: Dict) -> Dict[str, Any]:
        """Get current market insights for the analyzed skills"""
        return {
            'demand_level': 'High',
            'salary_outlook': 'Positive',
            'trending_skills': ['AI/ML', 'Cloud Computing', 'Cybersecurity'],
            'market_notes': 'Strong demand for these skills in the current market'
        }
    
    def _prioritize_learning_areas(self, skills_analysis: Dict) -> List[Dict[str, str]]:
        """Prioritize learning areas based on analysis"""
        return [
            {'area': 'Cloud Technologies', 'priority': 'High', 'reason': 'High market demand'},
            {'area': 'Machine Learning', 'priority': 'Medium', 'reason': 'Growing field'},
            {'area': 'DevOps', 'priority': 'High', 'reason': 'Industry standard'}
        ]