# Deployment Guide 🚀

This guide explains how to deploy your Flask application to make it publicly accessible.

## Prerequisites

Before deploying, make sure you have:
- Your code pushed to GitHub (most platforms deploy from Git)
- Updated your `requirements.txt` with production dependencies
- Configured environment variables properly

## Quick Start: Install Production Dependencies

```bash
pip install -r requirements.txt
```

This now includes:
- **Gunicorn**: Production WSGI server (replaces Flask's dev server)
- **python-dotenv**: For environment variables

## Deployment Options

### 🟢 Option 1: Render (Recommended for Beginners)

**Pros:** Free tier, easiest setup, auto-deploys from GitHub
**Cons:** Free tier has limited resources and spins down after inactivity

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Sign up at [Render.com](https://render.com)**

3. **Create a New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect it's a Python app

4. **Configure the service:**
   - **Name:** `flask-tutorial` (or whatever you want)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`

5. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add: `SECRET_KEY` = `your-random-secret-key-here`
   - Add: `FLASK_ENV` = `production`

6. **Deploy!**
   - Click "Create Web Service"
   - Wait 2-5 minutes for the build
   - You'll get a URL like: `https://flask-tutorial-abc123.onrender.com`

#### Auto-Deploy:
Every time you push to GitHub, Render automatically redeploys!

---

### 🟢 Option 2: Railway

**Pros:** Very simple, generous free tier, great CLI
**Cons:** Credit card required (but free tier exists)

#### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g railway
   # or
   brew install railway
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set SECRET_KEY=your-secret-key-here
   railway variables set FLASK_ENV=production
   ```

5. **Get your URL**
   ```bash
   railway domain
   ```

---

### 🟡 Option 3: AWS Elastic Beanstalk

**Pros:** Fully managed, auto-scaling, AWS ecosystem
**Cons:** More complex, costs money (free tier for 12 months)

#### Steps:

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   eb init -p python-3.11 flask-tutorial
   ```

3. **Create environment and deploy**
   ```bash
   eb create flask-tutorial-env
   ```

4. **Set environment variables**
   ```bash
   eb setenv SECRET_KEY=your-secret-key-here FLASK_ENV=production
   ```

5. **Open your app**
   ```bash
   eb open
   ```

#### Future deploys:
```bash
eb deploy
```

---

### 🟡 Option 4: Google Cloud Run

**Pros:** Serverless, pay-per-use, scales to zero
**Cons:** Requires Docker knowledge

#### Steps:

1. **Create a Dockerfile** (see below)

2. **Install gcloud CLI** from [cloud.google.com](https://cloud.google.com/sdk/docs/install)

3. **Initialize and deploy**
   ```bash
   gcloud init
   gcloud run deploy flask-tutorial --source .
   ```

4. **Follow the prompts** and you'll get a public URL

---

### 🟡 Option 5: Traditional VPS (DigitalOcean, Linode, AWS EC2)

**Pros:** Full control, cost-effective for high traffic
**Cons:** Most complex, you manage everything

This requires:
- Setting up a Linux server
- Installing Python, Nginx, and Gunicorn
- Configuring a reverse proxy
- Setting up SSL certificates

This is more advanced - start with Render or Railway first!

---

## Required Files for Deployment

### 1. Procfile
Already created! Tells platforms how to run your app:
```
web: gunicorn app:app
```

### 2. requirements.txt
Updated with production dependencies:
```
Flask==3.0.0
gunicorn==21.2.0
python-dotenv==1.0.0
```

### 3. Dockerfile (Optional - for Docker-based platforms)

Create this file if deploying to Cloud Run or using containers:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080
ENV PORT=8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

---

## Environment Variables

Set these in your deployment platform:

| Variable | Value | Description |
|----------|-------|-------------|
| `SECRET_KEY` | Random string | Used for session security (generate with: `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `FLASK_ENV` | `production` | Disables debug mode |
| `PORT` | Usually auto-set | Port to run on (Render, Railway set this automatically) |

### Generate a secure SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and use it as your SECRET_KEY.

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] `debug=False` in production (handled by FLASK_ENV)
- [ ] SECRET_KEY is set from environment variable
- [ ] Requirements.txt includes all dependencies
- [ ] `.env` is in `.gitignore` (never commit secrets!)
- [ ] Code is pushed to GitHub
- [ ] All routes work locally

---

## Testing Production Mode Locally

Before deploying, test production mode on your machine:

```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export SECRET_KEY="your-secret-key-here"
export FLASK_ENV="production"

# Run with Gunicorn (production server)
gunicorn app:app

# Visit http://localhost:8000
```

---

## Monitoring and Debugging in Production

### View Logs
- **Render:** Dashboard → Logs tab
- **Railway:** `railway logs`
- **AWS EB:** `eb logs`

### Common Issues

**App won't start:**
- Check logs for errors
- Verify `requirements.txt` is correct
- Make sure environment variables are set

**502/504 errors:**
- App is taking too long to start
- Check if PORT environment variable is correct
- Look for errors in startup logs

**Static files not loading:**
- Check that `static/` folder is included in deployment
- Verify CSS/JS paths use `url_for('static', filename='...')`

---

## Cost Comparison

| Platform | Free Tier | Paid Plans Start At |
|----------|-----------|---------------------|
| **Render** | ✅ Yes (with limits) | $7/month |
| **Railway** | ✅ $5 free credit/month | $0.000231/GB-hr |
| **Fly.io** | ✅ Generous free tier | $1.94/month |
| **AWS EB** | ✅ 12 months free | ~$15/month |
| **GCP Cloud Run** | ✅ 2M requests/month | Pay per use |
| **PythonAnywhere** | ✅ Limited free tier | $5/month |

**Recommendation for learning:** Start with Render or Railway's free tier.

---

## Scaling Considerations

As your app grows:

1. **Add a Database:**
   - Use PostgreSQL or MySQL (most platforms offer managed databases)
   - Update your code to use SQLAlchemy

2. **Add Caching:**
   - Use Redis for caching API responses
   - Reduces database load

3. **Enable HTTPS:**
   - Most platforms (Render, Railway) provide free SSL certificates
   - Always use HTTPS in production

4. **Monitor Performance:**
   - Use tools like Sentry for error tracking
   - Monitor response times and resource usage

5. **Implement CI/CD:**
   - GitHub Actions for automated testing
   - Auto-deploy only if tests pass

---

## Next Steps for Data Engineers

Once deployed, you can:

1. **Add a PostgreSQL database** for storing data
2. **Create data pipeline endpoints** that process uploaded files
3. **Integrate with S3/GCS** for data storage
4. **Add authentication** to protect sensitive endpoints
5. **Build dashboards** that query your data warehouse
6. **Expose ML models** as API endpoints

---

## Getting Help

- **Platform Docs:**
  - [Render Documentation](https://render.com/docs)
  - [Railway Documentation](https://docs.railway.app)
  - [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)

- **Flask Deployment:**
  - [Official Flask Deployment Guide](https://flask.palletsprojects.com/en/latest/deploying/)

---

## Quick Command Reference

```bash
# Test production mode locally
gunicorn app:app

# Generate secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Check what will be deployed
git ls-files

# View running processes
ps aux | grep gunicorn

# Check if port is in use
lsof -i :8000
```

---

**Remember:** Start simple with Render or Railway, learn the basics, then move to more complex platforms like AWS as needed!
