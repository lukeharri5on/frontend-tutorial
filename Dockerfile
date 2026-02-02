# Dockerfile for Google Cloud Run
# =================================
# This file defines how to package your Flask app into a Docker container.
#
# Think of a Docker container as a lightweight virtual machine that includes:
# - Your Python code
# - Python runtime
# - All dependencies
# - Everything needed to run your app
#
# Cloud Run runs this container in Google's infrastructure.

# Start from an official Python base image
# This is like choosing which OS and Python version to use
FROM python:3.11-slim

# Set metadata about the image
LABEL maintainer="your-email@example.com"
LABEL description="Flask Tutorial Application for Data Engineers"

# Set the working directory inside the container
# All commands will run from this directory
WORKDIR /app

# Copy requirements first (Docker caching optimization)
# If requirements.txt doesn't change, Docker reuses the cached layer
# This makes subsequent builds faster
COPY requirements.txt .

# Install Python dependencies
# --no-cache-dir saves space by not caching pip downloads
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
# This includes: app.py, templates/, static/, etc.
COPY . .

# Expose port 8080 (Cloud Run's default port)
# This is just documentation - Cloud Run automatically routes to this port
EXPOSE 8080

# Set environment variables
# Cloud Run sets PORT=8080 automatically, but we specify it here too
ENV PORT=8080
ENV FLASK_ENV=production

# The command to run when the container starts
# Cloud Run will execute this command to start your Flask app
# Using gunicorn with these settings:
#   --bind 0.0.0.0:8080  - Listen on all interfaces, port 8080
#   --workers 1          - Number of worker processes (Cloud Run scales by adding containers)
#   --threads 8          - Number of threads per worker
#   --timeout 0          - No timeout (Cloud Run handles this)
#   app:app              - Run the 'app' object from 'app.py'
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 app:app
