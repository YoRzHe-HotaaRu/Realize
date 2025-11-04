"""
Skills database model for RealiZe
Contains comprehensive IT skills categories and proficiency levels
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

from typing import Dict, List, Any
import json
import os

class SkillDatabase:
    """Manages comprehensive skills database for IT professionals"""
    
    def __init__(self):
        self.skills_data = self._initialize_skills_database()
    
    def _initialize_skills_database(self) -> Dict[str, Any]:
        """Initialize the comprehensive skills database"""
        return {
            "programming_languages": {
                "name": "Programming Languages",
                "skills": [
                    {"name": "Python", "category": "Backend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Java", "category": "Backend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "JavaScript", "category": "Full-Stack", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "TypeScript", "category": "Full-Stack", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "C#", "category": "Backend", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "C++", "category": "Systems", "demand": "Medium", "learning_difficulty": "Hard"},
                    {"name": "Go", "category": "Backend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Rust", "category": "Systems", "demand": "Medium", "learning_difficulty": "Hard"},
                    {"name": "PHP", "category": "Backend", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Ruby", "category": "Backend", "demand": "Low", "learning_difficulty": "Medium"},
                    {"name": "Swift", "category": "Mobile", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Kotlin", "category": "Mobile", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Dart", "category": "Mobile", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "R", "category": "Data Science", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "Scala", "category": "Backend", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "Julia", "category": "Data Science", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "MATLAB", "category": "Data Science", "demand": "Low", "learning_difficulty": "Hard"}
                ]
            },
            "frameworks": {
                "name": "Frameworks & Libraries",
                "skills": [
                    {"name": "React", "category": "Frontend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Angular", "category": "Frontend", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Vue.js", "category": "Frontend", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "Django", "category": "Backend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Flask", "category": "Backend", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Spring", "category": "Backend", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Express.js", "category": "Backend", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "Node.js", "category": "Backend", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "ASP.NET", "category": "Backend", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "Ruby on Rails", "category": "Backend", "demand": "Low", "learning_difficulty": "Medium"},
                    {"name": "Laravel", "category": "Backend", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "TensorFlow", "category": "AI/ML", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "PyTorch", "category": "AI/ML", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Pandas", "category": "Data Science", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "NumPy", "category": "Data Science", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "jQuery", "category": "Frontend", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Bootstrap", "category": "Frontend", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "Tailwind CSS", "category": "Frontend", "demand": "High", "learning_difficulty": "Medium"}
                ]
            },
            "databases": {
                "name": "Databases",
                "skills": [
                    {"name": "MySQL", "category": "Relational", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "PostgreSQL", "category": "Relational", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "SQLite", "category": "Relational", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Microsoft SQL Server", "category": "Relational", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "Oracle", "category": "Relational", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "MongoDB", "category": "NoSQL", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Redis", "category": "NoSQL", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Cassandra", "category": "NoSQL", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "DynamoDB", "category": "NoSQL", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Elasticsearch", "category": "Search", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Neo4j", "category": "Graph", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "InfluxDB", "category": "Time Series", "demand": "Low", "learning_difficulty": "Hard"},
                    {"name": "Firebase", "category": "Cloud Database", "demand": "High", "learning_difficulty": "Easy"}
                ]
            },
            "cloud_platforms": {
                "name": "Cloud Platforms & Services",
                "skills": [
                    {"name": "AWS", "category": "Cloud Provider", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Microsoft Azure", "category": "Cloud Provider", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Google Cloud Platform", "category": "Cloud Provider", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Docker", "category": "Containerization", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Kubernetes", "category": "Container Orchestration", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Terraform", "category": "Infrastructure as Code", "demand": "High", "learning_difficulty": "Hard"},
                    {"name": "Ansible", "category": "Configuration Management", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "Jenkins", "category": "CI/CD", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "GitLab CI/CD", "category": "CI/CD", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "GitHub Actions", "category": "CI/CD", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "CloudFlare", "category": "CDN", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "Heroku", "category": "Platform as a Service", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Vercel", "category": "Platform as a Service", "demand": "High", "learning_difficulty": "Easy"}
                ]
            },
            "tools": {
                "name": "Development Tools & Technologies",
                "skills": [
                    {"name": "Git", "category": "Version Control", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "GitHub", "category": "Version Control", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "GitLab", "category": "Version Control", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "VS Code", "category": "IDE", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "IntelliJ IDEA", "category": "IDE", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "PyCharm", "category": "IDE", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "Eclipse", "category": "IDE", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Postman", "category": "API Testing", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "Insomnia", "category": "API Testing", "demand": "Medium", "learning_difficulty": "Easy"},
                    {"name": "Swagger/OpenAPI", "category": "API Documentation", "demand": "High", "learning_difficulty": "Medium"},
                    {"name": "Webpack", "category": "Build Tool", "demand": "Medium", "learning_difficulty": "Hard"},
                    {"name": "Babel", "category": "Build Tool", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "npm", "category": "Package Manager", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "yarn", "category": "Package Manager", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "pip", "category": "Package Manager", "demand": "High", "learning_difficulty": "Easy"},
                    {"name": "maven", "category": "Build Tool", "demand": "Medium", "learning_difficulty": "Medium"},
                    {"name": "gradle", "category": "Build Tool", "demand": "Medium", "learning_difficulty": "Medium"}
                ]
            },
            "certifications": {
                "name": "IT Certifications",
                "skills": [
                    {"name": "AWS Certified Solutions Architect", "category": "Cloud", "demand": "High"},
                    {"name": "AWS Certified Developer", "category": "Cloud", "demand": "High"},
                    {"name": "Microsoft Azure Fundamentals", "category": "Cloud", "demand": "High"},
                    {"name": "Google Cloud Professional", "category": "Cloud", "demand": "High"},
                    {"name": "Certified Kubernetes Administrator", "category": "DevOps", "demand": "High"},
                    {"name": "Project Management Professional (PMP)", "category": "Management", "demand": "Medium"},
                    {"name": "CompTIA Security+", "category": "Security", "demand": "High"},
                    {"name": "Certified Information Systems Security Professional (CISSP)", "category": "Security", "demand": "High"},
                    {"name": "Oracle Certified Professional", "category": "Database", "demand": "Medium"},
                    {"name": "MongoDB Certified Developer", "category": "Database", "demand": "Medium"},
                    {"name": "Salesforce Administrator", "category": "CRM", "demand": "Medium"},
                    {"name": "Scrum Master Certification", "category": "Agile", "demand": "Medium"},
                    {"name": "Certified Business Analysis Professional (CBAP)", "category": "Business Analysis", "demand": "Medium"},
                    {"name": "Microsoft Certified: Azure Developer Associate", "category": "Cloud", "demand": "High"},
                    {"name": "Google Cloud Associate Cloud Engineer", "category": "Cloud", "demand": "High"}
                ]
            },
            "soft_skills": {
                "name": "Soft Skills",
                "skills": [
                    {"name": "Communication", "category": "Interpersonal", "demand": "High"},
                    {"name": "Leadership", "category": "Interpersonal", "demand": "High"},
                    {"name": "Problem Solving", "category": "Cognitive", "demand": "High"},
                    {"name": "Critical Thinking", "category": "Cognitive", "demand": "High"},
                    {"name": "Teamwork", "category": "Interpersonal", "demand": "High"},
                    {"name": "Adaptability", "category": "Personal", "demand": "High"},
                    {"name": "Time Management", "category": "Personal", "demand": "High"},
                    {"name": "Creativity", "category": "Cognitive", "demand": "High"},
                    {"name": "Conflict Resolution", "category": "Interpersonal", "demand": "Medium"},
                    {"name": "Mentoring", "category": "Interpersonal", "demand": "Medium"},
                    {"name": "Project Management", "category": "Professional", "demand": "High"},
                    {"name": "Strategic Planning", "category": "Professional", "demand": "Medium"},
                    {"name": "Emotional Intelligence", "category": "Interpersonal", "demand": "Medium"},
                    {"name": "Negotiation", "category": "Interpersonal", "demand": "Medium"},
                    {"name": "Public Speaking", "category": "Interpersonal", "demand": "Medium"},
                    {"name": "Technical Writing", "category": "Professional", "demand": "High"},
                    {"name": "Data Analysis", "category": "Professional", "demand": "High"},
                    {"name": "Customer Service", "category": "Interpersonal", "demand": "Medium"}
                ]
            }
        }
    
    def get_all_skills(self) -> Dict[str, Any]:
        """Get all skills data"""
        return self.skills_data
    
    def get_skills_by_category(self, category: str) -> List[Dict[str, str]]:
        """Get skills for a specific category"""
        if category in self.skills_data:
            return self.skills_data[category]['skills']
        return []
    
    def search_skills(self, query: str) -> List[Dict[str, str]]:
        """Search skills by name or category"""
        results = []
        query_lower = query.lower()
        
        for category_data in self.skills_data.values():
            for skill in category_data['skills']:
                if (query_lower in skill['name'].lower() or 
                    query_lower in skill.get('category', '').lower()):
                    results.append(skill)
        
        return results
    
    def get_skills_by_demand(self, demand_level: str) -> List[Dict[str, str]]:
        """Get skills by demand level (High, Medium, Low)"""
        results = []
        
        for category_data in self.skills_data.values():
            for skill in category_data['skills']:
                if skill.get('demand', '').lower() == demand_level.lower():
                    results.append(skill)
        
        return results
    
    def get_popular_skills(self, limit: int = 20) -> List[Dict[str, str]]:
        """Get most popular skills (high demand)"""
        high_demand_skills = self.get_skills_by_demand('High')
        return high_demand_skills[:limit]
    
    def get_learning_path(self, target_role: str) -> Dict[str, Any]:
        """Get recommended learning path for a target role"""
        learning_paths = {
            "full_stack_developer": {
                "essential": ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
                "recommended": ["TypeScript", "Docker", "AWS", "PostgreSQL", "GraphQL"],
                "advanced": ["Kubernetes", "Microservices", "System Design", "Performance Optimization"]
            },
            "backend_developer": {
                "essential": ["Python", "SQL", "Git", "REST APIs", "Linux"],
                "recommended": ["Docker", "Redis", "PostgreSQL", "Message Queues", "Testing"],
                "advanced": ["Kubernetes", "System Design", "Distributed Systems", "Performance Tuning"]
            },
            "frontend_developer": {
                "essential": ["JavaScript", "HTML", "CSS", "React", "Git"],
                "recommended": ["TypeScript", "Webpack", "Testing", "Accessibility", "Performance"],
                "advanced": ["Advanced React", "WebAssembly", "Progressive Web Apps", "Micro-frontends"]
            },
            "devops_engineer": {
                "essential": ["Linux", "Git", "Docker", "AWS", "Jenkins"],
                "recommended": ["Kubernetes", "Terraform", "Monitoring", "Security", "CI/CD"],
                "advanced": ["Service Mesh", "GitOps", "Cloud Architecture", "Site Reliability Engineering"]
            },
            "data_scientist": {
                "essential": ["Python", "R", "SQL", "Statistics", "Machine Learning"],
                "recommended": ["TensorFlow", "Pandas", "Data Visualization", "Big Data", "Cloud Platforms"],
                "advanced": ["Deep Learning", "MLOps", "Advanced Statistics", "Research Methods"]
            },
            "mobile_developer": {
                "essential": ["Swift", "Android Development", "iOS", "Java/Kotlin", "Git"],
                "recommended": ["React Native", "Flutter", "Mobile UI/UX", "App Store Optimization"],
                "advanced": ["Advanced Mobile Patterns", "Performance Optimization", "App Security"]
            }
        }
        
        return learning_paths.get(target_role.lower().replace(" ", "_"), {})
    
    def save_skills_to_file(self, filename: str):
        """Save skills database to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.skills_data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error saving skills to file: {e}")
            return False
    
    def load_skills_from_file(self, filename: str):
        """Load skills database from JSON file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r', encoding='utf-8') as f:
                    self.skills_data = json.load(f)
                return True
            return False
        except Exception as e:
            print(f"Error loading skills from file: {e}")
            return False