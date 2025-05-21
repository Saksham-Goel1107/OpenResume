# Deploying to Render

This guide explains how to deploy OpenResume to Render from GitHub.

## Prerequisites

- A GitHub account with your OpenResume repository
- A [Render](https://render.com/) account
- A [Google AI Studio](https://ai.google.dev/) account for the Gemini API key

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create an API key in your Google AI Studio account
3. Copy the API key - you'll need it for the Render deployment

## Step 2: Deploy to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository that contains OpenResume
4. Configure the service with the following settings:
   - **Name**: Choose a name for your service (e.g., `openresume`)
   - **Runtime**: Docker
   - **Branch**: `main` (or your preferred branch)
   - **Root Directory**: Leave empty if OpenResume is in the root of your repo
   - **Instance Type**: Choose based on your needs (Free tier is available)

5. Add the environment variable:
   - Click on "Advanced" to expand the settings
   - Under "Environment Variables", add:
     - **Key**: `GEMINI_API_KEY` and `REDIS_URL`
     - **Value**: Paste your Gemini API key from Google AI Studio and redis from redis.com

6. Click "Create Web Service"

Render will automatically detect the Dockerfile and build your application. Once the deployment is complete, your OpenResume instance will be available at the provided Render URL.

## Updating Your Deployment

Any new commits to your connected GitHub repository will automatically trigger a new build and deployment on Render.

## Environment Variables

- `GEMINI_API_KEY`: Required for AI chat functionality
- `REDIS_URL`: Optional, if using Redis for persistent chat history
