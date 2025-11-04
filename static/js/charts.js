/*
RealiZe - Charts JavaScript
Data visualization and interactive charts using Chart.js
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
*/

// Chart Manager
class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    padding: 12
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };
    }
    
    /**
     * Initialize charts for analysis results
     */
    initCharts(analysisData) {
        if (!analysisData) return;
        
        this.createSkillsChart(analysisData);
        this.createExperienceChart(analysisData);
        this.createScoreChart(analysisData);
        this.createMarketDemandChart(analysisData);
        this.createCareerPathChart(analysisData);
    }
    
    /**
     * Create skills distribution chart
     */
    createSkillsChart(analysisData) {
        const canvas = document.getElementById('skillsChart');
        if (!canvas) return;
        
        const skillsAnalysis = analysisData.skills_analysis || {};
        const skillsData = this.extractSkillsData(skillsAnalysis);
        
        if (skillsData.labels.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.skills = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: skillsData.labels,
                datasets: [{
                    data: skillsData.values,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 10
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Skills Distribution',
                        font: {
                            family: 'Inter',
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#1e293b',
                        padding: 20
                    }
                }
            }
        });
    }
    
    /**
     * Create experience timeline chart
     */
    createExperienceChart(analysisData) {
        const canvas = document.getElementById('experienceChart');
        if (!canvas) return;
        
        const experienceAnalysis = analysisData.experience_analysis || {};
        
        // Create mock experience data based on analysis
        const experienceData = this.generateExperienceData(experienceAnalysis);
        
        if (!experienceData) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.experience = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: experienceData.labels,
                datasets: [{
                    label: 'Your Skills',
                    data: experienceData.userData,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }, {
                    label: 'Industry Average',
                    data: experienceData.industryData,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        },
                        grid: {
                            color: '#e2e8f0'
                        },
                        angleLines: {
                            color: '#e2e8f0'
                        },
                        pointLabels: {
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#1e293b'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Experience Profile vs Industry',
                        font: {
                            family: 'Inter',
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#1e293b',
                        padding: 20
                    }
                }
            }
        });
    }
    
    /**
     * Create overall scores chart
     */
    createScoreChart(analysisData) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;
        
        const scores = analysisData.scores || {};
        const scoreData = {
            'Technical Skills': scores.technical_skills_score || 0,
            'Experience': scores.experience_score || 0,
            'Completeness': scores.completeness_score || 0,
            'Overall': scores.overall_score || 0
        };
        
        const ctx = canvas.getContext('2d');
        
        this.charts.scores = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(scoreData),
                datasets: [{
                    label: 'Score',
                    data: Object.values(scoreData),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11,
                                weight: '500'
                            },
                            color: '#1e293b'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Assessment Scores',
                        font: {
                            family: 'Inter',
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#1e293b',
                        padding: 20
                    }
                }
            }
        });
    }
    
    /**
     * Create market demand chart
     */
    createMarketDemandChart(analysisData) {
        const canvas = document.getElementById('marketDemandChart');
        if (!canvas) return;
        
        const skillsAnalysis = analysisData.skills_analysis || {};
        const marketData = this.generateMarketDemandData(skillsAnalysis);
        
        if (!marketData) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.marketDemand = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Skills',
                    data: marketData.userSkills,
                    backgroundColor: '#3b82f6',
                    borderColor: '#1d4ed8',
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 10
                }, {
                    label: 'High Demand Skills',
                    data: marketData.highDemandSkills,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Market Demand (Score out of 10)',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#1e293b'
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Your Proficiency (Score out of 10)',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#1e293b'
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Skills vs Market Demand',
                        font: {
                            family: 'Inter',
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#1e293b',
                        padding: 20
                    }
                }
            }
        });
    }
    
    /**
     * Create career path progress chart
     */
    createCareerPathChart(analysisData) {
        const canvas = document.getElementById('careerPathChart');
        if (!canvas) return;
        
        const careerPathData = this.generateCareerPathData(analysisData);
        
        if (!careerPathData) return;
        
        const ctx = canvas.getContext('2d');
        
        this.charts.careerPath = new Chart(ctx, {
            type: 'line',
            data: {
                labels: careerPathData.labels,
                datasets: [{
                    label: 'Career Progress',
                    data: careerPathData.progress,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Target Level',
                    data: careerPathData.target,
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    fill: false,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Skill Level (%)',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#1e293b'
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Career Milestones',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '500'
                            },
                            color: '#1e293b'
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: 'Career Development Path',
                        font: {
                            family: 'Inter',
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#1e293b',
                        padding: 20
                    }
                }
            }
        });
    }
    
    /**
     * Extract skills data from analysis
     */
    extractSkillsData(skillsAnalysis) {
        const data = { labels: [], values: [] };
        
        Object.entries(skillsAnalysis).forEach(([category, skills]) => {
            if (Array.isArray(skills) && skills.length > 0) {
                const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                data.labels.push(categoryName);
                data.values.push(skills.length);
            }
        });
        
        return data;
    }
    
    /**
     * Generate experience data for radar chart
     */
    generateExperienceData(experienceAnalysis) {
        const baseData = {
            labels: ['Technical Depth', 'Leadership', 'Communication', 'Problem Solving', 'Innovation', 'Mentoring'],
            userData: [75, 60, 80, 85, 70, 65], // Mock data based on analysis
            industryData: [70, 65, 75, 80, 70, 60] // Industry average
        };
        
        // Adjust based on actual analysis
        if (experienceAnalysis.estimated_level === 'Senior') {
            baseData.userData = [85, 80, 85, 90, 80, 85];
        } else if (experienceAnalysis.estimated_level === 'Junior') {
            baseData.userData = [60, 40, 70, 65, 50, 35];
        }
        
        return baseData;
    }
    
    /**
     * Generate market demand data for scatter chart
     */
    generateMarketDemandData(skillsAnalysis) {
        // Mock data - in real implementation, this would come from market analysis
        const userSkills = [
            { x: 8, y: 7, label: 'JavaScript' },
            { x: 9, y: 6, label: 'Python' },
            { x: 7, y: 8, label: 'React' },
            { x: 6, y: 5, label: 'Node.js' }
        ];
        
        const highDemandSkills = [
            { x: 9, y: 4, label: 'Kubernetes' },
            { x: 8, y: 3, label: 'Docker' },
            { x: 9, y: 2, label: 'AI/ML' },
            { x: 8, y: 5, label: 'Cloud Native' }
        ];
        
        return { userSkills, highDemandSkills };
    }
    
    /**
     * Generate career path data for line chart
     */
    generateCareerPathData(analysisData) {
        const experienceLevel = analysisData.experience_analysis?.estimated_level || 'Mid-Level';
        
        const paths = {
            'Junior': {
                labels: ['Current', '6 Months', '1 Year', '2 Years', '3 Years'],
                progress: [40, 55, 70, 80, 90],
                target: [50, 65, 75, 85, 95]
            },
            'Mid-Level': {
                labels: ['Current', '6 Months', '1 Year', '2 Years', 'Senior'],
                progress: [60, 70, 80, 88, 95],
                target: [65, 75, 85, 90, 98]
            },
            'Senior': {
                labels: ['Current', 'Lead', 'Principal', 'Architect', 'Expert'],
                progress: [75, 82, 88, 92, 96],
                target: [80, 85, 90, 94, 98]
            }
        };
        
        return paths[experienceLevel] || paths['Mid-Level'];
    }
    
    /**
     * Create a custom progress chart
     */
    createProgressChart(canvasId, currentValue, targetValue, label) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const percentage = Math.min((currentValue / targetValue) * 100, 100);
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: ['#3b82f6', '#f1f5f9'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }
    
    /**
     * Create skill proficiency chart
     */
    createSkillProficiencyChart(skills) {
        if (!skills || skills.length === 0) return;
        
        const canvas = document.getElementById('skillProficiencyChart');
        if (!canvas) return;
        
        const data = {
            labels: skills.map(skill => skill.name || skill),
            datasets: [{
                label: 'Proficiency Level',
                data: skills.map(skill => this.getProficiencyScore(skill.proficiency)),
                backgroundColor: skills.map(skill => this.getProficiencyColor(skill.proficiency)),
                borderColor: skills.map(skill => this.getProficiencyColor(skill.proficiency, true)),
                borderWidth: 2,
                borderRadius: 6
            }]
        };
        
        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#1e293b'
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Get proficiency score for skill level
     */
    getProficiencyScore(proficiency) {
        const scores = {
            'Advanced': 90,
            'Intermediate': 70,
            'Beginner': 50,
            'Not specified': 60
        };
        return scores[proficiency] || 60;
    }
    
    /**
     * Get color for proficiency level
     */
    getProficiencyColor(proficiency, border = false) {
        const colors = {
            'Advanced': border ? '#059669' : '#10b981',
            'Intermediate': border ? '#d97706' : '#f59e0b',
            'Beginner': border ? '#dc2626' : '#ef4444',
            'Not specified': border ? '#64748b' : '#94a3b8'
        };
        return colors[proficiency] || colors['Not specified'];
    }
    
    /**
     * Update chart data
     */
    updateChart(chartId, newData) {
        const chart = this.charts[chartId];
        if (!chart) return;
        
        chart.data = newData;
        chart.update('active');
    }
    
    /**
     * Destroy chart
     */
    destroyChart(chartId) {
        const chart = this.charts[chartId];
        if (chart) {
            chart.destroy();
            delete this.charts[chartId];
        }
    }
    
    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartId => {
            this.destroyChart(chartId);
        });
    }
    
    /**
     * Resize charts
     */
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }
    
    /**
     * Export chart as image
     */
    exportChart(chartId, filename) {
        const chart = this.charts[chartId];
        if (!chart) return;
        
        const url = chart.toBase64Image();
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.png`;
        a.click();
    }
    
    /**
     * Create animated counter
     */
    createAnimatedCounter(elementId, targetValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let startValue = 0;
        const increment = targetValue / (duration / 16);
        const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= targetValue) {
                startValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(startValue);
        }, 16);
    }
    
    /**
     * Create skill level indicators
     */
    createSkillLevelIndicators(skills) {
        const container = document.getElementById('skillLevelsContainer');
        if (!container) return;
        
        container.innerHTML = skills.map(skill => {
            const level = skill.proficiency || 'Not specified';
            const score = this.getProficiencyScore(level);
            const color = this.getProficiencyColor(level);
            
            return `
                <div class="skill-level-indicator">
                    <div class="skill-name">${skill.name || skill}</div>
                    <div class="level-bar">
                        <div class="level-fill" style="width: ${score}%; background-color: ${color};"></div>
                    </div>
                    <div class="level-label">${level}</div>
                </div>
            `;
        }).join('');
    }
}

// Global chart manager instance
let chartManager;

/**
 * Initialize charts for the application
 */
function initializeCharts(analysisData) {
    if (!chartManager) {
        chartManager = new ChartManager();
    }
    
    // Clear existing charts
    chartManager.destroyAllCharts();
    
    // Initialize new charts
    chartManager.initCharts(analysisData);
    
    // Set up chart data
    if (analysisManager && analysisManager.currentAnalysis) {
        analysisManager.setCurrentAnalysis(analysisData);
    }
    
    // Create animated counters for scores
    setTimeout(() => {
        if (analysisData.scores) {
            Object.entries(analysisData.scores).forEach(([key, value]) => {
                if (value > 0) {
                    chartManager.createAnimatedCounter(`score-${key}`, value);
                }
            });
        }
    }, 500);
}

/**
 * Update existing charts with new data
 */
function updateCharts(analysisData) {
    if (chartManager && analysisData) {
        chartManager.initCharts(analysisData);
    }
}

/**
 * Export all charts
 */
function exportAllCharts() {
    if (!chartManager) return;
    
    Object.keys(chartManager.charts).forEach(chartId => {
        chartManager.exportChart(chartId, `chart-${chartId}-${Date.now()}`);
    });
}

// Make functions available globally
window.initializeCharts = initializeCharts;
window.updateCharts = updateCharts;
window.exportAllCharts = exportAllCharts;
window.chartManager = chartManager;

// Handle window resize
window.addEventListener('resize', function() {
    if (chartManager) {
        chartManager.resizeCharts();
    }
});

// Handle chart-related animations
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for chart animations
    const style = document.createElement('style');
    style.textContent = `
        .skill-level-indicator {
            margin-bottom: 1rem;
        }
        
        .skill-name {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .level-bar {
            width: 100%;
            height: 8px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .level-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1s ease-in-out;
        }
        
        .level-label {
            font-size: 0.875rem;
            color: var(--text-muted);
        }
        
        .chart-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: var(--text-muted);
        }
        
        .chart-error {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: var(--text-muted);
            text-align: center;
        }
    `;
    document.head.appendChild(style);
});