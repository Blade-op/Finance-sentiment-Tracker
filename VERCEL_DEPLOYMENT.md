# Connecting Frontend (Vercel) to Backend (Render)

## Step 1: Get Your URLs

1. **Backend URL (Render):** `https://stock-sentiment-backend-yr1v.onrender.com`
2. **Frontend URL (Vercel):** Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

## Step 2: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://stock-sentiment-backend-yr1v.onrender.com`
   - **Environment:** Production, Preview, Development (select all)
5. Click **Save**

## Step 3: Configure Render Backend CORS

1. Go to your Render dashboard
2. Select your `stock-sentiment-backend` service
3. Go to **Environment** tab
4. Add a new environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
5. Click **Save Changes**
6. **Redeploy** your service (Render will auto-redeploy after saving)

## Step 4: Update Backend CORS (if needed)

If your Vercel URL is different from the default, update `project/backend/server.js`:

```javascript
// Line ~24, update this line with your actual Vercel URL:
'https://your-actual-vercel-url.vercel.app', // Replace with your actual URL
```

Then commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS with Vercel URL"
git push
```

## Step 5: Test the Connection

1. Deploy your frontend to Vercel (if not already deployed)
2. Visit your Vercel URL
3. Open browser DevTools (F12) → Network tab
4. Try searching for a stock
5. Check if API requests are going to `https://stock-sentiment-backend-yr1v.onrender.com`

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` is set in Render environment variables
- Make sure your Vercel URL is added to the CORS allowed origins in `server.js`
- Check that both URLs use `https://` (not `http://`)

### API Not Found
- Verify `VITE_API_URL` is set in Vercel environment variables
- Make sure the variable name is exactly `VITE_API_URL` (Vite requires `VITE_` prefix)
- Redeploy Vercel after adding environment variables

### Backend Not Responding
- Check Render logs to ensure backend is running
- Verify the backend URL is correct: `https://stock-sentiment-backend-yr1v.onrender.com`
- Test the backend directly: `https://stock-sentiment-backend-yr1v.onrender.com/api/health`

## Quick Reference

**Backend URL:** `https://stock-sentiment-backend-yr1v.onrender.com`  
**Frontend URL:** `https://your-app.vercel.app` (replace with your actual URL)

**Vercel Env Var:**
- `VITE_API_URL=https://stock-sentiment-backend-yr1v.onrender.com`

**Render Env Var:**
- `FRONTEND_URL=https://your-app.vercel.app`

