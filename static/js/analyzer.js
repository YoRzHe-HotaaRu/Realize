/*
RealiZe - Analyzer JavaScript
Advanced analysis features, job comparison, and career suggestions
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
*/

// Analysis Manager
class AnalysisManager {
    constructor() {
        this.currentAnalysis = null;
        this.analysisHistory = [];
    }
    
    /**
     * Initialize the analyzer
     */
    init() {
        this.setupAnalysisFeatures();
        this.loadAnalysisHistory();
    }
    
    /**
     * Setup analysis-specific features
     */
    setupAnalysisFeatures() {
        // Setup career suggestions button
        const careerBtn = document.getElementById('getCareerSuggestions');
        if (careerBtn) {
            careerBtn.addEventListener('click', () => this.generateCareerSuggestions());
        }
        
        // Setup detailed analysis toggle
        this.setupDetailedAnalysis();
        
        // Setup skills comparison
        this.setupSkillsComparison();
    }
    
    /**
     * Generate career suggestions
     */
    async generateCareerSuggestions() {
        if (!this.currentAnalysis) {
            showError('Please analyze a resume first.');
            return;
        }
        
        const suggestionsBtn = document.getElementById('getCareerSuggestions');
        if (suggestionsBtn) {
            suggestionsBtn.disabled = true;
            suggestionsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        }
        
        try {
            const response = await fetch('/api/career-suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_text: this.extractResumeText(),
                    skills_analysis: this.currentAnalysis.skills_analysis || {}
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayCareerSuggestions(result.suggestions);
                this.currentAnalysis.career_suggestions = result.suggestions;
            } else {
                throw new Error(result.error || 'Failed to generate career suggestions');
            }
        } catch (error) {
            console.error('Career suggestions error:', error);
            showError('Failed to generate career suggestions: ' + error.message);
        } finally {
            if (suggestionsBtn) {
                suggestionsBtn.disabled = false;
                suggestionsBtn.innerHTML = '<i class="fas fa-road"></i> Get Career Suggestions';
            }
        }
    }
    
