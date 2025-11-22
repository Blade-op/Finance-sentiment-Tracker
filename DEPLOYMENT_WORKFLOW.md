# How to Update Your Live Website

## 🚀 Quick Answer: **Changes appear automatically after you push to GitHub!**

Both Vercel (frontend) and Render (backend) are connected to your GitHub repository and will **automatically deploy** when you push changes.

---

## 📋 Step-by-Step Workflow

### 1. **Make Changes Locally**
   - Edit your code files (frontend or backend)
   - Test locally if needed: `npm run dev` (frontend) or `cd backend && npm start` (backend)

### 2. **Commit and Push to GitHub**
   ```bash
   cd "C:\Users\Ayush\Desktop\Stock sentiment analyser1\project"
   git add .
   git commit -m "Your change description"
   git push
   ```

### 3. **Automatic Deployment Happens**
   - ✅ **Vercel** (Frontend): Automatically detects the push and starts building
   - ✅ **Render** (Backend): Automatically detects the push and starts deploying
   - ⏱️ **Time**: Usually 2-5 minutes for each

### 4. **Check Deployment Status**
   - **Vercel**: Go to your Vercel dashboard → Your project → Deployments tab
   - **Render**: Go to your Render dashboard → Your service → Events tab
   - Wait for status to show "✅ Live" or "✓ Ready"

### 5. **See Changes Live**
   - Visit your live website URL
   - Changes should be visible immediately after deployment completes

---

## 🔍 How to Check if Auto-Deploy is Enabled

### **Vercel (Frontend)**
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Check that it shows: "Connected to GitHub" with your repo
3. Make sure "Auto-deploy" is enabled

### **Render (Backend)**
1. Go to Render Dashboard → Your Service → Settings
2. Check "Auto-Deploy" section
3. Should show: "Auto-Deploy: Yes" and your GitHub repo

---

## ⚡ Quick Commands Reference

### **Frontend Changes Only**
```bash
cd "C:\Users\Ayush\Desktop\Stock sentiment analyser1\project"
git add src/
git commit -m "Update frontend UI"
git push
# Vercel will auto-deploy in ~2-3 minutes
```

### **Backend Changes Only**
```bash
cd "C:\Users\Ayush\Desktop\Stock sentiment analyser1\project"
git add backend/
git commit -m "Update backend API"
git push
# Render will auto-deploy in ~3-5 minutes
```

### **Both Frontend and Backend**
```bash
cd "C:\Users\Ayush\Desktop\Stock sentiment analyser1\project"
git add .
git commit -m "Update both frontend and backend"
git push
# Both will auto-deploy simultaneously
```

---

## 🐛 Troubleshooting

### **Changes Not Appearing?**

1. **Check if push was successful:**
   ```bash
   git log --oneline -5
   ```
   Should show your latest commit

2. **Check Vercel/Render logs:**
   - Look for build errors in the deployment logs
   - Check if deployment completed successfully

3. **Clear browser cache:**
   - Press `Ctrl + Shift + R` (hard refresh)
   - Or open in incognito mode

4. **Wait a bit longer:**
   - Sometimes deployments take 5-10 minutes
   - Free tiers can be slower

### **Manual Redeploy (if auto-deploy fails)**

**Vercel:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click "..." on latest deployment → "Redeploy"

**Render:**
1. Go to Render Dashboard → Your Service → Manual Deploy
2. Click "Deploy latest commit"

---

## 📝 Important Notes

### **Environment Variables**
- If you add new environment variables, you need to set them in:
  - **Vercel**: Settings → Environment Variables
  - **Render**: Environment tab → Add variable
- Then **manually redeploy** (auto-deploy won't pick up new env vars)

### **Build Time**
- **Frontend (Vercel)**: Usually 2-3 minutes
- **Backend (Render)**: Usually 3-5 minutes
- **Free tiers**: Can be slower during peak times

### **Preview Deployments**
- Vercel creates preview deployments for every branch/PR
- Render only deploys from `main` branch (by default)

---

## ✅ Summary

**Yes, changes appear automatically!** Just:
1. Make changes
2. `git add .`
3. `git commit -m "message"`
4. `git push`
5. Wait 2-5 minutes
6. Check your live site!

No manual deployment needed! 🎉

