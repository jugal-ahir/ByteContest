# 🚀 ByteContest Deployment Guide

This guide will help you deploy ByteContest to production using **Render** for the backend and **Vercel** for the frontend.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting
3. **RapidAPI Account** - For Judge0 API access
4. **Render Account** - For backend hosting
5. **Vercel Account** - For frontend hosting

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

#### Backend Environment Variables (Render)
Create these variables in your Render dashboard:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
DB_NAME=your_database_name
ACCESS_TOKEN_SECRET=your_very_long_random_secret_key_here
ACCESS_TOKEN_EXPIRY=5h
PORT=8000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-vercel-url.vercel.app
RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
RAPIDAPI_KEY=your_rapidapi_key_here
```

#### Frontend Environment Variables (Vercel)
Create these variables in your Vercel dashboard:

```env
VITE_SERVER_URL=https://your-backend-render-url.onrender.com
VITE_RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
VITE_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

## 🌐 Deploy on Render (Backend)

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com) and sign up/login
2. Connect your GitHub account

### Step 2: Create Web Service
1. **Click "New +" → "Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service:**

   **Basic Settings:**
   - **Name**: `bytecontest-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`

   **Build & Deploy:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
1. Go to the **Environment** tab
2. Add all variables from the backend environment list above
3. **Important**: Set `CORS_ORIGIN` to your Vercel frontend URL (you'll update this after frontend deployment)

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for the build to complete
3. Note your backend URL (e.g., `https://bytecontest-backend.onrender.com`)

## 🎨 Deploy on Vercel (Frontend)

### Step 1: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub account

### Step 2: Create New Project
1. **Click "New Project"**
2. **Import your GitHub repository**
3. **Configure the project:**

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables
1. Go to **Settings → Environment Variables**
2. Add all variables from the frontend environment list above
3. **Important**: Set `VITE_SERVER_URL` to your Render backend URL

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for the build to complete
3. Note your frontend URL (e.g., `https://bytecontest-frontend.vercel.app`)

## 🔗 Update CORS Configuration

After both services are deployed:

1. **Go back to your Render backend service**
2. **Navigate to Environment tab**
3. **Update `CORS_ORIGIN`** to your Vercel frontend URL
4. **Redeploy the backend** (this will happen automatically)

## 🔍 Post-Deployment Verification

### ✅ Backend Verification

1. **Test API endpoints:**
   ```bash
   curl https://your-backend-render-url.onrender.com/
   # Should return a response
   ```

2. **Check database connection** in backend logs
3. **Test authentication** via frontend

### ✅ Frontend Verification

1. **Check if frontend loads** at your Vercel URL
2. **Test login/register functionality**
3. **Test contest creation and participation**
4. **Test code submission**

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check if `CORS_ORIGIN` is set correctly in Render
   - Ensure frontend URL is in allowed origins
   - Check browser console for specific CORS errors

2. **Database Connection Issues:**
   - Verify MongoDB URI is correct
   - Check if IP is whitelisted in MongoDB Atlas (Render IPs should be allowed)
   - Check backend logs for connection errors

3. **Build Failures:**
   - Check if all dependencies are in `package.json`
   - Verify TypeScript compilation
   - Check build logs for specific errors

4. **Environment Variables:**
   - Ensure all variables are set in your hosting platform
   - Check for typos in variable names
   - Verify variable values are correct

5. **Frontend API Calls Failing:**
   - Verify `VITE_SERVER_URL` is set correctly
   - Check if backend is running and accessible
   - Test API endpoints directly

### Debug Commands

```bash
# Test backend health
curl https://your-backend-url.onrender.com/

# Test specific API endpoint
curl https://your-backend-url.onrender.com/api/v1/auth/login

# Check environment variables in Vercel
# Go to Vercel Dashboard → Project → Settings → Environment Variables
```

## 📊 Monitoring

### Render Monitoring
- **Logs**: Available in the Render dashboard
- **Metrics**: CPU, memory usage
- **Deployments**: Automatic deployments on git push

### Vercel Monitoring
- **Analytics**: Built-in analytics dashboard
- **Performance**: Core Web Vitals
- **Deployments**: Automatic deployments on git push

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

1. **Push to GitHub main branch**
2. **Render** will automatically rebuild and deploy backend
3. **Vercel** will automatically rebuild and deploy frontend

## 🎉 Congratulations!

Your ByteContest application is now deployed and ready for production use!

### Your URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.onrender.com`

---

**Need Help?**
- Check the troubleshooting section above
- Review your hosting platform's documentation
- Check the application logs for specific error messages
- Join our community for support 