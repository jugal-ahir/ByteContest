# 🚀 ByteContest Production Deployment Guide

This guide will help you deploy ByteContest to production on Render.com, making it accessible to all your students.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting
3. **RapidAPI Account** - For Judge0 API access
4. **Render Account** - For hosting (free tier available)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 1.2 Verify Your Environment Variables
Make sure you have these values ready:
- MongoDB Atlas connection string
- RapidAPI key for Judge0
- Strong JWT secrets

## 🌐 Step 2: Deploy on Render.com

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Deploy Backend First

1. **Click "New +" → "Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `bytecontest-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables** (in the Environment tab):
   ```
   NODE_ENV=production
   PORT=8000
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=bytecontest
   ACCESS_TOKEN_SECRET=your_very_long_random_secret_key_here
   ACCESS_TOKEN_EXPIRY=1d
   JWT_CONTEST_SECRET=your_contest_jwt_secret_here
   JWT_CONTEST_EXPIRY=2h
   RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
   RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
   RAPIDAPI_KEY=your_rapidapi_key_here
   CORS_ORIGIN=https://your-frontend-domain.onrender.com
   ```

5. **Deploy**: Click "Create Web Service"

### 2.3 Deploy Frontend

1. **Click "New +" → "Static Site"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `bytecontest-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   VITE_SERVER_URL=https://your-backend-domain.onrender.com
   VITE_SOCKET_URL=https://your-backend-domain.onrender.com
   VITE_RAPIDAPI_URL=https://judge0-ce.p.rapidapi.com
   VITE_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

5. **Deploy**: Click "Create Static Site"

### 2.4 Update CORS Configuration

After both services are deployed:
1. Go to your backend service settings
2. Update `CORS_ORIGIN` to your frontend URL
3. Redeploy the backend

## 🔍 Step 3: Post-Deployment Verification

### 3.1 Backend Testing
```bash
# Test API health
curl https://your-backend-domain.onrender.com/
# Should return "Hello World"

# Test database connection
# Check backend logs for successful MongoDB connection
```

### 3.2 Frontend Testing
1. **Load the frontend URL**
2. **Test user registration/login**
3. **Test contest creation (admin)**
4. **Test contest participation (student)**
5. **Test code submission and execution**

### 3.3 Critical Features Testing
- ✅ User authentication
- ✅ Contest creation and management
- ✅ Problem creation and editing
- ✅ Code submission and execution
- ✅ Real-time leaderboard
- ✅ Assignment system
- ✅ Admin dashboard

## 🛠️ Step 4: Production Optimizations

### 4.1 Security Enhancements
1. **Generate strong JWT secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Update MongoDB Atlas security**:
   - Whitelist Render.com IP addresses
   - Use strong database passwords

3. **Environment variable security**:
   - Never commit `.env` files to Git
   - Use Render's environment variable system

### 4.2 Performance Optimizations
1. **Enable Render's auto-scaling** (if needed)
2. **Monitor application performance**
3. **Set up logging and monitoring**

## 🚨 Troubleshooting Common Issues

### Issue 1: CORS Errors
**Symptoms**: Frontend can't connect to backend
**Solution**: 
- Check `CORS_ORIGIN` in backend environment variables
- Ensure frontend URL is correctly set

### Issue 2: Database Connection Failures
**Symptoms**: Backend fails to start
**Solution**:
- Verify MongoDB URI is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Issue 3: Build Failures
**Symptoms**: Deployment fails during build
**Solution**:
- Check if all dependencies are in `package.json`
- Verify TypeScript compilation
- Check for syntax errors

### Issue 4: Code Execution Not Working
**Symptoms**: Judge0 API calls fail
**Solution**:
- Verify RapidAPI key is correct
- Check API usage limits
- Ensure Judge0 service is available

## 📊 Monitoring and Maintenance

### 4.1 Regular Checks
- Monitor Render dashboard for service health
- Check MongoDB Atlas for database performance
- Monitor RapidAPI usage and limits

### 4.2 Backup Strategy
- MongoDB Atlas provides automatic backups
- Consider backing up important data regularly

### 4.3 Updates and Maintenance
- Keep dependencies updated
- Monitor for security patches
- Test updates in development first

## 🎉 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loading
- [ ] Database connection working
- [ ] User authentication functional
- [ ] Contest creation working
- [ ] Code execution working
- [ ] Real-time features working
- [ ] Admin dashboard accessible
- [ ] Students can register and participate
- [ ] All features tested and working

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render.com documentation
3. Check application logs in Render dashboard
4. Verify all environment variables are set correctly

---

**Your ByteContest application is now ready for production use! 🚀**

Students can access your platform at: `https://your-frontend-domain.onrender.com` 