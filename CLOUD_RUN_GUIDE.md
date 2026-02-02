# Google Cloud Run Deployment Guide ☁️

Complete guide to deploying your Flask app on Google Cloud Run.

## What is Cloud Run?

**Cloud Run** is Google's serverless container platform. Here's how it works:

```
Your Code → Docker Container → Cloud Run → Public URL
```

### Key Concepts

1. **Containers**: Your app is packaged with all its dependencies into a container
2. **Serverless**: Google manages servers, you just deploy code
3. **Auto-scaling**: Automatically scales from 0 to 1000s of instances
4. **Pay-per-use**: Only pay when requests are being processed

### How it Differs from Traditional Hosting

| Traditional (like EC2) | Cloud Run |
|------------------------|-----------|
| Server always running | Scales to zero when idle |
| Fixed capacity | Auto-scales with traffic |
| Pay for server time | Pay per request |
| You manage OS, updates | Google manages everything |
| Minutes to scale | Milliseconds to scale |

## Prerequisites

### 1. Install Google Cloud SDK

**macOS:**
```bash
brew install google-cloud-sdk
```

**Windows/Linux:**
Download from: https://cloud.google.com/sdk/docs/install

### 2. Verify Installation
```bash
gcloud --version
```

### 3. Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name it: `flask-tutorial` (or whatever you want)
4. Note your **Project ID** (e.g., `flask-tutorial-123456`)

### 4. Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry (for storing Docker images)
gcloud services enable containerregistry.googleapis.com

# Enable Artifact Registry (newer, recommended)
gcloud services enable artifactregistry.googleapis.com
```

## Deployment Methods

### Method 1: Direct Deploy (Easiest)

Cloud Run can build your Docker image automatically!

#### Step 1: Initialize gcloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Set default region (choose closest to you)
gcloud config set run/region us-central1
```

#### Step 2: Deploy

```bash
# Deploy directly from source code
gcloud run deploy flask-tutorial \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**What this does:**
1. Detects your Dockerfile
2. Builds a container image
3. Pushes image to Google Container Registry
4. Deploys to Cloud Run
5. Returns a public URL

#### Step 3: Set Environment Variables

```bash
# Generate a secret key
SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")

# Set environment variables
gcloud run services update flask-tutorial \
  --update-env-vars SECRET_KEY=$SECRET_KEY,FLASK_ENV=production
```

#### Step 4: Visit Your App

```bash
# Get the URL
gcloud run services describe flask-tutorial --format='value(status.url)'
```

You'll get a URL like: `https://flask-tutorial-abc123-uc.a.run.app`

---

### Method 2: Build Locally Then Deploy

More control over the build process.

#### Step 1: Build Docker Image

```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/flask-tutorial:v1 .

# Test locally
docker run -p 8080:8080 \
  -e SECRET_KEY=test-key \
  -e FLASK_ENV=production \
  gcr.io/YOUR_PROJECT_ID/flask-tutorial:v1

# Visit http://localhost:8080
```

#### Step 2: Push to Google Container Registry

```bash
# Configure Docker to use gcloud credentials
gcloud auth configure-docker

# Push the image
docker push gcr.io/YOUR_PROJECT_ID/flask-tutorial:v1
```

#### Step 3: Deploy to Cloud Run

```bash
gcloud run deploy flask-tutorial \
  --image gcr.io/YOUR_PROJECT_ID/flask-tutorial:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SECRET_KEY=your-secret-key,FLASK_ENV=production
```

---

### Method 3: Using Artifact Registry (Modern Approach)

Artifact Registry is Google's newer service (replaces Container Registry).

#### Step 1: Create Artifact Registry Repository

```bash
# Create repository
gcloud artifacts repositories create flask-apps \
  --repository-format=docker \
  --location=us-central1 \
  --description="Flask applications"

# Configure Docker
gcloud auth configure-docker us-central1-docker.pkg.dev
```

#### Step 2: Build and Push

```bash
# Build
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/flask-apps/flask-tutorial:v1 .

# Push
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/flask-apps/flask-tutorial:v1
```

#### Step 3: Deploy

