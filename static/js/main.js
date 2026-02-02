/*
MAIN JAVASCRIPT FILE
====================
JavaScript adds interactivity to your web pages. While HTML is the structure
and CSS is the styling, JavaScript is the behavior.

This file runs on every page (it's included in base.html).
Use it for common functionality across your entire site.

JavaScript Basics for Python Developers:
- Similar syntax to Python but with curly braces { } and semicolons ;
- Variables: let, const (like Python variables)
- Functions: function myFunc() { } or arrow functions: () => { }
- Console.log() is like print() in Python
- Async operations are common (callbacks, promises, async/await)
*/

// ============================================================================
// INITIALIZATION
// ============================================================================

// This runs when the DOM (HTML structure) is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Flask Tutorial App Loaded');

    // Initialize any components
    highlightCurrentPage();
    addConsoleWelcomeMessage();
});


// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Highlight the current page in the navigation bar
 * Makes it clear which page the user is on
 */
function highlightCurrentPage() {
    // Get current page path
    const currentPath = window.location.pathname;

    // Find all navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Loop through links and highlight the current one
    navLinks.forEach(link => {
        // Get the href attribute of the link
        const linkPath = new URL(link.href).pathname;

        // If it matches current path, add 'active' class
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a number with commas (e.g., 1000 -> 1,000)
 * Useful for displaying large numbers in dashboards
 */
function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Format a date in a readable way
 * Similar to Python's strftime
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Show a toast notification (similar to a popup message)
 * Requires Bootstrap 5
 */
function showNotification(message, type = 'info') {
    // Create notification HTML
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// ============================================================================
// API INTERACTION HELPERS
// ============================================================================

/**
 * Generic function to fetch data from Flask API
 * Uses modern async/await syntax (similar to Python's async)
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/data')
 * @returns {Promise} - Promise that resolves to JSON data
 */
async function fetchFromAPI(endpoint) {
    try {
        console.log(`Fetching from ${endpoint}...`);

        // Fetch data (similar to Python's requests.get())
        const response = await fetch(endpoint);

        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();
        console.log('Data received:', data);

        return data;

    } catch (error) {
        // Error handling (similar to Python's try/except)
        console.error('Error fetching data:', error);
        showNotification('Error loading data. Check console for details.', 'danger');
        throw error;
    }
}

/**
 * Post data to Flask API
 * Use this when you need to send data to the server
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send (will be converted to JSON)
 * @returns {Promise} - Promise that resolves to response data
 */
async function postToAPI(endpoint, data) {
    try {
        console.log(`Posting to ${endpoint}:`, data);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)  // Convert JS object to JSON string
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response received:', responseData);

        return responseData;

    } catch (error) {
        console.error('Error posting data:', error);
        showNotification('Error sending data. Check console for details.', 'danger');
        throw error;
    }
}


// ============================================================================
// DEBUGGING & DEVELOPMENT
// ============================================================================

/**
 * Add a friendly welcome message to the browser console
 * Press F12 or right-click → Inspect to see the console
 */
function addConsoleWelcomeMessage() {
    console.log('%c Welcome to Flask Tutorial! ', 'background: #0d6efd; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Open this console (F12) to see logs and debug your JavaScript! ', 'color: #6c757d; font-size: 12px;');
    console.log('💡 Tip: Use console.log() to print variables (like print() in Python)');
}

/**
 * Log page load time (useful for performance monitoring)
 */
window.addEventListener('load', function() {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`⏱️  Page loaded in ${loadTime}ms`);
});


// ============================================================================
// INTERACTIVE FEATURES
// ============================================================================

/**
 * Add smooth scroll behavior to anchor links
 * Makes page navigation smoother
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ============================================================================
// EXPORT FOR MODULE USE (Optional)
// ============================================================================

/*
If you're using ES6 modules, you can export these functions
to use them in other JavaScript files:

export { fetchFromAPI, postToAPI, formatNumber, formatDate, showNotification };
*/


// ============================================================================
// COMPARISON: JAVASCRIPT vs PYTHON
// ============================================================================

/*
For Python developers learning JavaScript:

VARIABLES:
Python:     x = 10
JavaScript: let x = 10;  (or const x = 10; for constants)

FUNCTIONS:
Python:     def my_func(param):
                return param * 2
JavaScript: function myFunc(param) {
                return param * 2;
            }
            // Or arrow function:
            const myFunc = (param) => param * 2;

LISTS/ARRAYS:
Python:     my_list = [1, 2, 3]
JavaScript: let myArray = [1, 2, 3];

DICTIONARIES/OBJECTS:
Python:     my_dict = {"key": "value"}
JavaScript: let myObject = {key: "value"};

LOOPS:
Python:     for item in items:
                print(item)
JavaScript: for (let item of items) {
                console.log(item);
            }
            // Or:
            items.forEach(item => {
                console.log(item);
            });

CONDITIONALS:
Python:     if x > 10:
                print("big")
            elif x > 5:
                print("medium")
            else:
                print("small")

JavaScript: if (x > 10) {
                console.log("big");
            } else if (x > 5) {
                console.log("medium");
            } else {
                console.log("small");
            }

ASYNC/AWAIT (similar in both!):
Python:     async def fetch_data():
                result = await api_call()
                return result

JavaScript: async function fetchData() {
                const result = await apiCall();
                return result;
            }
*/
