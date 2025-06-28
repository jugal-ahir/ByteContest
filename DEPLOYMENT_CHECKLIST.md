# 🚀 ByteContest Deployment Checklist

## ✅ Pre-Deployment Setup

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas account created
- [ ] MongoDB database created and connection string ready
- [ ] RapidAPI account created and Judge0 API key obtained
- [ ] Render account created
- [ ] Vercel account created

## 🌐 Backend Deployment (Render)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `server`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `DB_NAME`
  - [ ] `ACCESS_TOKEN_SECRET`
  - [ ] `ACCESS_TOKEN_EXPIRY`
  - [ ] `PORT`
  - [ ] `NODE_ENV`
  - [ ] `CORS_ORIGIN` (temporary value)
  - [ ] `RAPIDAPI_URL`
  - [ ] `RAPIDAPI_HOST`
  - [ ] `RAPIDAPI_KEY`
- [ ] Deploy backend service
- [ ] Note backend URL (e.g., `https://bytecontest-backend.onrender.com`)
- [ ] Test backend health endpoint

## 🎨 Frontend Deployment (Vercel)

- [ ] Create new project on Vercel
- [ ] Import GitHub repository
- [ ] Set Root Directory to `client`
- [ ] Set Framework Preset to Vite
- [ ] Add environment variables:
  - [ ] `VITE_SERVER_URL` (set to your Render backend URL)
  - [ ] `VITE_RAPIDAPI_URL`
  - [ ] `VITE_RAPIDAPI_HOST`
  - [ ] `VITE_RAPIDAPI_KEY`
- [ ] Deploy frontend
- [ ] Note frontend URL (e.g., `https://bytecontest-frontend.vercel.app`)

## 🔗 Post-Deployment Configuration

- [ ] Update `CORS_ORIGIN` in Render to your Vercel frontend URL
- [ ] Redeploy backend (automatic)
- [ ] Test frontend-backend communication

## 🧪 Testing

- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Contest creation works (admin)
- [ ] Contest participation works
- [ ] Code submission works
- [ ] Leaderboard displays correctly
- [ ] All features work as expected

## 📊 Monitoring Setup

- [ ] Check Render logs for any errors
- [ ] Check Vercel analytics
- [ ] Monitor database connections
- [ ] Set up error tracking (optional)

## 🎉 Deployment Complete!

- [ ] Share your application URLs
- [ ] Update documentation with live URLs
- [ ] Test with real users
- [ ] Monitor performance

---

**Your Live URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-project.onrender.com`

**Need Help?**
- Check the troubleshooting section in `DEPLOYMENT.md`
- Review platform-specific documentation
- Check application logs for errors 