```bash
gcloud run deploy flask-tutorial \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/flask-apps/flask-tutorial:v1 \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Understanding the Architecture

### What Happens When You Deploy?

```
1. Code → Docker Build
   Your code is packaged into a container image

2. Image → Container Registry
   The image is stored in Google's registry

3. Deploy to Cloud Run
   Google creates your service

4. Request Arrives
   ┌─────────────────────────────────────┐
   │ User makes request                  │
   │    ↓                                │
   │ Google Load Balancer                │
   │    ↓                                │
   │ Cloud Run (spins up container)      │
   │    ↓                                │
   │ Your Flask App (in container)       │
   │    ↓                                │
   │ Response sent back                  │
   └─────────────────────────────────────┘

5. No Requests = Scale to Zero
   After ~15 minutes of inactivity, containers shut down
   You pay $0 during this time!
```

### Container Lifecycle

```
COLD START (first request)
├─ Load container image (~1-2 seconds)
├─ Start Python runtime
├─ Import Flask and your code
└─ Handle request

WARM START (subsequent requests)
└─ Container already running, instant response!

IDLE TIMEOUT (~15 minutes)
└─ Container shuts down to save costs
```

---

## Configuration Options

### Set Memory and CPU

```bash
gcloud run deploy flask-tutorial \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

**Options:**
- **Memory**: 128Mi to 32Gi (default: 512Mi)
- **CPU**: 1, 2, 4, 8 cores (default: 1)
- **Max Instances**: Limit concurrent containers (cost control)

### Set Minimum Instances (Avoid Cold Starts)

```bash
gcloud run deploy flask-tutorial \
  --min-instances 1
```

**Note:** Minimum instances cost money even when idle!

### Timeout Settings

```bash
gcloud run deploy flask-tutorial \
  --timeout 300
```

Default is 300 seconds (5 minutes).

### Concurrency (Requests per Container)

```bash
gcloud run deploy flask-tutorial \
  --concurrency 80
```

How many requests can one container handle simultaneously.

---

## Environment Variables and Secrets

### Using Environment Variables

```bash
# Set multiple variables
gcloud run services update flask-tutorial \
  --set-env-vars="SECRET_KEY=abc123,FLASK_ENV=production,DEBUG=false"

# From a file
gcloud run services update flask-tutorial \
  --env-vars-file=env.yaml
```

**env.yaml:**
```yaml
SECRET_KEY: "your-secret-key"
FLASK_ENV: "production"
```

### Using Secret Manager (Recommended for Secrets)

```bash
# Store secret in Secret Manager
echo -n "your-secret-key" | gcloud secrets create flask-secret-key --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding flask-secret-key \
  --member=serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Use secret in Cloud Run
gcloud run deploy flask-tutorial \
  --update-secrets=SECRET_KEY=flask-secret-key:latest
```

---

## Monitoring and Logs

### View Logs

```bash
# Stream logs in real-time
gcloud run services logs tail flask-tutorial

# View logs in Cloud Console
gcloud run services logs read flask-tutorial --limit 50
```

### Monitoring Dashboard

Visit: https://console.cloud.google.com/run

You'll see:
- Request count
- Request latency
- Container instance count
- Error rate
- Billable time

---

## Costs

### Pricing (as of 2024)

**Free Tier (per month):**
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

**After Free Tier:**
- $0.40 per million requests
- $0.00002400 per GB-second
- $0.00001000 per vCPU-second

### Example Costs

**Low traffic (100,000 requests/month):**
- Requests: FREE (under 2M)
- Compute: FREE (under limits)
- **Total: $0/month**

**Medium traffic (10M requests/month, avg 100ms response):**
- Requests: $3.20
- Compute: ~$5
- **Total: ~$8/month**

**Note:** You only pay when code is executing!

---

## Custom Domain

### Add Your Own Domain

```bash
# Map domain to service
gcloud run domain-mappings create \
  --service flask-tutorial \
  --domain tutorial.yourdomain.com
```

Then add DNS records as instructed by gcloud.

**SSL/HTTPS:** Automatically provisioned by Google!

---

## CI/CD: Auto-Deploy from GitHub

### Option 1: Cloud Build Triggers

