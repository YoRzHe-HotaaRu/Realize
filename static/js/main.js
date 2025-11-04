/*
RealiZe - Main JavaScript
Core functionality and event handlers for the application
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
*/

// Global application state
const AppState = {
    currentFile: null,
    isAnalyzing: false,
    analysisResults: null,
    charts: {}
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 Initializing RealiZe...');
    
    // Initialize components
    setupNavigation();
    setupFileUpload();
    setupFormHandlers();
    setupScrollAnimations();
    setupErrorHandling();
    
    // Check API connectivity
    checkAPIHealth();
    
    console.log('✅ RealiZe initialized successfully');
}

/**
 * Setup navigation functionality
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Setup file upload functionality
 */
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeFile');
    const jobComparison = document.getElementById('jobComparison');
    const actionButtons = document.getElementById('actionButtons');
    
    if (!uploadArea || !fileInput) return;
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // Click to upload
    const chooseFileBtn = document.getElementById('chooseFileBtn');
    if (chooseFileBtn) {
        chooseFileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.click();
        });
    }
    
    // Click on upload area (but not on button)
    uploadArea.addEventListener('click', function(e) {
        if (AppState.currentFile && !e.target.closest('#chooseFileBtn')) {
            showFileInfo(AppState.currentFile);
        }
    });
    
    /**
     * Handle file selection
     */
    function handleFileSelect(file) {
        if (!file) return;
        
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showError('Please select a PDF file.');
            return;
        }
        
        // Validate file size (16MB limit)
        const maxSize = 16 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('File size must be less than 16MB.');
            return;
        }
        
        AppState.currentFile = file;
        showFileInfo(file);
        
        // Show job comparison and action buttons
        if (jobComparison) jobComparison.style.display = 'block';
        if (actionButtons) actionButtons.style.display = 'flex';
        
        // Add success animation
        uploadArea.classList.add('success');
        setTimeout(() => uploadArea.classList.remove('success'), 1000);
        
        // Scroll to job comparison section
        if (jobComparison) {
            setTimeout(() => {
                jobComparison.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
}

/**
 * Show file information
 */
function showFileInfo(file) {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    const fileSize = formatFileSize(file.size);
    const fileName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
    
    uploadArea.innerHTML = `
        <div class="upload-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>File Selected Successfully</h3>
            <div class="file-info">
                <div class="file-details">
                    <span class="file-name">
                        <i class="fas fa-file-pdf"></i>
                        ${fileName}
                    </span>
                    <span class="file-size">${fileSize}</span>
                </div>
                <div class="file-actions">
                    <button class="btn btn-secondary" onclick="changeFile()">
                        <i class="fas fa-exchange-alt"></i>
                        Change File
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add success animation
    uploadArea.classList.add('animate-scale-in');
}

/**
 * Change selected file
 */
function changeFile() {
    AppState.currentFile = null;
    const uploadArea = document.getElementById('uploadArea');
    const jobComparison = document.getElementById('jobComparison');
    const actionButtons = document.getElementById('actionButtons');
    
    if (uploadArea) {
        // Remove any existing file input to prevent duplicates
        const existingFileInput = document.getElementById('resumeFile');
        if (existingFileInput) {
            existingFileInput.remove();
        }
        
        uploadArea.innerHTML = `
            <div class="upload-content">
                <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <h3>Drop your PDF resume here</h3>
                <p>or click to browse files</p>
                <input type="file" id="resumeFile" accept=".pdf" hidden>
                <button class="btn btn-primary" id="chooseFileBtn">
                    <i class="fas fa-folder-open"></i>
                    Choose File
                </button>
            </div>
        `;
        
        // Re-setup file upload
        setupFileUpload();
    }
    
    if (jobComparison) jobComparison.style.display = 'none';
    if (actionButtons) actionButtons.style.display = 'none';
}

/**
 * Setup form handlers
 */
function setupFormHandlers() {
    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', startAnalysis);
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnalysis);
    }
    
    // Job description input
    const jobDescription = document.getElementById('jobDescription');
    if (jobDescription) {
        jobDescription.addEventListener('input', function() {
            // Auto-save job description to localStorage
            localStorage.setItem('jobDescription', this.value);
        });
        
        // Restore from localStorage
        const saved = localStorage.getItem('jobDescription');
        if (saved) {
            jobDescription.value = saved;
        }
    }
}

/**
 * Start resume analysis
 */
async function startAnalysis() {
    if (!AppState.currentFile) {
        showError('Please select a resume file first.');
        return;
    }
    
    if (AppState.isAnalyzing) {
        showError('Analysis already in progress. Please wait...');
        return;
    }
    
    AppState.isAnalyzing = true;
    showLoadingState();
    
    try {
        const formData = new FormData();
        formData.append('resume', AppState.currentFile);
        
        const response = await fetch('/api/analyze-resume', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Analysis failed');
        }
        
        AppState.analysisResults = result.analysis;
        
        // Check if job description is provided for comparison
        const jobDescription = document.getElementById('jobDescription')?.value.trim();
        if (jobDescription) {
            await performJobComparison(jobDescription);
        }
        
        showAnalysisResults();
        
    } catch (error) {
        console.error('Analysis error:', error);
        showError('Analysis failed: ' + error.message);
    } finally {
        AppState.isAnalyzing = false;
        hideLoadingState();
    }
}

/**
 * Perform job comparison analysis
 */
async function performJobComparison(jobDescription) {
    try {
        const response = await fetch('/api/compare-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume_text: extractTextFromAnalysis(AppState.analysisResults),
                job_description: jobDescription
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            AppState.analysisResults.job_comparison = result.comparison;
        }
    } catch (error) {
        console.error('Job comparison error:', error);
    }
}

/**
 * Extract text from analysis results for comparison
 */
function extractTextFromAnalysis(analysis) {
    // This would be implemented based on the actual analysis structure
    return analysis?.basic_info?.text_content || '';
}

/**
 * Show loading state
 */
function showLoadingState() {
    const loadingState = document.getElementById('loadingState');
    const actionButtons = document.getElementById('actionButtons');
    
    if (loadingState) loadingState.style.display = 'block';
    if (actionButtons) actionButtons.style.display = 'none';
    
    // Scroll to loading state
    if (loadingState) {
        loadingState.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) loadingState.style.display = 'none';
}

/**
 * Show analysis results
 */
function showAnalysisResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection || !AppState.analysisResults) return;
    
    // Build results HTML
    resultsSection.innerHTML = buildResultsHTML(AppState.analysisResults);
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize charts
    if (window.initializeCharts) {
        window.initializeCharts(AppState.analysisResults);
    }
    
    // Add reveal animations
    addRevealAnimations();
}

/**
 * Build results HTML
 */
function buildResultsHTML(analysis) {
    return `
        <div class="results-container animate-fade-in-up">
            <div class="results-header">
                <h2>
                    <i class="fas fa-chart-line"></i>
                    Analysis Complete!
                </h2>
                <p>Your resume has been analyzed successfully. Below are the detailed insights.</p>
            </div>
            
            <div class="results-content">
                ${buildScoreCards(analysis)}
                ${buildSkillsAnalysis(analysis)}
                ${buildExperienceAnalysis(analysis)}
                ${buildRecommendations(analysis)}
                ${buildAIResumeSummary(analysis)}
                ${buildChartsSection(analysis)}
                ${buildJobComparison(analysis)}
                ${buildCareerSuggestions(analysis)}
            </div>
            
            <div class="results-actions">
                <button class="btn btn-secondary" onclick="exportResults()">
                    <i class="fas fa-download"></i>
                    Export Results
                </button>
                <button class="btn btn-primary" onclick="resetAnalysis()">
                    <i class="fas fa-refresh"></i>
                    Analyze Another Resume
                </button>
            </div>
        </div>
    `;
}

/**
 * Build score cards section
 */
function buildScoreCards(analysis) {
    const scores = analysis.scores || {};
    
    return `
        <div class="score-section">
            <h3>
                <i class="fas fa-star"></i>
                Overall Assessment
            </h3>
            <div class="results-grid">
                <div class="score-card">
                    <div class="score-label">Overall Score</div>
                    <div class="score-value">${scores.overall_score || 0}<span class="score-max">/100</span></div>
                    <div class="score-description">Comprehensive evaluation</div>
                </div>
                <div class="score-card">
                    <div class="score-label">Technical Skills</div>
                    <div class="score-value">${scores.technical_skills_score || 0}<span class="score-max">/100</span></div>
                    <div class="score-description">Programming & tools</div>
                </div>
                <div class="score-card">
                    <div class="score-label">Experience</div>
                    <div class="score-value">${scores.experience_score || 0}<span class="score-max">/100</span></div>
                    <div class="score-description">Years & level</div>
                </div>
                <div class="score-card">
                    <div class="score-label">Completeness</div>
                    <div class="score-value">${scores.completeness_score || 0}<span class="score-max">/100</span></div>
                    <div class="score-description">Resume quality</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Build skills analysis section
 */
function buildSkillsAnalysis(analysis) {
    const skillsAnalysis = analysis.skills_analysis || {};
    
    if (Object.keys(skillsAnalysis).length === 0) {
        return '';
    }
    
    return `
        <div class="skills-section">
            <h3>
                <i class="fas fa-code"></i>
                Skills Analysis
            </h3>
            ${buildSkillsCategory('Programming Languages', skillsAnalysis.programming_languages)}
            ${buildSkillsCategory('Frameworks & Libraries', skillsAnalysis.frameworks)}
            ${buildSkillsCategory('Databases', skillsAnalysis.databases)}
            ${buildSkillsCategory('Cloud Platforms', skillsAnalysis.cloud_platforms)}
            ${buildSkillsCategory('Development Tools', skillsAnalysis.tools)}
            ${buildSkillsCategory('Certifications', skillsAnalysis.certifications)}
            ${buildSkillsCategory('Soft Skills', skillsAnalysis.soft_skills)}
        </div>
    `;
}

/**
 * Build skills category HTML
 */
function buildSkillsCategory(title, skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="skill-category">
            <h4>${title}</h4>
            <div class="skills-grid">
                ${skills.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name || skill}</span>
                        ${skill.proficiency ? `<span class="skill-level ${skill.proficiency.toLowerCase()}">${skill.proficiency}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Build experience analysis section
 */
function buildExperienceAnalysis(analysis) {
    const experienceAnalysis = analysis.experience_analysis || {};
    
    if (Object.keys(experienceAnalysis).length === 0) {
        return '';
    }
    
    return `
        <div class="experience-section">
            <h3>
                <i class="fas fa-briefcase"></i>
                Experience Analysis
            </h3>
            <div class="experience-timeline">
                <div class="experience-item">
                    <div class="experience-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="experience-content">
                        <h4>Estimated Level: ${experienceAnalysis.estimated_level || 'Unknown'}</h4>
                        <p>Based on experience indicators and skill proficiency</p>
                    </div>
                </div>
                ${experienceAnalysis.years_pattern ? `
                    <div class="experience-item">
                        <div class="experience-icon">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="experience-content">
                            <h4>Years of Experience: ${experienceAnalysis.years_pattern}+</h4>
                            <p>Estimated from resume content analysis</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Build AI recommendations section
 */
function buildRecommendations(analysis) {
    const aiRecommendations = analysis.ai_recommendations || {};
    const recommendations = aiRecommendations.recommendations || [];
    
    if (recommendations.length === 0) return '';
    
    return `
        <div class="recommendations-section">
            <h3>
                <i class="fas fa-robot"></i>
                AI Recommendations
            </h3>
            <ul class="recommendations-list">
                ${recommendations.map(rec => `
                    <li class="recommendation-item">
                        <i class="recommendation-icon fas fa-arrow-right"></i>
                        <div class="recommendation-content">
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                            <div class="recommendation-meta">
                                <span class="priority ${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
                                <span class="category">${rec.category}</span>
                            </div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

/**
 * Build AI resume summary section
 */
function buildAIResumeSummary(analysis) {
    const aiSummary = analysis.ai_summary || {};
    
    if (!aiSummary.summary) return '';
    
    return `
        <div class="ai-summary-section">
            <h3>
                <i class="fas fa-brain"></i>
                AI Resume Summary
            </h3>
            <div class="ai-summary-content">
                <div class="summary-overview">
                    <h4>Overall Assessment</h4>
                    <p>${aiSummary.overall_assessment}</p>
                </div>
                
                <div class="summary-strengths">
                    <h4>Key Strengths</h4>
                    <ul>
                        ${aiSummary.key_strengths ? aiSummary.key_strengths.map(strength => `<li>${strength}</li>`).join('') : ''}
                    </ul>
                </div>
                
                <div class="summary-improvements">
                    <h4>Areas for Improvement</h4>
                    <ul>
                        ${aiSummary.areas_for_improvement ? aiSummary.areas_for_improvement.map(area => `<li>${area}</li>`).join('') : ''}
                    </ul>
                </div>
                
                <div class="summary-trajectory">
                    <h4>Career Trajectory</h4>
                    <p>${aiSummary.career_trajectory}</p>
                </div>
                
                <div class="summary-competitiveness">
                    <h4>Market Competitiveness</h4>
                    <p>${aiSummary.market_competitiveness}</p>
                </div>
                
                <div class="summary-detailed">
                    <h4>Detailed Analysis</h4>
                    <p>${aiSummary.summary}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Build charts section
 */
function buildChartsSection(analysis) {
    return `
        <div class="charts-section">
            <h3>
                <i class="fas fa-chart-pie"></i>
                Visual Analysis
            </h3>
            <div class="charts-container">
                <div class="chart-title">Skills Distribution</div>
                <div class="chart-wrapper">
                    <canvas id="skillsChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

/**
 * Build job comparison section
 */
function buildJobComparison(analysis) {
    const jobComparison = analysis.job_comparison;
    
    if (!jobComparison || jobComparison.error) return '';
    
    return `
        <div class="job-comparison-section">
            <h3>
                <i class="fas fa-bullseye"></i>
                Job Comparison
            </h3>
            <div class="comparison-results">
                <div class="comparison-side">
                    <h4>Match Score</h4>
                    <div class="match-score">
                        <div class="match-percentage-large">${jobComparison.match_score || 0}%</div>
                        <p>Overall match with job requirements</p>
                    </div>
                </div>
                <div class="comparison-side">
                    <h4>Key Findings</h4>
                    ${jobComparison.strong_matches ? `
                        <div class="findings">
                            <h5>Strong Matches</h5>
                            <ul>
                                ${jobComparison.strong_matches.map(match => `<li>${match}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${jobComparison.missing_skills ? `
                        <div class="findings">
                            <h5>Missing Skills</h5>
                            <ul>
                                ${jobComparison.missing_skills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Build career suggestions section
 */
function buildCareerSuggestions(analysis) {
    // This would be populated by career suggestions API
    return `
        <div class="career-suggestions-section">
            <h3>
                <i class="fas fa-road"></i>
                Career Suggestions
            </h3>
            <div class="career-paths">
                <p>Career suggestions will appear here based on your skills and experience.</p>
            </div>
        </div>
    `;
}

/**
 * Reset analysis
 */
function resetAnalysis() {
    // Reset state
    AppState.currentFile = null;
    AppState.isAnalyzing = false;
    AppState.analysisResults = null;
    
    // Clear UI
    const uploadArea = document.getElementById('uploadArea');
    const jobComparison = document.getElementById('jobComparison');
    const actionButtons = document.getElementById('actionButtons');
    const resultsSection = document.getElementById('resultsSection');
    
    if (uploadArea) changeFile();
    if (jobComparison) jobComparison.style.display = 'none';
    if (actionButtons) actionButtons.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    
    // Clear localStorage
    localStorage.removeItem('jobDescription');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Add reveal animations
 */
function addRevealAnimations() {
    const results = document.querySelectorAll('.results-container > *');
    results.forEach((element, index) => {
        element.classList.add('animate-fade-in-up');
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Check API health
 */
async function checkAPIHealth() {
    try {
        const response = await fetch('/health');
        if (response.ok) {
            console.log('✅ API health check passed');
        } else {
            console.warn('⚠️ API health check failed');
        }
    } catch (error) {
        console.error('❌ API health check error:', error);
    }
}

/**
 * Setup error handling
 */
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showError('An unexpected error occurred. Please refresh the page and try again.');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showError('A network error occurred. Please check your connection and try again.');
    });
}

/**
 * Show error message
 */
function showError(message) {
    // Create or update error message
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span></span>
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.querySelector('span').textContent = message;
    errorDiv.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    // Similar to showError but for success
    let successDiv = document.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span></span>
        `;
        document.body.appendChild(successDiv);
    }
    
    successDiv.querySelector('span').textContent = message;
    successDiv.style.display = 'flex';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Export results
 */
function exportResults() {
    if (!AppState.analysisResults) {
        showError('No results to export.');
        return;
    }
    
    // Create export data
    const exportData = {
        timestamp: new Date().toISOString(),
        filename: AppState.currentFile?.name || 'Unknown',
        analysis: AppState.analysisResults
    };
    
    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showSuccess('Results exported successfully!');
}

// Make functions available globally
window.changeFile = changeFile;
window.resetAnalysis = resetAnalysis;
window.startAnalysis = startAnalysis;
window.exportResults = exportResults;