    /**
     * Display career suggestions
     */
    displayCareerSuggestions(suggestions) {
        const container = document.getElementById('careerSuggestionsContainer');
        if (!container || !suggestions) return;
        
        // Create career suggestions HTML
        container.innerHTML = this.buildCareerSuggestionsHTML(suggestions);
        container.style.display = 'block';
        
        // Scroll to suggestions
        container.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Build career suggestions HTML
     */
    buildCareerSuggestionsHTML(suggestions) {
        const careerPaths = suggestions.career_paths || [];
        const learningPath = suggestions.learning_path || [];
        const skillsToDevelop = suggestions.skills_to_develop || [];
        const actionPlan = suggestions.action_plan || [];
        
        return `
            <div class="career-suggestions animate-fade-in-up">
                <div class="suggestions-header">
                    <h3>
                        <i class="fas fa-road"></i>
                        Career Path Suggestions
                    </h3>
                    <p>Personalized recommendations based on your skills and experience</p>
                </div>
                
                ${careerPaths.length > 0 ? `
                    <div class="career-paths">
                        <h4>Recommended Career Paths</h4>
                        <div class="paths-grid">
                            ${careerPaths.map(path => this.buildCareerPathHTML(path)).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${skillsToDevelop.length > 0 ? `
                    <div class="skills-development">
                        <h4>
                            <i class="fas fa-chart-line"></i>
                            Skills to Develop
                        </h4>
                        <div class="skills-tags">
                            ${skillsToDevelop.map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${actionPlan.length > 0 ? `
                    <div class="action-plan">
                        <h4>
                            <i class="fas fa-tasks"></i>
                            Action Plan
                        </h4>
                        <ol class="plan-steps">
                            ${actionPlan.map(step => `
                                <li class="plan-step">
                                    <i class="fas fa-arrow-right"></i>
                                    ${step}
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                ` : ''}
                
                ${suggestions.market_insights ? `
                    <div class="market-insights">
                        <h4>
                            <i class="fas fa-chart-pie"></i>
                            Market Insights
                        </h4>
                        <div class="insights-grid">
                            <div class="insight-card">
                                <div class="insight-label">Demand Level</div>
                                <div class="insight-value">${suggestions.market_insights.demand_level || 'Unknown'}</div>
                            </div>
                            <div class="insight-card">
                                <div class="insight-label">Salary Outlook</div>
                                <div class="insight-value">${suggestions.market_insights.salary_outlook || 'Unknown'}</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Build individual career path HTML
     */
    buildCareerPathHTML(path) {
        return `
            <div class="career-path-card">
                <div class="path-header">
                    <h5>${path.title || 'Career Path'}</h5>
                    <div class="match-indicator">
                        <span class="match-percentage">${path.match_percentage || 0}%</span>
                        <div class="match-bar">
                            <div class="match-fill" style="width: ${path.match_percentage || 0}%"></div>
                        </div>
                    </div>
                </div>
                <p class="path-description">${path.description || ''}</p>
                ${path.learning_path ? `
                    <div class="learning-roadmap">
                        <h6>Learning Path</h6>
                        <ul class="roadmap-steps">
                            ${path.learning_path.map(step => `
                                <li class="roadmap-step">
                                    <i class="fas fa-arrow-right"></i>
                                    ${step}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Setup detailed analysis features
     */
    setupDetailedAnalysis() {
        // Add toggle for detailed view
        const resultsContainer = document.getElementById('resultsSection');
        if (resultsContainer) {
            // This would be implemented to show/hide detailed analysis sections
        }
    }
    
    /**
     * Setup skills comparison features
     */
    setupSkillsComparison() {
        // Setup skills vs market demand comparison
        this.compareWithMarketDemand();
    }
    
    /**
     * Compare skills with market demand
     */
    async compareWithMarketDemand() {
        if (!this.currentAnalysis) return;
        
        try {
            const response = await fetch('/api/skills-database');
            const result = await response.json();
            
            if (result.success) {
                this.displayMarketComparison(result.skills, this.currentAnalysis.skills_analysis);
            }
        } catch (error) {
            console.error('Market comparison error:', error);
        }
    }
    
    /**
     * Display market comparison
     */
    displayMarketComparison(skillsDatabase, userSkills) {
        // Implementation for market comparison visualization
        const container = document.getElementById('marketComparisonContainer');
        if (!container) return;
        
        // This would show a comparison between user's skills and market demand
        container.innerHTML = this.buildMarketComparisonHTML(skillsDatabase, userSkills);
    }
    
    /**
     * Build market comparison HTML
     */
    buildMarketComparisonHTML(skillsDatabase, userSkills) {
        // Implementation for market comparison
        return `
            <div class="market-comparison">
                <h4>Skills vs Market Demand</h4>
                <p>Market demand analysis will be displayed here</p>
            </div>
        `;
    }
    
    /**
     * Extract text from current analysis
     */
    extractResumeText() {
        if (!this.currentAnalysis || !this.currentAnalysis.basic_info) {
            return '';
        }
        return this.currentAnalysis.basic_info.text_content || '';
    }
    
    /**
     * Set current analysis
     */
    setCurrentAnalysis(analysis) {
        this.currentAnalysis = analysis;
        this.addToHistory(analysis);
    }
    
    /**
     * Add analysis to history
     */
    addToHistory(analysis) {
        this.analysisHistory.unshift({
            timestamp: new Date().toISOString(),
            analysis: analysis
        });
        
        // Keep only last 10 analyses
        if (this.analysisHistory.length > 10) {
            this.analysisHistory = this.analysisHistory.slice(0, 10);
        }
        
        this.saveAnalysisHistory();
    }
    
    /**
     * Load analysis history
     */
    loadAnalysisHistory() {
        try {
            const saved = localStorage.getItem('analysisHistory');
            if (saved) {
                this.analysisHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading analysis history:', error);
        }
    }
    
    /**
     * Save analysis history
     */
    saveAnalysisHistory() {
        try {
            localStorage.setItem('analysisHistory', JSON.stringify(this.analysisHistory));
        } catch (error) {
            console.error('Error saving analysis history:', error);
        }
    }
    
    /**
     * Get analysis history
     */
    getAnalysisHistory() {
        return this.analysisHistory;
    }
    
    /**
     * Clear analysis history
     */
    clearAnalysisHistory() {
        this.analysisHistory = [];
        localStorage.removeItem('analysisHistory');
    }
}

// Job Comparison Manager
class JobComparisonManager {
    constructor() {
        this.currentComparison = null;
    }
    
    /**
     * Initialize job comparison
     */
    init() {
        this.setupJobComparisonFeatures();
    }
    
    /**
     * Setup job comparison features
     */
    setupJobComparisonFeatures() {
        // Add job description comparison functionality
        const compareBtn = document.getElementById('compareJobBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.performDetailedComparison());
        }
    }
    
    /**
     * Perform detailed job comparison
     */
    async performDetailedComparison() {
        const jobDescription = document.getElementById('jobDescription')?.value.trim();
        if (!jobDescription) {
            showError('Please enter a job description to compare against.');
            return;
        }
        
        if (!this.currentComparison) {
            showError('Please analyze a resume first.');
            return;
        }
        
        const compareBtn = document.getElementById('compareJobBtn');
        if (compareBtn) {
            compareBtn.disabled = true;
            compareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Comparing...';
        }
        
        try {
            const response = await fetch('/api/compare-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_text: this.extractResumeText(),
                    job_description: jobDescription
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayDetailedComparison(result.comparison);
            } else {
                throw new Error(result.error || 'Comparison failed');
            }
        } catch (error) {
            console.error('Job comparison error:', error);
            showError('Job comparison failed: ' + error.message);
        } finally {
            if (compareBtn) {
                compareBtn.disabled = false;
                compareBtn.innerHTML = '<i class="fas fa-bullseye"></i> Detailed Comparison';
            }
        }
    }
    
    /**
     * Display detailed comparison results
     */
    displayDetailedComparison(comparison) {
        const container = document.getElementById('detailedComparisonContainer');
        if (!container || !comparison) return;
        
        container.innerHTML = this.buildDetailedComparisonHTML(comparison);
        container.style.display = 'block';
        
        // Scroll to comparison
        container.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Build detailed comparison HTML
     */
    buildDetailedComparisonHTML(comparison) {
        const strongMatches = comparison.strong_matches || [];
        const missingSkills = comparison.missing_skills || [];
        const priorityGaps = comparison.priority_gaps || [];
        const recommendations = comparison.recommendations || [];
        
        return `
            <div class="detailed-comparison animate-fade-in-up">
                <div class="comparison-header">
                    <h3>
                        <i class="fas fa-search-plus"></i>
                        Detailed Job Comparison
                    </h3>
                    <p>In-depth analysis of your match with the job requirements</p>
                </div>
                
                <div class="comparison-score-large">
                    <div class="score-circle">
                        <span class="score-number">${comparison.match_score || 0}</span>
                        <span class="score-label">% Match</span>
                    </div>
                </div>
                
                <div class="comparison-grid">
                    ${strongMatches.length > 0 ? `
                        <div class="comparison-section">
                            <h4>
                                <i class="fas fa-check-circle"></i>
                                Strong Matches
                            </h4>
                            <ul class="matches-list">
                                ${strongMatches.map(match => `
                                    <li class="match-item">
                                        <i class="fas fa-check"></i>
                                        ${match}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${missingSkills.length > 0 ? `
                        <div class="comparison-section">
                            <h4>
                                <i class="fas fa-exclamation-triangle"></i>
                                Missing Skills
                            </h4>
                            <ul class="missing-list">
                                ${missingSkills.map(skill => `
                                    <li class="missing-item">
                                        <i class="fas fa-times"></i>
                                        ${skill}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                ${priorityGaps.length > 0 ? `
                    <div class="priority-gaps">
                        <h4>
                            <i class="fas fa-star"></i>
                            Priority Gaps
                        </h4>
                        <div class="gaps-tags">
                            ${priorityGaps.map(gap => `
                                <span class="gap-tag high-priority">${gap}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${recommendations.length > 0 ? `
                    <div class="comparison-recommendations">
                        <h4>
                            <i class="fas fa-lightbulb"></i>
                            Recommendations
                        </h4>
                        <ol class="recommendations-list">
                            ${recommendations.map(rec => `
                                <li class="recommendation-item">${rec}</li>
                            `).join('')}
                        </ol>
                    </div>
                ` : ''}
                
                ${comparison.overall_assessment ? `
                    <div class="overall-assessment">
                        <h4>
                            <i class="fas fa-balance-scale"></i>
                            Overall Assessment
                        </h4>
                        <p class="assessment-text">${comparison.overall_assessment}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Extract resume text from current analysis
     */
    extractResumeText() {
        // This would get the text from the current analysis
        return AppState.analysisResults?.basic_info?.text_content || '';
    }
    
    /**
     * Set current comparison
     */
    setCurrentComparison(comparison) {
        this.currentComparison = comparison;
    }
}

// Skills Enhancement Manager
class SkillsEnhancementManager {
    constructor() {
        this.enhancementSuggestions = [];
    }
    
    /**
     * Initialize skills enhancement
     */
    init() {
        this.generateEnhancementSuggestions();
    }
    
    /**
     * Generate skills enhancement suggestions
     */
    generateEnhancementSuggestions() {
        if (!AppState.analysisResults) return;
        
        const analysis = AppState.analysisResults;
        this.enhancementSuggestions = [];
        
        // Generate suggestions based on analysis
        this.suggestMissingCoreSkills(analysis);
        this.suggestTrendingSkills(analysis);
        this.suggestCertificationPaths(analysis);
        this.suggestExperienceEnhancement(analysis);
    }
    
    /**
     * Suggest missing core skills
     */
    suggestMissingCoreSkills(analysis) {
        const coreSkills = ['Git', 'Testing', 'CI/CD', 'Code Review', 'Agile'];
        const userSkills = this.extractUserSkills(analysis);
        
        coreSkills.forEach(skill => {
            if (!userSkills.includes(skill)) {
                this.enhancementSuggestions.push({
                    type: 'core_skill',
                    skill: skill,
                    priority: 'high',
                    description: `Add ${skill} to strengthen your technical foundation`,
                    action: `Learn ${skill} fundamentals and practice with real projects`
                });
            }
        });
    }
    
    /**
     * Suggest trending skills
     */
    suggestTrendingSkills(analysis) {
        const trendingSkills = [
            { skill: 'Docker', priority: 'high', description: 'Essential for modern development' },
            { skill: 'Kubernetes', priority: 'medium', description: 'Container orchestration is in high demand' },
            { skill: 'AI/ML Integration', priority: 'medium', description: 'AI skills are becoming crucial' },
            { skill: 'Cloud Native', priority: 'high', description: 'Cloud-native development is the future' }
        ];
        
        trendingSkills.forEach(item => {
            this.enhancementSuggestions.push({
                type: 'trending_skill',
                skill: item.skill,
                priority: item.priority,
                description: item.description,
                action: `Start with ${item.skill} basics and build practical experience`
            });
        });
    }
    
    /**
     * Suggest certification paths
     */
    suggestCertificationPaths(analysis) {
        const certifications = [
            { cert: 'AWS Certified Developer', priority: 'high', for: 'Cloud skills' },
            { cert: 'Kubernetes Certified Administrator', priority: 'medium', for: 'DevOps' },
            { cert: 'Google Cloud Professional', priority: 'medium', for: 'Multi-cloud' },
            { cert: 'CompTIA Security+', priority: 'high', for: 'Security awareness' }
        ];
        
        certifications.forEach(cert => {
            this.enhancementSuggestions.push({
                type: 'certification',
                skill: cert.cert,
                priority: cert.priority,
                description: `Relevant for ${cert.for}`,
                action: `Prepare for ${cert.cert} certification exam`
            });
        });
    }
    
    /**
     * Suggest experience enhancement
     */
    suggestExperienceEnhancement(analysis) {
        const experience = analysis.experience_analysis || {};
        
        if (experience.estimated_level === 'Junior') {
            this.enhancementSuggestions.push({
                type: 'experience',
                skill: 'Lead small projects',
                priority: 'high',
                description: 'Develop leadership experience through small project ownership',
                action: 'Volunteer to lead a project or feature development'
            });
        } else if (experience.estimated_level === 'Mid-Level') {
            this.enhancementSuggestions.push({
                type: 'experience',
                skill: 'Mentor junior developers',
                priority: 'medium',
                description: 'Build leadership and communication skills',
                action: 'Offer to mentor a junior team member'
            });
        }
    }
    
    /**
     * Extract user skills from analysis
     */
    extractUserSkills(analysis) {
        const skills = new Set();
        const skillsAnalysis = analysis.skills_analysis || {};
        
        Object.values(skillsAnalysis).forEach(category => {
            if (Array.isArray(category)) {
                category.forEach(skill => {
                    if (typeof skill === 'string') {
                        skills.add(skill);
                    } else if (skill && skill.name) {
                        skills.add(skill.name);
                    }
                });
            }
        });
        
        return Array.from(skills);
    }
    
    /**
     * Display enhancement suggestions
     */
    displayEnhancementSuggestions() {
        const container = document.getElementById('enhancementSuggestionsContainer');
        if (!container || this.enhancementSuggestions.length === 0) return;
        
        container.innerHTML = this.buildEnhancementSuggestionsHTML();
        container.style.display = 'block';
    }
    
    /**
     * Build enhancement suggestions HTML
     */
    buildEnhancementSuggestionsHTML() {
        return `
            <div class="enhancement-suggestions animate-fade-in-up">
                <div class="suggestions-header">
                    <h3>
                        <i class="fas fa-rocket"></i>
                        Skills Enhancement Plan
                    </h3>
                    <p>Personalized recommendations to boost your career prospects</p>
                </div>
                
                <div class="suggestions-grid">
                    ${this.enhancementSuggestions.map(suggestion => this.buildSuggestionHTML(suggestion)).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Build individual suggestion HTML
     */
    buildSuggestionHTML(suggestion) {
        const priorityClass = suggestion.priority === 'high' ? 'high-priority' : 'medium-priority';
        const typeIcon = this.getSuggestionTypeIcon(suggestion.type);
        
        return `
            <div class="suggestion-card">
                <div class="suggestion-header">
                    <div class="suggestion-type ${priorityClass}">
                        <i class="${typeIcon}"></i>
                        ${suggestion.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div class="suggestion-priority ${priorityClass}">
                        ${suggestion.priority} Priority
                    </div>
                </div>
                <h4>${suggestion.skill}</h4>
                <p class="suggestion-description">${suggestion.description}</p>
                <div class="suggestion-action">
                    <i class="fas fa-arrow-right"></i>
                    ${suggestion.action}
                </div>
            </div>
        `;
    }
    
    /**
     * Get icon for suggestion type
     */
    getSuggestionTypeIcon(type) {
        const icons = {
            'core_skill': 'fas fa-cog',
            'trending_skill': 'fas fa-trending-up',
            'certification': 'fas fa-certificate',
            'experience': 'fas fa-briefcase'
        };
        return icons[type] || 'fas fa-lightbulb';
    }
}

// Initialize managers
let analysisManager, jobComparisonManager, skillsEnhancementManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    analysisManager = new AnalysisManager();
    jobComparisonManager = new JobComparisonManager();
    skillsEnhancementManager = new SkillsEnhancementManager();
    
    analysisManager.init();
    jobComparisonManager.init();
    skillsEnhancementManager.init();
});

// Make managers available globally
window.analysisManager = analysisManager;
window.jobComparisonManager = jobComparisonManager;
window.skillsEnhancementManager = skillsEnhancementManager;