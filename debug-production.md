# 🔍 Production Debug Guide

## Issue: 500 Error on `/api/v1/problems/all` after login

### 🔍 **Step-by-Step Debug Process:**

#### 1. **Check Backend Logs (Render)**
1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for errors when the frontend makes requests
5. Check for authentication middleware errors

#### 2. **Check Frontend Network Tab**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to access the problems page
4. Look for the failed request to `/api/v1/problems/all`
5. Check:
   - Request headers (is Authorization header present?)
   - Response status (500)
   - Response body (any error message?)

#### 3. **Test Authentication Token**
Add this to your browser console to check if the token exists:
```javascript
// Check if token exists in cookies
console.log("Access Token:", document.cookie);

// Check if token is being sent in requests
fetch('https://your-backend-url.onrender.com/api/v1/problems/all', {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + document.cookie.split('accessToken=')[1]?.split(';')[0]
    }
}).then(r => r.json()).then(console.log).catch(console.error);
```

#### 4. **Test Backend Directly**
```bash
# Test if backend is accessible
curl https://your-backend-url.onrender.com/

# Test authentication endpoint
curl -X POST https://your-backend-url.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"test@test.com","userPassword":"password"}'
```

### 🛠️ **Common Solutions:**

#### **Solution A: Cookie Domain Issue**
If cookies aren't being sent:
1. Update cookie configuration in `server/src/controllers/auth.controller.ts`
2. Ensure `sameSite: 'none'` and `secure: true` in production
3. Redeploy backend

#### **Solution B: CORS Configuration**
If CORS errors:
1. Check `CORS_ORIGIN` in Render environment variables
2. Ensure it matches your Vercel frontend URL exactly
3. Redeploy backend

#### **Solution C: Environment Variables**
If authentication fails:
1. Check `ACCESS_TOKEN_SECRET` in Render
2. Ensure `NODE_ENV=production` is set
3. Verify all environment variables are correct

#### **Solution D: Database Connection**
If database errors:
1. Check MongoDB Atlas connection
2. Verify IP whitelist includes Render IPs
3. Check database logs

### 📋 **Debug Checklist:**

- [ ] Backend logs show authentication errors
- [ ] Frontend sends Authorization header
- [ ] Cookie is present in browser
- [ ] CORS_ORIGIN is set correctly
- [ ] All environment variables are set
- [ ] Database connection is working
- [ ] Token is valid and not expired

### 🚨 **Emergency Fix:**

If the issue persists, try this temporary workaround:

1. **Update the frontend to use localStorage instead of cookies:**
   ```javascript
   // In authService.ts, after successful login:
   localStorage.setItem('accessToken', accessToken);
   
   // In problemService.ts:
   const token = localStorage.getItem('accessToken') || getCookie("accessToken");
   ```

2. **Update the backend to accept both cookie and header tokens:**
   ```javascript
   // In auth.middleware.ts:
   const accessToken = req.cookies?.accessToken || 
                      req.header("Authorization")?.replace("Bearer ", "") ||
                      req.body?.accessToken;
   ```

### 📞 **Next Steps:**

1. Check the backend logs first
2. Test the authentication token manually
3. Verify all environment variables
4. If still failing, implement the emergency fix
5. Update this guide with your findings

---

**Remember:** The most common cause is cookie configuration in production. The `sameSite: 'none'` and `secure: true` options are crucial for cross-domain cookies. 