1. **Connect GitHub repository:**
   - Go to Cloud Build → Triggers
   - Click "Connect Repository"
   - Select your GitHub repo

2. **Create trigger:**
   ```bash
   gcloud builds triggers create github \
     --repo-name=frontend-tutorial \
     --repo-owner=YOUR_GITHUB_USERNAME \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

3. **Create cloudbuild.yaml:**

```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/flask-tutorial:$COMMIT_SHA', '.']

  # Push the image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/flask-tutorial:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'flask-tutorial'
      - '--image'
      - 'gcr.io/$PROJECT_ID/flask-tutorial:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/flask-tutorial:$COMMIT_SHA'
```

Now every push to `main` automatically deploys!

---

## Testing Locally with Docker

### Build and Run Locally

```bash
# Build
docker build -t flask-tutorial .

# Run
docker run -p 8080:8080 \
  -e SECRET_KEY=test-key \
  -e FLASK_ENV=production \
  flask-tutorial

# Visit http://localhost:8080
```

### Debug Container Issues

```bash
# Run interactively
docker run -it flask-tutorial /bin/bash

# Check logs
docker logs <container-id>

# Inspect
docker inspect flask-tutorial
```

---

## Troubleshooting

### Common Issues

**"Cannot pull image":**
```bash
gcloud auth configure-docker
```

**"Permission denied":**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**"Service not found":**
Check region:
```bash
gcloud run services list
```

**Cold starts too slow:**
- Optimize Dockerfile (use smaller base image)
- Set `--min-instances 1` (costs money)
- Reduce dependencies

**Port issues:**
Make sure your app listens on `0.0.0.0:$PORT` (not `localhost`)

---

## Comparison: Cloud Run vs Other Options

| Feature | Cloud Run | AWS Lambda | Render | Traditional VPS |
|---------|-----------|------------|--------|-----------------|
| **Pricing** | Pay per request | Pay per invocation | Flat monthly | Flat monthly |
| **Cold starts** | 1-2 seconds | 100ms-5s | None (always on) | None |
| **Scale to zero** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Max timeout** | 60 minutes | 15 minutes | None | None |
| **Custom domains** | ✅ Free SSL | ✅ Paid | ✅ Free SSL | ✅ Manual |
| **Learning curve** | Medium | Medium | Easy | Hard |
| **Best for** | APIs, web apps | Event-driven | Simple apps | Full control |

---

## Next Steps

Once deployed:

1. **Add a Database:**
   - Use Cloud SQL (PostgreSQL/MySQL)
   - Or connect to external database

2. **Add Cloud Storage:**
   - Use Google Cloud Storage for files
   - Perfect for data engineering use cases

3. **Set up Monitoring:**
   - Cloud Monitoring for metrics
   - Cloud Logging for logs
   - Error Reporting for exceptions

4. **Implement CI/CD:**
   - Auto-deploy from GitHub
   - Run tests before deployment

5. **Add Authentication:**
   - Use Firebase Auth or Cloud Identity
   - Protect sensitive endpoints

---

## Quick Command Reference

```bash
# Deploy from source
gcloud run deploy flask-tutorial --source .

# View logs
gcloud run services logs tail flask-tutorial

# Get URL
gcloud run services describe flask-tutorial --format='value(status.url)'

# Update environment variables
gcloud run services update flask-tutorial --set-env-vars="KEY=value"

# Delete service
gcloud run services delete flask-tutorial

# List all services
gcloud run services list

# Describe service (see all settings)
gcloud run services describe flask-tutorial
```

---

## Why Cloud Run for Data Engineers?

1. **Cost-effective for sporadic workloads**
   - Data pipeline endpoints that run occasionally
   - Internal tools used infrequently

2. **Easy to integrate with GCP data services**
   - BigQuery for analytics
   - Cloud Storage for data lakes
   - Dataflow for streaming

3. **Scales with data volume**
   - Handle sudden spike in API requests
   - Process batch uploads

4. **No infrastructure management**
   - Focus on code, not servers
   - Google handles scaling, security, updates

---

**You're now ready to deploy to Cloud Run!** 🚀

Start with the simple "Direct Deploy" method, then explore more advanced options as needed.
