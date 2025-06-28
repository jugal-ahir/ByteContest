# 🚀 ByteContest Deployment Guide

This guide will help you deploy ByteContest to production.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting
3. **RapidAPI Account** - For Judge0 API access
4. **Render Account** (or other platform) - For hosting

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create a `.env` file in your server directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
DB_NAME=your_database_name

# JWT Configuration
ACCESS_TOKEN_SECRET=your_very_long_random_secret_key_here
ACCESS_TOKEN_EXPIRY=5h

# Server Configuration
PORT=8000
NODE_ENV=production

# CORS Configuration (Update after deployment)
CORS_ORIGIN=https://your-frontend-domain.com

# Judge0 API Configuration
RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
RAPIDAPI_KEY=your_rapidapi_key_here
```

### 2. Update Frontend API URL

In `client/src/api/`, update all service files:

```typescript
// Change from:
private url = "http://localhost:8000";

// To:
private url = "https://your-backend-domain.com";
```

## 🌐 Deploy on Render (Recommended)

### Backend Deployment

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `bytecontest-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (in the Environment tab)
6. **Deploy**: Click "Create Web Service"

### Frontend Deployment

1. **Click "New +" → "Static Site"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `bytecontest-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

5. **Deploy**: Click "Create Static Site"

### Update CORS

After both are deployed:
1. Go to your backend service settings
2. Update `CORS_ORIGIN` to your frontend URL
3. Redeploy the backend

## 🔍 Post-Deployment Checklist

### ✅ Backend Verification

1. **Test API endpoints:**
   ```bash
   curl https://your-backend-domain.com/
   # Should return "Hello World"
   ```

2. **Check database connection** in backend logs
3. **Test authentication** via frontend

### ✅ Frontend Verification

1. **Check if frontend loads**
2. **Test login/register functionality**
3. **Test contest creation and participation**
4. **Test code submission**

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check if `CORS_ORIGIN` is set correctly
   - Ensure frontend URL is in allowed origins

2. **Database Connection Issues:**
   - Verify MongoDB URI is correct
   - Check if IP is whitelisted in MongoDB Atlas

3. **Build Failures:**
   - Check if all dependencies are in `package.json`
   - Verify TypeScript compilation

4. **Environment Variables:**
   - Ensure all variables are set in your hosting platform
   - Check for typos in variable names

## 🎉 Congratulations!

Your ByteContest application is now deployed and ready for production use!

---

**Need Help?**
- Check the troubleshooting section above
- Review your hosting platform's documentation
- Check the application logs for specific error messages 