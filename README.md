# Flask Tutorial for Data Engineers 🐍

A comprehensive, beginner-friendly tutorial for learning web development with Python. Perfect for data engineers who want to understand frontend and backend web technologies.

## 🎯 What You'll Learn

This tutorial teaches you how to build modern web applications using:

- **Backend:** Python with Flask framework
- **Frontend:** HTML, CSS, JavaScript
- **Data Visualization:** Chart.js for interactive dashboards
- **API Development:** RESTful APIs with JSON
- **Template Engines:** Jinja2 for dynamic HTML

## 📁 Project Structure

```
frontend-tutorial/
├── app.py                  # Main Flask application (backend logic)
├── requirements.txt        # Python dependencies
├── README.md              # This file!
│
├── static/                # Static files (served as-is)
│   ├── css/
│   │   └── style.css     # Custom styling
│   └── js/
│       └── main.js       # Custom JavaScript
│
└── templates/             # HTML templates (dynamic)
    ├── base.html          # Base template (all pages inherit from this)
    ├── index.html         # Home page
    ├── about.html         # About page
    ├── dashboard.html     # Data dashboard
    └── 404.html          # Custom error page
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A code editor (VS Code, PyCharm, etc.)
- A web browser

### Installation

1. **Create a virtual environment** (recommended):
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5000](http://localhost:5000)

## 📚 Key Concepts Explained

### Backend (Flask/Python)

#### Routes
Routes map URLs to Python functions:

```python
@app.route('/')
def home():
    return render_template('index.html')
```

When you visit `http://localhost:5000/`, Flask runs the `home()` function.

#### Templates
Templates are HTML files with placeholders for dynamic content:

```python
@app.route('/about')
def about():
    team = [{'name': 'Alice', 'role': 'Engineer'}]
    return render_template('about.html', team=team)
```

The `team` variable is passed to the HTML template and can be displayed using Jinja2 syntax.

#### APIs (JSON Endpoints)
APIs return data (usually JSON) instead of HTML:

```python
@app.route('/api/data')
def get_data():
    data = {'values': [1, 2, 3]}
    return jsonify(data)
```

This is how your frontend JavaScript fetches data from the backend.

### Frontend (HTML/CSS/JavaScript)

#### HTML (Structure)
HTML defines the structure and content of your pages:
```html
<h1>Welcome</h1>
<p>This is a paragraph.</p>
```

#### CSS (Styling)
CSS controls how elements look:
```css
h1 {
    color: blue;
    font-size: 32px;
}
```

#### JavaScript (Behavior)
JavaScript adds interactivity:
```javascript
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));
```

## 🔍 Exploring the Code

### Start Here: [app.py](app.py)

This is the heart of your application. It contains:
- **Routes:** Define which URLs your app responds to
- **View functions:** Handle requests and return responses
- **API endpoints:** Return JSON data for the frontend

Every function is heavily commented to explain what it does!

### Then Check: [templates/base.html](templates/base.html)

This is the "parent" template that all pages inherit from. It contains:
- Navigation bar
- Footer
- Common HTML structure
- Links to CSS and JavaScript files

### Next: [templates/index.html](templates/index.html)

The home page demonstrates:
- Template inheritance (`{% extends "base.html" %}`)
- Dynamic content with Jinja2
- Calling APIs from JavaScript
- Bootstrap styling

### Data Dashboard: [templates/dashboard.html](templates/dashboard.html)

Perfect for data engineers! Shows how to:
- Fetch data from Flask API
- Display interactive charts with Chart.js
- Update the UI dynamically
- Calculate and display statistics

## 🎓 Learning Path

### 1. Understand the Backend (Start Here!)
- Read through `app.py` line by line
- Notice how routes work
- Try adding a new route for `/hello` that returns "Hello World!"

### 2. Explore Templates
- Open `templates/base.html` - this is the foundation
- Look at `templates/index.html` - see how it extends base.html
- Try modifying the text and refresh your browser

### 3. Study the Frontend
- Check `static/css/style.css` - see how CSS works
- Review `static/js/main.js` - understand JavaScript basics
- Open browser DevTools (F12) to see console logs

### 4. Build Something!
Try these exercises to solidify your learning:

**Easy:**
- Add a new page `/contact` with a simple form
- Change colors in the CSS
- Add a new card to the home page

