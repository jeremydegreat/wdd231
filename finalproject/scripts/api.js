// API Module - Handles data fetching and API interactions

const API_BASE_URL = window.location.origin;
const OPPORTUNITIES_URL = `${API_BASE_URL}/opportunities.json`;

// Fetch opportunities from local JSON file
async function fetchOpportunities() {
    try {
        const response = await fetch(OPPORTUNITIES_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate and enrich data
        return data.map(opportunity => validateAndEnrichOpportunity(opportunity));
        
    } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        
        // Return mock data as fallback
        return getMockOpportunities();
    }
}

// Fetch a single opportunity by ID
async function fetchOpportunityById(id) {
    try {
        const opportunities = await fetchOpportunities();
        return opportunities.find(opp => opp.id === parseInt(id));
    } catch (error) {
        console.error('Failed to fetch opportunity by ID:', error);
        return null;
    }
}

// Search opportunities
async function searchOpportunities(query, filters = {}) {
    try {
        let opportunities = await fetchOpportunities();
        
        // Apply search query
        if (query) {
            const searchTerm = query.toLowerCase();
            opportunities = opportunities.filter(opp => {
                const searchableText = `${opp.title} ${opp.company} ${opp.description} ${opp.location} ${opp.category}`.toLowerCase();
                return searchableText.includes(searchTerm);
            });
        }
        
        // Apply filters
        if (filters.type) {
            opportunities = opportunities.filter(opp => opp.type === filters.type);
        }
        
        if (filters.location) {
            opportunities = opportunities.filter(opp => 
                opp.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        if (filters.category) {
            opportunities = opportunities.filter(opp => opp.category === filters.category);
        }
        
        if (filters.salaryMin) {
            opportunities = opportunities.filter(opp => {
                const salary = parseSalary(opp.salary);
                return salary >= filters.salaryMin;
            });
        }
        
        return opportunities;
        
    } catch (error) {
        console.error('Failed to search opportunities:', error);
        return [];
    }
}

// Get unique values for filters
async function getFilterOptions() {
    try {
        const opportunities = await fetchOpportunities();
        
        const types = [...new Set(opportunities.map(opp => opp.type))].sort();
        const locations = [...new Set(opportunities.map(opp => opp.location))].sort();
        const categories = [...new Set(opportunities.map(opp => opp.category))].sort();
        
        return { types, locations, categories };
        
    } catch (error) {
        console.error('Failed to get filter options:', error);
        return { types: [], locations: [], categories: [] };
    }
}

// Get statistics
async function getStatistics() {
    try {
        const opportunities = await fetchOpportunities();
        
        const totalOpportunities = opportunities.length;
        const jobCount = opportunities.filter(opp => opp.type === 'Full-time' || opp.type === 'Part-time').length;
        const trainingCount = opportunities.filter(opp => opp.type === 'Training' || opp.type === 'Apprenticeship').length;
        
        const uniqueCompanies = new Set(opportunities.map(opp => opp.company)).size;
        const uniqueLocations = new Set(opportunities.map(opp => opp.location)).size;
        
        return {
            totalOpportunities,
            jobCount,
            trainingCount,
            uniqueCompanies,
            uniqueLocations,
            lastUpdated: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Failed to get statistics:', error);
        return getMockStatistics();
    }
}

// Helper function to validate and enrich opportunity data
function validateAndEnrichOpportunity(opp) {
    // Ensure all required fields exist
    const requiredFields = ['id', 'title', 'company', 'location', 'type', 'category', 'salary', 'description'];
    
    requiredFields.forEach(field => {
        if (!opp[field]) {
            opp[field] = getDefaultValue(field);
        }
    });
    
    // Ensure arrays exist
    if (!Array.isArray(opp.requirements)) {
        opp.requirements = [];
    }
    
    if (!Array.isArray(opp.benefits)) {
        opp.benefits = [];
    }
    
    // Format dates
    if (opp.posted) {
        opp.posted = new Date(opp.posted).toISOString().split('T')[0];
    }
    
    if (opp.deadline) {
        opp.deadline = new Date(opp.deadline).toISOString().split('T')[0];
    }
    
    // Add search-friendly fields
    opp.searchText = `${opp.title} ${opp.company} ${opp.location} ${opp.category} ${opp.description}`.toLowerCase();
    
    return opp;
}

// Helper function to get default values
function getDefaultValue(field) {
    const defaults = {
        id: Math.floor(Math.random() * 10000),
        title: 'Untitled Position',
        company: 'Unknown Company',
        location: 'Various Locations',
        type: 'Full-time',
        category: 'General',
        salary: 'Negotiable',
        description: 'No description available.'
    };
    
    return defaults[field] || 'N/A';
}

// Helper function to parse salary
function parseSalary(salaryString) {
    if (!salaryString || salaryString === 'Free' || salaryString === 'Negotiable') {
        return 0;
    }
    
    // Extract numbers from salary string
    const numbers = salaryString.match(/\d+/g);
    if (!numbers) return 0;
    
    // Use the first number as base salary
    return parseInt(numbers[0]);
}

// Mock data for fallback
function getMockOpportunities() {
    return [
        {
            id: 1,
            title: "Software Developer",
            company: "Tech Solutions Ltd",
            location: "Awka",
            type: "Full-time",
            category: "Technology",
            salary: "₦200,000-300,000",
            description: "We are looking for a skilled software developer to join our team...",
            requirements: ["3+ years experience", "JavaScript/React", "Node.js"],
            benefits: ["Health insurance", "Remote work", "Training"],
            posted: "2024-12-01",
            deadline: "2024-12-31"
        },
        {
            id: 2,
            title: "Digital Marketing Specialist",
            company: "Marketing Pro",
            location: "Onitsha",
            type: "Part-time",
            category: "Marketing",
            salary: "₦100,000-150,000",
            description: "Join our marketing team to handle digital campaigns...",
            requirements: ["2+ years experience", "Social media marketing", "Analytics"],
            benefits: ["Flexible hours", "Commission", "Growth opportunities"],
            posted: "2024-12-02",
            deadline: "2024-12-25"
        }
    ];
}

function getMockStatistics() {
    return {
        totalOpportunities: 25,
        jobCount: 18,
        trainingCount: 7,
        uniqueCompanies: 15,
        uniqueLocations: 8,
        lastUpdated: new Date().toISOString()
    };
}

// Export API functions
export {
    fetchOpportunities,
    fetchOpportunityById,
    searchOpportunities,
    getFilterOptions,
    getStatistics
};