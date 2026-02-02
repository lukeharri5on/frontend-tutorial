"""
Flask Tutorial Application
==========================
This is a beginner-friendly Flask application that demonstrates:
1. Setting up a Flask web server
2. Creating routes (URLs that users can visit)
3. Rendering HTML templates
4. Serving static files (CSS, JavaScript)
5. Working with data (relevant for data engineers!)

Flask is a "micro" web framework - it's lightweight and easy to learn.
"""

# Import the Flask class and helper functions
from flask import Flask, render_template, jsonify
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

# Create a Flask application instance
# __name__ helps Flask know where to look for templates and static files
app = Flask(__name__)

# Configure the app (settings)
# In production, SECRET_KEY should come from environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'


# ============================================================================
# ROUTES: These define what happens when users visit different URLs
# ============================================================================

@app.route('/')
def home():
    """
    The home page route

    When someone visits http://localhost:5000/ this function runs.
    The @app.route decorator tells Flask which URL triggers this function.

    render_template() loads an HTML file from the 'templates' folder
    and sends it to the user's browser.
    """
    return render_template('index.html',
                         title='Home',
                         current_year=datetime.now().year)


@app.route('/about')
def about():
    """
    The about page route

    This demonstrates how to create multiple pages in your web app.
    Each route function can render a different template.
    """
    # You can pass data from Python to your HTML templates
    team_members = [
        {'name': 'Alice', 'role': 'Data Engineer'},
        {'name': 'Bob', 'role': 'ML Engineer'},
        {'name': 'Carol', 'role': 'Analytics Lead'}
    ]

    return render_template('about.html',
                         title='About Us',
                         team=team_members)


@app.route('/dashboard')
def dashboard():
    """
    A data dashboard page

    This is especially relevant for data engineers!
    Shows how to display data visualizations on a web page.
    """
    return render_template('dashboard.html', title='Data Dashboard')


@app.route('/api/data')
def get_data():
    """
    An API endpoint that returns JSON data

    This is how you build APIs with Flask. Instead of returning HTML,
    it returns JSON data that can be consumed by JavaScript or other applications.

    In real applications, this data would come from a database or data pipeline.
    """
    # Sample data - in a real app, this might come from a database or analytics pipeline
    sample_data = {
        'labels': ['January', 'February', 'March', 'April', 'May', 'June'],
        'values': [65, 59, 80, 81, 56, 55],
        'timestamp': datetime.now().isoformat()
    }

    # jsonify converts Python dictionaries to JSON format
    return jsonify(sample_data)


# ============================================================================
# ERROR HANDLERS: Handle errors gracefully
# ============================================================================

@app.errorhandler(404)
def page_not_found(e):
    """
    Custom 404 error page

    When users visit a URL that doesn't exist, show a friendly error page
    instead of the default browser error.
    """
    return render_template('404.html'), 404


# ============================================================================
# RUN THE APPLICATION
# ============================================================================

if __name__ == '__main__':
    """
    This runs the Flask development server.

    debug=True means:
    - The server auto-restarts when you change code
    - You see detailed error messages (helpful for learning!)

    WARNING: Never use debug=True in production!
    In production, use a proper WSGI server like Gunicorn instead.
    """
    # Determine if we're in development or production
    is_development = os.environ.get('FLASK_ENV') != 'production'

    if is_development:
        print("=" * 60)
        print("🚀 Starting Flask Tutorial Application (Development Mode)")
        print("=" * 60)
        print("📖 Visit these URLs in your browser:")
        print("   • Home:      http://localhost:5000/")
        print("   • About:     http://localhost:5000/about")
        print("   • Dashboard: http://localhost:5000/dashboard")
        print("   • API Data:  http://localhost:5000/api/data")
        print("=" * 60)
        print("Press CTRL+C to stop the server")
        print("=" * 60)

    # Only use debug mode in development
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=is_development, host='0.0.0.0', port=port)