**Medium:**
- Create a new API endpoint that returns random numbers
- Display those numbers in a table on a new page
- Add a button that refreshes the data

**Advanced (for Data Engineers):**
- Integrate pandas to read a CSV file
- Create an API that returns summary statistics
- Build a dashboard with multiple charts
- Add filters to your data visualization

## 🛠️ Common Tasks

### Adding a New Page

1. **Create a route in app.py:**
   ```python
   @app.route('/my-page')
   def my_page():
       return render_template('my_page.html', title='My Page')
   ```

2. **Create the template:**
   Create `templates/my_page.html`:
   ```html
   {% extends "base.html" %}
   {% block content %}
       <h1>My New Page</h1>
       <p>Hello from my new page!</p>
   {% endblock %}
   ```

3. **Add to navigation:**
   Edit `templates/base.html` and add a link in the navbar.

### Creating an API Endpoint

```python
@app.route('/api/my-data')
def my_data():
    # In a real app, this might query a database
    data = {
        'result': 42,
        'message': 'Success!'
    }
    return jsonify(data)
```

Access it at: `http://localhost:5000/api/my-data`

### Fetching from Your API with JavaScript

```javascript
fetch('/api/my-data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Do something with the data
    });
```

## 🔗 Integrating with Data Tools

### Using pandas

```python
import pandas as pd

@app.route('/api/analytics')
def analytics():
    # Read your data
    df = pd.read_csv('data.csv')

    # Perform analysis
    summary = {
        'mean': float(df['value'].mean()),
        'median': float(df['value'].median()),
        'count': int(len(df))
    }

    return jsonify(summary)
```

### Using plotly for Visualizations

```python
import plotly.express as px
import plotly.utils

@app.route('/api/plot-data')
def plot_data():
    # Create a plotly figure
    fig = px.line(x=[1, 2, 3], y=[4, 5, 6])

    # Convert to JSON for frontend
    return jsonify(fig.to_json())
```

## 📖 Resources for Further Learning

### Flask
- [Official Flask Documentation](https://flask.palletsprojects.com/)
- [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)

### Frontend
- [MDN Web Docs](https://developer.mozilla.org/) - Best resource for HTML, CSS, JS
- [Bootstrap Documentation](https://getbootstrap.com/docs/) - CSS framework used here
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial

### Data Visualization
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Plotly Python](https://plotly.com/python/)
- [D3.js](https://d3js.org/) - Advanced visualizations

## 🐛 Troubleshooting

### Port already in use
If you see "Address already in use", another app is using port 5000:
```bash
# Find and kill the process (macOS/Linux):
lsof -ti:5000 | xargs kill -9

# Or use a different port in app.py:
app.run(debug=True, port=5001)
```

### Module not found
Make sure you're in your virtual environment and dependencies are installed:
```bash
pip install -r requirements.txt
```

### Changes not showing
Flask caches templates. Hard refresh your browser:
- Chrome/Firefox: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or restart the Flask server

### Browser console errors
Press `F12` to open DevTools and check the Console tab for JavaScript errors.

## 💡 Tips for Data Engineers

1. **Think of Flask routes like API endpoints** - You're probably familiar with REST APIs. Flask routes are just functions that respond to HTTP requests.

2. **Templates are like parameterized queries** - Just as you pass parameters to SQL queries, you pass data to templates.

3. **Static files = assets** - CSS/JS files are like static assets in data pipelines - they're served as-is.

4. **JSON is your friend** - Use `jsonify()` to return data from Flask, just like serializing objects.

5. **Integrate with your tools** - Flask works seamlessly with pandas, numpy, scikit-learn, and any Python library you use for data work.

## 🎯 Next Steps

Once you're comfortable with this tutorial:

1. **Add a database:** Learn SQLAlchemy for database operations
2. **Add authentication:** Implement user login/signup
3. **Deploy your app:** Learn about Gunicorn, Docker, and cloud platforms
4. **Build a real project:** Create a dashboard for your data pipelines!

## 🤝 Need Help?

- Check the comments in the code - every file is heavily documented
- Use browser DevTools (F12) to debug frontend issues
- Add `print()` statements in Python to debug backend issues
- Read error messages carefully - they usually tell you what's wrong!

## 📝 License

This is a tutorial project - feel free to use it however you want!

---

**Happy coding! 🚀**

Remember: Every expert was once a beginner. Take your time, experiment, and don't be afraid to break things - that's how you learn!
